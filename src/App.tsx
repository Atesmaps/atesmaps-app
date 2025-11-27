import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './localization/i18n'; // Your i18n configuration
// import type {PropsWithChildren} from 'react';
// import {enableLatestRenderer} from 'react-native-maps';
import AppNav from './navigation/AppNav';
import moment from 'moment';

import 'moment/locale/ca'; // Catalan
import 'moment/locale/en-gb'; // English (or 'en' if you prefer generic)
import 'moment/locale/fr'; // French
import 'moment/locale/es'; // Español

moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  }
);
 

import { AuthProvider } from './context/AuthContext';
import { ObservationProvider } from './context/ObservationContext';
import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';

// enableLatestRenderer();

function App(): React.JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <NotificationProvider>
          <LocationProvider>
            <ObservationProvider>
              <AppNav />
            </ObservationProvider>
          </LocationProvider>
        </NotificationProvider>
      </AuthProvider>
    </I18nextProvider>
  );
};

export default App;
