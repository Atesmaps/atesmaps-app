import React, { useState, useEffect,useContext } from 'react';

import type {Node} from 'react';
import { useTranslation } from 'react-i18next';

import {
    StyleSheet,
    Button,
    Pressable,
    useColorScheme,
    View,
    Text,
  } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { ObservationContext } from '../context/ObservationContext';
import Profile from '../screens/Profile';


const Stack = createNativeStackNavigator();

const ProfileStack: () => Node = ({ navigation, route }) => {
  const { t } = useTranslation();
  const {logout} = useContext(AuthContext);
  const {setCurrentPage} = useContext(ObservationContext);

return(
    <Stack.Navigator> 
      <Stack.Screen 
        name="Perfil de Usuario" 
        component={Profile} 
        options={{
          headerShown: true ,
          title: t('perfilUser'),
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
            <Pressable
                    onPress={async ()  => {
                      console.log('LogOut triggered...');
                      logout();
                      setCurrentPage(1);
                    }}>
                  <MaterialCommunityIcons size={25} 
                                        color={'red'} 
                                        name="logout-variant"/>
                </Pressable>
            //  <Button
            //   onPress={() => {
            //     console.log('LogOut triggered...');
            //     logout();
            //     setCurrentPage(1);
            //     }
            //   }
            //   // Logout
              
            //   title="Logout"
            //   color="red"
            // />
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