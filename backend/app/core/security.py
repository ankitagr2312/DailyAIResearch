from datetime import datetime, timedelta
from typing import Optional, Union

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings


# Load settings (SECRET_KEY, ALGORITHM, EXPIRY)
settings = get_settings()


# Password hashing configuration using bcrypt
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """
    Hash a plain-text password using bcrypt.

    You will store this hash in the database, never the plain password.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify that a plain-text password matches the stored hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
        subject: Union[str, int],
        expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token.

    - subject: usually user ID (or email)
    - expires_delta: timedelta for expiration; if None, use default from settings
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.utcnow() + expires_delta

    to_encode = {
        "sub": str(subject),  # subject stored as string
        "exp": expire,        # expiration time
    }

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode a JWT access token.

    Returns the payload dict if valid, otherwise None.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None