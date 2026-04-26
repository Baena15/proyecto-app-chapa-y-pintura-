# ─── workorders/views.py ─────────────────────
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import SearchFilter
from rest_framework.response import Response

from .models import WorkOrder, WorkOrderItem, WorkOrderStatusHistory
from .serializers import (
    StatusChangeSerializer,
    WorkOrderCreateSerializer,
    WorkOrderDetailSerializer,
    WorkOrderItemSerializer,
    WorkOrderListSerializer,
)


class WorkOrderListCreateView(generics.ListCreateAPIView):
    queryset = WorkOrder.objects.select_related("vehicle", "customer", "assigned_to").prefetch_related("items", "status_history")
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["status", "assigned_to", "created_at"]
    search_fields = ["code", "vehicle__license_plate", "customer__first_name", "customer__last_name"]
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return WorkOrderCreateSerializer
        return WorkOrderListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "client" and hasattr(user, "customer_profile"):
            return self.queryset.filter(customer=user.customer_profile)
        if user.role in ["mechanic", "painter"]:
            return self.queryset.filter(assigned_to=user)
        return self.queryset


class WorkOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WorkOrder.objects.select_related("vehicle", "customer", "assigned_to", "created_by").prefetch_related("items", "status_history")
    serializer_class = WorkOrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class WorkOrderItemListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkOrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkOrderItem.objects.filter(work_order_id=self.kwargs["work_order_pk"])

    def perform_create(self, serializer):
        work_order = WorkOrder.objects.get(pk=self.kwargs["work_order_pk"])
        serializer.save(work_order=work_order)


class WorkOrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WorkOrderItem.objects.all()
    serializer_class = WorkOrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def change_status(request, pk):
    """Change the status of a work order and record history."""
    work_order = WorkOrder.objects.get(pk=pk)
    serializer = StatusChangeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    to_status = serializer.validated_data["to_status"]
    notes = serializer.validated_data.get("notes", "")

    # TODO: Add transition validation logic here
    valid_transitions = {
        "pending": ["in_progress", "cancelled"],
        "in_progress": ["in_bodywork", "waiting_parts", "cancelled"],
        "in_bodywork": ["waiting_parts", "in_painting", "cancelled"],
        "waiting_parts": ["in_bodywork", "cancelled"],
        "in_painting": ["quality_control", "cancelled"],
        "quality_control": ["ready", "in_painting", "cancelled"],
        "ready": ["delivered", "cancelled"],
        "delivered": [],
        "cancelled": [],
    }

    if to_status not in valid_transitions.get(work_order.status, []):
        return Response(
            {"detail": f"Transicion invalida: {work_order.status} -> {to_status}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    from_status = work_order.status
    work_order.status = to_status
    if to_status == "delivered":
        from django.utils import timezone
        work_order.actual_completion = timezone.now().date()
    work_order.save()

    WorkOrderStatusHistory.objects.create(
        work_order=work_order,
        from_status=from_status,
        to_status=to_status,
        changed_by=request.user,
        notes=notes,
    )

    return Response({"status": to_status, "previous": from_status})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def assign_technician(request, pk):
    """Assign a technician to a work order."""
    work_order = WorkOrder.objects.get(pk=pk)
    technician_id = request.data.get("technician_id")
    from apps.users.models import User

    try:
        technician = User.objects.get(pk=technician_id, role__in=["mechanic", "painter"])
    except User.DoesNotExist:
        return Response({"detail": "Tecnico no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

    work_order.assigned_to = technician
    work_order.save()
    return Response({"assigned_to": UserSerializer(technician).data})


# Import here to avoid circular imports
from apps.users.serializers import UserSerializer
