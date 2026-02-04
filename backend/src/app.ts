import express from "express";
import cors from "cors";
import roomRoutes from "./routes/room.routes";
import searchRoutes from "./routes/search.routes";
import authRoutes from "./routes/auth.routes";
import playlistRoutes from "./routes/playlist.routes";
import userRoutes from "./routes/user.routes";


const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api", roomRoutes);
app.use("/api", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", playlistRoutes);
app.use("/api", userRoutes);


// Health Check
app.get("/", (req, res) => {
    res.send("TuneFriends Backend is running...");
});

export default app;
