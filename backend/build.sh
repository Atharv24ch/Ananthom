#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== Installing dependencies ==="
pip install -r requirements.txt

echo "=== Collecting static files ==="
python manage.py collectstatic --no-input

echo "=== Checking database connection ==="
python manage.py check --database default

echo "=== Running database migrations ==="
python manage.py migrate --no-input --verbosity 2

echo "=== Creating superuser if needed ==="
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='admin').exists():
    print('Creating superuser...');
else:
    print('Superuser already exists');
" || true

echo "=== Build completed successfully ==="
