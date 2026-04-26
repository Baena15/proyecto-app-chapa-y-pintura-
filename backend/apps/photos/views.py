# ─── photos/views.py ─────────────────────────
from rest_framework import generics, permissions

from .models import Photo
from .serializers import PhotoSerializer


class PhotoListCreateView(generics.ListCreateAPIView):
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Photo.objects.filter(work_order_id=self.kwargs["work_order_pk"]).select_related("taken_by")

    def perform_create(self, serializer):
        from apps.workorders.models import WorkOrder
        work_order = WorkOrder.objects.get(pk=self.kwargs["work_order_pk"])
        serializer.save(work_order=work_order, taken_by=self.request.user)


class PhotoDetailView(generics.RetrieveDestroyAPIView):
    queryset = Photo.objects.select_related("taken_by")
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
