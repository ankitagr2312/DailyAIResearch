// frontend/components/topics/TopicCard.tsx
import Link from "next/link";
import { Topic } from "@/lib/types";
import TopicScores from "./TopicScores";

interface TopicCardProps {
    topic: Topic;
    variant?: "featured" | "default";
}

export default function TopicCard({ topic, variant = "default" }: TopicCardProps) {
    const isFeatured = variant === "featured";

    return (
        <div
            className={
                "rounded-xl border bg-white text-black p-5 flex flex-col gap-4 hover:border-blue-500 hover:shadow-md transition-all" +
                (isFeatured ? " md:p-6 md:gap-5 border-blue-200 shadow-sm" : " border-gray-300")
            }
        >
            {/* TITLE + SOURCE + FEATURED BADGE */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className={isFeatured ? "text-2xl font-semibold" : "text-lg font-semibold"}>
                        {topic.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Source: {topic.source}</p>
                </div>

                {isFeatured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            Today&apos;s Pick
          </span>
                )}
            </div>

            {/* SUMMARY */}
            <p className="text-sm text-gray-700 leading-relaxed">
                {topic.summary}
            </p>

            {/* SCORES + CHAT BUTTON SIDE-BY-SIDE (stack on mobile) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
                {/* Scores block */}
                <TopicScores scores={topic.scores} />

                {/* Chat button */}
                <Link
                    href={`/chat?topicId=${topic.id}`}
                    className="
            inline-flex items-center justify-center
            px-5 py-3 rounded-lg
            text-sm font-semibold text-white
            bg-gradient-to-r from-blue-600 to-blue-500
            shadow-md hover:shadow-lg hover:scale-[1.02]
            transition-transform transition-shadow duration-200
            whitespace-nowrap
          "
                >
                    Chat
                </Link>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-2">
                {topic.tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700"
                    >
            #{tag}
          </span>
                ))}
            </div>
        </div>
    );
}