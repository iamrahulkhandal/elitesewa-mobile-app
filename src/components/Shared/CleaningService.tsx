import React from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
  } from 'react-native';

  const features = [
    {
      id: "1",
      icon: require("../../assets/foam-wash.png"), // Replace with actual image/icon or emoji
      title: "Smart Machine Foam Wash For protect from scratches",
      description: "",
    },
    {
      id: "2",
      icon: require("../../assets/foam-wash.png"), // Replace with actual image/icon or emoji
      title: "Smart Machine Wax Coating For daily shine",
      description: "",
    },
    {
      id: "3",
      icon: require("../../assets/eco-friendly.png"), // Replace with actual image/icon or emoji
      title: "Eco-friendly wash our cleaners use Minimal to no water for car cleaning",
      description: "",
    },
    {
      id: "4",
      icon: require("../../assets/foam-wash.png"), // Replace with actual image/icon or emoji
      title: "Microfiber Cloth with High dust absorption Qualities to ensure zero scratches On yorr car",
      description: "",
    },
  ];

const CleaningService = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        How are we different from your regular car cleaning service?
      </Text>
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.itemText}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center',
    marginBottom: 20,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical:10,
    paddingBottom:0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  itemText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CleaningService;
