import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const SubmitButton = ({ onSubmit, disabled = false, loading = false, label = 'Submit' }) => {
  // While a submission is in flight the button must not take a second tap:
  // tapping twice used to start two bookings and two payment attempts.
  const isBlocked = disabled || loading;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isBlocked && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isBlocked}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ disabled: isBlocked, busy: loading }}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={[styles.buttonText, styles.loadingLabel]}>Processing…</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>{label}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    // Muted fill so the button visibly reads as "not tappable right now".
    backgroundColor: '#8FBCEB',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingLabel: {
    marginLeft: 8,
  },
});

export default SubmitButton;
