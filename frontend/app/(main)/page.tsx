// frontend/app/page.tsx

import TopicCard from "@/components/topics/TopicCard";
import { Topic } from "@/lib/types";


import { mockTopics } from "@/lib/mock-data";

export default function DashboardPage() {
    const [featured, ...others] = mockTopics;

    return (
        <div className="flex flex-col gap-6">
            {/* Today’s Pick */}
            <section>
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">Today&apos;s Pick</h1>
                <TopicCard topic={featured} variant="featured" />
            </section>

            {/* Other Topics */}
            <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Other Topics</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {others.map((topic) => (
                        <TopicCard key={topic.id} topic={topic} />
                    ))}
                </div>
            </section>
        </div>
    );
}