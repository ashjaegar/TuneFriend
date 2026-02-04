"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const samplePlaylists = [
    {
        id: 1,
        user: "@musiclover22",
        playlistName: "Chill Vibes",
        songs: [
            { title: "Weightless", artist: "Marconi Union", artwork: "https://i.ytimg.com/vi/UfcAVejslrU/maxresdefault.jpg" },
            { title: "Strawberry Swing", artist: "Coldplay", artwork: "https://i.ytimg.com/vi/h3pJZSTQqIg/maxresdefault.jpg" },
            { title: "Midnight City", artist: "M83", artwork: "https://i.ytimg.com/vi/dX3k_QDnzHE/maxresdefault.jpg" }
        ]
    },
    {
        id: 2,
        user: "@beats_daily",
        playlistName: "Workout Energy",
        songs: [
            { title: "Till I Collapse", artist: "Eminem", artwork: "https://i.ytimg.com/vi/ytQ5CYE1VZw/maxresdefault.jpg" },
            { title: "Thunderstruck", artist: "AC/DC", artwork: "https://i.ytimg.com/vi/v2AC41dglnM/maxresdefault.jpg" },
            { title: "Stronger", artist: "Kanye West", artwork: "https://i.ytimg.com/vi/PsO6ZnUZI0g/maxresdefault.jpg" }
        ]
    },
    {
        id: 3,
        user: "@indie_soul",
        playlistName: "Evening Jazz",
        songs: [
            { title: "So What", artist: "Miles Davis", artwork: "https://i.ytimg.com/vi/zqNTltOGh5c/maxresdefault.jpg" },
            { title: "Autumn Leaves", artist: "Bill Evans", artwork: "https://i.ytimg.com/vi/r-Z8KuwI7Gc/maxresdefault.jpg" },
            { title: "Blue in Green", artist: "Miles Davis", artwork: "https://i.ytimg.com/vi/PoPL7BExSQU/maxresdefault.jpg" }
        ]
    }
];

export default function PlaylistShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="text-neonBlue text-sm tracking-widest uppercase">
                        Community Playlists
                    </span>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-300 mt-4">
                        Discover What Others Are Listening To
                    </h2>
                </motion.div>

                {/* Playlist Cards */}
                <div className="space-y-8">
                    {samplePlaylists.map((playlist, index) => {
                        const delay = index * 0.2;

                        return (
                            <motion.div
                                key={playlist.id}
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay,
                                    ease: "easeOut"
                                }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-6 hover:border-neonBlue/50 transition-all"
                            >
                                {/* User Info - Clickable */}
                                <Link
                                    href={`/profile/${playlist.user.replace('@', '')}`}
                                    className="flex items-center gap-3 mb-4 group/user cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group-hover/user:border-neonBlue/50 transition-all">
                                        <img
                                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${playlist.user}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                                            alt={`${playlist.user} avatar`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover/user:text-neonBlue transition-colors">{playlist.playlistName}</h3>
                                        <p className="text-sm text-gray-400 group-hover/user:text-neonBlue/70 transition-colors">{playlist.user}</p>
                                    </div>
                                </Link>

                                {/* Songs Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    {playlist.songs.map((song, songIndex) => (
                                        <div
                                            key={songIndex}
                                            className="group relative aspect-square rounded-lg overflow-hidden bg-black/50"
                                        >
                                            <img
                                                src={song.artwork}
                                                alt={song.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-2 left-2 right-2">
                                                    <p className="text-xs font-semibold text-white truncate">{song.title}</p>
                                                    <p className="text-xs text-gray-300 truncate">{song.artist}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
