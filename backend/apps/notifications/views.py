# ─── notifications/views.py ──────────────────
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Notification, PushSubscription
from .serializers import NotificationSerializer, PushSubscriptionSerializer


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
