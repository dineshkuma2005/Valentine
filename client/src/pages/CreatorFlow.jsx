import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// API Base URL
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/valentine`;
const ASSETS_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/public/presets`;

const PRESET_QUESTIONS = [
    {
        question: "Where was our first date?",
        answer: "",
        photoViewLink: `${ASSETS_BASE_URL}/date.jpg` // Romantic Dinner
    },
    {
        question: "What is my favorite nickname for you?",
        answer: "",
        photoViewLink: `${ASSETS_BASE_URL}/nickname.jpg` // Love hearts
    },
    {
        question: "What is the date of our anniversary?",
        answer: "",
        photoViewLink: `${ASSETS_BASE_URL}/anniversary.jpg` // Calendar/Memory
    },
    {
        question: "What was the first movie we watched together?",
        answer: "",
        photoViewLink: `${ASSETS_BASE_URL}/movie.jpg` // Cinema
    },
    {
        question: "Which color do I think looks best on you?",
        answer: "",
        photoViewLink: `${ASSETS_BASE_URL}/fashion.jpg` // Fashion/Color
    }
];

export default function CreatorFlow() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const role = searchParams.get('role') || 'BF';

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        creatorName: '',
        partnerName: '',
        partnerPhone: '',
        questions: [{ question: '', answer: '', matchType: 'case-insensitive', file: null }],
        message: '',
        songUrl: '',
        finalNote: '',
        file: null // Photo
    });

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { question: '', answer: '', matchType: 'case-insensitive', file: null }]
        }));
    };

    const usePresets = () => {
        setFormData(prev => ({
            ...prev,
            questions: PRESET_QUESTIONS.map(q => ({ ...q, matchType: 'case-insensitive', file: null }))
        }));
    };

    const addRoleQuestion = () => {
        const isBF = role === 'BF';
        const question = "Step 1: Who am I to you?";
        const answer = isBF ? "Boyfriend" : "Girlfriend";
        const photoViewLink = isBF
            ? `${ASSETS_BASE_URL}/boyfriend.jpg` // Stylish Guy
            : `${ASSETS_BASE_URL}/girlfriend.jpg`; // Happy Girl

        setFormData(prev => ({
            ...prev,
            questions: [
                { question, answer, matchType: 'case-insensitive', file: null, photoViewLink },
                ...prev.questions.filter(q => q.question !== question)
            ]
        }));
    };

    const removeQuestion = (index) => {
        if (formData.questions.length > 1) {
            const newQuestions = [...formData.questions];
            newQuestions.splice(index, 1);
            setFormData(prev => ({ ...prev, questions: newQuestions }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('role', role);
            data.append('creatorName', formData.creatorName);
            data.append('partnerName', formData.partnerName);
            data.append('partnerPhone', formData.partnerPhone);

            // Clean questions for JSON string (remove file objects)
            const questionsJson = formData.questions.map(q => {
                const { file, ...rest } = q;
                return rest;
            });
            data.append('questions', JSON.stringify(questionsJson));

            data.append('message', formData.message);
            data.append('songUrl', formData.songUrl);
            data.append('finalNote', formData.finalNote);

            // Append main file
            if (formData.file) {
                data.append('photo', formData.file);
            }

            // Append question files
            formData.questions.forEach((q, i) => {
                if (q.file) {
                    data.append(`questionPhoto_${i}`, q.file);
                }
            });

            const response = await axios.post(`${API_URL}/create`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                navigate(`/share/${response.data.id}`);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-black text-white p-4 flex items-center justify-center">
            <motion.div
                className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center font-serif text-pink-300">
                    Step {step}: {step === 1 ? 'Basic Info' : step === 2 ? 'Secret Questions' : 'Surprise Content'}
                </h2>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                            <input
                                type="text" placeholder="Your Name"
                                value={formData.creatorName} onChange={e => updateFormData('creatorName', e.target.value)}
                                className="w-full bg-white/5 border border-pink-500/30 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                            />
                            <input
                                type="text" placeholder="Partner's Name"
                                value={formData.partnerName} onChange={e => updateFormData('partnerName', e.target.value)}
                                className="w-full bg-white/5 border border-pink-500/30 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                            />
                            <div className="space-y-1">
                                <label className="text-xs text-pink-300 ml-1">Partner's Phone (10 digits)</label>
                                <input
                                    type="tel" placeholder="e.g. 9876543210"
                                    value={formData.partnerPhone}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        updateFormData('partnerPhone', val);
                                    }}
                                    className="w-full bg-white/5 border border-pink-500/30 rounded-xl p-3 focus:outline-none focus:border-pink-500"
                                />
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.creatorName || !formData.partnerName || formData.partnerPhone.length !== 10}
                                    className="bg-pink-600 disabled:opacity-50 px-6 py-2 rounded-xl font-bold transition-all hover:bg-pink-500 active:scale-95"
                                >
                                    Next →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400 font-light">Add questions only the two of you know the answer to.</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={addRoleQuestion}
                                        className="text-xs bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 transition"
                                    >
                                        🏷️ Add Role Question
                                    </button>
                                    <button
                                        onClick={usePresets}
                                        className="text-xs bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 px-3 py-1 rounded-full border border-pink-500/30 transition"
                                    >
                                        ✨ Use Preset Questions
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4">
                                {formData.questions.map((q, i) => (
                                    <div key={i} className="p-4 bg-black/20 rounded-xl relative border border-white/5">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-pink-300">Question {i + 1}</span>
                                            {formData.questions.length > 1 && (
                                                <button onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-300">✕</button>
                                            )}
                                        </div>
                                        <input
                                            type="text" placeholder="e.g. Where did we meet?"
                                            value={q.question} onChange={e => updateQuestion(i, 'question', e.target.value)}
                                            className="w-full bg-white/5 border border-pink-500/30 rounded-lg p-2 mb-2"
                                        />
                                        <input
                                            type="text" placeholder="Correct Answer"
                                            value={q.answer} onChange={e => updateQuestion(i, 'answer', e.target.value)}
                                            className="w-full bg-white/5 border border-green-500/30 rounded-lg p-2 mb-3"
                                        />
                                        <div className="flex flex-wrap items-center gap-3">
                                            {q.photoViewLink && (
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                                                    <img src={q.photoViewLink} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => updateQuestion(i, 'photoViewLink', null)}
                                                        className="absolute top-0 right-0 bg-black/50 text-white p-0.5 hover:bg-red-500 transition-colors"
                                                    >
                                                        <span className="text-[10px]">✕</span>
                                                    </button>
                                                </div>
                                            )}
                                            <label className="text-xs text-gray-400 cursor-pointer hover:text-pink-300 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                                <span>📸 {q.file ? q.file.name : (q.photoViewLink ? 'Change Image' : 'Attach Image (Optional)')}</span>
                                                <input
                                                    type="file" accept="image/*" className="hidden"
                                                    onChange={e => updateQuestion(i, 'file', e.target.files[0])}
                                                />
                                            </label>
                                            {q.file && <button onClick={() => updateQuestion(i, 'file', null)} className="text-xs text-red-400 hover:underline">Remove Attached</button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addQuestion} className="w-full py-2 border border-dashed border-pink-500/50 rounded-xl text-pink-300 hover:bg-pink-500/10">+ Add Another Question</button>
                            <div className="flex justify-between mt-6">
                                <button onClick={() => setStep(1)} className="text-gray-300">← Back</button>
                                <button
                                    onClick={() => {
                                        const allFilled = formData.questions.every(q => q.question.trim() && q.answer.trim());
                                        if (allFilled) setStep(3);
                                        else alert('Please fill in all questions and answers.');
                                    }}
                                    className="bg-pink-600 px-6 py-2 rounded-xl font-bold"
                                >
                                    Next →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                            <textarea
                                placeholder="Write your romantic message here..."
                                value={formData.message} onChange={e => updateFormData('message', e.target.value)}
                                className="w-full h-32 bg-white/5 border border-pink-500/30 rounded-xl p-3 focus:outline-none focus:border-pink-500 resize-none"
                            />
                            <input
                                type="text" placeholder="Song URL (YouTube/Spotify Link)"
                                value={formData.songUrl} onChange={e => updateFormData('songUrl', e.target.value)}
                                className="w-full bg-white/5 border border-pink-500/30 rounded-xl p-3"
                            />
                            <div className="space-y-2">
                                <label className="block text-sm text-gray-300">Main Memory Photo</label>
                                <input
                                    type="file" accept="image/*"
                                    onChange={e => updateFormData('file', e.target.files[0])}
                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700 font-mono"
                                />
                                {formData.file && <p className="text-xs text-pink-300">Selected: {formData.file.name}</p>}
                            </div>
                            <input
                                type="text" placeholder="Final Reveal Note (Optional)"
                                value={formData.finalNote} onChange={e => updateFormData('finalNote', e.target.value)}
                                className="w-full bg-white/5 border border-pink-500/30 rounded-xl p-3"
                            />

                            <div className="flex justify-between mt-8">
                                <button onClick={() => setStep(2)} className="text-gray-300">← Back</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Creating Magic...' : 'Finalize Surprise 💝'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
