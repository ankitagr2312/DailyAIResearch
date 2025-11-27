// frontend/lib/config.ts

// Base URL of your FastAPI backend.
// In dev, something like: http://localhost:8000/api
// You can override via NEXT_PUBLIC_API_BASE_URL env variable.
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";