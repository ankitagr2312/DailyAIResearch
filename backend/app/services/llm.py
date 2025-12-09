# app/services/llm.py

from typing import Optional

import httpx

from app.core.config import get_settings
from app.models.topic import Topic

settings = get_settings()


def build_prompt(
        user_message: str,
        mode: str = "global",
        topic: Optional[Topic] = None,
) -> str:
    """
    Build the prompt we send to the LLM.

    - For global chat: just use the user message.
    - For topic chat: include topic title + summary as context.
    """
    if mode == "topic" and topic is not None:
        return (
            "You are an AI assistant helping a technical user understand an AI research topic.\n\n"
            f"Topic title: {topic.title}\n"
            f"Topic summary: {topic.summary}\n\n"
            "Answer the user's question clearly and technically, grounded in this topic.\n\n"
            f"User question: {user_message}"
        )

    # Global chat: no extra context (for now)
    return user_message


def generate_llm_reply(
        user_message: str,
        mode: str = "global",
        topic: Optional[Topic] = None,
) -> str:
    """
    Call Ollama's HTTP API (non-streaming) and return the generated text.

    Uses /api/generate with stream=False.
    """
    prompt = build_prompt(user_message=user_message, mode=mode, topic=topic)

    payload = {
        "model": settings.OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }

    try:
        resp = httpx.post(
            f"{settings.OLLAMA_BASE_URL}/api/generate",
            json=payload,
            timeout=60.0,
        )
        resp.raise_for_status()
    except httpx.HTTPError as e:
        # In a real app you might log e here
        # For now, return a friendly fallback
        return (
            "I tried to call the local LLM (Ollama) but the request failed.\n"
            f"Technical details: {str(e)}"
        )

    data = resp.json()
    # Ollama /api/generate returns the text in the "response" field
    text = data.get("response", "")

    if not text:
        return "The LLM returned an empty response."

    return text.strip()