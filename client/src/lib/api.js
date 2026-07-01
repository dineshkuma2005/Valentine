import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const verifyCode = async (code) => {
    try {
        const response = await api.post('/verify', { code });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { success: false, message: 'Network Error' };
    }
};

export default api;
