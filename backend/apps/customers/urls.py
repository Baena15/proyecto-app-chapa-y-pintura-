# ─── customers/urls.py ───────────────────────
from django.urls import path

from .views import CustomerDetailView, CustomerListCreateView, VehicleDetailView, VehicleListCreateView

urlpatterns = [
    path("customers/", CustomerListCreateView.as_view(), name="customer-list"),
    path("customers/<int:pk>/", CustomerDetailView.as_view(), name="customer-detail"),
    path("vehicles/", VehicleListCreateView.as_view(), name="vehicle-list"),
    path("vehicles/<int:pk>/", VehicleDetailView.as_view(), name="vehicle-detail"),
]
