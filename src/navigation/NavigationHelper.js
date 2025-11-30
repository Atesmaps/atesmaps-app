import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

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

// 2. 🧹 RESET FUNCTION (The "Cleaner")
export function reset(routeName, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0, // Go to the very first screen
        routes: [
          { name: routeName, params: params }, // This becomes the ONLY screen in history
        ],
      })
    );
  }
}