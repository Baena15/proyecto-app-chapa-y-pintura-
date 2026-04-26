# ─── invoices/serializers.py ─────────────────
from rest_framework import serializers

from .models import Invoice, InvoiceItem


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ["id", "description", "quantity", "unit_price", "total"]
        read_only_fields = ["total"]


class InvoiceListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    work_order_code = serializers.CharField(source="work_order.code", read_only=True)

    class Meta:
        model = Invoice
        fields = ["id", "code", "work_order_code", "status", "status_display", "total", "due_date", "created_at"]


class InvoiceDetailSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    work_order_code = serializers.CharField(source="work_order.code", read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "code",
            "work_order_code",
            "customer",
            "status",
            "status_display",
            "subtotal",
            "tax_rate",
            "tax_amount",
            "total",
            "paid_amount",
            "due_date",
            "paid_at",
            "payment_method",
            "items",
            "created_at",
        ]
