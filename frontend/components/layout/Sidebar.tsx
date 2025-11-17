"use client";
import Link from "next/link";
import Lottie from "lottie-react";
import Image from "next/image";
import { oldChats } from "@/lib/mock-data";

export default function Sidebar() {

    return (
        <div className="w-60 bg-gray-100 text-black h-screen p-4 flex flex-col gap-4 border-r border-gray-300">

            {/* App Header Block */}
            <div
                className="rounded-xl bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-3 mb-3 shadow-sm border border-blue-100">

                {/* Logo + Title */}
                <div className="flex items-center gap-2 mb-3">
                    {/* Simple Logo */}
                    <div
                        className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        D
                    </div>

                    <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-gray-500">
             Daily AI
            </span>
                        <h1 className="text-sm font-semibold text-gray-900">
                            DailyAIResearch
                        </h1>
                    </div>
                </div>

                {/* NEW CHAT BUTTON */}
                <Link
                    href="/chat/"
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-150"
                >
                    <span className="text-lg leading-none">＋</span>
                    <span>New Chat</span>
                </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4"/>

            {/* Navigation */}
            <nav className="flex flex-col gap-3">
                <Link href="/" className="flex items-center gap-2 hover:text-blue-600">
                    <Image
                        src="/icons/sidebar/dashboard.png"
                        alt="Sources Icon"
                        width={20}
                        height={20}
                        className="opacity-90"
                    />
                    <span>Dashboard</span>
                </Link>
                <Link href="/topics" className="flex items-center gap-2 hover:text-blue-600">
                    <Image
                        src="/icons/sidebar/topics.png"
                        alt="Sources Icon"
                        width={20}
                        height={20}
                        className="opacity-90"
                    />
                    <span>Topics</span>
                </Link>
                <Link href="/sources" className="flex items-center gap-2 hover:text-blue-600">
                    <Image
                        src="/icons/sidebar/dataSources.png"
                        alt="Sources Icon"
                        width={20}
                        height={20}
                        className="opacity-90"
                    />
                    <span>Sources</span>
                </Link>
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4"/>

            {/* Old Chats */}
            <div className="flex flex-col gap-2 overflow-auto">
                <h2 className="text-sm font-semibold text-gray-600">Old Chats</h2>

                <div className="flex flex-col gap-4">
                    {oldChats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={`/chat/global?id=${chat.id}`}
                            className="text-sm text-gray-800 hover:text-blue-600 truncate"
                        >
                            {chat.title}
                        </Link>
                    ))}
                </div>
            </div>
            {/* Divider */}
            {/* <div className="border-t border-gray-300 my-4" />*/}

            {/* PROFILE BUTTON (sticks bottom) */}
            <div className="mt-auto border-t border-gray-300 pt-4">
                <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-200 transition">
                    <div
                        className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                        A
                    </div>
                    <span className="text-sm font-medium">Ankit</span>
                </button>
            </div>

        </div>
    );
}