import mongoose, { Document, Schema } from "mongoose";

export interface ISong {
    videoId: string;
    title: string;
    artist: string;
    artwork: string;
    likeCount: number;
    addedAt: Date;
}

export interface IPlaylist extends Document {
    name: string;
    songs: ISong[];
    createdAt: Date;
    owner: Schema.Types.ObjectId;
    isPublic: boolean;
    likes: Schema.Types.ObjectId[];
}

const SongSchema = new Schema<ISong>({
    videoId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    artwork: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    addedAt: { type: Date, default: Date.now }
});

const PlaylistSchema = new Schema<IPlaylist>({
    name: { type: String, required: true, default: "Community Playlist" },
    songs: [SongSchema],
    createdAt: { type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: 'AuthUser', required: false },
    isPublic: { type: Boolean, default: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'AuthUser' }]
});

export default mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
