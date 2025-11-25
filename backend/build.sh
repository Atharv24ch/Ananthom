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

echo "=== Build completed successfully ==="
