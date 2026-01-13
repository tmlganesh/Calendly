# Calendly - Event Management App

A simple calendar application to create and manage your events. Built with React frontend and FastAPI backend, using Supabase PostgreSQL for data storage.

## Tech Stack

**Frontend**
- React 19
- React Router DOM
- Vite
- CSS (custom styling)

**Backend**
- FastAPI
- Psycopg (PostgreSQL adapter)
- JWT authentication (python-jose)
- Bcrypt for password hashing

**Database**
- Supabase (PostgreSQL)

## Features

- User registration and login
- Create, edit, and delete events
- Calendar views (Month, Week, Day)
- Drag and drop events
- Today's events and upcoming events list, previous events
- Dark mode toggle
- Protected routes

## Project Structure

```
├── backend/
│   ├── main.py          # FastAPI app entry point
│   ├── auth.py          # JWT and password utilities
│   ├── config.py        # Environment variables
│   ├── database.py      # Database connection and init
│   ├── models.py        # Pydantic models
│   └── routers/
│       ├── auth.py      # Login and register endpoints
│       └── events.py    # Event CRUD endpoints
│
└── frontend/
    └── src/
        ├── App.jsx
        ├── context/     # Auth context
        ├── hooks/       # Custom hooks (useEvents)
        ├── components/  # UI components
        └── utils/       # API calls
```

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/tmlganesh/Calendly.git
cd Calendly
```

### 2. Backend Setup

Create a `.env` file in the `backend` folder:

```
DATABASE_HOST=your-supabase-host.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=your-supabase-password
SECRET_KEY=your-secret-key
```

Install dependencies and run:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend runs on `http://localhost:8000`

API docs available at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

**Auth**
- `POST /auth/register` - Create new account
- `POST /auth/login` - Get access token

**Events**
- `GET /events` - Get all user events
- `GET /events/today` - Get today's events
- `GET /events/upcoming` - Get upcoming events
- `GET /events/date/{date}` - Get events by date
- `POST /events` - Create event
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event

## Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_HOST | Supabase project host |
| DATABASE_PORT | Database port (default: 5432) |
| DATABASE_NAME | Database name (default: postgres) |
| DATABASE_USER | Database user |
| DATABASE_PASSWORD | Database password |
| SECRET_KEY | JWT signing key |

## Notes

- The app uses custom tables (`calendar_users`, `calendar_events`) separate from Supabase auth
- JWT tokens expire after 24 hours by default
- CORS is enabled for all origins (development mode)
