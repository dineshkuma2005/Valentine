import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { verifyCode } from '../lib/api';
import HeartAnimation from '../components/HeartAnimation';

const VerificationPage = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await verifyCode(code);
            if (data.success) {
                navigate('/surprise', { state: { content: data } });
            }
        } catch (err) {
            setError(err.message || 'Invalid code. Try again, love.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <HeartAnimation />

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/10"
            >
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="bg-love-600 p-4 rounded-full shadow-lg shadow-love-600/50"
                    >
                        <span className="text-4xl">💌</span>
                    </motion.div>
                </div>

                <h1 className="text-5xl font-serif font-bold text-center text-love-100 mb-2 drop-shadow-lg mt-4">
                    Be My Valentine?
                </h1>
                <p className="text-center text-love-200/80 mb-10 font-light text-lg">
                    Enter the secret code to unlock my heart
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative group">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="SECRET CODE"
                            className="w-full px-6 py-4 bg-black/30 border border-love-500/30 rounded-xl focus:outline-none focus:border-love-500 focus:ring-2 focus:ring-love-500/50 text-white placeholder-love-300/30 transition-all font-mono text-center tracking-[0.2em] text-2xl group-hover:bg-black/40"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-love-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none blur-md -z-10"></div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-love-400 text-center text-sm font-semibold bg-red-900/20 py-2 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-love-600 via-love-500 to-love-600 bg-[length:200%_auto] animate-gradient rounded-xl text-white font-bold text-xl shadow-lg shadow-love-600/40 hover:shadow-love-600/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                        style={{ backgroundSize: '200% auto' }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Unlocking...
                            </span>
                        ) : 'Reveal Surprise 💖'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default VerificationPage;
