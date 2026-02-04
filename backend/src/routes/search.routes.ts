import { Router } from "express";
import { search, getSongDetails } from "../controllers/search.controller";

const router = Router();

router.get("/search", search);
router.get("/song/details", getSongDetails);

export default router;
