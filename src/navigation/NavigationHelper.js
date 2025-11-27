import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigate to a specific screen from outside components
 * @param {string} name - Screen Name
 * @param {object} params - Screen Params
 */
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    console.log('redirecting...')
    navigationRef.navigate(name, params);
  } else {
    // Optional: You could queue the navigation here if needed
    console.log("Navigation not ready yet");
  }
}