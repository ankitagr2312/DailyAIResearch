# DailyAIResearch

DailyAIResearch is an AI-powered research copilot that collects technical AI topics daily, filters out noise, ranks what matters, lets you explore each topic through RAG-based chat, and generates polished LinkedIn posts. Designed for technical creators who want to stay updated and publish daily with ease.

---

## 🚀 Features

### ✔ Daily Topic Aggregation
Automatically pulls research from:
- AI newsletters (AlphaSignal, AIxFunda, etc.)
- Substack/RSS feeds
- arXiv papers
- Uploaded PDFs, HTML files, or manual links

### ✔ Technical Filtering
Keeps only deep technical topics:
- LLM architectures
- RAG systems
- Agents & tool-use frameworks
- Memory systems
- Training & inference optimizations
- Open-source model releases

Filters out:
- Funding, PR, hiring
- Politics & regulation
- Non-technical business news

### ✔ Topic Ranking & Today’s Pick
Each topic is scored on:
- Trendiness
- Technical Depth
- Practicality

Automatically selects the best topic daily.

### ✔ Topic Chat (RAG-based)
Ask questions about a specific topic using retrieval from its source documents.

### ✔ Global Chat
Ask anything across **all topics ever ingested**, including trends, comparisons, and summaries.

### ✔ LinkedIn Post Generator
Generate professional LinkedIn posts using a structured format:
- Hook
- Explanation
- Why it matters
- Practical takeaway
- CTA
- Hashtags  
  Supports multiple tones (Technical, Opinionated, Short).

---

## 🧠 Architecture Overview

### Frontend
Built using Next.js / React:
- Daily Dashboard
- Topic List (by day)
- Topic Detail
- Topic Chat
- Global Chat
- LinkedIn Post Composer
- Source Setup & Configuration

### Backend
Built with FastAPI or NestJS:
- Ingestion Service
- Technical Filter & Summarizer
- Topic Scorer
- Document Fetcher
- RAG Chat Service
- LinkedIn Post Engine

### Data Layer
- PostgreSQL
- pgvector or Qdrant for embeddings
- Tables:
    - users
    - sources
    - source_items
    - topics
    - topic_documents
    - embeddings
    - daily_recommendations
    - chat_sessions
    - chat_messages

---

## 📚 Daily Workflow

1. App ingests all configured sources.
2. Extracts and filters technical topics.
3. Scores each topic and selects **Today’s Pick**.
4. User explores or selects an alternative topic.
5. User chats with topic or globally.
6. User generates a LinkedIn post.
7. Copy → Publish.

---

## 🛠 MVP Scope

- Source ingestion
- Technical filtering
- Topic scoring
- Today’s Pick selection
- Topic detail viewer
- Topic chat (RAG)
- Global chat (RAG)
- LinkedIn post generator
- Historical topic browsing
- Source configuration

---

## 📅 Roadmap

- Team collaboration mode
- Auto-publishing to LinkedIn
- Trend tracking across weeks
- Real-time source syncing
- Notion / Obsidian integration
- Custom topic scoring models

---

## 🤝 Contributing

Contributions, feature requests, and issues are welcome.  
Please open a pull request or discussion.

---

## 📄 License

MIT License (recommended). Update as needed.