# ─── notifications/serializers.py ────────────
from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    channel_display = serializers.CharField(source="get_channel_display", read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "channel",
            "channel_display",
            "subject",
            "body",
            "status",
            "status_display",
            "sent_at",
            "created_at",
        ]
