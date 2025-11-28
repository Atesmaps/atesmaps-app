import React, { 
  createContext, 
  useEffect, 
  useState, 
  useContext,
  useRef } from 'react';
import { 
  Platform, 
  PermissionsAndroid, 
  Alert,
  AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import i18n from '../localization/i18n';
import { registerDeviceToken, resetBadgeCount } from '../services/deviceService'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as NavigationHelper from '../navigation/NavigationHelper';
import { useTranslation } from 'react-i18next';
import notifee, { AndroidImportance, AndroidBadgeIconType } from '@notifee/react-native';
import { AuthContext } from './AuthContext';



export const NotificationContext = createContext();

// 1. Background Handler (Must be outside the component to work when app is closed)
messaging().setBackgroundMessageHandler(async remoteMessage => { 
  console.log('Message handled in the background!', remoteMessage);
});

export const NotificationProvider = ({ children }) => {
  const { userToken } = useContext(AuthContext);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const {t} = useTranslation();

  const appState = useRef(AppState.currentState);

  const clearBadges = async () => {
      try {
        // A. Visually clear the red dot on the phone (Native OS)
        await notifee.setBadgeCount(0);
        
        // B. Reset the database counter (Server)
        if (userToken) {
            await resetBadgeCount(); 
            console.log("✅ Badges cleared on Server & Device");
        }
      } catch (e) {
        console.log("⚠️ Error clearing badges:", e);
      }
  };

  useEffect(() => {
      const subscription = AppState.addEventListener("change", async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) && 
          nextAppState === "active"
        ) {
          await clearBadges();
        }

        appState.current = nextAppState;
      });

      return () => {
        subscription.remove();
      };
  }, [userToken]);



  // 2. Main Initialization Logic
  useEffect(() => {
    if (!userToken) {
        console.log("🔕 User logged out. Notification listeners paused.");
        return; 
    }

    const configure = async () => {
      console.log('🤖 [Android] Starting Notification Configuration...');
      
  
        await createAndroidChannel();
        const hasPermission = await requestPermission();
        setIsPermissionGranted(hasPermission);
      
      
      try {
        // A. Visually clear the red dot on the phone (Native OS)
        await notifee.setBadgeCount(0);
        
        // B. Reset the database counter (Server)
        // Only call this if we are logged in
        if (userToken) {
            await resetBadgeCount(); 
        }
      } catch (e) {
        console.log("Error clearing badges:", e);
      }
      
    
      if (hasPermission) {
        console.log("🚀 Permission granted, fetching token...");
        await fetchToken();
      } else {
        console.log("⛔ Permission DENIED. Skipping token fetch.");
      }
      // if (hasPermission) {
      //   await fetchToken();
      // }
    };

    configure();

    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      handleNotificationNavigation(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // We need a small delay to ensure NavigationContainer is fully mounted
          setTimeout(() => {
            handleNotificationNavigation(remoteMessage);
          }, 1000); 
        }
      });

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);

      const obsId = remoteMessage.data?.observationId;
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || '',
        [
          { text: 'ok', style: 'cancel' },
          { 
            text: t('viewButton'), // Add a button to navigate immediately
            onPress: () => {
              if (obsId) {
                //NavigationHelper.navigate('Ob
                // servationsMap', { observationId: obsId });
                NavigationHelper.navigate('Mapa', { 
                  screen: 'Observaciones', 
                  params: { observationId: obsId }
                });
              }
            } 
          }
        ]
      );
    });

     // 3. Listeners Setup
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async token => {
      console.log('🔥 Token Refreshed:', token);
      await registerDeviceToken(token, Platform.OS, i18n.language);
      setFcmToken(token);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeOnNotificationOpenedApp();
      unsubscribeTokenRefresh();
      unsubscribeForeground();
    };
  }, [userToken]);


  // --- Helper Functions ---

  const createAndroidChannel = async () => {
    if (Platform.OS === 'android') {
      // await messaging().createChannel({
      //   channelId: 'atesmaps-channel-id',
      //   channelName: 'ATESmaps Notifications',
      //   importance: 4,
      //   vibrate: true,
      // });

      await notifee.createChannel({
        id: 'atesmaps-channel-id',
        name: 'Floc Notifications',
        //importance: 4, // AndroidImportance.HIGH
        importance: AndroidImportance.DEFAULT,
        vibration: true,
        sound: 'default',
        badge: true,
        badgeIconType: AndroidBadgeIconType.SMALL,
      });
    }
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } 
    
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }
    return true; // Android < 13
  };

  const fetchToken = async () => {
    console.log('calling fetch token...')
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('🔥 FCM Token:', token);
        setFcmToken(token);
        await AsyncStorage.setItem('fcmToken', token);
        await registerDeviceToken(token, Platform.OS, i18n.language);
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };

    const handleNotificationNavigation = (remoteMessage) => {
    if (!remoteMessage) return;
    
    console.log('🔔 Notification caused app to open:', remoteMessage);
    
    // Extract the observationId from the 'data' payload
    // Note: data values are always strings in FCM
    const observationId = remoteMessage.data?.observationId;
    console.log(remoteMessage.data)

    if (observationId) {
      NavigationHelper.navigate('Mapa', { 
        screen: 'Observaciones', 
        params: { observationId: observationId }
      });
    }
  };

  return (
    <NotificationContext.Provider value={{ fcmToken, isPermissionGranted }}>
      {children}
    </NotificationContext.Provider>
  );
};
