import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type PriceBreakoutProps = { serviceid: string; locationData: any; planPrice: number };

const PriceBreakout = ({ serviceid,locationData,planPrice}: PriceBreakoutProps) => {
  const ratePerKm = 10;
  const fixedCharge = planPrice;

  const distanceValue = parseFloat(locationData?.distance) || 0;
  const distanceCharge = distanceValue * ratePerKm;
  const total = fixedCharge + distanceCharge;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Breakout {parseFloat(locationData?.distance)}</Text>
      <View style={styles.breakdown}>
        <Text style={styles.lineItem}>Service Fixed Charge: ₹{fixedCharge}</Text>
        <Text style={styles.lineItem}>Distance: {distanceValue} km</Text>
        <Text style={styles.lineItem}>Rate per Km: ₹{ratePerKm}</Text>
        <Text style={styles.lineItem}>Distance Charge: ₹{distanceCharge.toFixed(2)}</Text>

        <View style={styles.separator} />
        <Text style={styles.total}>Total Payable: ₹{total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  breakdown: {
    marginTop: 10,
  },
  lineItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default PriceBreakout;
