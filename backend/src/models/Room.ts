import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
    roomId: string;
    host: string; // Socket ID of host
    currentSong: {
        title: string;
        artist: string;
        album: string;
        artwork: string;
        videoId?: string; // YouTube ID
        duration?: number;
        isPlaying: boolean;
        timestamp: number; // Current playback time
        startedAt: number; // Server timestamp when song started
    } | null;
    users: string[]; // Array of socket IDs
    createdAt: Date;
}

const RoomSchema = new Schema<IRoom>({
    roomId: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    currentSong: {
        title: { type: String },
        artist: { type: String },
        album: { type: String },
        artwork: { type: String },
        videoId: { type: String },
        duration: { type: Number },
        isPlaying: { type: Boolean, default: false },
        timestamp: { type: Number, default: 0 },
        startedAt: { type: Number, default: Date.now },
    },
    users: [{ type: String }],
    createdAt: { type: Date, default: Date.now, expires: 86400 }, // Rooms expire after 24h
});

export default mongoose.model<IRoom>("Room", RoomSchema);
