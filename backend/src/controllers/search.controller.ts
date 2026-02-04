import { Request, Response } from "express";
import { searchMusic } from "../services/itunes.service";
import { getLyrics } from "../services/lyrics.service";

export const search = async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    const results = await searchMusic(query);
    res.json(results);
};

export const getSongDetails = async (req: Request, res: Response) => {
    const { artist, title } = req.query;
    if (!artist || !title) {
        return res.status(400).json({ message: "Artist and title are required" });
    }

    const lyrics = await getLyrics(artist as string, title as string);
    res.json({ lyrics });
}
