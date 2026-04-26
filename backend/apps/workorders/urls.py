# ─── workorders/urls.py ──────────────────────
from django.urls import path

from .views import (
    WorkOrderDetailView,
    WorkOrderItemDetailView,
    WorkOrderItemListCreateView,
    WorkOrderListCreateView,
    assign_technician,
    change_status,
)

urlpatterns = [
    path("work-orders/", WorkOrderListCreateView.as_view(), name="workorder-list"),
    path("work-orders/<int:pk>/", WorkOrderDetailView.as_view(), name="workorder-detail"),
    path("work-orders/<int:pk>/status/", change_status, name="workorder-change-status"),
    path("work-orders/<int:pk>/assign/", assign_technician, name="workorder-assign"),
    path(
        "work-orders/<int:work_order_pk>/items/",
        WorkOrderItemListCreateView.as_view(),
        name="workorder-item-list",
    ),
    path("work-order-items/<int:pk>/", WorkOrderItemDetailView.as_view(), name="workorder-item-detail"),
]
