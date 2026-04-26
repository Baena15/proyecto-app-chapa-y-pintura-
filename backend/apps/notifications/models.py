# ─── notifications/models.py ─────────────────
from django.db import models

from apps.users.models import User


class Notification(models.Model):
    CHANNEL_CHOICES = [
        ("email", "Email"),
        ("sms", "SMS"),
        ("push", "Push"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pendiente"),
        ("sent", "Enviado"),
        ("failed", "Fallido"),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.channel} to {self.recipient.username}: {self.subject}"
