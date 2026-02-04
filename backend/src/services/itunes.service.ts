import axios from "axios";

export const searchMusic = async (query: string) => {
    try {
        const response = await axios.get(`https://itunes.apple.com/search`, {
            params: {
                term: query,
                media: "music",
                limit: 10,
            },
        });

        return response.data.results.map((item: any) => ({
            trackName: item.trackName,
            artistName: item.artistName,
            collectionName: item.collectionName,
            artworkUrl100: item.artworkUrl100,
            previewUrl: item.previewUrl,
            trackId: item.trackId,
        }));
    } catch (error) {
        console.error("Error searching iTunes:", error);
        return [];
    }
};
