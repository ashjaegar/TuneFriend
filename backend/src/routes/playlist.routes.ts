import express from "express";
import { getPlaylist, addSong, toggleLike, createPlaylist, getUserPlaylists } from "../controllers/playlist.controller";

const router = express.Router();

router.get("/playlist", getPlaylist); // Legacy/Single
router.get("/playlist/user", getUserPlaylists); // New: All playlists for user
router.post("/playlist/create", createPlaylist); // New: Create
router.post("/playlist/add", addSong);
router.post("/playlist/like/:videoId", toggleLike);

export default router;
