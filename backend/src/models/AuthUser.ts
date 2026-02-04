import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAuthUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    likedPlaylists: Schema.Types.ObjectId[];
    about: string;
    avatar: string;
    isPublic: boolean;
}

const AuthUserSchema = new Schema<IAuthUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likedPlaylists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
    about: { type: String, default: "Music lover. Vibes enthusiast." },
    avatar: { type: String, default: "" },
    isPublic: { type: Boolean, default: true } // Profile is public by default
});

// Hash password before saving
AuthUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
AuthUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IAuthUser>("AuthUser", AuthUserSchema);
