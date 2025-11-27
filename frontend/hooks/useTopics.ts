// frontend/hooks/useTopics.ts
"use client";

import { useEffect, useState } from "react";
import { apiGet, ApiError } from "@/lib/api-client";
import type { Topic, TodayTopicsResponse } from "@/lib/types";

interface UseTodayTopicsResult {
    featured: Topic | null;
    others: Topic[];
    loading: boolean;
    error: string | null;
}

export function useTodayTopics(): UseTodayTopicsResult {
    const [featured, setFeatured] = useState<Topic | null>(null);
    const [others, setOthers] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGet<TodayTopicsResponse>("/topics/today");

                if (!cancelled) {
                    setFeatured(data.featured);
                    setOthers(data.others ?? []);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    const msg =
                        err instanceof ApiError
                            ? `Failed to load today topics (status ${err.status})`
                            : "Failed to load today topics";
                    setError(msg);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return { featured, others, loading, error };
}

interface UseTopicsListResult {
    topics: Topic[];
    loading: boolean;
    error: string | null;
}

export function useTopicsList(): UseTopicsListResult {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiGet<Topic[]>("/topics");
                if (!cancelled) {
                    setTopics(data);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    const msg =
                        err instanceof ApiError
                            ? `Failed to load topics (status ${err.status})`
                            : "Failed to load topics";
                    setError(msg);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return { topics, loading, error };
}