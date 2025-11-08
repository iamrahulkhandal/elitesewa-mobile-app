import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import testimonialsData from '../../data/TestimonialsData'; // Adjust path as necessary

const MoreTestimonialsScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={testimonialsData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.testimonialContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.feedback}>{item.feedback}</Text>
            <Text style={styles.rating}>Rating: {item.rating} ⭐</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedback: {
    fontSize: 14,
    marginBottom: 5,
  },
  rating: {
    fontSize: 12,
    color: '#888',
  },
});

export default MoreTestimonialsScreen;
