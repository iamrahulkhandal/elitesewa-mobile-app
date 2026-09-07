import React, { useState, useEffect } from 'react';
import type { Booking, PlanSummary } from '../../types/models';
import type { AppNavigation, AppRoute } from '../../types/navigation';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';
import { API_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import Activeplan from '../../components/Services/Activeplan';

const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  created: 'Awaiting first payment',
  active: 'Active · auto-renews',
  halted: 'Payment failed · paused',
  paused: 'Paused',
  cancel_scheduled: 'Auto-renew cancelled · active till period end',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

type ActivePlanListProps = { route: AppRoute; navigation: AppNavigation };

const ActivePlanList = ({ route, navigation }: ActivePlanListProps) => {
  const { role } = route.params ?? {};
  const userId = useAppSelector((state) => state.auth.userId);
  const userRole = useAppSelector((state) => state.auth.role);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Booking[]>([]);
  const [subscriptions, setSubscriptions] = useState<PlanSummary[]>([]);

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
      if (userRole === 'customer') {
        try {
          const subResponse = await axios.get(`${API_URL}/api/subscription/user/${userId}`);
          setSubscriptions(subResponse.data.subscriptions || []);
        } catch (subErr: any) {
          console.error('Error fetching subscriptions:', subErr.message);
        }
      }
    } catch (err: any) {
      console.error('Error fetching active plans:', err.message);
      setError('Unable to load your active plans. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAutoRenew = (subscription: any) => {
    Alert.alert(
      'Cancel auto-renew?',
      'Your current month stays active until it ends. No further charges will be made.',
      [
        { text: 'Keep auto-renew', style: 'cancel' },
        {
          text: 'Cancel auto-renew',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post(`${API_URL}/api/subscription/${subscription._id}/cancel`);
              fetchPayments();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Unable to cancel. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Subscriptions worth showing: hide fully closed ones.
  const visibleSubscriptions = subscriptions.filter(
    (s) => !['cancelled', 'completed', 'created'].includes(s.status ?? '')
  );

  const renderSubscriptionCard = (subscription: any) => {
    const plan = subscription.planId || {};
    const vehicle = subscription.vehicleId?.vehicleDetails || {};
    const halted = subscription.status === 'halted';
    const cancelable = ['active', 'halted', 'paused'].includes(subscription.status);
    return (
      <View key={subscription._id} style={[styles.subCard, halted && styles.subCardHalted]}>
        <View style={styles.subHeader}>
          <Icon name="refresh-circle-outline" size={22} color={halted ? '#e74c3c' : '#09b5e1'} />
          <Text style={styles.subTitle}>{plan.name || 'Monthly Plan'} · ₹{plan.price}/month</Text>
        </View>
        {vehicle.number ? <Text style={styles.subText}>Vehicle: {vehicle.number}</Text> : null}
        <Text style={[styles.subStatus, halted && styles.subStatusHalted]}>
          {SUBSCRIPTION_STATUS_LABELS[subscription.status] || subscription.status}
        </Text>
        <Text style={styles.subText}>Months paid: {subscription.paidCount}/{subscription.totalCount}</Text>
        {subscription.nextChargeAt && subscription.status === 'active' && (
          <Text style={styles.subText}>
            Next charge: {new Date(subscription.nextChargeAt).toDateString()}
          </Text>
        )}
        {halted && (
          <Text style={styles.subHaltedHelp}>
            Your last payment failed, so washes are paused. Approve the payment retry in your
            UPI app, or cancel and re-subscribe.
          </Text>
        )}
        {cancelable && (
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelAutoRenew(subscription)}>
            <Text style={styles.cancelButtonText}>Cancel Auto-Renew</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleActivePlanSelect = (plan: any, serviceId: any, vehicle: any, planActiveDate: string) => {
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

  const calculateEndDate = (planActiveDate: string, duration: string) => {
    const startDate = new Date(planActiveDate);
    const durationInDays = Number.parseInt(duration, 10);
    startDate.setUTCDate(startDate.getUTCDate() + durationInDays);
    return startDate;
  };

  // Plans still inside their duration window, with the fields the card needs.
  const activePayments = payments.filter((payment) => {
    if (!payment?.planId || !payment?.vehicleId || !payment?.planActiveDate) return false;
    return calculateEndDate(payment.planActiveDate ?? '', String(payment.planId?.duration ?? '')) > new Date();
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

  if (role !== 'customer' || (activePayments.length === 0 && visibleSubscriptions.length === 0)) {
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
      {visibleSubscriptions.length > 0 && (
        <>
          <Text style={styles.sectionHeading}>Monthly Subscriptions</Text>
          {visibleSubscriptions.map(renderSubscriptionCard)}
          {activePayments.length > 0 && <Text style={styles.sectionHeading}>Active Plans</Text>}
        </>
      )}
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
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginVertical: 8,
  },
  subCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#09b5e1',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  subCardHalted: {
    borderLeftColor: '#e74c3c',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginLeft: 6,
    flex: 1,
  },
  subText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 3,
  },
  subStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#09b5e1',
    marginBottom: 3,
  },
  subStatusHalted: {
    color: '#e74c3c',
  },
  subHaltedHelp: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#e74c3c',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default ActivePlanList;
