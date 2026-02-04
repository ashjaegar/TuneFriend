"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isAppPage = pathname.includes("/dashboard") || pathname.includes("/room");
    const isAuthPage = pathname.includes("/login") || pathname.includes("/signup");

    const opacity = useTransform(scrollY, [0, 100], [0, 1]);
    const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    useEffect(() => {
        const userData = localStorage.getItem("tunefriends_user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [pathname]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("tunefriends_user");
        setUser(null);
        setMobileMenuOpen(false);
        router.push("/");
    };

    return (
        <>
            <motion.nav
                style={{ backdropFilter: blur }}
                className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 transition-colors duration-500 ${isScrolled || isAppPage || isAuthPage ? "bg-black/50 border-b border-white/10" : "bg-transparent"
                    }`}
            >
                <div className="flex items-center gap-4 md:gap-12">
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                        <motion.img
                            src="/images/logo-svg.png"
                            alt="TuneFriends Logo"
                            className="w-12 h-12 md:w-24 md:h-24 object-contain"
                            initial={{ y: -100, opacity: 0, rotate: -180 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            transition={{
                                duration: 1.2,
                                delay: 0.3,
                                type: "spring",
                                bounce: 0.4
                            }}
                        />
                        <div className="text-lg md:text-2xl font-black tracking-tighter">
                            <span className="text-gray-300 group-hover:text-gray-400 transition-colors duration-300">
                                Tune
                            </span>
                            <span className="text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                                Friends
                            </span>
                        </div>
                    </Link>

                    {!isAppPage && !isAuthPage && (
                        <Link href="/lyrics" className="text-sm font-medium text-gray-400 hover:text-neonBlue transition-colors uppercase tracking-widest border-l border-white/10 pl-4 md:pl-12 hidden lg:block">
                            Lyrics Search
                        </Link>
                    )}
                </div>

                {/* Desktop Menu */}
                {!isAppPage && !isAuthPage && (
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex gap-6 text-sm font-medium text-gray-400">
                            <Link href="/features" className="hover:text-neonBlue transition-colors uppercase">
                                {user ? "YOUR PLAYLIST" : "PLAYLIST"}
                            </Link>

                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-neonBlue transition-colors uppercase"
                                >
                                    LOGOUT
                                </button>
                            ) : (
                                <>
                                    <Link href="/login" className="hover:text-neonBlue transition-colors">
                                        Login
                                    </Link>
                                    <Link href="/signup" className="hover:text-neonPurple transition-colors">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href={`/profile/${user.username}`}>
                                    <span className="text-gray-400 font-medium hover:text-white transition-colors cursor-pointer">
                                        Yo <span className="text-neonBlue">{user.username}</span>
                                    </span>
                                </Link>
                                <Link href="/dashboard">
                                    <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-neonBlue/20 text-white border border-white/20 hover:border-neonBlue transition-all duration-300 backdrop-blur-md">
                                        Join Room
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <Link href="/dashboard">
                                <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-neonBlue/20 text-white border border-white/20 hover:border-neonBlue transition-all duration-300 backdrop-blur-md">
                                    Join Room
                                </button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Mobile Hamburger Button */}
                {!isAppPage && !isAuthPage && (
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-white"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                )}
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black/95 pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-lg font-medium text-white">
                            <Link href="/features" className="py-3 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
                                {user ? "Your Playlist" : "Playlist"}
                            </Link>
                            <Link href="/lyrics" className="py-3 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
                                Lyrics Search
                            </Link>

                            {user ? (
                                <>
                                    <Link href={`/profile/${user.username}`} className="py-3 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
                                        <span className="text-neonBlue">@{user.username}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="py-3 border-b border-white/10 text-left text-red-400"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="py-3 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link href="/signup" className="py-3 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>
                                        Sign Up
                                    </Link>
                                </>
                            )}

                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                <button className="w-full py-4 mt-4 rounded-full bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold">
                                    Join Room
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
