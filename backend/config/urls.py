# ─── URL Configuration ───────────────────────
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
    # TODO: Register app URLs here, e.g.:
    # path("api/v1/users/", include("apps.users.urls")),
    # path("api/v1/customers/", include("apps.customers.urls")),
    # path("api/v1/workorders/", include("apps.workorders.urls")),
]
