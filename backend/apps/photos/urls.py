# ─── photos/urls.py ──────────────────────────
from django.urls import path

from .views import PhotoDetailView, PhotoListCreateView

urlpatterns = [
    path("work-orders/<int:work_order_pk>/photos/", PhotoListCreateView.as_view(), name="photo-list"),
    path("photos/<int:pk>/", PhotoDetailView.as_view(), name="photo-detail"),
]
