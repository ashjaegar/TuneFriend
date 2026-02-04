import { Request, Response } from "express";
import AuthUser from "../models/AuthUser";
import Playlist from "../models/Playlist";
import mongoose from "mongoose";

// Get user profile with their public playlists
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const user = await AuthUser.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch user's public playlists
        const playlists = await Playlist.find({
            owner: user._id,
            isPublic: true
        });

        // Fetch liked playlists
        const likedPlaylists = await Playlist.find({
            _id: { $in: user.likedPlaylists }
        }).populate("owner", "username");

        res.json({
            user,
            playlists,
            likedPlaylists
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

// Search for playlists
export const searchPlaylists = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: "Query parameter required" });
        }

        // Find users matching the query
        const matchingUsers = await AuthUser.find({
            username: { $regex: q as string, $options: "i" }
        }).select("_id");

        const matchingUserIds = matchingUsers.map(u => u._id);

        const playlists = await Playlist.find({
            isPublic: true,
            $or: [
                { name: { $regex: q as string, $options: "i" } },
                { owner: { $in: matchingUserIds } }
            ]
        }).populate("owner", "username");

        res.json(playlists);
    } catch (error) {
        console.error("Search playlists error:", error);
        res.status(500).json({ error: "Failed to search playlists" });
    }
};

// Like a playlist
export const likePlaylist = async (req: Request, res: Response) => {
    try {
        // Assume middleware populates req.user.id, but for now we might need to pass userId in body or rely on basic implementation
        // For this user's project structure, let's see how they handle auth.
        // They use localStorage on client, but backend doesn't seem to have strict auth middleware in the viewed files yet.
        // We will accept userId in the body for now to keep it simple, or username.

        const { playlistId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID required" });
        }

        const [user, playlist] = await Promise.all([
            AuthUser.findById(userId),
            Playlist.findById(playlistId)
        ]);

        if (!user || !playlist) {
            return res.status(404).json({ error: "User or Playlist not found" });
        }

        // Toggle like (using user's list as source of truth for 'consistency' but updating both)
        const userIndex = user.likedPlaylists.findIndex(id => id.toString() === playlistId);

        if (userIndex === -1) {
            // Like
            user.likedPlaylists.push(playlistId as any);
            if (!playlist.likes.includes(userId as any)) {
                playlist.likes.push(userId as any);
            }
        } else {
            // Unlike (optional, but good for completeness)
            user.likedPlaylists.splice(userIndex, 1);
            playlist.likes = playlist.likes.filter(id => id.toString() !== userId) as any;
        }

        await Promise.all([user.save(), playlist.save()]);

        res.json({
            message: userIndex === -1 ? "Playlist liked" : "Playlist unliked",
            likedPlaylists: user.likedPlaylists,
            likeCount: playlist.likes.length
        });

    } catch (error) {
        console.error("Like playlist error:", error);
        res.status(500).json({ error: "Failed to like playlist" });
    }
};
