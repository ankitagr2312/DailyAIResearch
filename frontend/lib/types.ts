// frontend/lib/types.ts

export type TopicScores = {
    trendiness: number;
    technicalDepth: number;
    practicality: number;
};

export type Topic = {
    id: string;
    title: string;
    summary: string;
    source: string; // e.g. "arXiv", "Substack"
    scores: TopicScores;
    tags: string[];
};

export interface TodayTopicsResponse {
    date: string;
    featured: Topic | null;
    others: Topic[];
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
    id: string | number;
    role: ChatRole;
    content: string;
    created_at: string; // match backend field name if it returns created_at
}

// A chat session returned by backend
export interface ChatSession {
    id: string | number;
    mode: string;
    title: string | null;
    user_id: number;
    topic_id: string | number | null;
    is_archieved:boolean;
    created_at: string;
    updated_at: string;
}

// Response from POST /api/chat/sessions
export interface CreateChatSessionResponse extends ChatSession {}

// Response from POST /api/chat/sessions/{id}/messages
export interface SendMessageResponse {
    session_id: string | number;
    user_message: ChatMessage;
    assistant_message: ChatMessage;
}