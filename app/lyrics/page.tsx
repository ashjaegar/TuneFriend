"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Search, Music2, ArrowLeft, Loader2, Play } from "lucide-react";
import Link from "next/link";

interface SongResult {
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    trackId: number;
}

export default function LyricsPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SongResult[]>([]);
    const [selectedSong, setSelectedSong] = useState<any | null>(null);
    const [lyrics, setLyrics] = useState("");
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // Autocomplete effect
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";
                const res = await axios.get(`${API_URL}/api/search?q=${query}`);
                setResults(res.data.slice(0, 5)); // Show top 5 recommendations
            } catch (error) {
                console.error("Search error", error);
            }
        };

        const timer = setTimeout(fetchRecommendations, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectSong = async (song: SongResult) => {
        setLoading(true);
        setSearching(false);
        setResults([]);
        setQuery(song.trackName);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";
            const res = await axios.get(`${API_URL}/api/song/details?artist=${song.artistName}&title=${song.trackName}`);

            setSelectedSong({
                ...song,
                artworkHigh: song.artworkUrl100.replace("100x100", "800x800")
            });
            setLyrics(res.data.lyrics || "Sorry, we couldn't find lyrics for this song yet.");
        } catch (error) {
            console.error("Lyrics error", error);
            setLyrics("Error fetching lyrics. Please try another song.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Link href="/" className="inline-flex items-center gap-2 text-neonBlue hover:gap-4 transition-all mb-4">
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                        <h1 className="text-6xl font-black tracking-tighter">
                            LYRIC <span className="text-neonPurple">FINDER</span>
                        </h1>
                        <p className="text-gray-400 text-xl">Search any song to get high-fidelity lyrics and details.</p>
                    </div>
                </div>

                {/* Search Input Section */}
                <div className="relative group">
                    <div className="absolute inset-x-0 -bottom-2 h-4 bg-neonPurple/20 blur-2xl group-focus-within:bg-neonBlue/30 transition-all rounded-full" />
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center group-focus-within:border-neonBlue transition-all shadow-2xl">
                        <div className="p-4">
                            <Search className="w-8 h-8 text-gray-500 group-focus-within:text-neonBlue transition-colors" />
                        </div>
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSearching(true);
                            }}
                            placeholder="Enter song name or movie..."
                            className="flex-1 bg-transparent border-none outline-none text-2xl py-4 placeholder-gray-600 font-medium"
                        />
                        {loading && (
                            <div className="px-6">
                                <Loader2 className="w-6 h-6 animate-spin text-neonBlue" />
                            </div>
                        )}
                    </div>

                    {/* Recommendations Dropdown */}
                    <AnimatePresence>
                        {searching && results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-4 bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
                            >
                                {results.map((song) => (
                                    <div
                                        key={song.trackId}
                                        onClick={() => handleSelectSong(song)}
                                        className="flex items-center gap-4 p-4 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-none group"
                                    >
                                        <img src={song.artworkUrl100} className="w-12 h-12 rounded-lg" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-white group-hover:text-neonBlue truncate">{song.trackName}</p>
                                            <p className="text-sm text-gray-400 truncate">{song.artistName} • {song.collectionName}</p>
                                        </div>
                                        <Music2 className="w-5 h-5 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Display Content */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-32 gap-6"
                        >
                            <Loader2 className="w-16 h-16 animate-spin text-neonBlue" />
                            <p className="text-2xl font-bold animate-pulse">Syncing high-fidelity lyrics...</p>
                        </motion.div>
                    ) : selectedSong ? (
                        <motion.div
                            key={selectedSong.trackId}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-3 gap-12"
                        >
                            {/* Left Side: Artwork & Meta */}
                            <div className="space-y-8">
                                <motion.div
                                    className="relative group"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-0 bg-neonBlue/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <img
                                        src={selectedSong.artworkHigh}
                                        className="w-full aspect-square rounded-3xl object-cover shadow-2xl border border-white/10 relative z-10"
                                        alt={selectedSong.trackName}
                                    />
                                </motion.div>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-neonBlue text-sm tracking-widest uppercase font-black">Singer / Artist</p>
                                        <p className="text-3xl font-bold">{selectedSong.artistName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-neonPurple text-sm tracking-widest uppercase font-black">Movie / Album</p>
                                        <p className="text-2xl text-gray-300 italic font-medium">{selectedSong.collectionName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Lyrics */}
                            <div className="md:col-span-2 space-y-8 bg-white/5 rounded-3xl p-10 border border-white/5 relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Music2 className="w-32 h-32" />
                                </div>
                                <h2 className="text-5xl font-black text-white tracking-tighter leading-tight underline decoration-neonBlue decoration-4 underline-offset-8 mb-12">
                                    {selectedSong.trackName}
                                </h2>
                                <p className="text-2xl md:text-3xl font-black whitespace-pre-line text-white/95 leading-[1.6] tracking-tight">
                                    {lyrics}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 flex flex-col items-center text-center opacity-30 select-none"
                        >
                            <Search className="w-32 h-32 mb-8" />
                            <p className="text-3xl font-bold max-w-md uppercase tracking-widest">Type a song name above to get started</p>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
