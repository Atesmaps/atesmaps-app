import analytics from '@react-native-firebase/analytics';

// Define standardized event names to avoid typos
export const EVENTS = {
  OBSERVATION_VIEW: 'view_observation',
  OBSERVATION_CREATE: 'create_observation',
  OBSERVATION_CREATE_DRAFT: 'create_observation_draft',
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  FILTER_CHANGE: 'change_filter',
};

class AnalyticsService {
  
  // --- 1. Generic Logger ---
  async logEvent(name, params = {}) {
    try {
      await analytics().logEvent(name, params);
      // console.log(`📊 Logged: ${name}`, params);
    } catch (error) {
      console.error('Analytics Error:', error);
    }
  }

  async logScreenView(screenName, screenClass = screenName) {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass,
      });
      // console.log(`📊 Service Logged Screen: ${screenName}`);
    } catch (error) {
      console.error('Analytics Error (Screen View):', error);
    }
  }

  // --- 2. Specific Business Actions (Cleaner Usage) ---
  
  async logObservationView(observationId, title, type) {
    try {
        await this.logEvent(EVENTS.OBSERVATION_VIEW, {
            id: observationId,
            title: title,
            type: type,
            content_type: 'observation' // Standard Firebase param
        });
    } catch (error) {
      console.error('Analytics Error (Observation View):', error);
    }
  }

  async logObservationCreate(userId, title) {
    try {
        await this.logEvent(EVENTS.OBSERVATION_CREATE, {
            userId: userId,
            title: title
        });
    } catch (error) {
      console.error('Analytics Error (Observation Create):', error);
    }
  }

   async logObservationDraftCreate(userId) {
    try {
        await this.logEvent(EVENTS.OBSERVATION_CREATE_DRAFT, {
            userId: userId
        });
    } catch (error) {
      console.error('Analytics Error (Observation Create Draft):', error);
    }
  }

  async logFilterChange(filterName, value) {
    try {
        await this.logEvent(EVENTS.FILTER_CHANGE, {
        filter_name: filterName,
        value: value
        });
    } catch (error) {
      console.error('Analytics Error (Filter Change):', error);
    }
  }

  // --- 3. User Identification ---
  // Call this when the user logs in
  async identifyUser(userId, userProps = {}) {
    // Links the events to a specific User ID in Firebase Console
    await analytics().setUserId(userId);
    
    // Set properties like "Role", "Language", "Membership Level"
    // This lets you filter audience: "Show me all French users who are Experts"
    await analytics().setUserProperties(userProps);
  }

  // Call this on Logout
  async resetUser() {
    await analytics().setUserId(null);
    await analytics().setUserProperties({});
  }
}

export const analyticsService = new AnalyticsService();