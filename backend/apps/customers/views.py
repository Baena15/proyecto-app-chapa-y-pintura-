# ─── customers/views.py ──────────────────────
from rest_framework import generics, permissions
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Customer, Vehicle
from .serializers import CustomerCreateUpdateSerializer, CustomerSerializer, VehicleSerializer


class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.prefetch_related("vehicles")
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ["first_name", "last_name", "phone", "email", "dni"]
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CustomerCreateUpdateSerializer
        return CustomerSerializer


class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.prefetch_related("vehicles")
    serializer_class = CustomerCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return CustomerSerializer
        return CustomerCreateUpdateSerializer


class VehicleListCreateView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.select_related("customer")
    serializer_class = VehicleSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["customer"]
    search_fields = ["license_plate", "brand", "model"]
    permission_classes = [permissions.IsAuthenticated]


class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.select_related("customer")
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
