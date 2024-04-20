import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native';
import StarRatingDisplay from 'react-native-star-rating-widget';
import { Ionicons } from '@expo/vector-icons';

const Feedbacks = ({ route }) => {
  const { feedbacks } = route.params;

  const [feeds, setFeeds] = useState(feedbacks);
  const initRating = [0, 1, 2, 3, 4, 5];
  const [rating, setRating] = useState([]);

  useEffect(() => {
    filterFeeds();
  }, [rating]);

  const filterFeeds = () => {
    const filteredFeeds = feedbacks?.filter((feed) => rating.length === 0 || rating.includes(feed.rating));
    setFeeds(filteredFeeds);
  }

  const addOrRemoveRating = (rate) => {
    if (rating.includes(rate)) {
      setRating(rating.filter((r) => r !== rate));
    } else {
      setRating([...rating, rate]);
    }
  }

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  return (
    <View>
      <View style={styles.filter}>
        {initRating.map((rate) => (
          <Pressable
            key={rate}
            onPress={() => addOrRemoveRating(rate)}
            style={({ pressed }) => [
              styles.filterItem,
              pressed ? styles.onPress : null,
              rating.includes(rate) ? styles.isActive : null
            ]}
          >
            <Text>{rate}</Text>
            <Ionicons name="star" size={20} color="yellow" />
          </Pressable>
        ))}
      </View>
      <FlatList
        data={feeds}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <StarRatingDisplay rating={item?.rating} />
            <Text>{item.comment}</Text>
            <Text>{item.author}</Text>
            <Text>{formatDate(item.date)}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default Feedbacks

const styles = StyleSheet.create({
  item: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  filter: {
    flexDirection: "row",
  },
  filterItem: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
    margin: 10,
    flexDirection: 'row',
    gap: 2
  },
  isActive: {
    backgroundColor: "tomato",
  },
})