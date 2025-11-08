import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Activeplan = ({ plan,service, vehicle, createdAt, onSelect, planActiveDate }) => {
  const { name, price, duration } = plan;

  const calculateEndDate = (planActiveDate, duration) => {
    const startDate = new Date(planActiveDate);
    const durationInDays = parseInt(duration, 10);
    startDate.setUTCDate(startDate.getUTCDate() + durationInDays);
    return startDate;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const endDate = calculateEndDate(planActiveDate, duration);
  const isPlanActive = endDate > new Date();
  const endDateFormatted = formatDate(endDate);
  const startDateFormatted = formatDate(new Date(planActiveDate));
  const serviceDateFormatted = createdAt ? formatDate(new Date(createdAt)) : 'Service date not available';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.duration}>Plan Duration: {duration} Days</Text>
      <Text style={styles.activationDate}>Plan Activation Date: {startDateFormatted}</Text>
      <Text style={styles.serviceDate}>Service Date: {serviceDateFormatted}</Text>
      <Text style={styles.expirationDate}>Plan Expiry Date: {endDateFormatted}</Text>
      {vehicle ? (
        <Text style={styles.vehicleInfo}>Vehicle Number: {vehicle.vehicleDetails.number}</Text>
      ) : (
        <Text style={styles.vehicleInfo}>Vehicle details not available</Text>
      )}
      <TouchableOpacity
        style={[styles.selectButton, { backgroundColor: isPlanActive ? '#F37254' : '#B0B0B0' }]}
        onPress={() => isPlanActive && onSelect(plan, service, vehicle, planActiveDate)}
        disabled={!isPlanActive}
      >
        <Text style={styles.selectButtonText}>{isPlanActive ? 'Select Plan' : 'Expired'}</Text>
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
  duration: {
    fontSize: 16,
    color: '#666',
  },
  activationDate: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  serviceDate: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  expirationDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  selectButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Activeplan;
