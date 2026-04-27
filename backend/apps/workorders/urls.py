# ─── workorders/urls.py ──────────────────────
from django.urls import path

from .views import (
    AppointmentDetailView,
    AppointmentListCreateView,
    WorkOrderCommentListCreateView,
    WorkOrderDetailView,
    WorkOrderItemDetailView,
    WorkOrderItemListCreateView,
    WorkOrderListCreateView,
    WorkOrderSurveyView,
    assign_technician,
    change_status,
    create_estimate_from_work_order,
    create_invoice_from_work_order,
)

urlpatterns = [
    path("work-orders/", WorkOrderListCreateView.as_view(), name="workorder-list"),
    path("work-orders/<int:pk>/", WorkOrderDetailView.as_view(), name="workorder-detail"),
    path("work-orders/<int:pk>/status/", change_status, name="workorder-change-status"),
    path("work-orders/<int:pk>/assign/", assign_technician, name="workorder-assign"),
    path("work-orders/<int:pk>/create-estimate/", create_estimate_from_work_order, name="workorder-create-estimate"),
    path("work-orders/<int:pk>/create-invoice/", create_invoice_from_work_order, name="workorder-create-invoice"),
    path(
        "work-orders/<int:work_order_pk>/comments/",
        WorkOrderCommentListCreateView.as_view(),
        name="workorder-comment-list",
    ),
    path(
        "work-orders/<int:work_order_pk>/items/",
        WorkOrderItemListCreateView.as_view(),
        name="workorder-item-list",
    ),
    path("work-order-items/<int:pk>/", WorkOrderItemDetailView.as_view(), name="workorder-item-detail"),
    path(
        "work-orders/<int:work_order_pk>/survey/",
        WorkOrderSurveyView.as_view(),
        name="workorder-survey",
    ),
    path("appointments/", AppointmentListCreateView.as_view(), name="appointment-list"),
    path("appointments/<int:pk>/", AppointmentDetailView.as_view(), name="appointment-detail"),
]
