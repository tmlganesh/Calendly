from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
from models import UserCreate, UserLogin, UserResponse, Token
from auth import get_password_hash, verify_password, create_access_token
from database import get_db_connection
from config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    """Register a new user."""
    # Validate password length (bcrypt has 72 byte limit)
    if len(user.password) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be 72 characters or less"
        )
    
    if len(user.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM calendar_users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            cursor.close()
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        password_hash = get_password_hash(user.password)
        cursor.execute(
            "INSERT INTO calendar_users (email, password_hash) VALUES (%s, %s) RETURNING id, email",
            (user.email, password_hash)
        )
        new_user = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return UserResponse(id=new_user["id"], email=new_user["email"])
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    """Login and get access token."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, email, password_hash FROM calendar_users WHERE email = %s",
            (user.email,)
        )
        db_user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not db_user or not verify_password(user.password, db_user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(db_user["id"])},
            expires_delta=access_token_expires
        )
        
        return Token(access_token=access_token, token_type="bearer")
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.get("/me", response_model=UserResponse)
async def get_me(user_id: str):
    """Get current user info."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, email FROM calendar_users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(id=user["id"], email=user["email"])
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
