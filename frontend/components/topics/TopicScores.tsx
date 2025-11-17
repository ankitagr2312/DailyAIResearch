// frontend/components/topics/TopicScores.tsx

import { TopicScores as TopicScoresType } from "@/lib/types";

type TopicScoresProps = {
    scores: TopicScoresType;
};

export default function TopicScores({ scores }: TopicScoresProps) {
    return (
        <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-2 py-1 rounded-md bg-[#EFFDF4] text-gray-700 flex flex-col leading-tight">
        <span className="text-xs font-bold text-[#16A349]">Trendiness</span>
        <span className="font-bold text-xl text-[#16803C]">{scores.trendiness}</span>
      </span>
            <span className="px-2 py-1 rounded-md bg-[#EEF6FF] text-gray-700 flex flex-col leading-tight">
        <span className="text-xs font-bold text-[#2463EB]">Technical Depth</span>
        <span className="font-bold text-xl text-[#1C4ED8]">{scores.technicalDepth}</span>
      </span>
            <span className="px-2 py-1 rounded-md bg-[#FAF5FF] text-gray-700 flex flex-col leading-tight">
        <span className="text-xs font-bold text-[#9333E9]">Practicality</span>
        <span className="font-bold text-xl text-[#7E22CD]">{scores.practicality}</span>
      </span>
        </div>
    );
}