import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate(`/create?role=${role}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-black flex flex-col items-center justify-center p-4 text-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-pink-500 opacity-20 text-4xl"
                        initial={{ y: -100, x: Math.random() * window.innerWidth }}
                        animate={{ y: window.innerHeight + 100 }}
                        transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
                    >
                        ♥
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="z-10 text-center space-y-8 max-w-lg w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-red-400 font-serif">
                    Create a Private Valentine Surprise 💝
                </h1>
                <p className="text-pink-100 text-lg">
                    Select your role to begin crafting your secret message.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleSelect('GF')}
                        className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all flex flex-col items-center gap-2"
                    >
                        <span className="text-3xl">👩</span>
                        <span>I am the Girlfriend</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRoleSelect('BF')}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all flex flex-col items-center gap-2"
                    >
                        <span className="text-3xl">👨</span>
                        <span>I am the Boyfriend</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
