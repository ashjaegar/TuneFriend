import { Router } from "express";
import { getUserProfile, searchPlaylists, likePlaylist } from "../controllers/user.controller";

const router = Router();

router.get("/profile/:username", getUserProfile);
router.get("/playlists/search", searchPlaylists);
router.post("/playlists/:playlistId/like", likePlaylist);

export default router;
