# 📁 DailyAIResearch — Project Structure & File Responsibilities

This document describes the full structure of the **DailyAIResearch** project and explains what each file and folder is responsible for.

Tech Stack:
- **Frontend:** React + Next.js (App Router)
- **Backend:** FastAPI (Python)
- **Worker:** Python (background ingestion and processing)
- **Database:** PostgreSQL + pgvector
- **LLM:** OpenAI API (or compatible)

---

## 🧱 Root Directory

```
daily-ai-research/
│
├── frontend/             # Next.js frontend application
├── backend/              # FastAPI backend API
├── worker/               # Ingestion + processing pipeline
├── infrastructure/       # Docker, deployment, scripts
├── docs/                 # Architecture, API, prompts, diagrams
│
├── .env.example          # Environment variables template
├── README.md             # General project overview
└── PROJECT_STRUCTURE.md  # This file
```

---

# 🟦 backend/ — FastAPI Application

```
backend/
│
├── app/
│   ├── main.py
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── utils/
│
└── tests/
```

### `app/main.py`  
Application entry point. Initializes FastAPI, includes routers, middleware, CORS, and DB connection.

---

## 📁 `app/api/` — API Endpoints

```
backend/app/api/v1/
├── topics.py
├── chats.py
├── linkedin.py
├── sources.py
└── auth.py
```

- **topics.py** — `/topics`, `/topics/today`, `/topics/by-date`, `/topics/{id}`
- **chats.py** — Topic chat (RAG) & global chat endpoints
- **linkedin.py** — Generate LinkedIn posts from a topic
- **sources.py** — Manage sources (RSS, email, HTML, PDF), sync sources
- **auth.py** — Login, signup, token verification

---

## 📁 `app/core/` — Config & Security

```
backend/app/core/
├── config.py      # Environment variables + settings
├── security.py    # JWT auth, password hashing
└── logging.py     # Logging config
```

---

## 📁 `app/models/` — Database Models

```
backend/app/models/
├── user.py             # User accounts
├── source.py           # Configured data sources
├── topic.py            # Topics after filtering
├── topic_document.py   # Full text of papers/articles
├── embeddings.py       # Embedding metadata
├── chat_session.py     # Each chat session
└── chat_message.py     # Messages within chat sessions
```

---

## 📁 `app/schemas/` — Pydantic Models

```
backend/app/schemas/
├── topic.py
├── chat.py
├── linkedin.py
├── source.py
└── auth.py
```

Defines API request/response formats.

---

## 📁 `app/services/` — Core Logic

```
backend/app/services/
├── topic_service.py      # Topic CRUD, scoring, Today’s Pick
├── rag_service.py        # Retrieval-Augmented Generation logic
├── linkedin_service.py   # LinkedIn post generation
├── source_service.py     # Manage + sync sources
└── auth_service.py       # Authentication logic
```

---

## 📁 `app/utils/` — Shared Utilities

```
backend/app/utils/
├── db.py               # DB session + engine
├── pagination.py       # Pagination helpers
└── openai_client.py    # Wrapper for OpenAI API calls
```

---

## 📁 `backend/tests/`

```
backend/tests/
├── test_topics.py
├── test_chats.py
├── test_sources.py
└── test_linkedin.py
```

Unit and integration tests.

---

# 🟩 frontend/ — Next.js Application

```
frontend/
│
├── app/
├── components/
├── hooks/
├── lib/
├── styles/
└── public/
```

---

## 📁 `app/` — Main Screens (Next.js App Router)

```
frontend/app/
├── layout.tsx                     # Global layout + sidebar
├── page.tsx                       # Daily Dashboard
│
├── topics/
│   ├── page.tsx                   # Topics for today
│   ├── history/page.tsx           # Historical topics by day
│   └── [id]/page.tsx              # Topic detail page
│
├── chat/
│   ├── global/page.tsx            # Global chat (all topics)
│   └── topic/[id]/page.tsx        # Topic-specific chat
│
├── sources/page.tsx               # Source configuration screen
└── linkedin/[id]/page.tsx         # LinkedIn Post Composer
```

---

## 📁 `components/` — Reusable UI Components

```
frontend/components/
├── layout/
│   ├── Sidebar.tsx
│   └── TopBar.tsx
│
├── topics/
│   ├── TopicCard.tsx
│   ├── TopicScores.tsx
│   └── TopicList.tsx
│
├── chat/
│   ├── ChatSidebar.tsx
│   ├── ChatWindow.tsx
│   └── ChatInput.tsx
│
├── sources/
│   └── SourceCard.tsx
│
└── linkedin/
    └── PostComposer.tsx
```

---

## 📁 `hooks/` — React Hooks

```
frontend/hooks/
├── useTopics.ts
├── useChat.ts
├── useSources.ts
└── useLinkedInPost.ts
```

---

## 📁 `lib/` — Utility Libraries

```
frontend/lib/
├── api-client.ts        # Wrapper for backend APIs
├── types.ts             # Shared TS interfaces
└── config.ts            # API URLs, constants
```

---

## 📁 `styles/`

```
frontend/styles/
├── globals.css
└── components.css
```

---

## 📁 `public/`

```
frontend/public/
└── icons/
```

---

# 🟨 worker/ — Ingestion & Processing Pipeline

```
worker/
├── tasks/
├── scheduler/
├── utils/
└── worker_main.py
```

---

## 📁 `tasks/` — Background Jobs

```
worker/tasks/
├── ingest_sources.py        # Fetch RSS, email, uploads
├── extract_items.py         # Parse newsletters into items
├── technical_filter.py      # LLM-based technical filtering
├── build_topics.py          # Create topic entities
├── fetch_documents.py       # Fetch PDFs/HTML/arXiv papers
├── chunk_and_embed.py       # Chunk + embedding generation
└── score_and_pick_today.py  # Topic scoring + Today’s Pick
```

---

## 📁 `scheduler/`

```
worker/scheduler/
└── cron.py                  # Daily scheduled ingestion pipeline
```

---

## 📁 `utils/`

```
worker/utils/
├── rss_reader.py
├── gmail_reader.py
├── html_cleaner.py
└── pdf_extractor.py
```

---

# 🗂 infrastructure/ — Deployment & Setup

```
infrastructure/
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── worker.Dockerfile
│
├── nginx/
│   └── nginx.conf
│
└── scripts/
    ├── setup_db.sh
    └── init_pgvector.sql
```

---

# 📄 docs/ — Documentation Files

```
docs/
├── architecture.md
├── api_reference.md
├── data_models.md
├── ingestion_flow.md
├── rag_pipeline.md
├── linkedin_prompts.md
└── ui_wireframes.md
```

---

# ✅ Summary

This structure ensures:
- Strong separation of frontend, backend, and worker services  
- A scalable ingestion + filtering + embedding + scoring pipeline  
- A clean RAG architecture for chats  
- Easy extension for future features  
