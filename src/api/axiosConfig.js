import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config'; 

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Good practice in mobile apps
});

api.interceptors.request.use(
    async (config) => {
        // Example: Retrieve token from secure storage
        // const token = await getToken(); 
        const token = await AsyncStorage.getItem('userToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 (Unauthorized) globally here (e.g., logout user)
        if (error.response?.status === 401) {
            console.log('Session expired');
            // navigateToLogin();
        }
        return Promise.reject(error);
    }
);

export default api;