import Profile from '../screens/Profile';
import LocationPicker from '../screens/LocationPicker';
import ObservationStack from './ObservationStack';
import ProfileStack from './ProfileStack';
// import PagesScreen from '../pages/PagesViewContainer';
// import ComponentsScreen from '../components/ComponentsViewContainer';

const iconHome = require('../../assets/images/tabbar/home.png');
const iconCalendar = require('../../assets/images/tabbar/calendar.png');
const iconGrids = require('../../assets/images/tabbar/grids.png');
const iconPages = require('../../assets/images/tabbar/pages.png');
const iconComponents = require('../../assets/images/tabbar/components.png');


const bottomMenuData = [
  {
    name: 'Perfil',
    component: ProfileStack,
    icon: 'account',
  },

  {
    name: 'Observaciones',
    component: ObservationStack,
    icon: 'eye',
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