import React from 'react';
import { View, Button, Alert,TouchableOpacity,StyleSheet,Text } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { API_URL } from '@env';


const RazorpayIntegration = (props) => { 
  const handlePayment = async () => {
    const options = {
      description: 'Payment for your service', 
      image: 'https://example.com/logo.png', // Add your logo URL here
      currency: 'INR',
      key: 'rzp_test_U6HfMGFCjhdYgo', // Replace with your Razorpay API Key
      amount: '50000', // Amount in paise (₹500.00)
      name: 'Your Company',
      prefill: {
        email: 'example@gmail.com',
        contact: '9876543210',
        name: 'John Doe',
      },
      theme: { color: '#3399cc' }, 
    };

    try {
      RazorpayCheckout.open(options)
        .then((data) => {
          // On payment success
          const { razorpay_payment_id } = data;
          Alert.alert('Payment Success', `Payment ID: ${razorpay_payment_id}`);
          savePaymentData(data); // Send data to your backend
        })
        .catch((error) => {
          // On payment failure
          Alert.alert('Payment Failed', error.description);
        });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const savePaymentData = async (paymentData) => {
    const response = await fetch(`${API_URL}/api/razorPayPaymentRoutes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    if (response.ok) {
      Alert.alert('Payment Saved', 'Your payment has been recorded.');
    } else {
      Alert.alert('Error', 'Failed to save payment data.');
    }
  };

  return (

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
            <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
button: {
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10, 
    marginTop: 20,
    alignItems: 'center', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RazorpayIntegration;
