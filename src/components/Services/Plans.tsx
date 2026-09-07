import React from 'react';
import type { PlanSummary, UserProfile } from '../../types/models';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { API_URL, RAZORPAY_KEY_ID } from '@env';
import { fileUrl } from '../../utils/fileUrl';

type PlansProps = { plan: PlanSummary; serviceId: string; user: UserProfile };

const Plans = ({ plan, serviceId, user }: PlansProps) => {
  const { name, price, duration, keyPoints } = plan;
  const planId = plan._id;
  const handlePayment = async () => {
    if (!user) {
      Alert.alert('Error', 'User is not logged in. Please log in to proceed.');
      return;
    }

    const options = {
      description: `Payment for ${name}`,
      image: fileUrl(null),
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      amount: (price ?? 0) * 100, // Convert to paise (Indian currency unit)
      name: 'EliteSewa',
      prefill: {
        email: user.email || 'kailashprogrammer@gmail.com',
        contact: user.contact || '8287876959',
        name: user.name || 'Kailash Chandra',
      },
      notes: {
        serviceId: serviceId,
        planId: planId,
      },
      theme: { color: '#F37254' },
    };

    try {
      // Save initial payment request
      // console.log('====================================');
      // console.log(`${API_URL}/api/payment/save-request`);
      // console.log('====================================');
      await axios.post(`${API_URL}/api/payment/save-request`, {
        userName: user,
        serviceId,
        planId,
        amount: price,
        currency: 'INR',
        status: 'PENDING',
      });

      // console.log('==============options======================');
      // console.log(options);
      // console.log('====================================');
      // Open Razorpay Checkout
      const data = await RazorpayCheckout.open(options);

      // console.log('====================================');
      // console.log(`${API_URL}/api/payment/save-response`);
      // console.log('====================================');
      // Save successful payment response
      await axios.post(`${API_URL}/api/payment/save-response`, {
        userName: user,
        serviceId,
        planId,
        paymentId: data.razorpay_payment_id,
        amount: price,
        currency: 'INR',
        status: 'SUCCESS',
      });

      Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}`);
    } catch (error: any) {
      // Save failed payment response
      await axios.post(`${API_URL}/api/payment/save-response`, {
        userName: user,
        serviceId,
        planId,
        error: error.description || error.message,
        amount: price,
        currency: 'INR',
        status: 'FAILED',
      });

      Alert.alert('Error', `Payment failed: ${error.description || error.message}`);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.price}>Price: Rs. {price}</Text>
      <Text style={styles.duration}>Duration: {duration} Min</Text>
      <Text style={styles.keyPointsHeading}>Key Points:</Text>
      {keyPoints?.map((point, index) => (
        <Text key={index} style={styles.keyPoint}>
          • {point}
        </Text>
      ))}

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#333',
  },
  duration: {
    fontSize: 16,
    color: '#666',
  },
  keyPointsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  keyPoint: {
    fontSize: 14,
    color: '#555',
  },
  payButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#F37254',
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Plans;
