import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeartAnimation from '../components/HeartAnimation';

const SurprisePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { content } = location.state || {};

    useEffect(() => {
        if (!content) {
            navigate('/');
        }
    }, [content, navigate]);

    if (!content) return null;

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
            <HeartAnimation />

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-love-900/40 via-gray-900/0 to-gray-900/0 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                className="relative z-10 w-full max-w-3xl bg-black/20 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/10 text-center"
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-love-300 via-love-100 to-love-300 mb-8 drop-shadow-sm animate-pulse-slow">
                        Happy Valentine's Day! 💖
                    </h1>
                </motion.div>

                <div className="space-y-8">
                    {content.surpriseType === 'text' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner"
                        >
                            <p className="text-xl md:text-3xl text-love-50 leading-relaxed whitespace-pre-line font-serif italic text-shadow-sm">
                                "{content.content}"
                            </p>
                        </motion.div>
                    )}

                    {content.surpriseType === 'image' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="rounded-2xl overflow-hidden shadow-2xl border-4 border-love-400/30 group"
                        >
                            <img src={content.content} alt="Surprise" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                        </motion.div>
                    )}

                    {content.surpriseType === 'video' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-love-400/30"
                        >
                            <iframe
                                className="w-full h-full"
                                src={content.content}
                                title="Valentine Surprise"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="mt-12 flex flex-col items-center gap-2"
                >
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-love-500 to-transparent"></div>
                    <p className="text-love-300/60 text-sm font-mono tracking-widest uppercase">
                        Made with eternal ❤️ just for you
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SurprisePage;
