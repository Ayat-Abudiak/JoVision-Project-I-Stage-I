
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import RNLocation from 'react-native-location';
import {accelerometer,setUpdateIntervalForType,SensorTypes} from 'react-native-sensors';

export default function SensorsScreen() {
  const [location, setLocation] = useState(null);
  const [orientation, setOrientation] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(function () {
    let locationSubscription = null;
    let sensorSubscription = null;
    let locationTimer = null;
    let active = true;

    async function startSensors() {
      try {
        RNLocation.configure({
          distanceFilter: 0,
        });

        const granted = await RNLocation.requestPermission({
          android: { detail: 'fine' },
          ios: 'whenInUse',
        });

        if (!granted || !active) {
          return;
        }

        async function updateLocation() {
          const result = await RNLocation.getLatestLocation({
            timeout: 10000,
          });

          if (result && active) {
            setLocation(result);
          }
        }

        await updateLocation();

        locationTimer = setInterval(function () {
          updateLocation();
        }, 10000);

        locationSubscription =
          RNLocation.subscribeToLocationUpdates(function (locations) {
            if (locations.length > 0 && active) {
              setLocation(locations[locations.length - 1]);
            }
          });
      } catch (error) {
        console.log('Location error:', error);
      }
    }

    setUpdateIntervalForType(SensorTypes.accelerometer, 500);

    sensorSubscription = accelerometer.subscribe(
      function (result) {
        if (active) {
          setOrientation({
            x: result.x,
            y: result.y,
            z: result.z,
          });
        }
      },
      function (error) {
        console.log('Sensor error:', error);
      }
    );

    startSensors();

    return function () {
      active = false;

      if (locationSubscription) {
        locationSubscription();
      }

      if (sensorSubscription) {
        sensorSubscription.unsubscribe();
      }

      if (locationTimer) {
        clearInterval(locationTimer);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensors</Text>

      <Text style={styles.heading}>Location</Text>
      <Text>Altitude: {location ? location.altitude : 'Loading...'}</Text>
      <Text>Latitude: {location ? location.latitude : 'Loading...'}</Text>
      <Text>Longitude: {location ? location.longitude : 'Loading...'}</Text>
      <Text>Speed: {location ? location.speed : 'Loading...'}</Text>

      <Text style={styles.heading}>Orientation (Accelerometer)</Text>
      <Text>X: {orientation.x.toFixed(2)}</Text>
      <Text>Y: {orientation.y.toFixed(2)}</Text>
      <Text>Z: {orientation.z.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});
