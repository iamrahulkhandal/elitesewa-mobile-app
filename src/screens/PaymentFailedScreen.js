import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Using FontAwesome5 for the cross icon
import { useNavigation } from '@react-navigation/native';

const PaymentFailedScreen = ({ route }) => {
    const navigation = useNavigation();
    // Params are optional so a stray navigation here cannot crash the screen.
    const { planPrice, reason } = route.params || {};
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="times-circle" size={50} color="red" />
      </View>
      <Text style={styles.header}>Payment Failed</Text>
      {/* Show what actually went wrong when we know it, so the user can fix
          the problem instead of guessing. */}
      <Text style={styles.subHeader}>
        {reason || 'There was an issue with your transaction'}
      </Text>

      {planPrice !== undefined && (
        <View style={styles.transactionDetails}>
          <Text style={styles.amountText}>Amount</Text>
          <Text style={styles.amount}>{planPrice}.00</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Retry Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Text style={styles.linkButtonText}>Return to Home Screen</Text>
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
    padding: 20,
    backgroundColor: 'white',
  },
  iconContainer: {
    backgroundColor: '#FDEDEC',
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
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
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
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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

export default PaymentFailedScreen;