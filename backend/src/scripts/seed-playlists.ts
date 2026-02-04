import mongoose from "mongoose";
import AuthUser from "../models/AuthUser";
import Playlist from "../models/Playlist";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tunefreids";

async function seedPlaylists() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Get the users we created
        const musiclover = await AuthUser.findOne({ username: "musiclover22" });
        const beatsDaily = await AuthUser.findOne({ username: "beats_daily" });
        const indieSoul = await AuthUser.findOne({ username: "indie_soul" });

        if (!musiclover || !beatsDaily || !indieSoul) {
            console.error("❌ Sample users not found. Run seed-users.ts first!");
            return;
        }

        // Check if playlists already exist
        const existingPlaylist = await Playlist.findOne({ name: "Chill Vibes" });
        if (existingPlaylist) {
            console.log("⏭️  Playlists already exist, skipping...");
            return;
        }

        // Create sample playlists
        const playlists = [
            {
                name: "Chill Vibes",
                owner: musiclover._id,
                songs: [
                    { videoId: "UfcAVejslrU", title: "Weightless", artist: "Marconi Union", artwork: "https://i.ytimg.com/vi/UfcAVejslrU/maxresdefault.jpg" },
                    { videoId: "h3pJZSTQqIg", title: "Strawberry Swing", artist: "Coldplay", artwork: "https://i.ytimg.com/vi/h3pJZSTQqIg/maxresdefault.jpg" },
                    { videoId: "dX3k_QDnzHE", title: "Midnight City", artist: "M83", artwork: "https://i.ytimg.com/vi/dX3k_QDnzHE/maxresdefault.jpg" }
                ],
                isPublic: true,
                likes: []
            },
            {
                name: "Workout Energy",
                owner: beatsDaily._id,
                songs: [
                    { videoId: "ytQ5CYE1VZw", title: "Till I Collapse", artist: "Eminem", artwork: "https://i.ytimg.com/vi/ytQ5CYE1VZw/maxresdefault.jpg" },
                    { videoId: "v2AC41dglnM", title: "Thunderstruck", artist: "AC/DC", artwork: "https://i.ytimg.com/vi/v2AC41dglnM/maxresdefault.jpg" },
                    { videoId: "PsO6ZnUZI0g", title: "Stronger", artist: "Kanye West", artwork: "https://i.ytimg.com/vi/PsO6ZnUZI0g/maxresdefault.jpg" }
                ],
                isPublic: true,
                likes: []
            },
            {
                name: "Evening Jazz",
                owner: indieSoul._id,
                songs: [
                    { videoId: "zqNTltOGh5c", title: "So What", artist: "Miles Davis", artwork: "https://i.ytimg.com/vi/zqNTltOGh5c/maxresdefault.jpg" },
                    { videoId: "r-Z8KuwI7Gc", title: "Autumn Leaves", artist: "Bill Evans", artwork: "https://i.ytimg.com/vi/r-Z8KuwI7Gc/maxresdefault.jpg" },
                    { videoId: "PoPL7BExSQU", title: "Blue in Green", artist: "Miles Davis", artwork: "https://i.ytimg.com/vi/PoPL7BExSQU/maxresdefault.jpg" }
                ],
                isPublic: true,
                likes: []
            }
        ];

        // Create all playlists
        const createdPlaylists = await Playlist.insertMany(playlists);
        console.log(`✨ Created ${createdPlaylists.length} playlists!`);

        console.log("\n🎉 Playlist seeding completed successfully!");
        console.log("📊 Playlists created:");
        createdPlaylists.forEach(p => {
            console.log(`   - ${p.name} (${p.songs.length} songs)`);
        });

    } catch (error) {
        console.error("❌ Error seeding playlists:", error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Disconnected from MongoDB");
    }
}

// Run the seed function
seedPlaylists();
