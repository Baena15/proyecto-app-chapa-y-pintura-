# ─── invoices/views.py ───────────────────────
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Invoice
from .serializers import InvoiceDetailSerializer, InvoiceListSerializer


class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.select_related("work_order", "customer").prefetch_related("items")
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return InvoiceDetailSerializer
        return InvoiceListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "client" and user.customer:
            return self.queryset.filter(customer=user.customer)
        return self.queryset


class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvoiceDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Invoice.objects.select_related("work_order", "customer").prefetch_related("items")
        user = self.request.user
        if user.role == "client" and user.customer:
            return qs.filter(customer=user.customer)
        return qs


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_invoice(request, pk):
    invoice = Invoice.objects.get(pk=pk)
    if invoice.status != "draft":
        return Response({"detail": "Solo se puede enviar una factura en borrador"}, status=status.HTTP_400_BAD_REQUEST)
    invoice.status = "sent"
    invoice.save()
    return Response({"status": "sent"})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def pay_invoice(request, pk):
    invoice = Invoice.objects.get(pk=pk)
    if invoice.status not in ["sent", "overdue"]:
        return Response({"detail": "La factura no puede ser pagada"}, status=status.HTTP_400_BAD_REQUEST)

    amount = request.data.get("amount", invoice.total)
    payment_method = request.data.get("payment_method", "cash")

    invoice.paid_amount = amount
    invoice.payment_method = payment_method
    invoice.status = "paid"
    invoice.paid_at = timezone.now()
    invoice.save()
    return Response({"status": "paid", "amount": amount})
