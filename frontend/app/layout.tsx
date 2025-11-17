import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const metadata = {
    title: "DailyAIResearch",
    description: "AI-powered research copilot",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        {/* Make the whole viewport a flex row and lock height to screen */}
        <body className="flex h-screen bg-white text-black">
        {/* Sidebar stays fixed on the left */}
        <Sidebar />

        {/* Right side: TopBar + scrollable main content */}
        <div className="flex flex-col flex-1 min-h-0">
            <TopBar />

            {/* This is the only part that scrolls */}
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
        </body>
        </html>
    );
}