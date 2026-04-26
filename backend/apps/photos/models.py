# ─── photos/models.py ────────────────────────
from django.db import models

from apps.users.models import User
from apps.workorders.models import WorkOrder


class Photo(models.Model):
    TYPE_CHOICES = [
        ("damage", "Danos iniciales"),
        ("progress", "Progreso"),
        ("final", "Resultado final"),
        ("document", "Documento"),
    ]

    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="work_orders/%Y/%m/")
    photo_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="damage")
    description = models.CharField(max_length=255, blank=True)
    taken_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    taken_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "photos"
        ordering = ["-taken_at"]

    def __str__(self):
        return f"Foto {self.get_photo_type_display()} - {self.work_order.code}"
