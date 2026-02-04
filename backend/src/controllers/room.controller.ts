import { Request, Response } from "express";
import Room from "../models/Room";
import { v4 as uuidv4 } from "uuid";

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { hostSocketId } = req.body;

        // In a real app we might validate hostSocketId, but for now we generate a Room ID
        // The actual socket joining happens via socket connection, but this REST endpoint 
        // reserves the room.

        // For simplicity, we'll generate a short code
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newRoom = await Room.create({
            roomId,
            host: hostSocketId || "pending", // Will be updated when socket connects/creates
        });

        res.status(201).json({ roomId, message: "Room created" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
