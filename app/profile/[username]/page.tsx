"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { User, Music2, Heart, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;

    const [profile, setProfile] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"playlists" | "liked">("playlists");
    const [currentUser, setCurrentUser] = useState<any>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

    useEffect(() => {
        const userStr = localStorage.getItem("tunefriends_user");
        if (userStr) setCurrentUser(JSON.parse(userStr));

        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/profile/${username}`);
            setProfile(res.data);
        } catch (error) {
            console.error("Profile error:", error);
        }
    };

    const handleLikePlaylist = async (playlistId: string) => {
        if (!currentUser) return alert("Please login to like playlists");

        try {
            await axios.post(`${API_URL}/api/playlists/${playlistId}/like`, { userId: currentUser.id });
            // Refresh to update potential UI states if we showed like count
            fetchProfile();
            alert("Playlist added to your Liked collection!");
        } catch (error) {
            console.error("Like error:", error);
        }
    };

    if (!profile) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Profile...</div>;

    return (
        <main className="min-h-screen bg-black text-white pt-32 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-8 items-center mb-16 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-neonBlue/10 to-transparent opacity-50" />

                    <div className="w-40 h-40 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-black relative z-10 hover:scale-105 transition-transform">
                        <img
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.user.username}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                            alt="Profile Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-4 text-center md:text-left relative z-10">
                        <h1 className="text-5xl font-black tracking-tighter">{profile.user.username}</h1>
                        <div className="flex gap-6 text-gray-400">
                            <div className="flex items-center gap-2">
                                <Music2 className="w-4 h-4" />
                                <span>{profile.playlists.length} Playlists</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                <span>{profile.likedPlaylists.length} Liked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {new Date(profile.user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-gray-300 italic">"{profile.user.about || "Music lover. Vibes enthusiast."}"</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-white/10 mb-8">
                    <button
                        onClick={() => setActiveTab("playlists")}
                        className={`pb-4 text-xl font-bold transition-colors ${activeTab === "playlists" ? "text-neonBlue border-b-2 border-neonBlue" : "text-gray-500 hover:text-white"}`}
                    >
                        Created Playlists
                    </button>
                    <button
                        onClick={() => setActiveTab("liked")}
                        className={`pb-4 text-xl font-bold transition-colors ${activeTab === "liked" ? "text-neonPurple border-b-2 border-neonPurple" : "text-gray-500 hover:text-white"}`}
                    >
                        Liked Playlists
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(activeTab === "playlists" ? profile.playlists : profile.likedPlaylists).map((playlist: any) => (
                        <motion.div
                            key={playlist._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-gray-700 transition-all flex flex-col group"
                        >
                            {/* Playlist Art Grid */}
                            <div className="grid grid-cols-2 aspect-video bg-black/50">
                                {playlist.songs.slice(0, 4).map((song: any, i: number) => (
                                    <img key={i} src={song.artwork} className="w-full h-full object-cover" />
                                ))}
                                {playlist.songs.length === 0 && (
                                    <div className="col-span-2 flex items-center justify-center text-gray-700 bg-zinc-900">No Songs</div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <div>
                                    <h3 className="text-xl font-bold truncate text-white">{playlist.name}</h3>
                                    <p className="text-sm text-gray-500">{playlist.songs.length} Tracks</p>
                                </div>

                                <div className="mt-auto flex gap-2">
                                    <button
                                        onClick={() => handleLikePlaylist(playlist._id)}
                                        className="flex-1 py-2 bg-white/5 hover:bg-neonPurple/20 text-neonPurple rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Heart className="w-4 h-4" /> Like
                                    </button>
                                </div>

                                {/* Song List Preview */}
                                <div className="space-y-2 mt-2 pt-4 border-t border-white/5">
                                    {playlist.songs.slice(0, 3).map((song: any, idx: number) => (
                                        <p key={idx} className="text-xs text-gray-400 truncate">
                                            {idx + 1}. {song.title}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {(activeTab === "playlists" ? profile.playlists : profile.likedPlaylists).length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-600 italic">
                            Nothing here yet.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
