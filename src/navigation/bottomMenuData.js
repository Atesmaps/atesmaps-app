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
    icon: 'map',
  },
  {
    name: 'Perfil',
    title: 'perfil',
    component: ProfileStack,
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