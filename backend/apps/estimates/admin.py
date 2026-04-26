# ─── estimates/admin.py ──────────────────────
from django.contrib import admin

from .models import Estimate, EstimateItem


class EstimateItemInline(admin.TabularInline):
    model = EstimateItem
    extra = 1


@admin.register(Estimate)
class EstimateAdmin(admin.ModelAdmin):
    list_display = ["work_order", "status", "total", "valid_until", "created_at"]
    list_filter = ["status", "created_at"]
    inlines = [EstimateItemInline]
