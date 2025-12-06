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

import Observations from '../screens/Observations';
import ObservationDetail from '../screens/ObservationDetail';
import QuickObservationTypeDetail from '../screens/QuickObservationTypeDetail';
import WeatherObservationTypeDetail from '../screens/WeatherObservationTypeDetail';
import AvalancheObservationTypeDetail from '../screens/AvalancheObservationTypeDetail';
import SnowpackObservationTypeDetail from '../screens/SnowpackObservationTypeDetail';
import AccidentObservationTypeDetail from '../screens/AccidentObservationTypeDetail';
import ObservationImageList from '../screens/ObservationImageList';
import LocationPicker from '../screens/LocationPicker';
import ShowObservation from '../screens/ShowObservation';

import {ObservationContext } from '../context/ObservationContext';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

const ObservationStack: () => Node = ({ navigation, route }) => {
const {t} = useTranslation();
const {lastIndex, selectedIndex} = useContext(ObservationContext);
// let index = observations.length > 0 ? observations.length-1 : 0;

return(
    <Stack.Navigator> 
      <Stack.Group>
        <Stack.Screen name="Mis Observaciones" component={Observations} options={{
            title: t('misObs')
        }} />
        <Stack.Screen 
          name="Nueva Observacion" 
          component={ObservationDetail}
          options={{
            title: t('observationTitle'),
            headerShown: true,
        }} />
        <Stack.Screen name="Ver Observacion" component={ShowObservation} options={{
            title: t('observationDetailsTitle')
        }} />
        <Stack.Screen name="Imagenes" component={ObservationImageList} options={{
            title: t('observationImagesTitle')
        }} />
        <Stack.Screen name="Ubicación" component={LocationPicker} options={{
            title: t('observationLocationTitle')
        }} />
        <Stack.Screen name="Rapida" component={QuickObservationTypeDetail} options={{
            title: t('observationQuickTitle')
        }} />
        <Stack.Screen name="Avalancha" component={AvalancheObservationTypeDetail} options={{
            title: t('observationAvalancheTitle')
        }} />
        <Stack.Screen name="Manto de nieve" component={SnowpackObservationTypeDetail} options={{
            title: t('observationSnowTitle')
        }} />
        <Stack.Screen name="Accidente" component={AccidentObservationTypeDetail} options={{
            title: t('observationAccidentTitle')
        }} />
        <Stack.Screen name="Tiempo" component={WeatherObservationTypeDetail} options={{
            title: t('observationWeatherTitle')
        }} />
        
      </Stack.Group>
      
    </Stack.Navigator>
)};



export default ObservationStack;