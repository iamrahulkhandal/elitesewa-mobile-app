import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const OfferCard = ({ title, price, duration, features }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Image 
        source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} // Add a star image to your project directory
        style={styles.star}
      />
      <Text style={styles.price}>{price}</Text>
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.duration}>{duration}</Text>
    <View style={styles.features}>
      {features.map((feature, index) => (
        <Text key={index} style={styles.featureText}>★ {feature}</Text>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: '#ffd700',
      padding: 15,
      borderRadius: 10,
      marginHorizontal: 10,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    star: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#d32f2f',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 5,
    },
    duration: {
      fontSize: 14,
      color: '#555',
      marginBottom: 15,
    },
    features: {
      marginTop: 10,
    },
    featureText: {
      fontSize: 14,
      marginBottom: 5,
      color: '#333',
    },
  });
  export default OfferCard;