# ─── estimates/urls.py ───────────────────────
from django.urls import path

from .views import EstimateDetailView, EstimateListCreateView, approve_estimate, reject_estimate, send_estimate

urlpatterns = [
    path("estimates/", EstimateListCreateView.as_view(), name="estimate-list"),
    path("estimates/<int:pk>/", EstimateDetailView.as_view(), name="estimate-detail"),
    path("estimates/<int:pk>/send/", send_estimate, name="estimate-send"),
    path("estimates/<int:pk>/approve/", approve_estimate, name="estimate-approve"),
    path("estimates/<int:pk>/reject/", reject_estimate, name="estimate-reject"),
]
