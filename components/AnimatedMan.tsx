"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useSpring } from "framer-motion";

const TOTAL_FRAMES = 136;
const FOLDER_PATH = "/theman";

export default function AnimatedMan() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        mass: 0.1,
        stiffness: 100,
        damping: 20
    });

    // Preload Images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                const img = new Image();
                const paddedIndex = i.toString().padStart(3, "0");
                img.src = `${FOLDER_PATH}/ezgif-frame-${paddedIndex}.jpg`;

                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === TOTAL_FRAMES) {
                        setIsLoaded(true);
                    }
                };
                loadedImages.push(img);
            }
            setImages(loadedImages);
        };

        loadImages();
    }, []);

    // Render Loop
    useEffect(() => {
        const render = (progress: number) => {
            const canvas = canvasRef.current;
            if (!canvas || images.length === 0 || !isLoaded) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const frameIndex = Math.min(
                TOTAL_FRAMES - 1,
                Math.floor(progress * (TOTAL_FRAMES - 1))
            );

            const img = images[frameIndex];
            if (!img) return;

            // Canvas sizing (Cover)
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        const unsubscribe = smoothProgress.onChange((latest) => {
            render(latest);
        });

        // Initial render attempt
        render(smoothProgress.get());

        return () => unsubscribe();
    }, [images, smoothProgress, isLoaded]);

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 animate-pulse z-50">
                        Loading Animation...
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Optional: Add a gradient overlay to blend with next section if needed */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
            </div>
        </div>
    );
}
