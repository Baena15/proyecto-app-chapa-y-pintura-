# ─── customers/admin.py ──────────────────────
from django.contrib import admin

from .models import Customer, Vehicle


class VehicleInline(admin.TabularInline):
    model = Vehicle
    extra = 1


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["full_name", "phone", "email", "dni", "city", "created_at"]
    list_filter = ["city", "created_at"]
    search_fields = ["first_name", "last_name", "phone", "email", "dni"]
    inlines = [VehicleInline]


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ["license_plate", "brand", "model", "year", "color", "customer"]
    list_filter = ["brand", "year"]
    search_fields = ["license_plate", "brand", "model", "vin"]
