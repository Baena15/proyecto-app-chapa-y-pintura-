# ─── photos/serializers.py ───────────────────
from rest_framework import serializers

from apps.users.serializers import UserSerializer

from .models import Photo


class PhotoSerializer(serializers.ModelSerializer):
    taken_by = UserSerializer(read_only=True)
    photo_type_display = serializers.CharField(source="get_photo_type_display", read_only=True)

    class Meta:
        model = Photo
        fields = [
            "id",
            "image",
            "photo_type",
            "photo_type_display",
            "description",
            "taken_by",
            "taken_at",
        ]
