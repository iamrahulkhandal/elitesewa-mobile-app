import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import Activeplan from '../../components/Services/Activeplan';

const ActivePlanList = ({ route, navigation }) => {
  const { role } = route.params;
  const userId = useSelector((state) => state.auth.userId);
  const userRole = useSelector((state) => state.auth.role);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    if (!userId || !userRole) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_URL}/api/payment/activeplan/${userRole}/${userId}`
      );
      setPayments(response.data.payments || []);
    } catch (err) {
      console.error('Error fetching active plans:', err.message);
      setError('Unable to load your active plans. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivePlanSelect = (plan, serviceId, vehicle, planActiveDate) => {
    navigation.navigate('Checkout', {
      serviceId: serviceId._id,
      planId: plan._id,
      planPrice: plan.price,
      planActive: true,
      planActiveDate,
      vehicleNumber: vehicle.vehicleNumber,
      vehicleId: vehicle._id,
      planDuration: plan.duration,
    });
  };

  const calculateEndDate = (planActiveDate, duration) => {
    const startDate = new Date(planActiveDate);
    const durationInDays = parseInt(duration, 10);
    startDate.setUTCDate(startDate.getUTCDate() + durationInDays);
    return startDate;
  };

  // Plans still inside their duration window, with the fields the card needs.
  const activePayments = payments.filter((payment) => {
    if (!payment?.planId || !payment?.vehicleId || !payment?.planActiveDate) return false;
    return calculateEndDate(payment.planActiveDate, payment.planId.duration) > new Date();
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="cloud-offline-outline" size={48} color="#9ca3af" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchPayments} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (role !== 'customer' || activePayments.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.centerContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPayments} />}
      >
        <Icon name="document-text-outline" size={48} color="#9ca3af" />
        <Text style={styles.emptyTitle}>No active plans yet</Text>
        <Text style={styles.emptyText}>
          When you purchase a service plan, it will appear here so you can book services under it.
        </Text>
        {role === 'customer' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Browse Services</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPayments} />}
      style={styles.container}
    >
      {activePayments.map((payment, index) => {
        const { planId, vehicleId, createdAt, serviceId, planActiveDate } = payment;
        return (
          <View key={payment._id || index}>
            <Activeplan
              plan={planId}
              service={serviceId}
              vehicle={vehicleId}
              createdAt={createdAt}
              planActiveDate={planActiveDate}
              onSelect={handleActivePlanSelect}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 30,
  },
  centerContainer: {
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginTop: 14,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#09b5e1',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ActivePlanList;
