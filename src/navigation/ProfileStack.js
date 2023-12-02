import React, { useState, useEffect,useContext } from 'react';

import type {Node} from 'react';

import {
    StyleSheet,
    Button,
    Pressable,
    useColorScheme,
    View,
    Text,
  } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { ObservationContext } from '../context/ObservationContext';
import Profile from '../screens/Profile';


const Stack = createNativeStackNavigator();

const ProfileStack: () => Node = ({ navigation, route }) => {

  const {logout} = useContext(AuthContext);
  const {setCurrentPage} = useContext(ObservationContext);

return(
    <Stack.Navigator> 
      <Stack.Screen 
        name="Perfil de Usuario" 
        component={Profile} 
        options={{
          headerShown: true ,
        //headerTitle: () => <Text>Title...</Text>,
          // headerLeft: () => (
          //   <Button
          //     onPress={() => {
          //       console.log('update details triggered...');
          //       logout();
          //       }
          //     }
          //     title="Guardar"
           
          //   />
          // ),
           headerRight: () => (
             <Button
              onPress={() => {
                console.log('LogOut triggered...');
                logout();
                setCurrentPage(1);
                }
              }
              title="Logout"
              color="red"
            />
        )
      }}/>
    </Stack.Navigator>
)};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
  });

export default ProfileStack;