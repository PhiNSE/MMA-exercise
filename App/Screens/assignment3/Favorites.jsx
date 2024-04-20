import { Dimensions, Pressable, FlatList, Image, StyleSheet, Text, TextInput, View, Switch, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { favlistStorageKey } from '../Utils/Constant';
import { Button, Dialog, Portal, PaperProvider } from 'react-native-paper';

const Favorites = ({ navigation }) => {

  const [favWatches, setFavWatches] = useState([]);
  const [filteredWatches, setFilteredWatches] = useState([]);

  const isFav = (watch) => {
    return favWatches.some((favWatch) => favWatch.id === watch.id);
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
        const isFav = array.some((favWatch) => favWatch.id === item.id);
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
        console.log("getted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      getStoredData();
    }
  }, [isFocus]);

  const clearFavStorage = async () => {
    try {
      await AsyncStorage.setItem(favlistStorageKey, JSON.stringify([]));
      setFavWatches([]);
    } catch (error) {
      console.log(error);
    }
  }

  const [brands, setBrands] = useState([
    "Citizen",
    "Tissot",
    "Fossil",
    "Seiko",
    "Frederique Constant",
  ]);
  const [brandFilters, setBrandFilters] = useState([]);

  useEffect(() => {
    filterWatches();
  }, [brandFilters]);

  const filterWatches = () => {
    const filteredWatches = favWatches.filter((watch) =>
      brandFilters.length === 0 || brandFilters.includes(watch.brandName)
    );
    setFilteredWatches(filteredWatches);
  };

  const addOrRemoveBrandFilter = (brand) => {
    if (brandFilters.includes(brand)) {
      setBrandFilters(brandFilters.filter((b) => b !== brand));
    } else {
      setBrandFilters([...brandFilters, brand]);
    }
  };

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
    <View>
      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.filter}>
        <Pressable
          onPress={() => setBrandFilters([])}
          style={({ pressed }) => [styles.filterItem,
          pressed ? styles.onPress : null,
          { justifyContent: 'center', padding: 5 }]}
        >
          <Ionicons name="close-circle-outline" size={24} color="black" />
        </Pressable>
        {brands.length > 0 && brands.map((brand) => (
          <Pressable
            key={brand}
            onPress={() => addOrRemoveBrandFilter(brand)}
            style={({ pressed }) => [
              styles.filterItem,
              pressed ? styles.onPress : null,
              ,
              brandFilters.includes(brand) ? styles.isActive : null
            ]
            }
          >
            <Text>{brand}</Text>
          </Pressable>
        ))}
      </ScrollView> */}
      <Pressable
        disabled={favWatches.length === 0}
        onPress={() => showDialog()}
        style={({ pressed }) => [favWatches.length === 0 ? styles.displayNone : styles.button, pressed ? styles.onPress : null]}>
        <Text style={{ color: 'white' }}>Clear all favorites</Text>
      </Pressable>
      <Text style={{ marginHorizontal: 10 }}>
        {favWatches.length === 0 ? "No favorite watch" : "Favorite watches"}
      </Text>
      <FlatList
        key={item => item.id}
        keyExtractor={item => "_" + item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        data={favWatches}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("WatchDetail", { watch: item })}
            style={({ pressed }) => [
              pressed ? styles.onPress : null,
            ]}
          >
            <View style={styles.itemCard}>

              <Image source={{ uri: item.image, width: 180, height: 180 }} />

              <Text numberOfLines={1}>{item.watchName}</Text>
              <Text numberOfLines={1}>{item.brandName}</Text>
              <View style={styles.priceAndFav}>
                <Text style={{ paddingRight: 70 }}>{item.price}$</Text>
                <Pressable
                  onPress={() => store(item)}
                  style={({ pressed }) => [
                    pressed ? styles.onPress : null,
                  ]}
                >
                  <Ionicons style={styles.favPressable}

                    name={isFav(item) ? "heart" : "heart-outline"} size={24} color="red" />
                </Pressable>
              </View>

            </View>
          </Pressable>
        )
        }
      />

      {/* <PaperProvider>
        <View> */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to clear all favorites?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={() => { hideDialog(); clearFavStorage() }}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* </View>
      </PaperProvider> */}

    </View >
  )
}

export default Favorites

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  filter: {
    flexDirection: "row",
  },
  filterItem: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
    margin: 10,
  },
  isActive: {
    backgroundColor: "tomato",
  },
  itemCard: {
    width: screenWidth / 2 - 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  onPress: {
    opacity: 0.5,
    transform: [{ scale: 0.9 }],
  },
  priceAndFav: {
    flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'
  },
  favPressable: {
    padding: 5
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
  displayNone: {
    display: 'none'
  }
})