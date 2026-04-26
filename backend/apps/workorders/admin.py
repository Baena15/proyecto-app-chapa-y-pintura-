# ─── workorders/admin.py ─────────────────────
from django.contrib import admin

from .models import WorkOrder, WorkOrderItem, WorkOrderStatusHistory


class WorkOrderItemInline(admin.TabularInline):
    model = WorkOrderItem
    extra = 1


class WorkOrderStatusHistoryInline(admin.TabularInline):
    model = WorkOrderStatusHistory
    extra = 0
    readonly_fields = ["from_status", "to_status", "changed_by", "notes", "created_at"]
    can_delete = False


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ["code", "vehicle", "customer", "status", "assigned_to", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["code", "vehicle__license_plate", "customer__first_name", "customer__last_name"]
    inlines = [WorkOrderItemInline, WorkOrderStatusHistoryInline]


@admin.register(WorkOrderItem)
class WorkOrderItemAdmin(admin.ModelAdmin):
    list_display = ["description", "item_type", "work_order", "estimated_hours", "actual_hours"]
    list_filter = ["item_type"]
