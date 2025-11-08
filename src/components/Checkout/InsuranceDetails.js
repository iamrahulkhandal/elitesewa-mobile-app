import React from 'react';
import { View } from 'react-native';
import DatePicker from '../FormComponents/DatePicker';
import TimePicker from '../FormComponents/TimePicker';
import InputField from '../FormComponents/InputField';

const InsuranceDetails = ({ insuranceData, onChange, serviceid }) => {
    console.log('Service ID:', serviceid); // ✅ Logs serviceId
  const showPickFields = serviceid !== '673f16bd7a12ef01b200c941';
  const showDropFields = serviceid === '673f16c47a12ef01b200c943';
  const pickLabel = serviceid === '673f16c47a12ef01b200c943' ? 'Pick Date & Time' : 'Schedule Date & Time';

  return ( 
    <View>
      <InputField
        label="Policy Number"
        placeholder="Policy Number"
        value={insuranceData.policyNumber}
        onChange={(text) => onChange('policyNumber', text)}
      />

      <InputField
        label="Provider Name"
        placeholder="Provider Name"
        value={insuranceData.providerName}
        onChange={(text) => onChange('providerName', text)}
      />

      {showPickFields && (
        <>
          <DatePicker
            label={pickLabel}
            date={insuranceData.startDate}
            onChange={(date) => onChange('startDate', date)}
          />
          <TimePicker
            time={insuranceData.startTime}
            onChange={(time) => onChange('startTime', time)}
          />
        </>
      )}

      {showDropFields && (
        <>
          <DatePicker
            label="Drop Date & Time"
            date={insuranceData.expiryDate}
            onChange={(date) => onChange('expiryDate', date)}
          />
          <TimePicker
            time={insuranceData.expiryTime}
            onChange={(time) => onChange('expiryTime', time)}
          />
        </>
      )}
    </View>
  );
};

export default InsuranceDetails; 
