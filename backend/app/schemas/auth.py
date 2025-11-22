from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """
    Schema for user login request.
    """
    email: EmailStr
    password: str


class Token(BaseModel):
    """
    Schema for the JWT access token response.
    """
    access_token: str
    token_type: str = "bearer"