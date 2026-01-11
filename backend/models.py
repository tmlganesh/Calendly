from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, time
from uuid import UUID

# Auth Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# Event Models
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: date
    start_time: time
    end_time: time
    notify_before: Optional[int] = 10  # minutes

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    notify_before: Optional[int] = None

class EventResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    event_date: date
    start_time: time
    end_time: time
    notify_before: int
    created_at: str
    updated_at: str
