import * as React from 'react';
import { Text, View, Image, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import bottomMenuData from './bottomMenuData';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{style: {height: Platform.OS === 'ios' ? 90 : 50}}}>
      {bottomMenuData.map((item, idx) => (
        <Tab.Screen 
          key={`tab_item${idx+1}`}
          name={item.name}
          component={item.component}
          options={{
          headerShown: false, 
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabBarItemContainer}>
              <MaterialCommunityIcons size={25} 
            color={'#5f5f5f'} name={item.icon} 
            style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}/>
              {/* <Image
                resizeMode="contain"
                source={item.icon}
                style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
              /> */}
            </View>
          ),
          tabBarLabel: ({ focused }) => <Text style={{ fontSize: 12, color: focused ? '#307df6' : '#5f5f5f' }}>{item.name}</Text>,
        }}
        />        
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
    paddingHorizontal: 10,
    bottom: Platform.OS === 'ios' ? -5 : 0,
  },
  tabBarIcon: {
    width: 25,
    height: 25,
  },
  tabBarIconFocused: {
    color: '#307df6',
  },
});
