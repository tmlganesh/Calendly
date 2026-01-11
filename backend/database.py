import psycopg
from psycopg.rows import dict_row
from config import DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD

def get_db_connection():
    """Create a new database connection."""
    conn = psycopg.connect(
        host=DATABASE_HOST,
        port=DATABASE_PORT,
        dbname=DATABASE_NAME,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        row_factory=dict_row
    )
    return conn

def init_db():
    """Initialize database tables."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create our own calendar_users table (separate from Supabase auth.users)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS calendar_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    """)
    
    # Create our own calendar_events table (to avoid FK constraint on Supabase users table)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS calendar_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            event_date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            notify_before INTEGER DEFAULT 10,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    """)
    
    # Create index for faster event queries
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON calendar_events(user_id, event_date)
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()
