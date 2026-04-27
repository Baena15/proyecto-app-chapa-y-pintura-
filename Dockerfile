FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY backend/ ./

# Collect static files
RUN python manage.py collectstatic --noinput

# Run gunicorn
CMD gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
