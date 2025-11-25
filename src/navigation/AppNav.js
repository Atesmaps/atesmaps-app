import React, {useContext, useEffect, useState} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import VersionCheck from 'react-native-version-check';
import axios from 'axios';

import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    Alert, 
    Linking, 
    Platform,
    View, 
    ActivityIndicator
  } from 'react-native';

import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

import BottomTabs from './BottomMenu';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';
import { BASE_URL } from '../config';


const AppNav: () => Node = () => {
   // const isDarkMode = useColorScheme() === 'dark';
    const {isLoading, userToken} = useContext(AuthContext);
  
    useEffect(()=>{
      // console.log(VersionCheck.getCountry());            // KR
      // console.log(VersionCheck.getPackageName());        // com.reactnative.app
      // console.log(VersionCheck.getCurrentBuildNumber()); // 10
      console.log(VersionCheck.getCurrentVersion());  
      checkForUpdates();
    },[])

    const getLatestVersion = async () => {
       try {
           
            let response = await axios.get(BASE_URL+(Platform.OS === 'ios' ? '/ios-version' : '/play-version'));
            console.log(response.data)

            return response.data.version
        } catch (error) {
          console.error('Error checking for updates:', error.message);
          console.log(error);
        } 
    }

    const checkForUpdates = async() => {

     const latestVersion = await getLatestVersion();
     
      try {        
        VersionCheck.needUpdate({
          currentVersion: VersionCheck.getCurrentVersion(),
          latestVersion: latestVersion//latestVersion
        }).then(res => {
          // console.log('Does it need update?')
          // console.log(res);
          if(Platform.OS === 'ios'){
           
            if(res.isNeeded) { showUpdateAlert('itms-apps://apps.apple.com/es/app/floc/id6444729278')};
            // VersionCheck.getAppStoreUrl({ country:'ES', appID: '6444729278' }).then(url => {
            //   console.log(VersionCheck.getCurrentVersion())
            //   console.log(latestVersion)
            //   console.log(res.isNeeded);  // true
            //   console.log('storeURL:')
            //   console.log(url)
            //   if(res.isNeeded) { showUpdateAlert(url)};
            // })
          }else{
            // VersionCheck.getPlayStoreUrl({ country:'ES', packageName: 'com.atesmapsapp'  }).then(url => {
            //   console.log(VersionCheck.getCurrentVersion())
            //   console.log(latestVersion)
            //   console.log(res.isNeeded);  // true
            //   console.log('storeURL:')
            //   console.log(url)
            //   if(res.isNeeded) { showUpdateAlert(url)};
            // })
            if(res.isNeeded) { showUpdateAlert('https://play.google.com/store/apps/details?id=com.atesmapsapp')};
          }
        });
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    const showUpdateAlert = (url) => {
      Alert.alert(
        'Update Available',
        'A new version of the app is available. Update now?',
        [
          {
            text: 'Update',
            onPress: () => {
              // // Open the app store URL for updating
              //  VersionCheck.getStoreUrl().then(res => {
              //    console.log(res);  // true
               
              // });

              // console.log(VersionCheck.getAppStoreUrl({ appID: '6444729278' }));
              // Linking.openURL(
              //   Platform.OS === 'ios'
              //     ? VersionCheck.getAppStoreUrl({ appID: '6444729278' })
              //     : VersionCheck.getPlayStoreUrl({ packageName: 'com.atesmapsapp' })
              // );
          //     const url = Platform.OS === 'android' ?
          //     'https://play.google.com/store/apps/details?id=com.atesmapsapp'   
          //  :  'https://apps.apple.com/es/app/floc/id6444729278'
              //console.log(url)
              Linking.canOpenURL(url).then(supported => {
                supported && Linking.openURL(url);
              }, (err) => console.log(err));
             
            },
          },
        ],
        { cancelable: false }
      );
    };
  
    //console.log(`Auth Context userTokenm value: ${userToken}`);
    // const backgroundStyle = {
    //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // };

    if( isLoading ) {
        return(
            <Loading />
            // <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
            //     <ActivityIndicator size={'large'}/> 
            // </View>
        )
    }
    
    return (
      <NavigationContainer>
        {/* <SafeAreaView > */}
          <StatusBar barStyle={'dark-content'} hidden={false} />
          {/* TODO: check update needed... */}
          { userToken !== null ? <BottomTabs /> : <AuthStack />}
        {/* </SafeAreaView> */}
      </NavigationContainer>
    );
  };

export default AppNav;