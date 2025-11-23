# Django Backend - High On Chem

Django REST API backend connected to NeonDB PostgreSQL.

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Environment variables are configured in `.env`

3. Run migrations:

```bash
python manage.py migrate
```

4. Create superuser (optional):

```bash
python manage.py createsuperuser
```

5. Run development server:

```bash
python manage.py runserver
```

## Database

Connected to NeonDB PostgreSQL (configured in `.env`)

## API Endpoints

- Admin panel: http://localhost:8000/admin/
- API root: http://localhost:8000/api/

## Tech Stack

- Django 5.2
- Django REST Framework
- PostgreSQL (NeonDB)
- CORS Headers (configured for frontend on port 3000)
