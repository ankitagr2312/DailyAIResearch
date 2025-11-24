from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """
    Common fields shared by multiple user schemas.
    """
    email: EmailStr


class UserCreate(UserBase):
    """
    Schema for creating a new user (signup).

    - email
    - password (plain)
    """
    password: str


class UserRead(UserBase):
    """
    Schema for returning user data in API responses.

    Note: Does NOT include password fields.
    """
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    class Config:
        # Allow reading data from ORM objects (SQLAlchemy models)
        from_attributes = True

class numbersAdder(BaseModel):
    num1:int
    num2:int