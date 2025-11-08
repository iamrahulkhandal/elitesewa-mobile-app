import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const DatePicker = ({ label, date, onChange }) => {
  // Ensure that the provided date is a Date object.
  const initialDate = date instanceof Date ? date : new Date(date);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [show, setShow] = useState(false);

  // Update local state if the prop date changes.
  useEffect(() => {
    const newDate = date instanceof Date ? date : new Date(date);
    setSelectedDate(newDate);
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
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
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
});

export default DatePicker;
