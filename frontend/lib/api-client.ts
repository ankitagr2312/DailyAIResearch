// frontend/lib/api-client.ts

import { API_BASE_URL } from "./config";

export class ApiError extends Error {
    status: number;
    body: unknown;

    constructor(message: string, status: number, body: unknown) {
        super(message);
        this.status = status;
        this.body = body;
    }
}

// Helper: get token from localStorage (only in browser)
function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
}

function buildAuthHeaders() {
    const token = getAccessToken();
    if (!token) return {};
    return {
        Authorization: `Bearer ${token}`,
    };
}

// Generic helper for GET requests
export async function apiGet<T>(path: string): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...buildAuthHeaders(),
        },
        cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new ApiError(`GET ${path} failed`, res.status, data);
    }

    return data as T;
}

// Generic helper for POST requests
export async function apiPost<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
    const url = `${API_BASE_URL}${path}`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...buildAuthHeaders(),
        },
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new ApiError(`POST ${path} failed`, res.status, data);
    }

    return data as TRes;
}