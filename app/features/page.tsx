"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Heart, Plus, Music2 } from "lucide-react";

interface Song {
    videoId: string;
    title: string;
    artist: string;
    artwork: string;
    likeCount: number;
}

export default function FeaturesPage() {
    const router = useRouter();
    const [songs, setSongs] = useState<Song[]>([]);
    const [userPlaylists, setUserPlaylists] = useState<any[]>([]); // All playlists owned by user
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("");
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<{ username: string } | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

    // Check authentication
    useEffect(() => {
        const userData = localStorage.getItem("tunefriends_user");
        if (!userData) {
            // Redirect to login if not authenticated
            router.push("/login");
        } else {
            setUser(JSON.parse(userData));
        }
    }, [router]);

    // Fetch user playlists on load
    useEffect(() => {
        if (user) {
            fetchUserPlaylists();
        }
    }, [user]);

    // Fetch songs when selected playlist changes
    useEffect(() => {
        if (selectedPlaylistId && userPlaylists.length > 0) {
            const playlist = userPlaylists.find(p => p._id === selectedPlaylistId);
            setSongs(playlist?.songs || []);
        }
    }, [selectedPlaylistId, userPlaylists]);

    const fetchUserPlaylists = async () => {
        try {
            if (user) {
                const res = await axios.get(`${API_URL}/api/playlist/user?username=${user.username}`);
                const playlists = res.data;
                setUserPlaylists(playlists);

                // If playlists exist and none selected, select first
                if (playlists.length > 0 && !selectedPlaylistId) {
                    setSelectedPlaylistId(playlists[0]._id);
                } else if (playlists.length === 0) {
                    setShowCreateForm(true); // Default to create mode if no playlists
                }
            }
        } catch (err) {
            console.error("Failed to fetch playlists:", err);
        }
    };

    const handleCreatePlaylist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlaylistName.trim() || !user) return;

        try {
            const res = await axios.post(`${API_URL}/api/playlist/create`, {
                name: newPlaylistName,
                username: user.username,
                isPublic: true
            });

            // Refresh list and select new playlist
            await fetchUserPlaylists();
            setSelectedPlaylistId(res.data._id);
            setNewPlaylistName("");
            setShowCreateForm(false);
        } catch (err) {
            console.error("Create playlist error:", err);
            alert("Failed to create playlist");
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError("");

        try {
            const res = await axios.get(`${API_URL}/api/search?q=${encodeURIComponent(searchQuery)}`);
            // Map iTunes results to the format used by the UI
            const mappedResults = res.data.map((item: any) => ({
                videoId: item.trackId.toString(), // Use trackId as videoId for uniqueness
                title: item.trackName,
                artist: item.artistName,
                thumbnail: item.artworkUrl100.replace("100x100", "600x600") // Get higher quality artwork
            }));
            setSearchResults(mappedResults);
        } catch (err) {
            setError("Search failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSong = async (video: any) => {
        if (!selectedPlaylistId) return alert("Please select or create a playlist first");

        try {
            await axios.post(`${API_URL}/api/playlist/add`, {
                videoId: video.videoId,
                title: video.title,
                artist: video.artist || "Unknown Artist",
                artwork: video.thumbnail,
                username: user?.username,
                playlistId: selectedPlaylistId
            });

            // Refresh playlists to get updated song list
            fetchUserPlaylists();
            setSearchResults([]);
            setSearchQuery("");
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to add song");
        }
    };

    const handleLike = async (videoId: string) => {
        try {
            await axios.post(`${API_URL}/api/playlist/like/${videoId}`);
            // Refresh playlist to show updated like count
            fetchUserPlaylists();
        } catch (err) {
            console.error("Failed to like song:", err);
        }
    };

    // Show loading while checking authentication
    if (!user) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-neonBlue text-xl">Checking authentication...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-6xl font-black tracking-tighter text-gray-300 mb-4">
                        Your Playlist
                    </h1>
                    <p className="text-gray-500 text-xl">
                        Add your favorite songs and like what others share
                    </p>
                </motion.div>

                {/* Playlist Management - NEW */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-3xl mx-auto mb-12"
                >
                    {showCreateForm || userPlaylists.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-lg border border-white/10 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-300">Start Your Playlist</h2>
                            <p className="text-gray-400">Give your new playlist a cool name to get started.</p>
                            <form onSubmit={handleCreatePlaylist} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    placeholder="My Awesome Playlist"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-all text-xl"
                                />
                                <button type="submit" className="bg-neonBlue text-black font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform">
                                    Create Playlist
                                </button>
                            </form>
                            {userPlaylists.length > 0 && (
                                <button onClick={() => setShowCreateForm(false)} className="text-sm text-gray-500 hover:text-white underline">
                                    Cancel
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex-1">
                                <label className="text-sm text-gray-400 block mb-1">Adding to:</label>
                                <select
                                    value={selectedPlaylistId}
                                    onChange={(e) => setSelectedPlaylistId(e.target.value)}
                                    className="w-full bg-transparent text-xl font-bold text-white border-none outline-none cursor-pointer"
                                >
                                    {userPlaylists.map(p => (
                                        <option key={p._id} value={p._id} className="bg-black text-gray-300">{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="p-2 bg-white/10 rounded-lg hover:bg-neonBlue/20 hover:text-white transition-colors"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Search Box - Only show if playlist selected and not creating new */}
                {!showCreateForm && userPlaylists.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto mb-12"
                    >
                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-lg border border-white/10">
                            <h2 className="text-2xl font-bold text-gray-300 mb-4">
                                Add Songs
                            </h2>
                            <form onSubmit={handleSearch} className="flex gap-3">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={`Search songs to add to "${userPlaylists.find(p => p._id === selectedPlaylistId)?.name}"...`}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-r from-neonPurple to-neonBlue px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? "Searching..." : "Search"}
                                </button>
                            </form>

                            {error && <p className="text-red-400 mt-4">{error}</p>}

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-400">Search Results:</h3>
                                    {searchResults.slice(0, 5).map((video) => (
                                        <div
                                            key={video.videoId}
                                            className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-16 h-16 rounded object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate">{video.title}</p>
                                                <p className="text-sm text-gray-400">{video.artist || "Unknown Artist"}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAddSong(video)}
                                                className="p-2 bg-neonBlue/20 hover:bg-neonBlue/30 rounded-lg transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Playlist Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {songs.length === 0 ? (
                        <div className="text-center py-20">
                            <Music2 className="w-20 h-20 mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-500 text-lg">
                                No songs yet. Be the first to add one!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {songs.map((song) => (
                                <div
                                    key={song.videoId}
                                    className="group bg-white/5 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden hover:border-neonBlue/50 transition-all"
                                >
                                    <div className="relative aspect-square">
                                        <img
                                            src={song.artwork}
                                            alt={song.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-white truncate">{song.title}</h3>
                                            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                                        </div>
                                        <button
                                            onClick={() => handleLike(song.videoId)}
                                            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-neonPurple/20 border border-white/10 hover:border-neonPurple/50 py-2 rounded-lg transition-all group-hover:scale-105"
                                        >
                                            <Heart className="w-4 h-4 text-neonPurple" fill="#bd00ff" />
                                            <span className="text-sm font-medium">{song.likeCount} Likes</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
