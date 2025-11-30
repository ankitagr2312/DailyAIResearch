// frontend/hooks/useChat.ts
"use client";

import { useCallback, useState } from "react";
import { apiGet, apiPost, ApiError } from "@/lib/api-client";
import type {
    ChatMessage,
    CreateChatSessionResponse,
    SendMessageResponse,
} from "@/lib/types";

/**
 * useChat hook
 * - Manages chat session (global or topic)
 * - Sends messages to backend
 * - Stores messages in state
 */
export function useChat(options?: { topicId?: string | null }) {
    const { topicId = null } = options || {};

    const [sessionId, setSessionId] = useState<string | number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Ensure we have a session.
     * If no session yet, call POST /chat/sessions and store id.
     */
    const ensureSession = useCallback(async () => {
        if (sessionId !== null) return sessionId;

        try {
            const body = {
                topic_id: topicId, // null means global chat
                title: null,
            };

            const res = await apiPost<typeof body, CreateChatSessionResponse>(
                "/chat/sessions",
                body
            );

            setSessionId(res.id);

            // Optionally load existing messages if backend supports it
            // (for now, we start empty; ChatPage already shows a welcome message in UI)

            return res.id;
        } catch (err) {
            console.error("Failed to create chat session", err);
            throw err;
        }
    }, [sessionId, topicId]);

    /**
     * Send a message:
     * - Ensure we have a session
     * - Add user message locally
     * - Call backend
     * - Append assistant reply
     */
    const sendMessage = useCallback(
        async (content: string) => {
            const trimmed = content.trim();
            if (!trimmed) return;

            setError(null);
            setIsSending(true);

            try {
                // 1. Ensure session exists
                const effectiveSessionId = await ensureSession();

                // 2. Create local user message (optimistic)
                const now = new Date().toISOString();
                const userMessage: ChatMessage = {
                    id: `local-${Date.now()}`,
                    role: "user",
                    content: trimmed,
                    created_at: now,
                };

                setMessages((prev) => [...prev, userMessage]);

                // 3. Call backend
                const body = { content: trimmed };
                const res = await apiPost<typeof body, SendMessageResponse>(
                    `/chat/sessions/${effectiveSessionId}/messages`,
                    body
                );

                // 4. Append assistant message from backend
                setMessages((prev) => [
                    ...prev,
                    // use backend's canonical user message & assistant message
                    res.assistant_message,
                ]);
            } catch (err) {
                console.error("Failed to send message", err);
                const msg =
                    err instanceof ApiError
                        ? `Failed to send message (status ${err.status})`
                        : "Failed to send message";
                setError(msg);
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