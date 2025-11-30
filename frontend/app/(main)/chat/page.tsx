// frontend/app/(main)/chat/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mockTopics } from "@/lib/mock-data"; // still ok for title lookup only
import { useChat } from "@/hooks/useChat";
import type { ChatMessage } from "@/lib/types";

export default function ChatPage() {
    const searchParams = useSearchParams();
    const topicId = searchParams.get("topicId");

    // Look up topic if topicId is present (for header only)
    const topic = useMemo(
        () => mockTopics.find((t) => t.id === topicId) ?? null,
        [topicId]
    );

    const isTopicMode = Boolean(topicId && topic);

    // useChat hook handles backend session + messages
    const { sessionId, messages, isSending, error, sendMessage } = useChat({
        topicId: isTopicMode && topic ? topic.id : null,
    });

    // Local input state (just the textarea text)
    const [input, setInput] = useState("");

    // Handle submit from form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;
        await sendMessage(trimmed);
        setInput("");
    };

    // For initial "welcome" message, we can fake it in UI if no messages yet.
    const shouldShowIntro = messages.length === 0;

    return (
        <div className="relative h-full w-full">
            {/* VIDEO BACKGROUND */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover z-0"
                src="/videos/chat-bg-video.mp4"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* FOREGROUND CHAT UI */}
            <div className="relative z-10 flex flex-col h-full max-h-[calc(100vh-2rem)] gap-4">
                {/* Header */}
                <header className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-gray-100">
                        {isTopicMode && topic ? "Topic Chat" : "Global Chat"}
                    </h1>
                    <p className="text-sm text-gray-200/80">
                        {isTopicMode && topic
                            ? `You’re chatting about: "${topic.title}".`
                            : "Ask anything based on all topics collected so far."}
                    </p>
                    {isTopicMode && topic && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-blue-200/40 bg-blue-500/20 px-3 py-1">
                            <span className="h-2 w-2 rounded-full bg-blue-300" />
                            <span className="text-xs font-medium text-blue-50">
                Topic: {topic.title}
              </span>
                        </div>
                    )}
                </header>

                {/* Chat window */}
                <div className="flex-1 min-h-0 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* Intro message if no messages yet */}
                        {shouldShowIntro && (
                            <MessageBubble
                                message={{
                                    id: "intro",
                                    role: "assistant",
                                    content: isTopicMode && topic
                                        ? `You are now chatting about the topic: "${topic.title}". Ask anything about this specific research topic.`
                                        : "This is a global chat across all your collected AI topics. Ask for summaries, comparisons, or trends.",
                                    created_at: new Date().toISOString(),
                                }}
                            />
                        )}

                        {messages.map((msg) => (
                            <MessageBubble key={`${msg.role}-${msg.id}-${msg.created_at}`} message={msg} />
                        ))}

                        {isSending && (
                            <div className="flex items-center gap-2 text-xs text-gray-200">
                                <span className="h-2 w-2 rounded-full bg-gray-300 animate-pulse" />
                                <span>Thinking...</span>
                            </div>
                        )}

                        {error && (
                            <div className="text-xs text-red-300 mt-2">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    <form
                        onSubmit={handleSubmit}
                        className="border-t border-white/10 bg-black/20 p-3 backdrop-blur-md"
                    >
                        <div className="flex items-end gap-2">
              <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                  placeholder={
                      isTopicMode
                          ? "Ask something about this topic..."
                          : "Ask anything across your AI topics..."
                  }
                  className="flex-1 resize-none rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
                            <button
                                type="submit"
                                disabled={isSending || !input.trim()}
                                className="
                  inline-flex items-center justify-center
                  px-4 py-2 rounded-lg text-sm font-semibold
                  text-white bg-blue-600
                  disabled:bg-gray-500 disabled:cursor-not-allowed
                  hover:bg-blue-700 transition-colors
                "
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Same bubble UI, but now uses ChatMessage from types.ts
function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    isUser
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white/80 text-gray-900 rounded-bl-sm"
                }`}
            >
                {message.content}
            </div>
        </div>
    );
}