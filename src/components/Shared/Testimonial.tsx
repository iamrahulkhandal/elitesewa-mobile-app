import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import testimonialsData from '../../data/TestimonialsData'; // Adjust path as necessary
import { useNavigation } from '@react-navigation/native';
import type { AppNavigation } from '../../types/navigation';

const Testimonial = () => {
  const navigation = useNavigation<AppNavigation>();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.testimonialContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.feedback}>{item.feedback}</Text>
      <Text style={styles.rating}>Rating: {item.rating} ⭐</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={testimonialsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('MoreTestimonialsScreen')} // Navigate to detailed screen
      >
        <Text style={styles.buttonText}>See More Testimonials</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  testimonialContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  feedback: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Testimonial;
