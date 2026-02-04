import { Router } from "express";
import { createRoom, getRoom } from "../controllers/room.controller";

const router = Router();

router.post("/rooms/create", createRoom);
router.get("/rooms/:roomId", getRoom);

export default router;
