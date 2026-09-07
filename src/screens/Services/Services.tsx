// src/components/Shared/Services.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ServicesData from '../../components/Data/ServicesData'; // Ensure the path is correct
import { useNavigation } from '@react-navigation/native';
import type { AppNavigation } from '../../types/navigation';

const Services = () => {
  const navigation = useNavigation<AppNavigation>();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(item.navigate, { service: item })} // Navigate to the appropriate screen
    >
      <Icon name={item.icon} size={40} color="#FFC107" />
      <Text style={styles.itemText}>{item.name}</Text>
      {item.comingSoon && <Text style={styles.comingSoon}>Coming Soon</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ServicesData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  item: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 15,
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
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  comingSoon: {
    color: 'white',
    fontSize: 6,
    marginTop: 5,
    backgroundColor: 'green',
    padding: 2,
    borderRadius: 4,
    position: 'absolute',
    right: 5,
    top: 0,
  },
});

export default Services;
