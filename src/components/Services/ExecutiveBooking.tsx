import React, { useState, useCallback } from 'react';
import type { Booking } from '../../types/models';
import type { AppNavigation } from '../../types/navigation';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';

// Daily-wash plans are subscriptions serviced day by day, so their cards get
// the day-wise upload flow instead of the one-shot pending/complete buttons.
const isDailyWash = (item: any) => /daily/i.test(item.serviceId?.name || '');

type ExecutiveBookingProps = { navigation: AppNavigation };

const ExecutiveBooking = ({ navigation }: ExecutiveBookingProps) => {
  const [payments, setPayments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [washProgress, setWashProgress] = useState<Record<string, number>>({}); // paymentId -> days logged

  // Access user and role from Redux store
  const userId = useAppSelector((state) => state.auth.userId);
  const role = useAppSelector((state) => state.auth.role);

  const fetchPayments = async () => {
    if (!userId || !role) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/payment/${role}/${userId}`);
      const list = response.data.payments || [];
      setPayments(list);
      fetchWashProgress(list);
    } catch (error: any) {
      console.error('Error fetching payment listings:', error.message);
      Alert.alert('Error', 'Unable to fetch payment listings. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Days-logged count per daily-wash booking, for the progress line.
  const fetchWashProgress = async (list: any) => {
    const dailyBookings = list.filter(isDailyWash);
    if (!dailyBookings.length) return;
    const entries = await Promise.all(
      dailyBookings.map(async (item: any) => {
        try {
          const res = await axios.get(`${API_URL}/api/dailywash/${item._id}`);
          return [item._id, (res.data.logs || []).length];
        } catch (error) {
          return null;
        }
      })
    );
    setWashProgress(Object.fromEntries(entries.filter(Boolean)));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
  };

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPayments();
    }, [userId, role])
  );

  const handleCancelBooking = async (paymentId: any) => {
    try {
      await axios.put(`${API_URL}/api/payment/${paymentId}/cancel`);
      Alert.alert('Success', 'Booking has been cancelled successfully.');
      fetchPayments(); // Refresh the list after cancellation
    } catch (error: any) {
      console.error('Error cancelling booking:', error.message);
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
    }
  };

  const renderPaymentItem = ({ item }: { item: any }) => {
    const daily = isDailyWash(item);
    const daysLogged = washProgress[item._id];
    const totalDays = Number.parseInt(item.planId?.duration, 10);

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', { item_id: item._id })}>
          <Text style={styles.title}>Plan: {item.planId?.name || 'N/A'}</Text>
          <Text style={styles.text}>Service: {item.serviceId?.name || 'N/A'}</Text>
          <Text style={styles.text}>User: {item.userId?.name || 'N/A'}</Text>
          <Text style={styles.text}>Payment Status: {item.status}</Text>
          {daily ? (
            <Text style={styles.progressText}>
              {item.subscriptionId ? `Month ${item.monthNumber || 1} · ` : ''}
              Washes logged: {daysLogged ?? '…'}{Number.isFinite(totalDays) ? ` / ${totalDays} days` : ' days'}
            </Text>
          ) : (
            <Text style={styles.text}>Service Status: {item.service}</Text>
          )}
        </TouchableOpacity>

        {daily ? (
          // Subscription: serviced day by day — no one-shot complete button.
          <TouchableOpacity
            style={[styles.button, styles.dailyButton]}
            onPress={() => navigation.navigate('DailyWashUpload', { item_id: item._id })}
          >
            <Text style={styles.buttonText}>Upload Today's Wash Photos</Text>
          </TouchableOpacity>
        ) : item.service === 'PENDING' ? (
          <TouchableOpacity
            style={[styles.button, styles.pendingButton]}
            onPress={() => navigation.navigate('ExecutiveServicesCreate', { item_id: item._id })}
          >
            <Text style={styles.buttonText}>Service Pending</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.completeButton]}>
            <Text style={styles.buttonText}>Service Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#F37254" style={styles.loading} />;
  }

  return (
    <FlatList
      data={payments}
      keyExtractor={(item) => String(item._id)}
      renderItem={renderPaymentItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        !loading ? <Text style={styles.emptyText}>No payments found.</Text> : null
      }
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
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#09b5e1',
    fontWeight: '700',
  },
  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pendingButton: {
    backgroundColor: '#f39c12',
  },
  completeButton: {
    backgroundColor: '#2ecc71',
  },
  dailyButton: {
    backgroundColor: '#09b5e1',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
});

export default ExecutiveBooking;
