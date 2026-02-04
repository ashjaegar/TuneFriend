import { io } from "socket.io-client";

// Connect to the backend URL
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
});
