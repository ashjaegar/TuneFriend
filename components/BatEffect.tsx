"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Music2, Music3, Music4 } from "lucide-react";

interface MusicIcon {
    id: number;
    startX: number;
    startY: number;
    color: string;
    Icon: any;
    angle: number;
}

export default function BatEffect() {
    const [musicIcons, setMusicIcons] = useState<MusicIcon[]>([]);
    const [iconIdCounter, setIconIdCounter] = useState(0);

    const colors = [
        "#00f3ff", // neonBlue
        "#bd00ff", // neonPurple
        "#ff006e", // pink
        "#ffbe0b", // yellow
        "#06ffa5", // green
        "#ff6b35", // orange
    ];

    const icons = [Music, Music2, Music3, Music4];

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Only trigger on button clicks or link clicks
            const isButton = target.tagName === 'BUTTON' ||
                target.closest('button') !== null ||
                target.tagName === 'A' ||
                target.closest('a') !== null;

            if (!isButton) return;

            // Spawn multiple music icons on button click
            const newIcons: MusicIcon[] = [];
            const numIcons = Math.floor(Math.random() * 3) + 2; // 2-4 icons per click

            for (let i = 0; i < numIcons; i++) {
                newIcons.push({
                    id: iconIdCounter + i,
                    startX: e.clientX,
                    startY: e.clientY,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    Icon: icons[Math.floor(Math.random() * icons.length)],
                    angle: Math.random() * 360, // Random direction
                });
            }

            setMusicIcons(prev => [...prev, ...newIcons]);
            setIconIdCounter(prev => prev + numIcons);

            // Remove icons after animation completes
            setTimeout(() => {
                setMusicIcons(prev => prev.filter(icon => !newIcons.find(ni => ni.id === icon.id)));
            }, 3000);
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [iconIdCounter]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <AnimatePresence>
                {musicIcons.map((icon) => {
                    const IconComponent = icon.Icon;
                    const distance = 400 + Math.random() * 200; // Random distance
                    const angleRad = (icon.angle * Math.PI) / 180;
                    const endX = icon.startX + Math.cos(angleRad) * distance;
                    const endY = icon.startY + Math.sin(angleRad) * distance;

                    return (
                        <motion.div
                            key={icon.id}
                            initial={{
                                x: icon.startX,
                                y: icon.startY,
                                opacity: 0,
                                scale: 0,
                                rotate: 0,
                            }}
                            animate={{
                                x: endX,
                                y: endY,
                                opacity: [0, 1, 1, 0.5, 0],
                                scale: [0, 1.2, 1, 0.8, 0],
                                rotate: Math.random() * 720 - 360,
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                                duration: 3,
                                ease: "easeOut",
                            }}
                            className="absolute"
                            style={{ left: 0, top: 0 }}
                        >
                            <IconComponent
                                size={32}
                                color={icon.color}
                                strokeWidth={2.5}
                                className="drop-shadow-[0_0_12px_currentColor]"
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
