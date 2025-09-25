

import React from 'react';
// import type {PropsWithChildren} from 'react';
import {enableLatestRenderer} from 'react-native-maps';
import AppNav from './navigation/AppNav';
 

import { AuthProvider } from './context/AuthContext';
import { ObservationProvider } from './context/ObservationContext';
import { LocationProvider } from './context/LocationContext';

enableLatestRenderer();

function App(): React.JSX.Element {
  return (
  
    <AuthProvider>
      <LocationProvider>
        <ObservationProvider>
          <AppNav />
        </ObservationProvider>
      </LocationProvider>
    </AuthProvider>
    
  );
};

export default App;
