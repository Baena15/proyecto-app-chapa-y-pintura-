# ─── notifications/admin.py ──────────────────
from django.contrib import admin

from .models import Notification, PushSubscription


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["recipient", "channel", "subject", "status", "sent_at", "created_at"]
    list_filter = ["channel", "status", "created_at"]
    search_fields = ["recipient__username", "subject"]


@admin.register(PushSubscription)
class PushSubscriptionAdmin(admin.ModelAdmin):
    list_display = ["user", "endpoint_preview", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__username", "endpoint"]

    def endpoint_preview(self, obj):
        return obj.endpoint[:60] + "..."
    endpoint_preview.short_description = "Endpoint"
