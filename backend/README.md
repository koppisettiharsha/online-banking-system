# Django Backend

This is the backend API for the project, built with Django and Django REST Framework.

## Setup Instructions

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

The server will start at http://localhost:8000/

## Available Endpoints

- `GET /api/welcome/` - Welcome message endpoint

## Development

- The API is configured to allow CORS for development
- Django REST Framework is set up with basic permissions
- The project structure follows Django best practices 