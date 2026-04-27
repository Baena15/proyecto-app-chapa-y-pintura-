# ─── estimates/serializers.py ────────────────
from rest_framework import serializers

from apps.customers.serializers import CustomerSerializer, VehicleSerializer

from .models import Estimate, EstimateItem


class EstimateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstimateItem
        fields = ["id", "description", "item_type", "quantity", "unit_price", "total"]
        read_only_fields = ["total"]


class EstimateListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    work_order_code = serializers.CharField(source="work_order.code", read_only=True)

    class Meta:
        model = Estimate
        fields = ["id", "work_order_code", "status", "status_display", "total", "valid_until", "created_at"]


class EstimateDetailSerializer(serializers.ModelSerializer):
    items = EstimateItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    work_order_code = serializers.CharField(source="work_order.code", read_only=True)
    vehicle = VehicleSerializer(source="work_order.vehicle", read_only=True)
    customer = CustomerSerializer(source="work_order.customer", read_only=True)

    class Meta:
        model = Estimate
        fields = [
            "id",
            "work_order_code",
            "vehicle",
            "customer",
            "status",
            "status_display",
            "total_labor",
            "total_parts",
            "total",
            "valid_until",
            "sent_at",
            "approved_at",
            "rejected_at",
            "items",
            "created_at",
        ]
