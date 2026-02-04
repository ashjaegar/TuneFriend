import axios from "axios";

export const getLyrics = async (artist: string, title: string) => {
    try {
        const response = await axios.get(
            `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(
                title
            )}`
        );
        return response.data.lyrics;
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return "Lyrics not found.";
    }
};
