import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { PaperProvider, Card, Button } from 'react-native-paper';
import axios from 'axios';
import { REACT_NATIVE_SERVER_URL } from '@env';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const ServicesListing = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${REACT_NATIVE_SERVER_URL}/api/services`,
      );
      setServices(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = serviceId => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(
                `${REACT_NATIVE_SERVER_URL}/api/services/${serviceId}`,
              );
              Alert.alert('Success', 'Service deleted successfully');
              setServices(
                services.filter(service => service._id !== serviceId),
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete service');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };


  // Updated renderServiceItem with horizontal alignment
  const renderServiceItem = ({ item }) => {
    const firstPlan = item.plans?.[0];
    const firstKeyPoint = firstPlan?.keyPoints?.[0];
    return (
    <Card style={{ marginBottom: 20 }}>
      <Card.Title
        title={item.name}
        titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
        subtitleStyle={{ fontSize: 14 }}
        left={() => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ServicesView', { serviceId: item._id })
            }>
            {item.iconLib === 'Material Icons' ? (
              <MaterialIcon
                name={item.icon}
                size={28}
                color="#007BFF"
                style={styles.icon}
              />
            ) : (
              <FontAwesomeIcon
                name={item.icon}
                size={28}
                color="#007BFF"
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        )} />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ServicesView', { serviceId: item._id })
        }>
        <Card.Cover
          source={{ uri: `${REACT_NATIVE_SERVER_URL}/${item.images[0]}` }}
          style={{ margin: 10, borderRadius: 10, height: 150 }}
        />
      </TouchableOpacity>
      <Card.Content
        style={{
          margin: 0,
          paddingVertical: 10,
          borderRadius: 10,
          borderBottomWidth: 1,
          borderColor: 'grey',
        }}>
            {firstKeyPoint && (
              <View style={{ marginTop: 10 }}>
                <Text>{firstKeyPoint}</Text>
              </View>
            )}
      </Card.Content>

     {/* <Card.Actions>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ServicesEdit', { serviceId: item._id })
          }
          style={styles.editButton}>
          <MaterialIcon name="edit" size={20} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteService(item._id)}
          style={styles.deleteButton}>
          <FontAwesomeIcon name="trash" size={20} color="#FF0000" />
        </TouchableOpacity> 
      </Card.Actions> */}
    </Card>
  );
};

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
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
      <FlatList
        data={services.filter(service => !service.isShowing)} // ✅ Filter here
        keyExtractor={item => item._id}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No services available.</Text>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    padding: 6,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
    padding: 6,
    marginLeft: 5,
  },
});

export default ServicesListing;
