"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { Scene } from "@/data/scenes";

interface TextOverlaysProps {
    progress: MotionValue<number>;
    scene: Scene;
}

export default function TextOverlays({ progress, scene }: TextOverlaysProps) {
    // Title Animation (0% - 20%)
    const titleOpacity = useTransform(progress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
    const titleY = useTransform(progress, [0, 0.2], [50, 0]);
    const titleScale = useTransform(progress, [0, 0.2], [0.8, 1]);

    // Subtitle Animation (20% - 40%)
    const subOpacity = useTransform(progress, [0.2, 0.25, 0.4, 0.5], [0, 1, 1, 0]);
    const subY = useTransform(progress, [0.2, 0.3], [50, 0]);

    // Description Animation (50% - 80%)
    const descOpacity = useTransform(progress, [0.5, 0.55, 0.8, 0.9], [0, 1, 1, 0]);
    const descScale = useTransform(progress, [0.5, 0.8], [0.9, 1.1]);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center z-10 px-4">
            {/* Main Title Section */}
            <motion.div
                style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
                className="absolute"
            >
                <h1
                    className="text-6xl md:text-9xl font-black tracking-tighter text-gray-300 drop-shadow-2xl"
                    style={{ textShadow: `0 0 30px ${scene.themeColor}40` }}
                >
                    {scene.title}
                </h1>
            </motion.div>

            {/* Subtitle Section */}
            <motion.div
                style={{ opacity: subOpacity, y: subY }}
                className="absolute top-[60%]"
            >
                <h2 className="text-3xl md:text-5xl font-medium text-gray-400">
                    {scene.subtitle}
                </h2>
            </motion.div>

            {/* Description Section */}
            <motion.div
                style={{ opacity: descOpacity, scale: descScale }}
                className="absolute bottom-[20%] max-w-2xl"
            >
                <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-normal backdrop-blur-sm p-6 rounded-2xl bg-black/40 border border-white/5">
                    {scene.description}
                </p>
            </motion.div>
        </div>
    );
}
