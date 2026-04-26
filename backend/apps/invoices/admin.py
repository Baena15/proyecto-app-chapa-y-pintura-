# ─── invoices/admin.py ───────────────────────
from django.contrib import admin

from .models import Invoice, InvoiceItem


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ["code", "work_order", "status", "total", "due_date", "created_at"]
    list_filter = ["status", "created_at"]
    inlines = [InvoiceItemInline]
