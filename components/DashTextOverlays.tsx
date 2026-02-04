"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

interface DashTextOverlaysProps {
    progress: MotionValue<number>;
}

export default function DashTextOverlays({ progress }: DashTextOverlaysProps) {
    // First Text: "Tune up with your friends" (0% - 30%)
    const firstTextOpacity = useTransform(progress, [0, 0.1, 0.25, 0.35], [0, 1, 1, 0]);
    const firstTextY = useTransform(progress, [0, 0.2, 0.35], [50, 0, -50]);
    const firstTextScale = useTransform(progress, [0, 0.15], [0.8, 1]);

    // Second Text: "Join Rooms" (35% - 70%)
    const secondTextOpacity = useTransform(progress, [0.3, 0.4, 0.65, 0.75], [0, 1, 1, 0]);
    const secondTextY = useTransform(progress, [0.35, 0.5, 0.75], [50, 0, -50]);
    const secondTextScale = useTransform(progress, [0.35, 0.5], [0.9, 1]);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center z-10 px-4">
            {/* First Text: Tune up with your friends */}
            <motion.div
                style={{ opacity: firstTextOpacity, y: firstTextY, scale: firstTextScale }}
                className="absolute"
            >
                <h1
                    className="text-6xl md:text-9xl font-black tracking-tighter text-gray-300 drop-shadow-2xl"
                    style={{ textShadow: "0 0 30px rgba(0,243,255,0.3)" }}
                >
                    Tune up with
                </h1>
                <h1
                    className="text-6xl md:text-9xl font-black tracking-tighter text-gray-400 drop-shadow-2xl mt-4"
                    style={{ textShadow: "0 0 30px rgba(189,0,255,0.3)" }}
                >
                    your friends
                </h1>
            </motion.div>

            {/* Second Text: Join Rooms */}
            <motion.div
                style={{ opacity: secondTextOpacity, y: secondTextY, scale: secondTextScale }}
                className="absolute"
            >
                <h2
                    className="text-7xl md:text-8xl font-black tracking-tight text-gray-400 drop-shadow-2xl"
                    style={{ textShadow: "0 0 30px rgba(189,0,255,0.3)" }}
                >
                    Join Rooms
                </h2>
                <p className="text-2xl md:text-3xl text-gray-500 mt-6 font-medium">
                    Connect instantly
                </p>
            </motion.div>
        </div>
    );
}
