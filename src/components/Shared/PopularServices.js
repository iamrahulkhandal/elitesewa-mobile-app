import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

const popularServices = [
  {
    id: '1',
    name: 'Battery Jumpstart',
    oldPrice: 500,
    newPrice: 400,
    image: 'https://d1gymyavdvyjgt.cloudfront.net/drive/images/uploads/headers/ws_cropper/1_0x0_2000x1200_0x520_how_to_jump_start_header.jpg',  // Replace with your image path
  },
  {
    id: '2',
    name: 'Oil Change',
    oldPrice: 400,
    newPrice: 350,
    image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.wallacechev.com%2Fblog%2Foil-change-why-do-i-need-it%2F&psig=AOvVaw2izSq3xvwlfR1qKdk6KDU1&ust=1724560933325000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKi1q7XojIgDFQAAAAAdAAAAABAE',  // Replace with your image path
  },
  {
    id: '3',
    name: 'Tubeless Puncture',
    oldPrice: 200,
    newPrice: 150,
    image: 'https://www.jiomart.com/images/product/original/rvelzm0er1/fiable-tubeless-tire-tyre-puncture-repair-kit-for-lmvs-product-images-orvelzm0er1-p590999655-1-202201122309.jpg?im=Resize=(420,420)',  // Replace with your image path
  },
];

const PopularServices = () => {

  const renderItem = ({ item }) => (
    <View style={styles.card}>
                  <Image
        style={styles.image}
        source={{
          uri: 'https://d1gymyavdvyjgt.cloudfront.net/drive/images/uploads/headers/ws_cropper/1_0x0_2000x1200_0x520_how_to_jump_start_header.jpg',
        }}
      />
      {/* <Image source={item.image} style={styles.image} /> */}
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.oldPrice}>₹ {item.oldPrice}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.newPrice}>₹ {item.newPrice}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Popular Services</Text>
      <FlatList
        data={popularServices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}  // Makes the list scroll horizontally
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: 150,
    marginRight: 10,
    borderRadius: 10,
    paddingHorizontal:5,
    paddingVertical:5,
    borderColor:'lightgray',
    borderWidth:1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  image: {
    margin:'auto',
    width: 140,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  serviceName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#999',
    marginTop: 5,
  },
  priceContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 5,
    alignItems:'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
  },
});

export default PopularServices;