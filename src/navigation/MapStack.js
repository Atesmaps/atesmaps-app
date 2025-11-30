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

import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { ObservationContext } from '../context/ObservationContext';

import ObservationsMap from '../screens/ObservationsMap';
import ShowObservation from '../screens/ShowObservation';


const Stack = createNativeStackNavigator();

const ProfileStack: () => Node = ({ navigation, route }) => {
  const {t} = useTranslation();
  const {logout} = useContext(AuthContext);
  const {setCurrentPage} = useContext(ObservationContext);

return(
    <Stack.Navigator> 
      <Stack.Group>
        <Stack.Screen name="Observaciones" component={ObservationsMap} options={{
            title: t('observacionesTitle'),
        }}  />
      </Stack.Group>
      {/* <Stack.Group screenOptions={{ presentation: 'modal' }}> */}
      <Stack.Group>
        <Stack.Screen name="ObservationModal" component={ShowObservation} options={{
            title: t('observationTitle'),
        }}  />
      </Stack.Group>
    </Stack.Navigator>
)};


export default ProfileStack;