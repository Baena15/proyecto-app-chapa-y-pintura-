# ─── workorders/admin.py ─────────────────────
from django.contrib import admin

from .models import (
    WorkOrder,
    WorkOrderComment,
    WorkOrderItem,
    WorkOrderStatusHistory,
    WorkOrderSurvey,
)


class WorkOrderItemInline(admin.TabularInline):
    model = WorkOrderItem
    extra = 1


class WorkOrderStatusHistoryInline(admin.TabularInline):
    model = WorkOrderStatusHistory
    extra = 0
    readonly_fields = ["from_status", "to_status", "changed_by", "notes", "created_at"]
    can_delete = False


class WorkOrderCommentInline(admin.TabularInline):
    model = WorkOrderComment
    extra = 0
    readonly_fields = ["author", "created_at"]


class WorkOrderSurveyInline(admin.StackedInline):
    model = WorkOrderSurvey
    extra = 0
    readonly_fields = ["created_at"]
    can_delete = False


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ["code", "vehicle", "customer", "status", "assigned_to", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["code", "vehicle__license_plate", "customer__first_name", "customer__last_name"]
    inlines = [WorkOrderItemInline, WorkOrderStatusHistoryInline, WorkOrderCommentInline, WorkOrderSurveyInline]
    date_hierarchy = "created_at"


@admin.register(WorkOrderItem)
class WorkOrderItemAdmin(admin.ModelAdmin):
    list_display = ["description", "item_type", "work_order", "estimated_hours", "actual_hours"]
    list_filter = ["item_type"]
    search_fields = ["description", "work_order__code"]


@admin.register(WorkOrderComment)
class WorkOrderCommentAdmin(admin.ModelAdmin):
    list_display = ["work_order", "author", "text_preview", "is_internal", "created_at"]
    list_filter = ["is_internal", "created_at"]
    search_fields = ["text", "work_order__code", "author__username"]

    def text_preview(self, obj):
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    text_preview.short_description = "Texto"


@admin.register(WorkOrderSurvey)
class WorkOrderSurveyAdmin(admin.ModelAdmin):
    list_display = ["work_order", "rating", "comment_preview", "created_at"]
    list_filter = ["rating", "created_at"]
    search_fields = ["comment", "work_order__code"]

    def comment_preview(self, obj):
        return obj.comment[:50] + "..." if obj.comment and len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = "Comentario"
