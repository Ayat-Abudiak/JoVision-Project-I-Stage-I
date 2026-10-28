
import React, { useState, useEffect } from 'react';
import {View,Text,Image,FlatList,StyleSheet,RefreshControl} from 'react-native';
import RNFS from 'react-native-fs';

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadPhotos() {
    const folder = RNFS.DocumentDirectoryPath + '/JoVisionPhotos';

    try {
      if (await RNFS.exists(folder)) {
        const files = await RNFS.readDir(folder);

        const savedPhotos = files.filter(function (file) {
          return file.isFile() && file.name.endsWith('.jpg');
        });

        setPhotos(savedPhotos);
      } else {
        setPhotos([]);
      }
    } catch (error) {
      console.log('Could not load photos:', error);
    }
  }

  async function refreshPhotos() {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  }

  useEffect(function () {
    loadPhotos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>

      <FlatList
        data={photos}
        keyExtractor={function (item) {
          return item.path;
        }}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshPhotos}
          />
        }
        ListEmptyComponent={
          <Text style={styles.message}>
            No saved photos yet. Take a photo and save it first.
          </Text>
        }
        renderItem={function ({ item }) {
          return (
            <Image
              source={{ uri: 'file://' + item.path }}
              style={styles.photo}
              resizeMode="cover"
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  photo: {
    width: '48%',
    height: 160,
    margin: '1%',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
  },
});
