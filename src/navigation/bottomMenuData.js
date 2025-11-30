// import Profile from '../screens/Profile';
// import LocationPicker from '../screens/LocationPicker';
import ObservationStack from './ObservationStack';
import ProfileStack from './ProfileStack';
import MapStack from './MapStack';

const bottomMenuData = [
  {
    name: 'Mis Observaciones',
    title: 'misObs',
    component: ObservationStack,
    params: {},
    icon: 'eye',
  },
  // {
  //   name: 'Tracks',
  //   component: TrackRecorder,
  //   icon: 'chart-timeline-variant',
  // },
  {
    name: 'Mapa',
    title: 'map',
    component: MapStack,
    params: {isNotification: false},
    icon: 'map',
  },
  {
    name: 'Perfil',
    title: 'perfil',
    component: ProfileStack,
    params: {},
    icon: 'account',
  },
//   {
//     name: 'Pages',
//     component: PagesScreen,
//     icon: iconPages,
//   },
//   {
//     name: 'Components',
//     component: ComponentsScreen,
//     icon: iconComponents,
//   },
];

export default bottomMenuData;