import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Alert,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const Booking = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [executiveservicesid, setExecutiveservicesid] = useState(null);

  // Access user and role from Redux store
  const userId = useSelector((state) => state.auth.userId);
  const userRole = useSelector((state) => state.auth.role);

  const fetchPayments = async () => {
    if (!userId || !userRole) return;

    setLoading(true);
    try {
      // console.log('Fetching payments for user ID:', userId);

      const response = await axios.get(
        `${API_URL}/api/payment/${userRole}/${userId}`
      );

      // console.log('Payments:', response.data.payments);
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error(
        'Error fetching payment listings:',
        error.response?.data || error.message
      );
      Alert.alert('Error', 'Unable to fetch payment listings. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPayments();
    }, [userId, userRole])
  );

  const handleCancelBooking = async (paymentId) => {
    try {
      await axios.put(`${API_URL}/api/payment/${paymentId}/cancel`);
      Alert.alert('Success', 'Booking has been cancelled successfully.');
      fetchPayments(); // Refresh the payments list
    } catch (error) {
      console.error('Error cancelling booking:', error.message);
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
    }
  }; 

  const serviceRating = async (paymentId) => {
    try {
      const response = await axios.get(`${API_URL}/api/executiveservices/${paymentId}`);
      setExecutiveservicesid(response.data);

      navigation.navigate('ExecutiveServicesUpdate', {
        item_id: response.data._id,
        payment_id: paymentId,
      });
    } catch (error) {
      console.error('Error fetching executive service:', error.message);
      Alert.alert('Error', 'Failed to fetch service details.');
    }
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', { item_id: item._id })}>
        <Text style={styles.title}>Plan: {item.planId?.name || 'N/A'}</Text>
        <Text>Service: {item.serviceId?.name || 'N/A'}</Text>
        <Text>User: {item.userId?.name || 'N/A'}</Text>
        <Text>Amount: ₹{item.amount}</Text>
        <Text>Status: {item.status}</Text>
        <Text>Service Status: {item.service}</Text>
        <Text>Rating: {item.rating}</Text>
      </TouchableOpacity>

      {item.service === 'COMPLETE' && item.rating === 'PENDING' ? (
        <Button title="Please Rate" color="#F37254" onPress={() => serviceRating(item._id)} />
      ) : item.service !== 'COMPLETE' ? (
        <Button title="Service Pending" color="#F37254" disabled />
      ) :         <TouchableOpacity style={[styles.button, styles.completeButton]}>
                <Text style={styles.buttonText}>Service Complete</Text>
              </TouchableOpacity>}

      {item.status === 'PENDING' && (
        <Button
          title="Cancel Booking"
          color="#F37254"
          onPress={() =>
            Alert.alert('Confirm Cancellation', 'Are you sure you want to cancel this booking?', [
              { text: 'No', style: 'cancel' },
              { text: 'Yes', onPress: () => handleCancelBooking(item._id) },
            ])
          }
        />
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#F37254" style={styles.loading} />;
  }

  return (
    <FlatList
      data={payments}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderPaymentItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.emptyText}>No payments found.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  button: {
    marginTop: 10, 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: '#2ecc71',
  },
});

export default Booking;
