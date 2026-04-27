# ─── workorders/models.py ────────────────────
from django.db import models

from apps.customers.models import Customer, Vehicle
from apps.users.models import User


class WorkOrder(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pendiente"),
        ("in_progress", "En progreso"),
        ("in_bodywork", "En chapa"),
        ("waiting_parts", "Esperando piezas"),
        ("in_painting", "En pintura"),
        ("quality_control", "Control de calidad"),
        ("ready", "Listo para entrega"),
        ("delivered", "Entregado"),
        ("cancelled", "Cancelado"),
    ]

    code = models.CharField(max_length=20, unique=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name="work_orders")
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="work_orders")
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_work_orders",
        limit_choices_to={"role__in": ["mechanic", "painter"]},
    )
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estimated_completion = models.DateField(null=True, blank=True)
    actual_completion = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="created_work_orders"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "work_orders"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["assigned_to"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.code} - {self.vehicle.license_plate}"

    def save(self, *args, **kwargs):
        if not self.code:
            from datetime import datetime
            count = WorkOrder.objects.filter(
                created_at__year=datetime.now().year
            ).count() + 1
            self.code = f"OT-{datetime.now().year}-{count:04d}"
        super().save(*args, **kwargs)


class WorkOrderItem(models.Model):
    TYPE_CHOICES = [
        ("bodywork", "Chapa"),
        ("painting", "Pintura"),
        ("mechanical", "Mecanica"),
        ("electrical", "Electricidad"),
        ("other", "Otro"),
    ]

    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(max_length=255)
    item_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    estimated_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    actual_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    parts_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = "work_order_items"

    def __str__(self):
        return f"{self.description} ({self.get_item_type_display()})"


class WorkOrderStatusHistory(models.Model):
    work_order = models.ForeignKey(
        WorkOrder, on_delete=models.CASCADE, related_name="status_history"
    )
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "work_order_status_history"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.work_order.code}: {self.from_status} -> {self.to_status}"


class WorkOrderComment(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="work_order_comments")
    text = models.TextField()
    is_internal = models.BooleanField(default=False, help_text="Solo visible para el personal del taller")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "work_order_comments"
        ordering = ["created_at"]

    def __str__(self):
        return f"Comentario {self.author} en {self.work_order.code}"
