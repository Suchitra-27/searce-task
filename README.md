# searce-task

# Backend: Django Setup

Prerequisites

Ensure you have the following installed:

Python (>= 3.8)

PostgreSQL

pip (Python package manager)

Virtualenv (optional but recommended)

Installation

Clone the repository:

git clone <repository_url>
cd backend

Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Database Configuration

Open settings.py in your Django project and configure the PostgreSQL database:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',
        'USER': 'your_database_user',
        'PASSWORD': 'your_database_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

Apply migrations to set up the database:

python manage.py makemigrations
python manage.py migrate

Create a superuser:

python manage.py createsuperuser

Running the Django Server

Start the server:

python manage.py runserver

The API will be available at http://127.0.0.1:8000/.


# Frontend: Angular Setup

Prerequisites

Ensure you have the following installed:

Node.js (>= 14.x)

npm (Node package manager)

Angular CLI (>= 15.x)

Installation

Navigate to the Angular directory:

cd frontend

Install dependencies:

npm install

Running the Angular Application

Start the development server:

ng serve

Open your browser and navigate to:

# needful packages
UI materials 
chart.js 
