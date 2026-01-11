from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import date, datetime
from models import EventCreate, EventUpdate, EventResponse
from auth import get_current_user
from database import get_db_connection

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("", response_model=List[EventResponse])
async def get_all_events(user_id: str = Depends(get_current_user)):
    """Get all events for the current user."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """SELECT id, user_id, title, description, event_date, start_time, end_time, 
               notify_before, created_at, updated_at 
               FROM calendar_events WHERE user_id = %s ORDER BY event_date, start_time""",
            (user_id,)
        )
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [_format_event(e) for e in events]
    except Exception as e:
        print(f"Error fetching events: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/date/{event_date}", response_model=List[EventResponse])
async def get_events_by_date(event_date: date, user_id: str = Depends(get_current_user)):
    """Get events for a specific date."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """SELECT id, user_id, title, description, event_date, start_time, end_time,
               notify_before, created_at, updated_at 
               FROM calendar_events WHERE user_id = %s AND event_date = %s ORDER BY start_time""",
            (user_id, event_date)
        )
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [_format_event(e) for e in events]
    except Exception as e:
        print(f"Error fetching events by date: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/upcoming", response_model=List[EventResponse])
async def get_upcoming_events(user_id: str = Depends(get_current_user)):
    """Get upcoming events (today and future)."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        today = date.today()
        cursor.execute(
            """SELECT id, user_id, title, description, event_date, start_time, end_time,
               notify_before, created_at, updated_at 
               FROM calendar_events WHERE user_id = %s AND event_date >= %s 
               ORDER BY event_date, start_time LIMIT 20""",
            (user_id, today)
        )
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [_format_event(e) for e in events]
    except Exception as e:
        print(f"Error fetching upcoming events: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/today", response_model=List[EventResponse])
async def get_todays_events(user_id: str = Depends(get_current_user)):
    """Get today's events."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        today = date.today()
        cursor.execute(
            """SELECT id, user_id, title, description, event_date, start_time, end_time,
               notify_before, created_at, updated_at 
               FROM calendar_events WHERE user_id = %s AND event_date = %s ORDER BY start_time""",
            (user_id, today)
        )
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [_format_event(e) for e in events]
    except Exception as e:
        print(f"Error fetching today's events: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/month/{year}/{month}", response_model=List[EventResponse])
async def get_events_by_month(year: int, month: int, user_id: str = Depends(get_current_user)):
    """Get events for a specific month."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """SELECT id, user_id, title, description, event_date, start_time, end_time,
               notify_before, created_at, updated_at 
               FROM calendar_events WHERE user_id = %s 
               AND EXTRACT(YEAR FROM event_date) = %s 
               AND EXTRACT(MONTH FROM event_date) = %s
               ORDER BY event_date, start_time""",
            (user_id, year, month)
        )
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [_format_event(e) for e in events]
    except Exception as e:
        print(f"Error fetching events by month: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: str, user_id: str = Depends(get_current_user)):
    """Get a specific event."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """SELECT id, user_id, title, description, event_date, start_time, end_time,
               notify_before, created_at, updated_at 
               FROM calendar_events WHERE id = %s AND user_id = %s""",
            (event_id, user_id)
        )
        event = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        return _format_event(event)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(event: EventCreate, user_id: str = Depends(get_current_user)):
    """Create a new event."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """INSERT INTO calendar_events (user_id, title, description, event_date, start_time, end_time, notify_before)
               VALUES (%s, %s, %s, %s, %s, %s, %s)
               RETURNING id, user_id, title, description, event_date, start_time, end_time, notify_before, created_at, updated_at""",
            (user_id, event.title, event.description, event.event_date, 
             event.start_time, event.end_time, event.notify_before or 10)
        )
        new_event = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return _format_event(new_event)
    except Exception as e:
        print(f"Error creating event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, event: EventUpdate, user_id: str = Depends(get_current_user)):
    """Update an existing event."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if event exists and belongs to user
        cursor.execute("SELECT id FROM calendar_events WHERE id = %s AND user_id = %s", (event_id, user_id))
        existing = cursor.fetchone()
        
        if not existing:
            cursor.close()
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Build update query dynamically
        update_fields = []
        values = []
        
        if event.title is not None:
            update_fields.append("title = %s")
            values.append(event.title)
        if event.description is not None:
            update_fields.append("description = %s")
            values.append(event.description)
        if event.event_date is not None:
            update_fields.append("event_date = %s")
            values.append(event.event_date)
        if event.start_time is not None:
            update_fields.append("start_time = %s")
            values.append(event.start_time)
        if event.end_time is not None:
            update_fields.append("end_time = %s")
            values.append(event.end_time)
        if event.notify_before is not None:
            update_fields.append("notify_before = %s")
            values.append(event.notify_before)
        
        if update_fields:
            update_fields.append("updated_at = NOW()")
            values.extend([event_id, user_id])
            
            query = f"""UPDATE calendar_events SET {', '.join(update_fields)}
                        WHERE id = %s AND user_id = %s
                        RETURNING id, user_id, title, description, event_date, start_time, end_time, notify_before, created_at, updated_at"""
            
            cursor.execute(query, values)
            updated_event = cursor.fetchone()
            conn.commit()
        else:
            cursor.execute(
                """SELECT id, user_id, title, description, event_date, start_time, end_time,
                   notify_before, created_at, updated_at FROM calendar_events WHERE id = %s AND user_id = %s""",
                (event_id, user_id)
            )
            updated_event = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return _format_event(updated_event)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: str, user_id: str = Depends(get_current_user)):
    """Delete an event."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "DELETE FROM calendar_events WHERE id = %s AND user_id = %s RETURNING id",
            (event_id, user_id)
        )
        deleted = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def _format_event(event: dict) -> EventResponse:
    """Format event data for response."""
    return EventResponse(
        id=event["id"],
        user_id=event["user_id"],
        title=event["title"],
        description=event["description"],
        event_date=event["event_date"],
        start_time=event["start_time"],
        end_time=event["end_time"],
        notify_before=event["notify_before"],
        created_at=str(event["created_at"]),
        updated_at=str(event["updated_at"])
    )
