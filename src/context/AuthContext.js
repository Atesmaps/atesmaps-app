import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


import { BASE_URL,ANDROID_CLIENT_ID_DEBUG,ANDROID_CLIENT_ID,WEB_CLIENT_ID } from '../config';
import { AccessControlTranslationFilterSensitiveLog } from '@aws-sdk/client-s3';
import  Snackbar  from "react-native-snackbar";

import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(()=>{
        
        if(Platform.OS === 'ios'){
            console.log('Setting up Google Sign-in configurations (IOS Platform');
            GoogleSignin.configure();
        }else{
            console.log('Setting up Google Sign-in configurations (ANDROID Platform');
            GoogleSignin.configure({
                offlineAccess: true,
                webClientId:WEB_CLIENT_ID,
                androidClientId: ANDROID_CLIENT_ID,
                scopes: ['profile', 'email']
            });
        }
        
        
    }, [])

    useEffect(() => {
        console.log('Setting up Apple Sign-in configurations');
        if (appleAuth.isSupported ){
            // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
            return appleAuth.onCredentialRevoked(async () => {
                console.warn('If this function executes, User Credentials have been Revoked');
                logout();
            });
        }
        
    }, []);

    const updateUser = async (data) => {
       // console.log('user local storage updated...')
       // let user = data;
       // await AsyncStorage.setItem('userDetails', JSON.stringify(user));
        // console.log(data);
        //setUserDetails(user);
    }

    const appleLogin = async () => {
        try {
            setIsLoading(true);
            if(Platform.OS === 'ios'){
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                // Note: it appears putting FULL_NAME first is important, see issue #293
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
              });
            
              // get current authentication state for user
              // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
              const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
              
              // use credentialState response to ensure the user is authenticated
              if (credentialState === appleAuth.State.AUTHORIZED) {
               
                //console.log(credentialState); 
                //console.log(appleAuthRequestResponse);
                const {email, fullName} = appleAuthRequestResponse;
                //const {} = jwtDecode(appleAuthRequestResponse.identityToken);
              
                let response = await axios.post(`${BASE_URL}/auth/apple-signin`,{'tokenId': appleAuthRequestResponse.identityToken, user:{email,fullName}, platform:Platform.OS});

                let user = response.data.user;

               // console.log(user)
                // console.log('This is after logging:')
                // console.log(user);
                // console.log('------------------------')
                await AsyncStorage.setItem('userToken', response.data.accessToken);
                await AsyncStorage.setItem('userDetails', JSON.stringify(user));
                setUserToken(response.data.accessToken);
                setUserDetails(user);
              }
            }else{
                // Generate secure, random values for state and nonce
                const rawNonce = uuid();
                const state = uuid();

                // Configure the request
                appleAuthAndroid.configure({
                // The Service ID you registered with Apple
                clientId: 'org.atesmaps',

                // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
                // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
                redirectUri: 'https://atesmaps.org/auth/apple-signin-callback',

                // The type of response requested - code, id_token, or both.
                responseType: appleAuthAndroid.ResponseType.ALL,
                

                // The amount of user information requested from Apple.
                scope: appleAuthAndroid.Scope.ALL,

                // Random nonce value that will be SHA256 hashed before sending to Apple.
                nonce: rawNonce,

                // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
                state,
                });

                // Open the browser window for user sign in
                const signinResponse = await appleAuthAndroid.signIn();
                //console.log(signinResponse);

                let response = await axios.post(`${BASE_URL}/auth/apple-signin`,{'tokenId': signinResponse.id_token, platform:Platform.OS});
                let user = response.data.user;

                //console.log(user)
                // console.log('This is after logging:')
                // console.log(user);
                // console.log('------------------------')
                await AsyncStorage.setItem('userToken', response.data.accessToken);
                await AsyncStorage.setItem('userDetails', JSON.stringify(user));
                setUserToken(response.data.accessToken);
                setUserDetails(user);
                  
              

                // Send the authorization code to your backend for verification
            }
        } catch (error) {
            // E_SIGNIN_CANCELLED_ERROR
            if(error.message === 'E_SIGNIN_CANCELLED_ERROR'){
                Snackbar.show({
                    text: 'Login cancelado.',
                    duration: Snackbar.LENGTH_SHORT,
                    numberOfLines: 2,
                    textColor: "#fff",
                    backgroundColor: "#B00020",
                });
            }else{
                Snackbar.show({
                    text: 'Algo salió mal',
                    duration: Snackbar.LENGTH_SHORT,
                    numberOfLines: 2,
                    textColor: "#fff",
                    backgroundColor: "#B00020",
                });
            }
          
        }
        setIsLoading(false);
    }

    const googleLogin = async () => {
        try {
            console.log('Logging Google Sign in')
            setIsLoading(true);
            const result = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            //console.log('result:');
            //console.log(result);
            const userInfo = await GoogleSignin.signIn();
            //console.log(userInfo);
            let response = await axios.post(`${BASE_URL}/auth/google-signin`,{'tokenId': userInfo.idToken, platform:Platform.OS});
    
            let user = response.data.user;
            // console.log('This is after logging:')
            // console.log(user);
            // console.log('------------------------')
            await AsyncStorage.setItem('userToken', response.data.accessToken);
            await AsyncStorage.setItem('userDetails', JSON.stringify(user));
            setUserToken(response.data.accessToken);
            setUserDetails(user);
            //setState({ userInfo });
          } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Snackbar.show({
                    text:'Login cancelado.',
                    duration: Snackbar.LENGTH_SHORT,
                    numberOfLines: 2,
                    textColor: "#fff",
                    backgroundColor: "#B00020",
                });
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Snackbar.show({
                    text: 'Ya hay un Login en proceso.',
                    duration: Snackbar.LENGTH_SHORT,
                    numberOfLines: 2,
                    textColor: "#fff",
                    backgroundColor: "#B00020",
                });
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                 Snackbar.show({
                    text: 'Google Play services debe ser actualizado',
                    duration: Snackbar.LENGTH_SHORT,
                    numberOfLines: 2,
                    textColor: "#fff",
                    backgroundColor: "#B00020",
                });
            } else {
                console.log(error)
                Snackbar.show({
                    text: 'Algo salió mal',
                    duration: Snackbar.LENGTH_SHORT,
                    numberOfLines: 2,
                    textColor: "#fff",
                    backgroundColor: "#B00020",
                });
            }
          }
        setIsLoading(false);
    }

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            // console.log('---------');
            // console.log(BASE_URL);
            // console.log('---------');
            let response = await axios.post(`${BASE_URL}/auth/login`,{'email': email, 'pwd':password});
            // console.log(response.data);
            //console.log(response.data.accessToken);
            //let user = {userName, userEmail, userId} = response.data;
            let user = response.data.user;
            // console.log('This is after logging:')
            // console.log(user);
            // console.log('------------------------')
            await AsyncStorage.setItem('userToken', response.data.accessToken);
            await AsyncStorage.setItem('userDetails', JSON.stringify(user));
            setUserToken(response.data.accessToken);
            setUserDetails(user);
        } catch (e) {
            Snackbar.show({
                text: e.response.status == 409 ? e.response.data.message : 'Password o email incorrectos',
                duration: Snackbar.LENGTH_SHORT,
                numberOfLines: 2,
                textColor: "#fff",
                backgroundColor: "#B00020",
            });

        }
        setIsLoading(false);
    }


    

    const signUp = async (userName, password, email) => {
        try {
           // console.log(userName + ', '+email+', '+password);
            setIsLoading(true);
            let response = await axios.post(`${BASE_URL}/register`,{'userName':userName, 'email': email, 'pwd':password});
            //console.log(response.data);
            //let user = {userName, userEmail, userId} = response.data;
            let user = response.data.user;
            await AsyncStorage.setItem('userToken', response.data.accessToken);
            await AsyncStorage.setItem('userDetails', JSON.stringify(user));
            setUserToken(response.data.accessToken);
            setUserDetails(user);
        } catch (e) {
            Snackbar.show({
                text: e.response.status == 409 ? 'Este usuario ya existe.' : 'Password o email incorrectos',
                duration: Snackbar.LENGTH_SHORT,
                numberOfLines: 2,
                textColor: "#fff",
                backgroundColor: "#B00020",
            });
        }
        setIsLoading(false);
    }
 
    const logout = async () => {
        try {
            setIsLoading(true);
            setUserToken(null);
            setUserDetails(null);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userDetails');
        } catch (e) {
            console.log(e);
            Snackbar.show({
                text: e.response.status,
                duration: Snackbar.LENGTH_SHORT,
                numberOfLines: 2,
                textColor: "#fff",
                backgroundColor: "#B00020",
            });
        }
        setIsLoading(false);
    }

    const isLoggedIn = async () =>{
        let userToken;
        let userDetails;
        try {
            setIsLoading(true);
            userToken = await AsyncStorage.getItem('userToken');
            userDetails = await AsyncStorage.getItem('userDetails');
            setUserToken(userToken);
            setUserDetails(JSON.parse(userDetails));    
        } catch (e) {
            console.log('error on is logged in method:');
            console.log(e);
        }
        setIsLoading(false);
    }

    useEffect(()=>{
        // console.log('checking if logged in....')
        isLoggedIn();
    }, [])


    // useEffect(()=>{
    //     console.log('user details updated....')
    //     // isLoggedIn();
    // }, [userDetails])

    return(
        <AuthContext.Provider value={{signUp, 
                                    login, 
                                    googleLogin,
                                    appleLogin,
                                    logout, 
                                    isLoading, 
                                    userToken, 
                                    userDetails, 
                                    setUserDetails,
                                    updateUser,
                                    }}> 
            {children}
        </AuthContext.Provider>
    )
}