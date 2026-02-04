import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app";
import connectDB from "./config/db";
import { roomSocketHandler } from "./sockets/room.socket";

const PORT = parseInt(process.env.PORT || "5002");

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Initialize Sockets
roomSocketHandler(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
