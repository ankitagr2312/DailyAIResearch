// frontend/hooks/useChat.ts
"use client";

import { useCallback, useState } from "react";
import { apiPost, ApiError } from "@/lib/api-client";
import type { ChatMessage } from "@/lib/types";

interface UseChatParams {
    topicId: string | null;
}

interface ChatSession {
    id: number;
    mode: string;
    title: string | null;
    user_id: number;
    topic_id: number | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

// 👇 match the actual backend payload you showed
interface SendMessageResponse {
    session: ChatSession;
    messages: ChatMessage[]; // [{...user}, {...assistant}]
}

export function useChat({ topicId }: UseChatParams) {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Ensure we have a chat session on the backend.
     * - If we already have sessionId in state, reuse it.
     * - Otherwise call POST /chat/sessions and store the id.
     */
    const ensureSession = useCallback(async (): Promise<number> => {
        if (sessionId !== null) {
            return sessionId;
        }

        setError(null);

        const body = {
            topic_id: topicId, // null = global chat
            title: null,
        };

        try {
            // Your create-session endpoint likely returns just the session
            const res = await apiPost<typeof body, ChatSession>("/chat/sessions", body);

            setSessionId(res.id);
            return res.id;
        } catch (err) {
            console.error("Failed to create chat session", err);
            if (err instanceof ApiError) {
                setError(`Failed to create chat session (status ${err.status})`);
            } else {
                setError("Failed to create chat session.");
            }
            throw err;
        }
    }, [sessionId, topicId]);

    /**
     * Send a message:
     * 1. Ensure session exists
     * 2. Add user message locally (optimistic)
     * 3. Call backend POST /chat/sessions/{id}/messages
     * 4. Append assistant message from backend (from response.messages)
     */
    const sendMessage = useCallback(
        async (content: string) => {
            const trimmed = content.trim();
            if (!trimmed) return;

            setIsSending(true);
            setError(null);

            const now = new Date().toISOString();
            const tempId = `local-${Date.now()}`;

            // 2) Optimistically add user message
            const userLocalMessage: ChatMessage = {
                id: tempId,
                role: "user",
                content: trimmed,
                created_at: now,
            };

            setMessages((prev) => [...prev, userLocalMessage]);

            try {
                // 1) Ensure session
                const session = await ensureSession();

                // 3) Call backend
                const body = { content: trimmed };

                const res = await apiPost<typeof body, SendMessageResponse>(
                    `/chat/sessions/${session}/messages`,
                    body
                );

                console.log("BACKEND CHAT RESPONSE:", res);

                // 4) Pick assistant message from res.messages
                if (Array.isArray(res.messages) && res.messages.length > 0) {
                    // Try to find the assistant message explicitly
                    const assistant =
                        res.messages.find((m) => m.role === "assistant") ??
                        res.messages[res.messages.length - 1];

                    setMessages((prev) => [...prev, assistant]);
                } else {
                    console.warn("No messages array in response", res);
                }
            } catch (err) {
                console.error("Failed to send message", err);
                if (err instanceof ApiError) {
                    setError(`Failed to send message (status ${err.status})`);
                } else {
                    setError("Failed to send message.");
                }
            } finally {
                setIsSending(false);
            }
        },
        [ensureSession]
    );

    return {
        sessionId,
        messages,
        isSending,
        error,
        sendMessage,
    };
}