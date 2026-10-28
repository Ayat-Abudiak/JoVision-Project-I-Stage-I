
import React, { useState, useEffect, useRef } from 'react';
import {View,Text,Image,FlatList,Button,StyleSheet} from 'react-native';
import RNFS from 'react-native-fs';

export default function SlideshowScreen() {
  const [photos, setPhotos] = useState([]);
  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const list = useRef(null);

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

  useEffect(function () {
    loadPhotos();
  }, []);

  useEffect(function () {
    if (paused || photos.length <= 1) {
      return;
    }

    const timer = setInterval(function () {
      setCurrentIndex(function (index) {
        const nextIndex = (index + 1) % photos.length;

        if (list.current != null) {
          list.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }

        return nextIndex;
      });
    }, 1000);

    return function () {
      clearInterval(timer);
    };
  }, [paused, photos.length]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slideshow</Text>

      <FlatList
        ref={list}
        data={photos}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        keyExtractor={function (item) {
          return item.path;
        }}
        renderItem={function ({ item }) {
          return (
            <Image
              source={{ uri: 'file://' + item.path }}
              style={styles.photo}
              resizeMode="contain"
            />
          );
        }}
        ListEmptyComponent={
          <Text>No saved photos yet.</Text>
        }
      />

      <Button
        title={paused ? 'Resume Slideshow' : 'Pause Slideshow'}
        onPress={function () {
          setPaused(!paused);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  photo: {
    width: 330,
    height: 450,
  },
});
