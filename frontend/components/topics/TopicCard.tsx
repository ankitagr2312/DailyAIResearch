// frontend/components/topics/TopicCard.tsx

import { Topic } from "@/lib/types";
import TopicScores from "./TopicScores";

type TopicCardProps = {
    topic: Topic;
    variant?: "featured" | "default";
};

export default function TopicCard({ topic, variant = "default" }: TopicCardProps) {
    const isFeatured = variant === "featured";

    return (
        <div
            className={
                "rounded-xl border border-gray-300 bg-white text-black p-5 flex flex-col gap-4 hover:border-blue-500 transition-all" +
                (isFeatured ? " md:p-6 md:gap-4" : "")
            }
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className={isFeatured ? "text-2xl font-semibold" : "text-lg font-semibold"}>
                        {topic.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Source: {topic.source}</p>
                </div>
                {isFeatured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/40">
            Today&apos;s Pick
          </span>
                )}
            </div>

            <p className="text-sm text-gray-700">
                {topic.summary}
            </p>

            <TopicScores scores={topic.scores} />

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