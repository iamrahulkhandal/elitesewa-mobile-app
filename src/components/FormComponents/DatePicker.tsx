import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

// Returns a valid Date or null (empty string / undefined / unparseable input).
const parseDate = (value) => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
};

type DatePickerProps = {
  label: string;
  date?: Date | string | null;
  onChange?: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
};

const DatePicker = ({ label, date, onChange, maximumDate, minimumDate }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState(parseDate(date));
  const [show, setShow] = useState(false);

  // Update local state if the prop date changes.
  useEffect(() => {
    setSelectedDate(parseDate(date));
  }, [date]);

  const onChangeInternal = (event, pickedDate) => {
    setShow(false);
    if (pickedDate) {
      setSelectedDate(pickedDate);
      onChange(pickedDate);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={() => setShow(true)} style={styles.dateButton}>
      <Icon name="calendar" size={20} color="gray" style={styles.icon} />
        <Text style={selectedDate ? styles.dateText : styles.placeholderText}>
          {selectedDate ? selectedDate.toDateString() : 'Select date'}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
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
  dateButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    height: 45,
    flexDirection: 'row', // Add this for horizontal alignment of icon and text
    alignItems: 'center',
  },
  icon: {
    marginRight: 10, // Space between icon and date text
  },
  dateText: {
    fontSize: 14,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default DatePicker;
