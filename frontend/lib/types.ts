// frontend/lib/types.ts

export type TopicScores = {
    trendiness: number;
    technicalDepth: number;
    practicality: number;
};

export type Topic = {
    id: string;
    title: string;
    summary: string;
    source: string; // e.g. "arXiv", "Substack"
    scores: TopicScores;
    tags: string[];
};