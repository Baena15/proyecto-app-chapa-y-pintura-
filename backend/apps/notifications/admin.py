# ─── notifications/admin.py ──────────────────
from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["recipient", "channel", "subject", "status", "sent_at", "created_at"]
    list_filter = ["channel", "status", "created_at"]
