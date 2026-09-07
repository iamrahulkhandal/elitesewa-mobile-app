import React, { useState } from 'react';
import type { FieldErrors } from '../../types/models';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const daysOfWeek = [
  { id: 'Monday', name: 'Monday' },
  { id: 'Tuesday', name: 'Tuesday' },
  { id: 'Wednesday', name: 'Wednesday' },
  { id: 'Thursday', name: 'Thursday' },
  { id: 'Friday', name: 'Friday' },
  { id: 'Saturday', name: 'Saturday' },
  { id: 'Sunday', name: 'Sunday' },
];

type AvailabilityProps = { formData: any; onChange: (...args: any[]) => void; errors: FieldErrors };

const Availability = ({ formData, onChange, errors }: AvailabilityProps) => {
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectedDays, setSelectedDays] = useState(formData.availability.days || []);

  const handleDaySelect = (day: any) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d: any) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
    onChange('availability', { ...formData.availability, days: selectedDays });
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = (date: Date) => {
    onChange('availability', { ...formData.availability, startTime: moment(date).format('hh:mm A') });
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (date: Date) => {
    onChange('availability', { ...formData.availability, endTime: moment(date).format('hh:mm A') });
    hideEndTimePicker();
  };

  return (
    <View style={styles.container}>
      <Text>Available Days:</Text>
      {daysOfWeek.map(day => (
        <TouchableOpacity
          key={day.id}
          onPress={() => handleDaySelect(day.id)}
          style={styles.checkboxContainer}
        >
          <View style={[
            styles.checkbox,
            selectedDays.includes(day.id) && styles.checkboxSelected
          ]}>
            {selectedDays.includes(day.id) && <Text style={styles.checkmark}>✔</Text>}
          </View>
          <Text style={styles.label}>{day.name}</Text>
        </TouchableOpacity>
      ))}
      {errors.days && <Text style={styles.errorText}>{errors.days}</Text>}

      <TouchableOpacity onPress={showStartTimePicker} style={styles.input}>
        <Text>{formData.availability.startTime || 'Select Start Time'}</Text>
      </TouchableOpacity>
      {errors.startTime && <Text style={styles.errorText}>{errors.startTime}</Text>}
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />

      <TouchableOpacity onPress={showEndTimePicker} style={styles.input}>
        <Text>{formData.availability.endTime || 'Select End Time'}</Text>
      </TouchableOpacity>
      {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#48d22b',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  label: {
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginVertical: 5,
  },
});

export default Availability;
