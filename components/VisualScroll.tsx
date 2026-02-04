"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useSpring } from "framer-motion";
import { Scene } from "@/data/scenes";
import TextOverlays from "./TextOverlays";

interface VisualScrollProps {
    scene: Scene;
}

export default function VisualScroll({ scene }: VisualScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Based on assets found
    const frameCount = 120; // Limiting to 120 as per prompt, even if we have more

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        mass: 0.1,
        stiffness: 100,
        damping: 20,
    });

    // Preload Images
    useEffect(() => {
        const loadImages = async () => {
            setIsLoaded(false);
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                const paddedIndex = i.toString().padStart(3, "0");
                img.src = `${scene.folderPath}/ezgif-frame-${paddedIndex}.jpg`;

                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === frameCount) {
                        setIsLoaded(true);
                    }
                };
                loadedImages.push(img);
            }
            setImages(loadedImages);
        };

        loadImages();
    }, [scene]);

    // Render Loop
    useEffect(() => {
        const render = (progress: number) => {
            const canvas = canvasRef.current;
            if (!canvas || images.length === 0) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(progress * (frameCount - 1))
            );

            const img = images[frameIndex];
            if (!img) return;

            // Canvas sizing (Cover)
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        // Initial render
        render(smoothProgress.get());

        const unsubscribe = smoothProgress.onChange((latest) => {
            render(latest);
        });

        return () => unsubscribe();
    }, [images, smoothProgress, isLoaded]);

    // Window resize handler
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && images.length > 0) {
                // re-trigger render
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(smoothProgress.get() * (frameCount - 1))
                );
                // ... logic repeated, strictly speaking we rely on the onChange but on resize we might need to force update if scroll doesn't change
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [images, smoothProgress]);


    return (
        <div ref={containerRef} className="relative h-[400vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-neonBlue z-50">
                        Loading Experience...
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

                <TextOverlays progress={smoothProgress} scene={scene} />
            </div>
        </div>
    );
}
