# ─── invoices/urls.py ────────────────────────
from django.urls import path

from .views import InvoiceDetailView, InvoiceListCreateView, pay_invoice, send_invoice

urlpatterns = [
    path("invoices/", InvoiceListCreateView.as_view(), name="invoice-list"),
    path("invoices/<int:pk>/", InvoiceDetailView.as_view(), name="invoice-detail"),
    path("invoices/<int:pk>/send/", send_invoice, name="invoice-send"),
    path("invoices/<int:pk>/pay/", pay_invoice, name="invoice-pay"),
]
