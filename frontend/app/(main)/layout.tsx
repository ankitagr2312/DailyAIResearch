// frontend/app/(main)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        // run only in browser
        const isAuthed =
            typeof window !== "undefined" &&
            window.localStorage.getItem("isAuthenticated") === "true";

        if (!isAuthed) {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="flex h-screen bg-white text-black">
            <Sidebar />
            <div className="flex flex-col flex-1 min-h-0">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}