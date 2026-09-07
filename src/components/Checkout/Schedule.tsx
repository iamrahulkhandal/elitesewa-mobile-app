import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DatePicker from '../FormComponents/DatePicker';
import TimePicker from '../FormComponents/TimePicker';

// Service scheduling (date/time). This used to double as an "insurance" section;
// the insurance policy fields were removed, so it now reads simply as Schedule.
// The `insuranceData` prop name is retained to avoid rippling the shared state
// object through the checkout flow.
const Schedule = ({ insuranceData, onChange, serviceid }) => {
  const showPickFields = serviceid !== '673f16bd7a12ef01b200c941';
  const showDropFields = serviceid === '673f16c47a12ef01b200c943';
  const pickLabel = serviceid === '673f16c47a12ef01b200c943' ? 'Pick Date & Time' : 'Schedule Date & Time';

  if (!showPickFields && !showDropFields) return null;

  // Bookings need at least 30 minutes of lead time. The time floor only
  // applies when the chosen date is today — any time is fine on a later day.
  const now = new Date();
  const minTime = new Date(now.getTime() + 30 * 60 * 1000);
  const isTodayOrUnset = (value) => {
    const date = value ? new Date(value) : null;
    return !date || isNaN(date.getTime()) || date.toDateString() === now.toDateString();
  };

  return (
    <View>
      <Text style={styles.heading}>Schedule</Text>

      {showPickFields && (
        <>
          <DatePicker
            label={pickLabel}
            date={insuranceData.startDate}
            onChange={(date) => onChange('startDate', date)}
            minimumDate={now}
          />
          <TimePicker
            time={insuranceData.startTime}
            onChange={(time) => onChange('startTime', time)}
            minimumDate={isTodayOrUnset(insuranceData.startDate) ? minTime : undefined}
            minimumMessage="Time must be at least 30 minutes from now"
          />
        </>
      )}

      {showDropFields && (
        <>
          <DatePicker
            label="Drop Date & Time"
            date={insuranceData.expiryDate}
            onChange={(date) => onChange('expiryDate', date)}
            minimumDate={now}
          />
          <TimePicker
            time={insuranceData.expiryTime}
            onChange={(time) => onChange('expiryTime', time)}
            minimumDate={isTodayOrUnset(insuranceData.expiryDate) ? minTime : undefined}
            minimumMessage="Time must be at least 30 minutes from now"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
    marginBottom: 8,
  },
});

export default Schedule;
