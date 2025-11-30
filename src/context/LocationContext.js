import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    // Default Delta (Zoom Level)
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = 0.0421;

    // Default fallback location (e.g., Pyrenees) in case everything fails
    const DEFAULT_LOCATION = {
        latitude: 42.677973,
        longitude: 1.218886,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    };

    const [locationStatus, setLocationStatus] = useState('Initializing...');
    const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
    const [position, setPosition] = useState(null); // Raw position data
    const [watchId, setWatchId] = useState(null);

    // --- 1. PERMISSION HANDLER (Platform Agnostic) ---
    const requestPermissions = async () => {
        if (Platform.OS === 'ios') {
            try {
                // Request 'whenInUse' first (Standard for Maps)
                // This async call helps avoid the "UI Unresponsiveness" warning
                const auth = await Geolocation.requestAuthorization('whenInUse');
                return auth === 'granted';
            } catch (err) {
                console.warn("iOS Permission Error:", err);
                return false;
            }
        } 
        
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn("Android Permission Error:", err);
                return false;
            }
        }
        return false;
    };

    // --- 2. ROBUST LOCATION GETTER ---
    // Tries High Accuracy (GPS) -> Falls back to Low Accuracy (Wifi/Cell)
    const getOneTimeLocation = useCallback(async () => {
        setLocationStatus('Getting Location...');
        
        const hasPermission = await requestPermissions();
        
        if (!hasPermission) {
            setLocationStatus('Permission Denied');
            return;
        }

        // OPTION A: Try GPS first (High Accuracy)
        Geolocation.getCurrentPosition(
            // Success Handler
            (pos) => {
                updateLocationState(pos);
            },
            // Error Handler
            (error) => {
                console.log(`⚠️ GPS Failed (${error.code}). Trying Network...`);
                
                // If GPS timed out (3) or unavailable (2), try Network
                if (error.code === 3 || error.code === 2) {
                    Geolocation.getCurrentPosition(
                        (pos) => updateLocationState(pos),
                        (err) => {
                            console.error("❌ Location Failed:", err);
                            setLocationStatus('Location Error');
                        },
                        {
                            enableHighAccuracy: false, // ⚡ Use Network/Wifi (Faster)
                            timeout: 10000,
                            maximumAge: 30000
                        }
                    );
                } else {
                    setLocationStatus(error.message);
                }
            },
            {
                // GPS Options
                enableHighAccuracy: true, 
                timeout: 15000, // 15s timeout (Fixes Android "Code 3" error)
                maximumAge: 10000, 
                showLocationDialog: true,
                forceRequestLocation: true 
            }
        );
    }, []);

    // Helper to update state
    const updateLocationState = (pos) => {
        // console.log("✅ Location Found:", pos.coords.latitude, pos.coords.longitude);
        setLocationStatus('You are Here');
        
        const newRegion = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };

        setCurrentLocation(newRegion);
        setPosition(pos);
    };

    // --- 3. SUBSCRIPTION LOGIC (Optional) ---
    const subscribeLocation = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        // Clear old watch if exists
        if (watchId !== null) {
            Geolocation.clearWatch(watchId);
        }

        const id = Geolocation.watchPosition(
            (pos) => {
                updateLocationState(pos);
            },
            (error) => { 
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 10, // Update every 10 meters
                interval: 5000, 
                fastestInterval: 2000,
            }
        );
        setWatchId(id);
    };

    const unsubscribeLocation = () => {
        if (watchId !== null) {
            Geolocation.clearWatch(watchId);
            setWatchId(null);
        }
    };

    // --- INITIALIZE ON MOUNT ---
    useEffect(() => {
        getOneTimeLocation();
        
        return () => {
            if (watchId !== null) Geolocation.clearWatch(watchId);
        };
    }, []);

    return(
        <LocationContext.Provider value={{ 
            currentLocation, 
            LATITUDE_DELTA, 
            LONGITUDE_DELTA, 
            position, 
            locationStatus,
            watchId, 
            unsubscribeLocation, 
            subscribeLocation, 
            getOneTimeLocation
        }}> 
            {children}
        </LocationContext.Provider>
    )
}