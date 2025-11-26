Tone options: Technical, Opinionated, Short.

---

## 🧱 Technical Architecture

### Frontend (Next.js + React)
Screens include:
- Source Setup & Sync
- Daily Dashboard
- Topic List (By Day)
- Topic Detail
- Global Chat
- Topic Chat
- LinkedIn Composer

### Backend (FastAPI)
Services:
- Source Service
- Ingestion Service
- Topic Service
- Document Processor
- Embedding Service
- Chat Service (Global & Topic RAG)
- LinkedIn Post Service

### Database (PostgreSQL + pgvector)
Tables:
- `sources`
- `source_items`
- `topics`
- `topic_documents`
- `embeddings`
- `daily_recommendations`
- `chat_sessions`
- `chat_messages`
- `users`

### Daily Pipeline (Cron)
1. Fetch sources
2. Filter technical content
3. Summarize topics
4. Fetch/parse documents
5. Chunk & embed
6. Score topics
7. Select Today’s Pick

---

## 📂 Project Structure
/frontend
- /app
- /components
- /lib
- /hooks
- /styles

/backend
- /api
- /models
- /services
- /db
- /routers
- /schemas
- /workers

main.py

---

## 🛠️ Tech Stack

**Frontend:** Next.js, React, Tailwind  
**Backend:** FastAPI, Python  
**Database:** PostgreSQL + pgvector  
**AI Layer:** OpenAI APIs (LLM-based summarization, RAG, chat, LinkedIn generation)  
**Task Scheduling:** Cron / Celery (optional future)

---

## 🧩 MVP Scope

- Source ingestion
- Filtering & summarization
- Topic ranking & Today’s Pick
- Topic detail viewer
- Global Chat (RAG)
- Topic Chat (RAG)
- LinkedIn post generator

---

## 🚧 Future Roadmap

- Multi-user collaboration
- Auto-publish to LinkedIn
- Daily email digest
- Topic alerts
- Export to Notion/Obsidian
- Customizable scoring model

---

### ⭐ If you like this project, give it a star on GitHub!