import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeartAnimation = () => {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const createHeart = () => {
            const id = Math.random();
            const left = Math.random() * 100;
            const duration = Math.random() * 5 + 5;
            const size = Math.random() * 20 + 10;
            const colors = ['#e11d48', '#f43f5e', '#fb7185', '#be123c', '#fff1f2'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            setHearts((prev) => [...prev, { id, left, duration, size, color }]);

            setTimeout(() => {
                setHearts((prev) => prev.filter((h) => h.id !== id));
            }, duration * 1000);
        };

        const interval = setInterval(createHeart, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{ y: '110vh', opacity: 0 }}
                    animate={{ y: '-10vh', opacity: [0, 0.8, 0] }}
                    transition={{ duration: heart.duration, ease: 'linear' }}
                    style={{
                        position: 'absolute',
                        left: `${heart.left}%`,
                        fontSize: `${heart.size}px`,
                        color: heart.color,
                        textShadow: '0 0 5px rgba(255,105,180, 0.5)'
                    }}
                >
                    ❤️
                </motion.div>
            ))}
        </div>
    );
};

export default HeartAnimation;
