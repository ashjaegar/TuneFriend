import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    socketId: string;
    username: string;
    roomId: string;
    online: boolean;
}

const UserSchema = new Schema<IUser>({
    socketId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    roomId: { type: String, required: true },
    online: { type: Boolean, default: true },
});

export default mongoose.model<IUser>("User", UserSchema);
