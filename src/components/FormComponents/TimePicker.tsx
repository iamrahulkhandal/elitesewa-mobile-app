import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';

// Returns a valid Date or null (empty string / undefined / unparseable input).
const parseTime = (value: any) => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// The Android time picker has no native min/max-time support, so when
// `maximumDate`/`minimumDate` are set the limits are enforced after picking,
// by time-of-day comparison.
const isAfterTimeOfDay = (picked: any, max: any) =>
  picked.getHours() > max.getHours() ||
  (picked.getHours() === max.getHours() && picked.getMinutes() > max.getMinutes());

type TimePickerProps = {
  label?: string;
  time?: Date | string | null;
  onChange?: (time: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  /** Shown when the picked time falls before minimumDate. */
  minimumMessage?: string;
};

const TimePicker = ({ label, time, onChange, maximumDate, minimumDate, minimumMessage }: TimePickerProps) => {
  const [selectedTime, setSelectedTime] = useState(parseTime(time));
  const [show, setShow] = useState(false);

  useEffect(() => {
    setSelectedTime(parseTime(time));
  }, [time]);

  const onChangeInternal = (event: any, pickedTime: any) => {
    setShow(false);
    if (pickedTime) {
      if (maximumDate && isAfterTimeOfDay(pickedTime, maximumDate)) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Time',
          text2: 'Time cannot be in the future',
          position: 'bottom',
          visibilityTime: 3000,
        });
        return;
      }
      if (minimumDate && isAfterTimeOfDay(minimumDate, pickedTime)) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Time',
          text2: minimumMessage || 'Please choose a later time',
          position: 'bottom',
          visibilityTime: 3000,
        });
        return;
      }
      setSelectedTime(pickedTime);
      onChange?.(pickedTime);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${paddedMinutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={() => setShow(true)} style={styles.timeButton}>
        <Icon name="clock-o" size={20} color="gray" style={styles.icon} />
        <Text style={selectedTime ? styles.timeText : styles.placeholderText}>
          {selectedTime ? formatTime(selectedTime) : 'Select time'}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          maximumDate={maximumDate}
          onChange={onChangeInternal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  timeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  timeText: {
    fontSize: 14,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default TimePicker;
