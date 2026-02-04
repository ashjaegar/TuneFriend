"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { socket } from "@/utils/socket";
import axios from "axios";
import { Play, Pause, Search, Users, Music2, SkipForward } from "lucide-react";
import Script from "next/script";

interface Song {
    title: string;
    artist: string;
    album: string;
    artwork: string;
    videoId: string;
    isPlaying: boolean;
    timestamp: number;
}

// Global variable for YouTube Player
declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

function RoomContent() {
    const searchParams = useSearchParams();
    const roomId = searchParams.get("id");
    const router = useRouter();

    const [connected, setConnected] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isHost, setIsHost] = useState(false);

    // Manual Lyrics Search State
    const [manualSearchQuery, setManualSearchQuery] = useState("");
    const [manualLyricsData, setManualLyricsData] = useState<{
        title: string;
        artist: string;
        album: string;
        artwork: string;
        lyrics: string;
    } | null>(null);
    const [isManualSearching, setIsManualSearching] = useState(false);

    // YouTube Player Refs
    const playerRef = useRef<any>(null);
    const isPlayerReady = useRef(false);

    useEffect(() => {
        if (!roomId) {
            router.push("/dashboard");
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("room:join", roomId);

        // Core Socket Listeners
        const handleRoomJoined = (data: any) => {
            console.log("Joined Room:", data);
            setConnected(true);
            setIsHost(data.isHost);
            if (data.currentSong) {
                setCurrentSong(data.currentSong);
                syncPlayerState(data.currentSong);
            }
        };

        const handleSongChanged = (song: Song) => {
            console.log("🔥 SONG CHANGED EVENT:", song);
            setCurrentSong(song);
            if (isPlayerReady.current && playerRef.current) {
                playerRef.current.loadVideoById(song.videoId);
                playerRef.current.playVideo();
            }
            // Automatic fetching removed as per user request
        };

        const handleSongSynced = (data: any) => {
            console.log("🔄 SYNC EVENT:", data);
            if (!isPlayerReady.current || !playerRef.current) return;

            // If we are significantly out of sync, seek
            const currentTime = playerRef.current.getCurrentTime();
            if (Math.abs(currentTime - data.timestamp) > 2) {
                playerRef.current.seekTo(data.timestamp, true);
            }

            // Sync play/pause state
            if (data.isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        };

        socket.on("room:joined", handleRoomJoined);
        socket.on("song:changed", handleSongChanged);
        socket.on("song:synced", handleSongSynced);

        // Add listeners for simplified events from reference repo if needed
        socket.on("change-video", (data: any) => handleSongChanged({ ...data, isPlaying: true, timestamp: 0 }));
        socket.on("play", (data: any) => handleSongSynced({ isPlaying: true, timestamp: data.time }));
        socket.on("pause", (data: any) => handleSongSynced({ isPlaying: false, timestamp: data.time }));

        return () => {
            socket.off("room:joined");
            socket.off("song:changed");
            socket.off("song:synced");
            socket.off("change-video");
            socket.off("play");
            socket.off("pause");
            socket.disconnect();
        };
    }, [roomId, router]);

    // Initialize YouTube Player
    const onYouTubeReady = () => {
        if (playerRef.current) return;

        playerRef.current = new window.YT.Player("yt-player", {
            height: "100%",
            width: "100%",
            videoId: currentSong?.videoId || "",
            playerVars: {
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0
            },
            events: {
                onReady: (event: any) => {
                    console.log("YouTube Player Ready");
                    isPlayerReady.current = true;
                    if (currentSong) {
                        event.target.loadVideoById(currentSong.videoId);
                        event.target.seekTo(currentSong.timestamp || 0, true);
                    }
                },
                onStateChange: (event: any) => {
                    // event.data: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
                    if (!isHost) return;

                    const time = playerRef.current.getCurrentTime();
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        socket.emit("song:sync", { roomId, isPlaying: true, timestamp: time });
                    }
                    if (event.data === window.YT.PlayerState.PAUSED) {
                        socket.emit("song:sync", { roomId, isPlaying: false, timestamp: time });
                    }
                }
            }
        });
    };

    const syncPlayerState = (song: Song) => {
        if (isPlayerReady.current && playerRef.current) {
            playerRef.current.loadVideoById(song.videoId);
            playerRef.current.seekTo(song.timestamp, true);
            if (song.isPlaying) playerRef.current.playVideo();
            else playerRef.current.pauseVideo();
        }
    };

    const changeSong = (url: string) => {
        if (!url) return;
        socket.emit("song:change", { roomId, url }, (response: any) => {
            if (response?.error) {
                alert(response.error);
            }
        });
    };

    const handleManualSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualSearchQuery) return;

        setIsManualSearching(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

            // 1. Search for metadata on iTunes
            const searchRes = await axios.get(`${API_URL}/api/search?q=${manualSearchQuery}`);
            if (searchRes.data && searchRes.data.length > 0) {
                const bestMatch = searchRes.data[0];
                const artwork = bestMatch.artworkUrl100.replace("100x100", "600x600");

                // 2. Fetch lyrics using metadata
                const lyricsRes = await axios.get(`${API_URL}/api/song/details?artist=${bestMatch.artistName}&title=${bestMatch.trackName}`);

                setManualLyricsData({
                    title: bestMatch.trackName,
                    artist: bestMatch.artistName,
                    album: bestMatch.collectionName || "Single",
                    artwork: artwork,
                    lyrics: lyricsRes.data.lyrics || "No lyrics found for this song."
                });
            } else {
                alert("Song not found. Try another name.");
            }
        } catch (error) {
            console.error("Manual search error", error);
            alert("Error fetching song details.");
        } finally {
            setIsManualSearching(false);
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden pt-24">
            <Script
                src="https://www.youtube.com/iframe_api"
                onLoad={() => {
                    if (window.YT && window.YT.Player) {
                        onYouTubeReady();
                    } else {
                        window.onYouTubeIframeAPIReady = onYouTubeReady;
                    }
                }}
            />

            {/* Left Panel: Player & Visuals */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0" />

                {/* Dynamic Background */}
                {currentSong?.artwork && (
                    <div
                        className="absolute inset-0 z-0 opacity-20 blur-3xl scale-110 transition-all duration-1000"
                        style={{ backgroundImage: `url(${currentSong.artwork})`, backgroundSize: 'cover' }}
                    />
                )}

                <div className="z-10 w-full max-w-4xl flex flex-col gap-8">
                    {/* Song Info (Top) */}
                    {currentSong && (
                        <div className="flex items-center gap-6 animate-in fade-in slide-in-from-top duration-700">
                            <img
                                src={currentSong.artwork}
                                alt={currentSong.title}
                                className="w-24 h-24 rounded-2xl shadow-2xl border border-white/20 object-cover bg-black"
                            />
                            <div className="space-y-1">
                                <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">{currentSong.title}</h1>
                                <div className="flex items-center gap-3">
                                    <p className="text-xl text-neonBlue font-medium">{currentSong.artist}</p>
                                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                    <p className="text-xl text-gray-400 italic">
                                        {currentSong.album === "YouTube" ? "Single" : currentSong.album}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Player Container */}
                    <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group ring-1 ring-white/5">
                        <div id="yt-player" className="w-full h-full"></div>

                        {!currentSong && (
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-gray-500 bg-black pointer-events-none">
                                <img
                                    src="/tunefriends_placeholder.png"
                                    alt="Sync Your Music"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-8">
                                    <p className="text-2xl font-bold text-white tracking-[0.3em] uppercase">Ready to Sync</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls / Input */}
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex gap-4 items-center shadow-xl">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Music2 className="w-6 h-6 text-neonPurple" />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Type or Paste YouTube Song Link..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    changeSong(e.currentTarget.value);
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
                        <button
                            onClick={() => {
                                if (inputRef.current?.value) {
                                    changeSong(inputRef.current.value);
                                    inputRef.current.value = "";
                                }
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-neonBlue to-neonPurple rounded-xl text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-neonBlue/20"
                        >
                            Sync Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel: Chat/Details/Lyrics */}
            <div className="w-full md:w-[400px] bg-black/50 border-l border-white/10 backdrop-blur-xl p-6 flex flex-col gap-6 z-20 h-screen overflow-y-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Room Code</p>
                        <p className="text-2xl font-mono font-bold text-neonBlue">{roomId}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="text-white">Active</span>
                        </div>
                        <span className="text-[10px] text-neonPurple uppercase font-bold">{isHost ? "Host" : "Listener"}</span>
                    </div>
                </div>

                {/* Get Lyrics Section */}
                <div className="flex-1 min-h-0 flex flex-col gap-4">
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Get Lyrics
                        </p>
                        <form onSubmit={handleManualSearch} className="flex gap-2">
                            <input
                                value={manualSearchQuery}
                                onChange={(e) => setManualSearchQuery(e.target.value)}
                                placeholder="Enter song name..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-neonPurple outline-none"
                            />
                            <button
                                disabled={isManualSearching}
                                className="px-4 py-2 bg-neonPurple/20 hover:bg-neonPurple/40 text-neonPurple rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                            >
                                {isManualSearching ? "..." : "Get"}
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-4">
                        {manualLyricsData ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                                <div className="flex gap-4 items-center">
                                    <img
                                        src={manualLyricsData.artwork}
                                        className="w-20 h-20 rounded-lg border border-white/10 object-cover shadow-lg"
                                        alt={manualLyricsData.title}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-neonBlue font-bold truncate text-lg leading-tight">{manualLyricsData.artist}</p>
                                        <p className="text-gray-400 text-sm italic truncate">{manualLyricsData.album}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black text-white tracking-tight underline decoration-neonPurple decoration-2 underline-offset-4">
                                        {manualLyricsData.title}
                                    </h2>
                                    <p className="whitespace-pre-line text-white font-bold text-xl leading-relaxed">
                                        {manualLyricsData.lyrics}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-gray-600 italic text-sm text-center">
                                Search for any song above to see singer, movie, and lyrics!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Debug Overlay */}
            <div className="fixed bottom-4 left-4 bg-black/80 p-2 rounded text-[10px] text-gray-500 font-mono z-50 pointer-events-none">
                <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>
                <p>Role: {isHost ? "🎧 Host" : "👥 Listener"}</p>
                <p>Backend: 5002</p>
                <p>Player: {isPlayerReady.current ? "Ready" : "Loading..."}</p>
            </div>
        </div>
    );
}

export default function RoomPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Room...</div>}>
            <RoomContent />
        </Suspense>
    );
}
