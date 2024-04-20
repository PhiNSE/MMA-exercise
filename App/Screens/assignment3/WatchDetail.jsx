import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import StarRatingDisplay from 'react-native-star-rating-widget';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { favlistStorageKey } from '../Utils/Constant';

const WatchDetail = ({ route, navigation }) => {

  //start fav
  const [favWatches, setFavWatches] = useState([]);

  const isFav = (watch) => {
    return favWatches?.some((favWatch) => favWatch.id === watch.id);
  };

  const store = async (item) => {
    let array = [];
    try {
      const value = await AsyncStorage.getItem(favlistStorageKey);
      if (value == null) {
        AsyncStorage.setItem(favlistStorageKey, JSON.stringify(array))
      }
      else {
        array = JSON.parse(value);
        const isFav = array?.some((favWatch) => favWatch.id === item.id);
        if (isFav) {
          array = array.filter((favWatch) => favWatch.id !== item.id);
          await AsyncStorage.setItem(
            favlistStorageKey, JSON.stringify(array)
          );
          console.log('removed');
        } else {
          array.push(item);
          await AsyncStorage.setItem(
            favlistStorageKey, JSON.stringify(array)
          );
          console.log('pushed');
        }
        setFavWatches(array);

      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStoredData = async () => {
    try {
      const value = await AsyncStorage.getItem(favlistStorageKey)
      if (value !== null) {
        setFavWatches(JSON.parse(value));
        console.log("getted", value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStoredData();
  }, []);
  //end fav

  const { watch } = route.params;
  const averageRating = watch?.feedbacks?.reduce((acc, feedback) => acc + feedback?.rating, 0) / watch?.feedbacks?.length;
  return (
    <View>
      <ScrollView>
        <View style={styles.img}>
          <Image source={{ uri: watch?.image, width: 400, height: 400 }} />
          <Pressable onPress={() => alert("hi")} style={({ pressed }) => [{ borderRadius: 10, position: 'absolute', bottom: 5, right: 5 }, pressed ? styles.onPress : null]}>
            <Ionicons onPress={() => store(watch)}
              name={isFav(watch) ? "heart" : "heart-outline"} size={50} color="red" />
          </Pressable>
        </View>
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{watch?.watchName}</Text>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              <Ionicons name="watch-outline" size={24} color="tomato" />
              <Text style={{ padding: 5, fontSize: 30 }}>{watch?.brandName}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              <Ionicons name="pricetags-outline" size={24} color="tomato" />
              <Text style={{ padding: 5, fontSize: 30 }}>{watch?.price}$</Text>
            </View>
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 20, paddingTop: 10 }}>Description</Text>
          <Text style={{ textAlign: 'justify' }} >{watch?.description}</Text>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, paddingTop: 10 }}>
              Automatic: </Text>
            <Ionicons style={{ paddingTop: 10 }} name={watch?.automatic ? 'checkmark-circle-outline' : 'close-circle-outline'} size={30} color={watch?.automatic ? 'green' : 'red'} />
          </View>
        </View >
        <View style={styles.feedback}>
          <Text style={{ fontSize: 30 }}>Feedbacks</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <StarRatingDisplay
              rating={averageRating}
            />
            <Text>(Total feedbacks: {watch.feedbacks?.length | 0})</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Feedbacks', { feedbacks: watch.feedbacks })}
            style={({ pressed }) => [styles.button, pressed ? styles.onPress : null]}>
            <Text style={{ color: 'white' }}>View feedbacks</Text>
          </Pressable>
        </View>
      </ScrollView >
    </View >
  )
}

export default WatchDetail

const styles = StyleSheet.create({
  img: {
    justifyContent: 'center',
    alignItems: 'center',
    color: "#FFFFFF"
  },
  onPress: {
    opacity: 0.5,
    transform: [{ scale: 0.9 }],
  },
  feedback: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20
  },
  button: {
    backgroundColor: "tomato",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  onPress: {
    opacity: 0.5,
    transform: [{ scale: 0.9 }],
  },
})