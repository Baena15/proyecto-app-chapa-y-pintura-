# ─── workorders/serializers.py ───────────────
from rest_framework import serializers

from apps.customers.serializers import CustomerSerializer, VehicleSerializer
from apps.users.serializers import UserSerializer

from .models import WorkOrder, WorkOrderItem, WorkOrderStatusHistory


class WorkOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrderItem
        fields = [
            "id",
            "description",
            "item_type",
            "estimated_hours",
            "actual_hours",
            "labor_cost",
            "parts_cost",
        ]


class WorkOrderStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = UserSerializer(read_only=True)

    class Meta:
        model = WorkOrderStatusHistory
        fields = ["id", "from_status", "to_status", "changed_by", "notes", "created_at"]


class WorkOrderListSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    customer = CustomerSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "code",
            "vehicle",
            "customer",
            "status",
            "status_display",
            "assigned_to",
            "estimated_cost",
            "final_cost",
            "estimated_completion",
            "created_at",
        ]


class WorkOrderDetailSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)
    customer = CustomerSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    items = WorkOrderItemSerializer(many=True, read_only=True)
    status_history = WorkOrderStatusHistorySerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "code",
            "vehicle",
            "customer",
            "description",
            "status",
            "status_display",
            "assigned_to",
            "estimated_cost",
            "final_cost",
            "estimated_completion",
            "actual_completion",
            "items",
            "status_history",
            "created_by",
            "created_at",
            "updated_at",
        ]


class WorkOrderCreateSerializer(serializers.ModelSerializer):
    vehicle_id = serializers.IntegerField(write_only=True)
    customer_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = WorkOrder
        fields = [
            "id",
            "vehicle_id",
            "customer_id",
            "description",
            "estimated_cost",
            "estimated_completion",
        ]

    def create(self, validated_data):
        from apps.customers.models import Customer, Vehicle

        vehicle_id = validated_data.pop("vehicle_id")
        customer_id = validated_data.pop("customer_id")
        validated_data["vehicle"] = Vehicle.objects.get(pk=vehicle_id)
        validated_data["customer"] = Customer.objects.get(pk=customer_id)
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class StatusChangeSerializer(serializers.Serializer):
    to_status = serializers.ChoiceField(choices=WorkOrder.STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)
