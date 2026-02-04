import { Server, Socket } from "socket.io";
import Room, { IRoom } from "../models/Room";
import { getVideoDetails, extractVideoId } from "../services/youtube.service";
import { searchMusic } from "../services/itunes.service";

export const roomSocketHandler = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Join Room
        socket.on("room:join", async (roomId: string) => {
            try {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);

                let room = await Room.findOne({ roomId });
                if (room) {
                    // Assign host if none exists or is pending
                    if (!room.host || room.host === "pending") {
                        room.host = socket.id;
                    }

                    if (!room.users.includes(socket.id)) {
                        room.users.push(socket.id);
                        await room.save();
                    }

                    socket.emit("room:joined", {
                        roomId,
                        currentSong: room.currentSong,
                        isHost: room.host === socket.id
                    });
                }
            } catch (error) {
                console.error("Join Room Error:", error);
            }
        });

        // Compatibility aliases for reference repo
        socket.on("change-video", async (data: any) => {
            // Forward to song:change logic
            socket.emit("song:change", { roomId: data.roomId, url: `https://www.youtube.com/watch?v=${data.videoId}` });
        });

        socket.on("play", (data: any) => {
            io.to(data.roomId).emit("song:synced", { isPlaying: true, timestamp: data.time });
        });

        socket.on("pause", (data: any) => {
            io.to(data.roomId).emit("song:synced", { isPlaying: false, timestamp: data.time });
        });

        // Song Change
        socket.on("song:change", async ({ roomId, url }: { roomId: string, url: string }, callback?: (response: any) => void) => {
            console.log(`[song:change] Room: ${roomId}, URL: ${url}`);
            try {
                const videoId = extractVideoId(url);
                if (!videoId) {
                    if (callback) callback({ error: "Invalid YouTube URL" });
                    return;
                }

                const details = await getVideoDetails(videoId);
                if (!details) {
                    if (callback) callback({ error: "Could not fetch video details" });
                    return;
                }

                const room = await Room.findOne({ roomId });
                if (room) {
                    // Enrich with iTunes metadata for better UI
                    let artwork = details.thumbnail || "";
                    let album = "YouTube";

                    try {
                        const itunesData = await searchMusic(details.title);
                        if (itunesData && itunesData.length > 0) {
                            const bestMatch = itunesData[0];
                            artwork = bestMatch.artworkUrl100.replace("100x100", "600x600"); // Get high res
                            album = bestMatch.collectionName || "Single";
                        }
                    } catch (e) {
                        console.warn("iTunes enrichment failed, using YT data only");
                    }

                    room.currentSong = {
                        title: details.title || "Unknown Title",
                        artist: details.channelTitle || "Unknown Artist",
                        album: album,
                        artwork: artwork,
                        videoId: videoId,
                        duration: 0,
                        isPlaying: true,
                        timestamp: 0,
                        startedAt: Date.now()
                    };
                    await room.save();

                    io.to(roomId).emit("song:changed", room.currentSong);
                    if (callback) callback({ success: true, song: room.currentSong });
                }
            } catch (error) {
                console.error("Song Change Error:", error);
            }
        });

        // Play/Pause/Seek
        socket.on("song:sync", async (data: { roomId: string, isPlaying: boolean, timestamp: number }) => {
            io.to(data.roomId).emit("song:synced", {
                isPlaying: data.isPlaying,
                timestamp: data.timestamp
            });

            try {
                await Room.updateOne(
                    { roomId: data.roomId },
                    {
                        $set: {
                            "currentSong.isPlaying": data.isPlaying,
                            "currentSong.timestamp": data.timestamp
                        }
                    }
                );
            } catch (e) { }
        });

        socket.on("disconnecting", async () => {
            for (const roomId of socket.rooms) {
                if (roomId === socket.id) continue;

                const room = await Room.findOne({ roomId });
                if (room) {
                    room.users = room.users.filter(id => id !== socket.id);
                    // If host leaves, assign a new one
                    if (room.host === socket.id && room.users.length > 0) {
                        room.host = room.users[0];
                        io.to(roomId).emit("host-changed", room.host);
                    }
                    await room.save();
                }
            }
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
