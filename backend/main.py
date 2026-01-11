from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth, events
from database import init_db

app = FastAPI(
    title="Calendar API",
    description="A Google Calendar-like API for managing events",
    version="1.0.0"
)

# CORS middleware - must be added first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Global exception handler to ensure CORS headers are sent on errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Include routers
app.include_router(auth.router)
app.include_router(events.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    try:
        init_db()
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Database initialization error: {e}")

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Calendar API is running", "docs": "/docs"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
