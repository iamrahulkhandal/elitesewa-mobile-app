import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Using FontAwesome5 for the checkmark
import { useNavigation } from '@react-navigation/native';

const PaymentSuccessScreen = ({route}) => {
    const navigation = useNavigation();
    const { paymentId, vehicleNumber, planPrice,planActive } = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="check-circle" size={50} color="green" />
      </View>

      {planActive ? (
      <>
      <Text style={styles.header}>Booking Successful!</Text>
      <Text style={styles.subHeader}>Your booking has been completed successfully</Text>

      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>Vehicle ID</Text>
        <Text style={styles.transactionId}>{vehicleNumber}</Text>
      </View>
    </>
    ) : (
      <>
      <Text style={styles.header}>Payment Successful!</Text>
      <Text style={styles.subHeader}>Your transaction has been completed successfully</Text>

      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>Transaction ID</Text>
        <Text style={styles.transactionId}>{paymentId}</Text>
        <Text style={styles.amountText}>Amount Paid</Text>
        <Text style={styles.amount}>{planPrice}.00</Text>
      </View>
    </>
    )}





      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ServicesListing')}>
          <Text style={styles.buttonText}>Continue to Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Main', { screen: 'Booking' })}>
          <Text style={styles.buttonText2}>View My Booking   <Icon name="chevron-right" size={15} color="#374151" /> </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Text style={styles.linkButtonText}> <Icon name="home" size={18} color="green" /> Return to Home Screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  iconContainer: {
    backgroundColor: '#E9F7E5',
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  transactionDetails: {
    marginBottom: 30,
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 14,
    color: '#888',
  },
  transactionId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  amountText: {
    fontSize: 14,
    color: '#888',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '95%',
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '95%',
    display:'flex',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText2: {
    
    color: '#374151',
    fontSize: 14,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
  },
  linkButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default PaymentSuccessScreen;
