"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { scenes } from "@/data/scenes";
import VisualScroll from "@/components/VisualScroll";
import PlaylistShowcase from "@/components/PlaylistShowcase";
import { ChevronRight, Search } from "lucide-react";

import AnimatedMan from "@/components/AnimatedMan";

export default function Home() {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const currentScene = scenes[currentSceneIndex];

    const handleNextScene = () => {
        setCurrentSceneIndex((prev) => (prev + 1) % scenes.length);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentScene.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    {/* Scrollytelling Section */}
                    <VisualScroll scene={currentScene} />

                    {/* Post-Scroll Content (Shows after scrolling through the visual) */}
                    <section className="relative z-10 bg-black pt-32 pb-32 px-6">
                        <div className="max-w-4xl mx-auto space-y-12">

                            {/* Playlist Showcase - NEW */}
                            <PlaylistShowcase />

                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className="flex justify-center"
                            >
                                <Link href="/playlists/search">
                                    <button className="px-12 py-5 bg-black/50 border border-white/20 hover:border-neonBlue text-white font-bold text-xl tracking-widest uppercase rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                                        Search Community Playlists
                                    </button>
                                </Link>
                            </motion.div>

                        </div>
                    </section>

                    {/* Animated Man Section - Full Screen */}
                    <AnimatedMan />

                    <section className="relative z-10 bg-black pt-0 pb-32 px-6">
                        <div className="max-w-4xl mx-auto space-y-32">


                            {/* CTA & Next Scene */}
                            <div className="flex flex-col items-center gap-12 pt-12">
                                <Link href="/dashboard">
                                    <button className="px-12 py-5 bg-white text-black font-bold text-xl rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                        Start Listening Together
                                    </button>
                                </Link>

                                <div
                                    className="flex items-center gap-4 cursor-pointer group text-gray-400 hover:text-white transition-colors"
                                    onClick={handleNextScene}
                                >
                                    <span className="uppercase tracking-widest text-sm">
                                        Next: {scenes[(currentSceneIndex + 1) % scenes.length].title}
                                    </span>
                                    <div className="p-3 rounded-full border border-white/20 group-hover:border-neonBlue group-hover:bg-neonBlue/10 transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* Scene Indicator Pills */}
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 backdrop-blur-md px-6 py-3 rounded-full bg-white/5 border border-white/10">
                        {scenes.map((scene, index) => (
                            <div
                                key={scene.id}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSceneIndex ? "bg-neonBlue w-8" : "bg-white/20"
                                    }`}
                            />
                        ))}
                    </div>

                </motion.div>
            </AnimatePresence>
        </main>
    );
}
