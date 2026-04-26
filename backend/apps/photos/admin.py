# ─── photos/admin.py ─────────────────────────
from django.contrib import admin

from .models import Photo


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ["work_order", "photo_type", "taken_by", "taken_at"]
    list_filter = ["photo_type", "taken_at"]
