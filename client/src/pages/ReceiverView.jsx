import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/valentine`;

export default function ReceiverView() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [stage, setStage] = useState('INTRO'); // INTRO, QUIZ, REVEAL
    const [answers, setAnswers] = useState({});
    const [shake, setShake] = useState(false);

    const [surprise, setSurprise] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/${id}`);
                setData(res.data);
            } catch (err) {
                setError('Valentine not found or expired.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAnswerChange = (qId, val) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const submitQuiz = async () => {
        try {
            const res = await axios.post(`${API_URL}/unlock`, { id, answers });
            if (res.data.success) {
                setSurprise(res.data.surprise);
                setStage('REVEAL');
            } else {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                alert('Incorrect answers! Try again.');
            }
        } catch (err) {
            alert('Error validating answers.');
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans">
            <AnimatePresence mode="wait">

                {/* INTRO STAGE */}
                {stage === 'INTRO' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 bg-gradient-to-b from-gray-900 to-black"
                    >
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                            className="text-6xl"
                        >
                            💌
                        </motion.div>
                        <h1 className="text-4xl font-serif text-pink-300">
                            Hi {data.partnerName},
                        </h1>
                        <p className="text-xl text-gray-300 max-w-lg">
                            {data.creatorName} has sent you a locked surprise.
                            Only you can open it by answering a few special questions.
                        </p>
                        <button
                            onClick={() => setStage('QUIZ')}
                            className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                        >
                            Unlock My Surprise 🔓
                        </button>
                    </motion.div>
                )}

                {/* QUIZ STAGE */}
                {stage === 'QUIZ' && (
                    <motion.div
                        key="quiz"
                        initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
                        className={`flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900 ${shake ? 'animate-shake' : ''}`}
                    >
                        <h2 className="text-2xl text-pink-300 mb-8 font-serif">Prove it's you...</h2>
                        <div className="w-full max-w-md space-y-6">
                            {data.questions.map((q) => (
                                <div key={q._id} className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <label className="block text-gray-300 font-medium">{q.question}</label>
                                    {q.photoViewLink && (
                                        <motion.img
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            src={q.photoViewLink}
                                            alt="Question Hint"
                                            className="w-full h-48 object-cover rounded-xl shadow-inner border border-white/20"
                                        />
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Your answer..."
                                        className="w-full bg-white/5 border border-pink-500/30 rounded-xl p-3 focus:border-pink-500 outline-none transition"
                                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                    />
                                </div>
                            ))}
                            <button
                                onClick={submitQuiz}
                                className="w-full bg-gradient-to-r from-pink-600 to-red-600 py-3 rounded-xl font-bold shadow-lg mt-4"
                            >
                                Verify & Open 🎁
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* REVEAL STAGE */}
                {stage === 'REVEAL' && surprise && (
                    <motion.div
                        key="reveal"
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-black p-6 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        {surprise.photoViewLink && (
                            <motion.img
                                src={surprise.photoViewLink}
                                alt="Memory"
                                className="w-full max-w-md rounded-lg shadow-2xl border-4 border-white/10 rotate-2"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            />
                        )}

                        <motion.div
                            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-2xl w-full"
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                        >
                            <h1 className="text-3xl font-serif text-pink-200 mb-6">💖 Special Message</h1>
                            <p className="text-lg whitespace-pre-wrap leading-relaxed font-light font-sans">
                                {surprise.message}
                            </p>

                            {surprise.finalNote && (
                                <p className="mt-8 text-sm text-pink-300 italic">
                                    Note: {surprise.finalNote}
                                </p>
                            )}
                        </motion.div>

                        {surprise.songUrl && (
                            <div className="mt-8 text-pink-300">
                                🎵 <a href={surprise.songUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Listen to our song</a>
                            </div>
                        )}
                    </motion.div>
                )}

            </AnimatePresence>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
        </div>
    );
}
