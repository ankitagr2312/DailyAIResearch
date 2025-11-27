// frontend/app/(main)/topics/page.tsx
"use client";

import TopicCard from "@/components/topics/TopicCard";
import { useTopicsList } from "@/hooks/useTopics";

export default function TopicsPage() {
    const { topics, loading, error } = useTopicsList();

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <header className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-gray-900">All Topics</h1>
                <p className="text-sm text-gray-600">
                    Browse all collected AI research topics. Filtering and search will come next.
                </p>
            </header>

            {/* (Placeholder) Filters row */}
            <section className="flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search by title or summary..."
                    className="w-full md:w-72 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <select
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">All tags</option>
                    <option value="RAG">RAG</option>
                    <option value="LLMs">LLMs</option>
                    <option value="Agents">Agents</option>
                    <option value="Inference">Inference</option>
                </select>

                <select
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Sort by</option>
                    <option value="trendiness">Trendiness</option>
                    <option value="technicalDepth">Technical depth</option>
                    <option value="practicality">Practicality</option>
                </select>
            </section>

            {/* Loading / Error states */}
            {loading && (
                <p className="text-sm text-gray-500">Loading topics...</p>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {/* Topics Grid */}
            {!loading && !error && (
                <section>
                    <div className="grid gap-4 md:grid-cols-2">
                        {topics.map((topic) => (
                            <TopicCard key={topic.id} topic={topic} />
                        ))}
                    </div>
                </section>
            )}

            {!loading && !error && topics.length === 0 && (
                <p className="text-sm text-gray-500">No topics found.</p>
            )}
        </div>
    );
}