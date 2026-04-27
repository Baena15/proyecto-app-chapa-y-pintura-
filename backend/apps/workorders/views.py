# ─── workorders/views.py ─────────────────────
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import SearchFilter
from rest_framework.response import Response

from .models import WorkOrder, WorkOrderComment, WorkOrderItem, WorkOrderStatusHistory
from .serializers import (
    StatusChangeSerializer,
    WorkOrderCommentSerializer,
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
        if user.role == "client" and user.customer:
            return self.queryset.filter(customer=user.customer)
        if user.role in ["mechanic", "painter"]:
            return self.queryset.filter(assigned_to=user)
        return self.queryset


class WorkOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkOrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = WorkOrder.objects.select_related("vehicle", "customer", "assigned_to", "created_by").prefetch_related("items", "status_history")
        user = self.request.user
        if user.role == "client" and user.customer:
            return qs.filter(customer=user.customer)
        if user.role in ["mechanic", "painter"]:
            return qs.filter(assigned_to=user)
        return qs


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


class WorkOrderCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkOrderCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        wo_pk = self.kwargs["work_order_pk"]
        qs = WorkOrderComment.objects.filter(work_order_id=wo_pk).select_related("author")
        user = self.request.user
        if user.role == "client":
            qs = qs.filter(is_internal=False)
        return qs

    def perform_create(self, serializer):
        work_order = WorkOrder.objects.get(pk=self.kwargs["work_order_pk"])
        serializer.save(work_order=work_order, author=self.request.user)


def _send_push_to_customer(work_order, title, body):
    """Send push notification to the customer linked to this work order."""
    from django.conf import settings
    from apps.notifications.models import PushSubscription
    from pywebpush import webpush, WebPushException

    customer_users = work_order.customer.user_accounts.all()
    subs = PushSubscription.objects.filter(user__in=customer_users)
    if not subs.exists():
        return

    for sub in subs:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {"p256dh": sub.p256dh, "auth": sub.auth},
                },
                data=f'{{"title":"{title}","body":"{body}","tag":"wo-{work_order.id}","data":{{"url":"/work-orders/{work_order.id}/"}}}}',
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=settings.VAPID_CLAIMS,
            )
        except WebPushException:
            pass


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def change_status(request, pk):
    """Change the status of a work order and record history."""
    work_order = WorkOrder.objects.get(pk=pk)
    serializer = StatusChangeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    to_status = serializer.validated_data["to_status"]
    notes = serializer.validated_data.get("notes", "")

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

    # Send push notification when car is ready
    if to_status == "ready":
        _send_push_to_customer(
            work_order,
            title="Tu vehiculo esta listo",
            body=f"La orden {work_order.code} esta lista para recoger. Pasa por el taller cuando puedas.",
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
