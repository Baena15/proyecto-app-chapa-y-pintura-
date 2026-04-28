"""WSGI config for app-taller-chapa project."""
import os

from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()
# Serve media files in production (for demo; use S3/Cloudinary in real production)
media_root = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'media')
if os.path.exists(media_root):
    application = WhiteNoise(application, root=media_root, prefix='media/')
else:
    os.makedirs(media_root, exist_ok=True)
    application = WhiteNoise(application, root=media_root, prefix='media/')
