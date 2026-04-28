# ─── notifications/urls.py ───────────────────
from django.urls import path

from .views import (
    NotificationListView,
    send_estimate_whatsapp,
    send_invoice_whatsapp,
    send_push_test,
    send_whatsapp_manual,
    send_workorder_whatsapp,
    subscribe_push,
    vapid_public_key,
)

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path("push-subscribe/", subscribe_push, name="push-subscribe"),
    path("push-test/", send_push_test, name="push-test"),
    path("vapid-public-key/", vapid_public_key, name="vapid-public-key"),
    # WhatsApp
    path("whatsapp/send/", send_whatsapp_manual, name="whatsapp-send"),
    path("work-orders/<int:work_order_pk>/whatsapp/", send_workorder_whatsapp, name="workorder-whatsapp"),
    path("estimates/<int:estimate_pk>/whatsapp/", send_estimate_whatsapp, name="estimate-whatsapp"),
    path("invoices/<int:invoice_pk>/whatsapp/", send_invoice_whatsapp, name="invoice-whatsapp"),
]
