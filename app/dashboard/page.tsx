"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Plus } from "lucide-react";
import DashAnimation from "@/components/DashAnimation";

export default function Dashboard() {
    const router = useRouter();
    const [roomIdInput, setRoomIdInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateRoom = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";
            const res = await axios.post(`${API_URL}/api/rooms/create`, {
                hostSocketId: "init-client"
            });

            const { roomId } = res.data;
            router.push(`/room?id=${roomId}`);
        } catch (error) {
            console.error("Failed to create room", error);
            alert("Error creating room. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomIdInput.trim()) return;
        router.push(`/room?id=${roomIdInput.trim()}`);
    };

    return (
        <>
            {/* Scroll Animation Section */}
            <DashAnimation />

            {/* Dashboard Content */}
            <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(189,0,255,0.2),transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(0,243,255,0.1),transparent_50%)]" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="text-center mb-12 space-y-4">
                        <h1 className="text-5xl font-black tracking-tighter text-gray-400">
                            Dashboard
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Start a jam session or join a vibe.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {/* Create Room */}
                        <button
                            onClick={handleCreateRoom}
                            disabled={loading}
                            className="group relative w-full p-6 bg-gradient-to-r from-neonPurple/20 to-neonBlue/20 border border-white/10 rounded-2xl hover:border-white/30 transition-all flex items-center justify-between overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-neonPurple/10 to-neonBlue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-neonPurple/20 rounded-full text-neonPurple group-hover:bg-neonPurple group-hover:text-white transition-colors">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold">Create Room</h3>
                                    <p className="text-sm text-gray-400">Host a new session</p>
                                </div>
                            </div>
                            {loading && <div className="text-sm text-white/50 animate-pulse">Creating...</div>}
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        {/* Join Room */}
                        <form onSubmit={handleJoinRoom} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Join with Code</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Room Code (e.g. A1B2C3)"
                                        value={roomIdInput}
                                        onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-all text-center tracking-[0.2em] font-mono uppercase"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!roomIdInput}
                                        className="bg-white text-black px-6 rounded-xl font-bold hover:bg-neonBlue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </main>
        </>
    );
}
