import api from '../api/axiosConfig'; // Import the configured instance

// The Notification Manager calls this
export const registerDeviceToken = async (token, os, lang) => {
    try {
        const response = await api.post(`/users/register-device-token`, { token, os, lang });
        return response.data;
    } catch (error) {
        console.error("API Call Failed: registerDeviceToken", error.response?.data || error.message);
        throw error; 
    }
};

export const unregisterDeviceToken = async (token) => {
    try {
        await api.post('/users/unregister-token', { token });
    } catch (error) {
        console.warn("Failed to unregister token on server:", error);
    }
};

export const resetBadgeCount = async () => {
    try {
        const response = await api.post('/users/reset-badge');
        return response.data;
    } catch (error) {
        console.error("API Call Failed: resetBadgeCount", error.response?.data || error.message);
    }
};