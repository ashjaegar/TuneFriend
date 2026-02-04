"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { Search, ArrowRight, User, Heart } from "lucide-react";

export default function PlaylistSearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

    useEffect(() => {
        const userStr = localStorage.getItem("tunefriends_user");
        if (userStr) setCurrentUser(JSON.parse(userStr));
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/playlists/search?q=${query}`);
            setResults(res.data || []);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (playlistId: string) => {
        if (!currentUser) return alert("Please login to like playlists");

        try {
            const res = await axios.post(`${API_URL}/api/playlists/${playlistId}/like`, { userId: currentUser.id });
            // Update local state to show new like count
            setResults(prev => prev.map(p =>
                p._id === playlistId
                    ? { ...p, likes: new Array(res.data.likeCount || (p.likes?.length || 0) + 1).fill("id") } // Simple optimistic/response update
                    : p
            ));
        } catch (error) {
            console.error("Like error:", error);
            alert("Failed to like playlist");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white pt-32 px-6">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-white tracking-tighter">
                        Find <span className="text-neonBlue">Community</span> Playlists
                    </h1>
                    <p className="text-gray-400 text-xl">
                        Discover what Tunefriends are listening to.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute inset-x-0 -bottom-2 h-4 bg-neonBlue/20 blur-2xl transition-all rounded-full" />
                    <form onSubmit={handleSearch} className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl">
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by playlist name..."
                            className="flex-1 bg-transparent border-none outline-none text-xl py-3 px-4 placeholder-gray-500 text-white"
                        />
                        <button
                            disabled={loading}
                            className="bg-neonBlue text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform"
                        >
                            {loading ? "..." : <Search className="w-6 h-6" />}
                        </button>
                    </form>
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {results.map((playlist) => (
                        <motion.div
                            key={playlist._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-neonBlue/50 transition-all flex flex-col gap-4 group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-neonBlue transition-colors">{playlist.name}</h3>
                                    <Link href={`/profile/${playlist.owner?.username}`}>
                                        <div className="flex items-center gap-2 text-gray-400 hover:text-white mt-2">
                                            <User className="w-4 h-4" />
                                            <span>{playlist.owner?.username || "Unknown User"}</span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                                    {playlist.songs?.length || 0} Songs
                                </div>
                            </div>

                            {/* Preview of first few songs */}
                            <div className="flex gap-2">
                                {playlist.songs?.slice(0, 3).map((song: any, i: number) => (
                                    <img
                                        key={i}
                                        src={song.artwork}
                                        className="w-12 h-12 rounded-lg object-cover border border-white/10"
                                        alt=""
                                    />
                                ))}
                            </div>

                            <Link
                                href={`/profile/${playlist.owner?.username}`}
                                className="mt-auto w-full py-3 bg-white/5 hover:bg-neonBlue/20 text-center rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                View Profile <ArrowRight className="w-4 h-4" />
                            </Link>

                            <button
                                onClick={() => handleLike(playlist._id)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-neonPurple rounded-full transition-colors flex items-center gap-1 backdrop-blur-md"
                            >
                                <Heart className={`w-4 h-4 ${playlist.likes?.includes(currentUser?.id) ? "fill-white" : ""}`} />
                                <span className="text-xs font-bold">{playlist.likes?.length || 0}</span>
                            </button>
                        </motion.div>
                    ))}

                    {!loading && results.length === 0 && query && (
                        <p className="text-center text-gray-500 col-span-full py-12">No playlists found.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
