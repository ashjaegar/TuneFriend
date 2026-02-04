"use client";

import { Music2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Footer() {
    const [appleTop10, setAppleTop10] = useState<any[]>([]);
    const [spotifyTop10, setSpotifyTop10] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFromItunes = async (query: string) => {
            try {
                const res = await axios.get("https://itunes.apple.com/search", {
                    params: {
                        term: query,
                        media: "music",
                        entity: "song",
                        limit: 1
                    }
                });
                if (res.data.results && res.data.results.length > 0) {
                    const track = res.data.results[0];
                    return {
                        name: track.trackName,
                        artistName: track.artistName,
                        artworkUrl100: track.artworkUrl100
                    };
                }
                return null;
            } catch (error) {
                console.error(`Failed to fetch from iTunes: ${query}`, error);
                return null;
            }
        };

        const fetchAllData = async () => {
            setLoading(true);

            // Popular songs for Spotify section
            const spotifyQueries = [
                "Starboy The Weeknd",
                "Birds of a Feather Billie Eilish",
                "Die With A Smile Lady Gaga",
                "Espresso Sabrina Carpenter",
                "Not Like Us Kendrick Lamar",
                "A Bar Song Shaboozey",
                "I Had Some Help Post Malone",
                "Good Luck Babe Chappell Roan",
                "Beautiful Things Benson Boone",
                "Cruel Summer Taylor Swift"
            ];

            // Popular songs for Apple Music section
            const appleQueries = [
                "Anti-Hero Taylor Swift",
                "flowers Miley Cyrus",
                "As It Was Harry Styles",
                "vampire Olivia Rodrigo",
                "Calm Down Rema",
                "Fortnight Taylor Swift",
                "Greedy Tate McRae",
                "Paint The Town Red Doja Cat",
                "Snooze SZA",
                "Seven Jungkook"
            ];

            console.log("Fetching songs from iTunes API...");

            // Fetch Spotify section
            const spotifyPromises = spotifyQueries.map(query => fetchFromItunes(query));
            const spotifyResults = await Promise.all(spotifyPromises);
            const spotifyFiltered = spotifyResults.filter(song => song !== null);

            console.log("Spotify songs fetched:", spotifyFiltered);
            setSpotifyTop10(spotifyFiltered);

            // Fetch Apple Music section
            const applePromises = appleQueries.map(query => fetchFromItunes(query));
            const appleResults = await Promise.all(applePromises);
            const appleFiltered = appleResults.filter(song => song !== null);

            console.log("Apple Music songs fetched:", appleFiltered);
            setAppleTop10(appleFiltered);

            setLoading(false);
        };

        fetchAllData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 20 }
        }
    };

    return (
        <footer className="w-full bg-gradient-to-b from-black via-[#0a0a0a] to-black py-24 px-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto mb-16">
                <h3 className="text-5xl font-black text-center mb-4 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonBlue via-neonPurple to-pink-500">
                        Global Top 50
                    </span>
                </h3>
                <p className="text-center text-gray-400 text-sm mb-16 font-medium tracking-wide">
                    The hottest tracks streaming right now
                </p>

                {loading ? (
                    <div className="text-center text-gray-500 py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonBlue"></div>
                        <p className="mt-4 font-semibold">Loading charts...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Spotify Top Hits */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/30">
                                    <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.783-.962-.335.077-.67-.133-.746-.468-.076-.335.132-.67.467-.746 3.808-.87 7.076-.496 9.662.906.294.18.386.563.206.857zm1.216-2.705c-.225.336-.67.436-1.006.212-2.692-1.654-6.8-2.13-9.965-1.164-.396.117-.803-.1-.92-.5-.118-.4.1-.803.5-.92 3.585-1.096 8.112-.566 11.18 1.364.337.228.436.673.21.986zm.106-2.77c-3.226-1.928-8.562-2.106-11.65-1.135-.487.155-1.01-.1-1.157-.59-.148-.487.1-1.01.59-1.157 3.56-1.12 9.475-.907 13.2 1.306.452.266.586.85.32 1.303-.268.452-.852.586-1.303.32z" /></svg>
                                </div>
                                <h4 className="text-2xl font-black text-white tracking-tight">Spotify Top Hits</h4>
                            </div>
                            <div className="space-y-3">
                                {spotifyTop10.map((song, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        className="flex items-center gap-4 group cursor-default p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                                    >
                                        <span className="text-[#1DB954] font-mono font-black text-lg w-8">{String(i + 1).padStart(2, '0')}</span>
                                        <img
                                            src={song.artworkUrl100}
                                            className="w-12 h-12 rounded-lg shadow-md bg-gray-800"
                                            alt={song.name}
                                            onError={(e) => {
                                                console.error("Failed to load image:", song.artworkUrl100);
                                                e.currentTarget.src = "https://via.placeholder.com/100/1DB954/FFFFFF?text=Music";
                                            }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-white group-hover:text-[#1DB954] transition-colors truncate text-base">{song.name}</p>
                                            <p className="text-sm text-gray-400 truncate font-medium">{song.artistName}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Apple Music Top Hits */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
                                    <Music2 size={20} fill="white" className="text-white" />
                                </div>
                                <h4 className="text-2xl font-black text-white tracking-tight">Apple Music Hot</h4>
                            </div>
                            <div className="space-y-3">
                                {appleTop10.map((song, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        className="flex items-center gap-4 group cursor-default p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                                    >
                                        <span className="text-pink-500 font-mono font-black text-lg w-8">{String(i + 1).padStart(2, '0')}</span>
                                        <img
                                            src={song.artworkUrl100}
                                            className="w-12 h-12 rounded-lg shadow-md bg-gray-800"
                                            alt={song.name}
                                            onError={(e) => {
                                                console.error("Failed to load image:", song.artworkUrl100);
                                                e.currentTarget.src = "https://via.placeholder.com/100/EC4899/FFFFFF?text=Music";
                                            }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-white group-hover:text-pink-500 transition-colors truncate text-base">{song.name}</p>
                                            <p className="text-sm text-gray-400 truncate font-medium">{song.artistName}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>


        </footer>
    );
}
