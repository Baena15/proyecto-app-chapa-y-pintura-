# ─── users/models.py ─────────────────────────
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Administrador"),
        ("receptionist", "Recepcionista"),
        ("mechanic", "Mecanico / Chapista"),
        ("painter", "Pintor"),
        ("client", "Cliente"),
    ]

    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default="client"
    )
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True)
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_accounts",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
