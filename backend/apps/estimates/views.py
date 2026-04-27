# ─── estimates/views.py ──────────────────────
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import SearchFilter
from rest_framework.response import Response

from .models import Estimate
from .serializers import EstimateDetailSerializer, EstimateListSerializer


class EstimateListCreateView(generics.ListCreateAPIView):
    queryset = Estimate.objects.select_related("work_order").prefetch_related("items")
    filter_backends = [SearchFilter]
    search_fields = ["work_order__code"]
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EstimateDetailSerializer
        return EstimateListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "client" and user.customer:
            return self.queryset.filter(work_order__customer=user.customer)
        return self.queryset


class EstimateDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EstimateDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Estimate.objects.select_related("work_order").prefetch_related("items")
        user = self.request.user
        if user.role == "client" and user.customer:
            return qs.filter(work_order__customer=user.customer)
        return qs


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_estimate(request, pk):
    estimate = Estimate.objects.get(pk=pk)
    if estimate.status != "draft":
        return Response({"detail": "Solo se puede enviar un presupuesto en borrador"}, status=status.HTTP_400_BAD_REQUEST)
    estimate.status = "sent"
    estimate.sent_at = timezone.now()
    estimate.save()
    from apps.notifications.utils import notify_estimate_sent
    notify_estimate_sent(estimate)
    return Response({"status": "sent"})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def approve_estimate(request, pk):
    estimate = Estimate.objects.get(pk=pk)
    if estimate.status != "sent":
        return Response({"detail": "El presupuesto no esta en estado enviado"}, status=status.HTTP_400_BAD_REQUEST)
    estimate.status = "approved"
    estimate.approved_at = timezone.now()
    estimate.save()
    # Update work order status if pending
    if estimate.work_order.status == "pending":
        estimate.work_order.status = "in_progress"
        estimate.work_order.save()
    return Response({"status": "approved"})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def reject_estimate(request, pk):
    estimate = Estimate.objects.get(pk=pk)
    if estimate.status != "sent":
        return Response({"detail": "El presupuesto no esta en estado enviado"}, status=status.HTTP_400_BAD_REQUEST)
    estimate.status = "rejected"
    estimate.rejected_at = timezone.now()
    estimate.save()
    return Response({"status": "rejected"})
