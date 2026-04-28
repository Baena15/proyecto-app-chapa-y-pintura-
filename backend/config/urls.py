# ─── URL Configuration ───────────────────────
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.users.urls")),
    path("api/v1/", include("apps.customers.urls")),
    path("api/v1/", include("apps.workorders.urls")),
    path("api/v1/", include("apps.estimates.urls")),
    path("api/v1/", include("apps.invoices.urls")),
    path("api/v1/", include("apps.photos.urls")),
    path("api/v1/", include("apps.notifications.urls")),
]

# Serve media files in production too (for demo; use S3/Cloudinary in real production)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
