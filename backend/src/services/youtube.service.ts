import axios from "axios";

export const getVideoDetails = async (videoId: string) => {
    const fallbackData = {
        title: "TuneFriends Jam Session",
        channelTitle: "TuneFriends DJ",
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration: "PT3M30S"
    };

    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey || apiKey === "YOUR_YOUTUBE_API_KEY_HERE") {
            console.warn("YOUTUBE_API_KEY is missing or default. Using fallback.");
            return fallbackData;
        }

        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
                params: {
                    part: "snippet,contentDetails",
                    id: videoId,
                    key: apiKey,
                },
            }
        );

        const item = response.data.items?.[0];
        if (!item) {
            console.warn("Video not found in API. Using fallback.");
            return fallbackData;
        }

        return {
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.high.url,
            duration: item.contentDetails.duration,
        };
    } catch (error) {
        console.error("Error fetching YouTube details (using fallback):", error);
        return fallbackData;
    }
};

export const extractVideoId = (url: string): string | null => {
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};
