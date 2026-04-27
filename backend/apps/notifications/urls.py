# ─── notifications/urls.py ───────────────────
from django.urls import path

from .views import NotificationListView, send_push_test, subscribe_push, vapid_public_key

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path("push-subscribe/", subscribe_push, name="push-subscribe"),
    path("push-test/", send_push_test, name="push-test"),
    path("vapid-public-key/", vapid_public_key, name="vapid-public-key"),
]
