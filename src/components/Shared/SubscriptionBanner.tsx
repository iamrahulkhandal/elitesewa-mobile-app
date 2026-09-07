import React, { useState, useCallback } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { AppNavigation } from '../../types/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '@env';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

// Home-screen banner for monthly Autopay subscriptions: warns when a payment
// failed (plan halted) or informs when the next charge is coming up soon.
// Renders nothing when there is nothing to say.
const SubscriptionBanner = () => {
  const navigation = useNavigation<AppNavigation>();
  const userId = useAppSelector((state) => state.auth.userId);
  const role = useAppSelector((state) => state.auth.role);
  const [banner, setBanner] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!userId || role !== 'customer') return;
        try {
          const response = await axios.get(`${API_URL}/api/subscription/user/${userId}`);
          const subscriptions = response.data.subscriptions || [];

          const halted = subscriptions.find((s) => s.status === 'halted');
          if (halted) {
            setBanner({
              type: 'error',
              text: 'A subscription payment failed — your daily washes are paused. Tap to fix.',
            });
            return;
          }

          const chargingSoon = subscriptions.find(
            (s) =>
              s.status === 'active' &&
              s.nextChargeAt &&
              new Date(s.nextChargeAt).getTime() - Date.now() < THREE_DAYS_MS &&
              new Date(s.nextChargeAt) > new Date()
          );
          if (chargingSoon) {
            setBanner({
              type: 'info',
              text: `Your monthly plan renews on ${new Date(chargingSoon.nextChargeAt).toDateString()}.`,
            });
            return;
          }

          setBanner(null);
        } catch (error) {
          // Banner is informational only — stay silent on failure.
          setBanner(null);
        }
      };
      load();
    }, [userId, role])
  );

  if (!banner) return null;

  const isError = banner.type === 'error';
  return (
    <TouchableOpacity
      style={[styles.banner, isError ? styles.error : styles.info]}
      onPress={() => navigation.navigate('ActivePlanList', { role })}
    >
      <Icon
        name={isError ? 'alert-circle' : 'information-circle'}
        size={20}
        color="#fff"
        style={styles.icon}
      />
      <Text style={styles.text}>{banner.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
  },
  error: {
    backgroundColor: '#e74c3c',
  },
  info: {
    backgroundColor: '#09b5e1',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});

export default SubscriptionBanner;
