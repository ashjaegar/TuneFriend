import { Request, Response } from "express";
import Playlist from "../models/Playlist";

import AuthUser from "../models/AuthUser";

// Create a new playlist
export const createPlaylist = async (req: Request, res: Response) => {
    try {
        const { name, username, isPublic = true } = req.body;

        if (!name || !username) {
            return res.status(400).json({ error: "Name and username are required" });
        }

        const user = await AuthUser.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const playlist = new Playlist({
            name,
            owner: user._id,
            isPublic,
            songs: []
        });

        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        console.error("Create playlist error:", error);
        res.status(500).json({ error: "Failed to create playlist" });
    }
};

// Get all playlists for a user
export const getUserPlaylists = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;
        if (!username) return res.status(400).json({ error: "Username required" });

        const user = await AuthUser.findOne({ username: username as string });
        if (!user) return res.status(404).json({ error: "User not found" });

        const playlists = await Playlist.find({ owner: user._id });
        res.json(playlists);
    } catch (error) {
        console.error("Get user playlists error:", error);
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
};

// Get playlist (User's or Community)
export const getPlaylist = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;
        let query = {};

        if (username) {
            const user = await AuthUser.findOne({ username: username as string });
            if (user) {
                query = { owner: user._id };
            } else {
                query = { name: "Community Playlist" }; // Fallback
            }
        } else {
            query = { name: "Community Playlist" };
        }

        let playlist = await Playlist.findOne(query);

        if (!playlist && username) {
            // Return empty structure if not found, don't auto-create until they add a song
            return res.status(200).json({ playlist: { songs: [] } });
        }

        if (!playlist) {
            // Create default community playlist if it doesn't exist AND no username was specific
            playlist = new Playlist({
                name: "Community Playlist",
                songs: []
            });
            await playlist.save();
        }

        res.status(200).json({ playlist });
    } catch (error) {
        console.error("Get playlist error:", error);
        res.status(500).json({ error: "Failed to fetch playlist" });
    }
};

// Add song to playlist
export const addSong = async (req: Request, res: Response) => {
    try {
        const { videoId, title, artist, artwork, username, playlistId } = req.body;

        if (!videoId || !title || !artist || !artwork) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let playlist;

        if (playlistId) {
            playlist = await Playlist.findById(playlistId);
            if (!playlist) return res.status(404).json({ error: "Playlist not found" });
        } else if (username) {
            // ... existing fallback, maybe we keep it for backward compat or older clients, or we can deprecate it.
            // Let's keep it but ideally we should be passing playlistId
            const user = await AuthUser.findOne({ username });
            if (!user) return res.status(404).json({ error: "User not found" });

            playlist = await Playlist.findOne({ owner: user._id }); // Just gets the first one

            if (!playlist) {
                // Return error? Or Create? The prompt asks for explicit creation first.
                // Let's create one if none exists as a safety net, but "Create Playlist" UI is the new main way.
                playlist = new Playlist({
                    name: `${username}'s Playlist`,
                    owner: user._id,
                    isPublic: true,
                    songs: []
                });
            }
        } else {
            playlist = await Playlist.findOne({ name: "Community Playlist" });
            if (!playlist) {
                playlist = new Playlist({
                    name: "Community Playlist",
                    songs: []
                });
            }
        }

        // Check if song already exists
        const existingSong = playlist.songs.find(s => s.videoId === videoId);
        if (existingSong) {
            return res.status(400).json({ error: "Song already in playlist" });
        }

        // Add new song
        playlist.songs.push({
            videoId,
            title,
            artist,
            artwork,
            likeCount: 0,
            addedAt: new Date()
        } as any);

        await playlist.save();

        res.status(201).json({
            message: "Song added successfully",
            song: playlist.songs[playlist.songs.length - 1]
        });
    } catch (error) {
        console.error("Add song error:", error);
        res.status(500).json({ error: "Failed to add song" });
    }
};

// Toggle like on a song
export const toggleLike = async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;

        const playlist = await Playlist.findOne({ name: "Community Playlist" });

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        const song = playlist.songs.find(s => s.videoId === videoId);

        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }

        // Increment like count
        song.likeCount += 1;
        await playlist.save();

        res.status(200).json({
            message: "Like added",
            likeCount: song.likeCount
        });
    } catch (error) {
        console.error("Toggle like error:", error);
        res.status(500).json({ error: "Failed to update like" });
    }
};
