import { Request, Response } from "express";
import AuthUser from "../models/AuthUser";

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await AuthUser.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.email === email
                    ? "Email already registered"
                    : "Username already taken"
            });
        }

        // Generate random avatar using dicebear API with username as seed
        const avatarStyles = ['avataaars', 'bottts', 'fun-emoji', 'lorelei', 'notionists'];
        const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
        const backgroundColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
        const randomBg = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
        const avatar = `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${username}&backgroundColor=${randomBg}`;

        // Create new user with random avatar and public profile
        const user = new AuthUser({
            username,
            email,
            password,
            avatar,
            isPublic: true
        });

        await user.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await AuthUser.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};
