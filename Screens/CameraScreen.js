
import React, { useState } from 'react';
import {View,Text,Button,Image,StyleSheet,Alert,} from 'react-native';
import {Camera,useCameraDevice,useCameraPermission,usePhotoOutput,} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';


export default function CameraScreen() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const photoOutput = usePhotoOutput();

  const [photoPath, setPhotoPath] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  async function takePhoto() {
    try {
      const photo = await photoOutput.capturePhotoToFile({}, {});
      setPhotoPath(photo.filePath);
    } catch (error) {
      Alert.alert('Error', 'Could not take photo.');
    }
  }

  async function savePhoto() {
    const folder = RNFS.DocumentDirectoryPath + '/JoVisionPhotos';

    if (!(await RNFS.exists(folder))) {
      await RNFS.mkdir(folder);
    }

    const newPath = folder + '/photo_' + Date.now() + '.jpg';

    await RNFS.moveFile(photoPath, newPath);
    setPhotoPath(null);
    Alert.alert('Saved', 'Photo saved successfully.');
  }

  async function discardPhoto() {
    if (await RNFS.exists(photoPath)) {
      await RNFS.unlink(photoPath);
    }

    setPhotoPath(null);
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Camera permission is required.</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (photoPath) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: 'file://' + photoPath }}
          style={styles.preview}
          resizeMode="contain"
        />

        <Text>Save this photo?</Text>
        <Button title="Save" onPress={savePhoto} />
        <Button title="Discard" onPress={discardPhoto} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        outputs={[photoOutput]}
        onConfigured={function () {
          setCameraReady(true);
        }}
      />

      <Button
        title="Take Photo"
        onPress={takePhoto}
        disabled={!cameraReady}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
});
