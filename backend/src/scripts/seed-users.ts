import mongoose from "mongoose";
import AuthUser from "../models/AuthUser";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tunefreids";

const sampleUsers = [
    {
        username: "musiclover22",
        email: "musiclover22@tunefriends.com",
        password: "password123",
        about: "Music enthusiast and playlist curator 🎵 | Creating vibes for every mood"
    },
    {
        username: "beats_daily",
        email: "beatsdaily@tunefriends.com",
        password: "password123",
        about: "Daily beats and workout anthems 💪 | Fitness fanatic meets music addict"
    },
    {
        username: "indie_soul",
        email: "indiesoul@tunefriends.com",
        password: "password123",
        about: "Jazz and indie music lover 🎷 | Old soul in a new world"
    }
];

async function seedUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Check and create each user
        for (const userData of sampleUsers) {
            const existingUser = await AuthUser.findOne({ username: userData.username });

            if (existingUser) {
                console.log(`⏭️  User "${userData.username}" already exists, skipping...`);
            } else {
                const user = new AuthUser(userData);
                await user.save();
                console.log(`✨ Created user: ${userData.username}`);
            }
        }

        console.log("\n🎉 Seed completed successfully!");
        console.log(`📊 Total sample users: ${sampleUsers.length}`);

    } catch (error) {
        console.error("❌ Error seeding users:", error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Disconnected from MongoDB");
    }
}

// Run the seed function
seedUsers();
