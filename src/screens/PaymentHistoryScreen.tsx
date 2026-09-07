import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { useAppSelector } from '../store/hooks';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { API_URL } from '@env';

const STATUS_COLORS = {
  SUCCESS: '#2ecc71',
  FAILED: '#e74c3c',
  CANCELLED: '#e67e22',
  PENDING: '#f39c12',
};

const PaymentHistoryScreen = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userId = useAppSelector((state) => state.auth.userId);
  const role = useAppSelector((state) => state.auth.role);

  const fetchPayments = async () => {
    if (!userId || !role) return;
    setLoading(true);
    try {
      // Executives see the bookings assigned to them; customers see their own.
      const endpoint =
        role === 'executive'
          ? `${API_URL}/api/payment/executive/${userId}`
          : `${API_URL}/api/payment/customer/${userId}`;
      const response = await axios.get(endpoint);
      const list = response.data.payments || [];
      // Newest first.
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPayments(list);
    } catch (error: any) {
      console.error('Error fetching payment history:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to load payment history. Pull to refresh to retry.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPayments();
    }, [userId, role])
  );

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderItem = ({ item }) => {
    const statusColor = STATUS_COLORS[item.status] || '#7f8c8d';
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('BookingDetails', { item_id: item._id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.planName} numberOfLines={1}>
            {item.planId?.name || 'Plan'}
          </Text>
          <Text style={styles.amount}>₹{item.amount}</Text>
        </View>

        <Text style={styles.service} numberOfLines={1}>
          {item.serviceId?.name || 'Service'}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.serviceStatusLabel}>Service:</Text>
          <Text style={styles.serviceStatusValue}>{item.service || 'N/A'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#09b5e1" style={styles.loading} />;
  }

  return (
    <FlatList
      data={payments}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon name="receipt-outline" size={48} color="#c4c9d0" />
          <Text style={styles.emptyText}>No payment history yet.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    marginRight: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#09b5e1',
  },
  service: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  serviceStatusLabel: {
    fontSize: 13,
    color: '#888',
  },
  serviceStatusValue: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 15,
    color: '#888',
  },
});

export default PaymentHistoryScreen;
