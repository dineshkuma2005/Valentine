import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SharePage() {
    const { id } = useParams();
    const shareLink = `${window.location.origin}/valentine/${id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        alert('Link copied to clipboard!');
    };

    const shareOnWhatsApp = () => {
        const text = `Someone special created a Valentine surprise just for you 💘 Click to unlock it: ${shareLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-md w-full text-center space-y-6"
            >
                <div className="text-6xl">💌</div>
                <h2 className="text-2xl font-bold text-pink-400">Surprise Created!</h2>
                <p className="text-gray-400">Your surprise is locked and ready to be delivered.</p>

                <div className="bg-black/50 p-4 rounded-xl break-all font-mono text-sm text-pink-200 border border-pink-900">
                    {shareLink}
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button onClick={copyToClipboard} className="bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-medium transition">
                        Copy Link
                    </button>
                    <button onClick={shareOnWhatsApp} className="bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
                        <span>💬</span> Share on WhatsApp
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
