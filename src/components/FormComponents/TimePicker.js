import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const TimePicker = ({ label, time, onChange }) => {
  const initialTime = time instanceof Date ? time : new Date(time);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const newTime = time instanceof Date ? time : new Date(time);
    setSelectedTime(newTime);
  }, [time]);

  const onChangeInternal = (event, pickedTime) => {
    setShow(false);
    if (pickedTime) {
      setSelectedTime(pickedTime);
      onChange(pickedTime);
    }
  };

  const formatTime = (date) => {
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
        <Text style={styles.timeText}>{formatTime(selectedTime)}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={false}
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
});

export default TimePicker;
