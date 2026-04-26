# ─── estimates/models.py ─────────────────────
from django.db import models

from apps.workorders.models import WorkOrder


class Estimate(models.Model):
    STATUS_CHOICES = [
        ("draft", "Borrador"),
        ("sent", "Enviado"),
        ("approved", "Aprobado"),
        ("rejected", "Rechazado"),
    ]

    work_order = models.OneToOneField(WorkOrder, on_delete=models.CASCADE, related_name="estimate")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    total_labor = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_parts = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valid_until = models.DateField()
    sent_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "estimates"
        ordering = ["-created_at"]

    def __str__(self):
        return f"PRES-{self.work_order.code}"

    def calculate_totals(self):
        self.total_labor = sum(
            item.total for item in self.items.filter(item_type="labor")
        )
        self.total_parts = sum(
            item.total for item in self.items.filter(item_type="part")
        )
        self.total = self.total_labor + self.total_parts
        self.save()


class EstimateItem(models.Model):
    TYPE_CHOICES = [
        ("labor", "Mano de obra"),
        ("part", "Pieza / Material"),
    ]

    estimate = models.ForeignKey(Estimate, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(max_length=255)
    item_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "estimate_items"

    def save(self, *args, **kwargs):
        self.total = self.quantity * self.unit_price
        super().save(*args, **kwargs)
