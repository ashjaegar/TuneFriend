"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useSpring } from "framer-motion";

export default function SignupAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const frameCount = 152;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        mass: 0.1,
        stiffness: 100,
        damping: 20,
    });

    // Preload signup animation frames
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                const paddedIndex = i.toString().padStart(3, "0");
                img.src = `/images/signup/ezgif-frame-${paddedIndex}.jpg`;

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
    }, []);

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

    useEffect(() => {
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
                render(smoothProgress.get());
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [images, smoothProgress]);

    return (
        <div ref={containerRef} className="relative h-[400vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-neonPurple z-50">
                        Loading...
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
            </div>
        </div>
    );
}
