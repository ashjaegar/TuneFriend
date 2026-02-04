export interface Scene {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    folderPath: string; // Path relative to public/, e.g., "/images/scene1"
    themeColor: string;
    gradient: string;
}

export const scenes: Scene[] = [
    {
        id: "listen-together",
        title: "Listen Together",
        subtitle: "Sync Your Vibe",
        description:
            "Join a room and experience music in perfect sync with your friends. No lag, just vibes.",
        folderPath: "/images/scene1",
        themeColor: "#00f3ff",
        gradient: "from-blue-900 to-black",
    },
    {
        id: "create-rooms",
        title: "Create Rooms",
        subtitle: "Your Space, Your Rules",
        description:
            "Customize your audio environment. Chill lo-fi den or high-energy party floor?",
        folderPath: "/images/scene2",
        themeColor: "#bd00ff",
        gradient: "from-purple-900 to-black",
    },
    {
        id: "share-playlists",
        title: "Share Playlists",
        subtitle: "Collaborate Live",
        description:
            "Build the ultimate queue together. Vote on tracks and discover new favorites.",
        folderPath: "/images/scene3",
        themeColor: "#ffffff",
        gradient: "from-gray-900 to-black",
    },
];
