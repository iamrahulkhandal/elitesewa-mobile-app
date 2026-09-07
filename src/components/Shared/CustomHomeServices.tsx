import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

import { API_URL } from '@env';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigation } from '../../types/navigation';

const CustomHomeServices = () => {
  const navigation = useNavigation<AppNavigation>();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const categoryId = '6736424636a5412c42c20da1'; // Define the categoryId here
    fetchServices(categoryId);
  }, []);

  const fetchServices = async (categoryId: any) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/services/category/${categoryId}`);
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const categoryId = '6736424636a5412c42c20da1';
    await fetchServices(categoryId);
    setRefreshing(false);
  };

  const keyExtractor = (item: any, index: number) => item.id || item._id || index.toString();

  const getIconComponent = (lib: any, name: string, size: number, color: any) => {
    switch (lib) {
      case 'Material Icons':
        return <MaterialIcon name={name} size={size} color={color} />;
      case 'Font Awesome':
        return <FontAwesomeIcon name={name} size={size} color={color} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchServices} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Services</Text>
      <FlatList
        data={services}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No services available.</Text>}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ServicesView', { serviceId: item._id })}
          >
            {getIconComponent(item.iconLib, item.icon, 30, '#FFC107')}
            <Text style={styles.itemText}>{item.name}</Text>
            {item.comingSoon && <Text style={styles.comingSoon}>Coming Soon</Text>}
          </TouchableOpacity>
        )}
      />
      {/* <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Services')}>
        <Icon name="dots-horizontal" size={30} color="#FFC107" />
        <Text style={styles.itemText}>More to Come</Text>
      </TouchableOpacity> */}
      
    </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
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
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  comingSoon: {
    color: 'white',
    fontSize: 8,
    marginTop: 5,
    backgroundColor: 'green',
    padding: 4,
    borderRadius: 4,
    position: 'absolute',
    right: 5,
    top: 0,
  },
});

export default CustomHomeServices;
