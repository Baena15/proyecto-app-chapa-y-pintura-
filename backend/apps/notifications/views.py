# ─── notifications/views.py ──────────────────
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Notification, PushSubscription
from .serializers import NotificationSerializer, PushSubscriptionSerializer
from .whatsapp import send_whatsapp_message, notify_workorder_status_update, notify_estimate_ready, notify_invoice_ready


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def vapid_public_key(request):
    return Response({"public_key": settings.VAPID_PUBLIC_KEY})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def subscribe_push(request):
    serializer = PushSubscriptionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    PushSubscription.objects.update_or_create(
        user=request.user,
        endpoint=serializer.validated_data["endpoint"],
        defaults={
            "p256dh": serializer.validated_data["p256dh"],
            "auth": serializer.validated_data["auth"],
        },
    )
    return Response({"status": "subscribed"})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_push_test(request):
    from pywebpush import webpush, WebPushException

    subs = PushSubscription.objects.filter(user=request.user)
    if not subs.exists():
        return Response({"detail": "No hay suscripciones push"}, status=status.HTTP_400_BAD_REQUEST)

    results = []
    for sub in subs:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {"p256dh": sub.p256dh, "auth": sub.auth},
                },
                data='{"title":"TallerApp","body":"Notificacion de prueba"}',
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=settings.VAPID_CLAIMS,
            )
            results.append({"endpoint": sub.endpoint[:50], "status": "sent"})
        except WebPushException as e:
            results.append({"endpoint": sub.endpoint[:50], "status": "failed", "error": str(e)})

    return Response({"results": results})


# ─── WhatsApp Endpoints ──────────────────────
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_whatsapp_manual(request):
    """Send a custom WhatsApp message to a phone number."""
    phone = request.data.get("phone", "")
    body = request.data.get("body", "")
    if not phone or not body:
        return Response(
            {"detail": " phone and body are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    result = send_whatsapp_message(phone, body)
    return Response(result, status=status.HTTP_200_OK if result["success"] else status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_workorder_whatsapp(request, work_order_pk):
    """Send work order status notification via WhatsApp."""
    from apps.workorders.models import WorkOrder

    try:
        work_order = WorkOrder.objects.select_related("customer", "vehicle").get(pk=work_order_pk)
    except WorkOrder.DoesNotExist:
        return Response({"detail": "Work order not found"}, status=status.HTTP_404_NOT_FOUND)

    result = notify_workorder_status_update(
        work_order,
        request.data.get("old_status", work_order.status),
        request.data.get("new_status", work_order.status),
    )
    return Response(result, status=status.HTTP_200_OK if result["success"] else status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_estimate_whatsapp(request, estimate_pk):
    """Send estimate ready notification via WhatsApp."""
    from apps.estimates.models import Estimate

    try:
        estimate = Estimate.objects.select_related("work_order__customer", "work_order__vehicle").get(pk=estimate_pk)
    except Estimate.DoesNotExist:
        return Response({"detail": "Estimate not found"}, status=status.HTTP_404_NOT_FOUND)

    result = notify_estimate_ready(estimate)
    return Response(result, status=status.HTTP_200_OK if result["success"] else status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_invoice_whatsapp(request, invoice_pk):
    """Send invoice ready notification via WhatsApp."""
    from apps.invoices.models import Invoice

    try:
        invoice = Invoice.objects.select_related("work_order__customer", "work_order__vehicle").get(pk=invoice_pk)
    except Invoice.DoesNotExist:
        return Response({"detail": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

    result = notify_invoice_ready(invoice)
    return Response(result, status=status.HTTP_200_OK if result["success"] else status.HTTP_400_BAD_REQUEST)
