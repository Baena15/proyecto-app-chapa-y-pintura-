# ─── workorders/serializers.py ───────────────
from rest_framework import serializers

from apps.customers.serializers import CustomerSerializer, VehicleSerializer
from apps.users.serializers import UserSerializer

from .models import WorkOrder, WorkOrderComment, WorkOrderItem, WorkOrderStatusHistory, WorkOrderSurvey


class WorkOrderCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = WorkOrderComment
        fields = ["id", "author", "text", "is_internal", "created_at"]
        read_only_fields = ["author"]


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
    comments = serializers.SerializerMethodField()
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
            "comments",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def get_comments(self, obj):
        user = self.context["request"].user
        qs = obj.comments.select_related("author")
        if user.role == "client":
            qs = qs.filter(is_internal=False)
        return WorkOrderCommentSerializer(qs, many=True).data


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


class WorkOrderSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrderSurvey
        fields = ["id", "work_order", "rating", "comment", "created_at"]


class StatusChangeSerializer(serializers.Serializer):
    to_status = serializers.ChoiceField(choices=WorkOrder.STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)
