# ─── customers/models.py ─────────────────────
from django.db import models

from apps.users.models import User


class Customer(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name="customer_profile"
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20)
    dni = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "customers"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["phone"]),
            models.Index(fields=["last_name", "first_name"]),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Vehicle(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.PROTECT, related_name="vehicles"
    )
    license_plate = models.CharField(max_length=20, unique=True)
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    color = models.CharField(max_length=30)
    vin = models.CharField(max_length=17, blank=True)
    insurance_company = models.CharField(max_length=100, blank=True)
    insurance_policy = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "vehicles"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["license_plate"]),
        ]

    def __str__(self):
        return f"{self.license_plate} ({self.brand} {self.model})"
