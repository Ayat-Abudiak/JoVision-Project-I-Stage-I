
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CameraScreen from './Screens/CameraScreen';
import GalleryScreen from './Screens/GalleryScreen';
import SlideshowScreen from './Screens/SlideshowScreen';
import SensorsScreen from './Screens/SensorsScreen';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Sensors">
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
        />
        <Tab.Screen
          name="Sensors"
          component={SensorsScreen}
        />
        <Tab.Screen
          name="Gallery"
          component={GalleryScreen}
        />
        <Tab.Screen
          name="Slideshow"
          component={SlideshowScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
