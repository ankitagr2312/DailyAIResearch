// frontend/hooks/useChatSessions.ts
"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api-client";
import type { ChatSession } from "@/lib/types";

export function useChatSessions() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGet<ChatSession[]>("/chat/sessions");
                if (!cancelled) {
                    setSessions(data);
                }
            } catch (err) {
                console.error("Failed to load chat sessions", err);
                if (!cancelled) {
                    setError("Failed to load chats.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return { sessions, loading, error };
}