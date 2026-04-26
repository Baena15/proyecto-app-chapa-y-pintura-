# ─── invoices/models.py ──────────────────────
from django.db import models

from apps.customers.models import Customer
from apps.workorders.models import WorkOrder


class Invoice(models.Model):
    STATUS_CHOICES = [
        ("draft", "Borrador"),
        ("sent", "Enviada"),
        ("paid", "Pagada"),
        ("overdue", "Vencida"),
    ]

    code = models.CharField(max_length=20, unique=True)
    work_order = models.OneToOneField(WorkOrder, on_delete=models.PROTECT, related_name="invoice")
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=21.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    due_date = models.DateField()
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "invoices"
        ordering = ["-created_at"]

    def __str__(self):
        return self.code

    def save(self, *args, **kwargs):
        if not self.code:
            from datetime import datetime
            count = Invoice.objects.filter(created_at__year=datetime.now().year).count() + 1
            self.code = f"FAC-{datetime.now().year}-{count:04d}"
        self.tax_amount = self.subtotal * (self.tax_rate / 100)
        self.total = self.subtotal + self.tax_amount
        super().save(*args, **kwargs)


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "invoice_items"

    def save(self, *args, **kwargs):
        self.total = self.quantity * self.unit_price
        super().save(*args, **kwargs)
