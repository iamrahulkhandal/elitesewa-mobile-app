import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../FormComponents/InputField';

type OwnerDetailsProps = { ownerData: any; onChange: (...args: any[]) => void };

const OwnerDetails = ({ ownerData, onChange }: OwnerDetailsProps) => {
  return (
    <View>
      <InputField
        label="Owner Name"
        value={ownerData.ownerName}
        onChange={(text) => onChange('ownerName', text)}
        placeholder="e.g. Rahul Sharma"
      />
      <InputField
        label="Owner Contact"
        value={ownerData.ownerContact}
        onChange={(text) => onChange('ownerContact', text)}
        placeholder="e.g. 9876543210"
        keyboardType="phone-pad"
      /> 
      <InputField
        label="Alternate Contact"
        value={ownerData.ownerAlternateContact}
        onChange={(text) => onChange('ownerAlternateContact', text)}
        placeholder="e.g. 9123456780"
        keyboardType="phone-pad"
      />
      <InputField
        label="Owner Email"
        value={ownerData.ownerEmail}
        onChange={(text) => onChange('ownerEmail', text)}
        placeholder="e.g. rahul@gmail.com"
        keyboardType="email-address"
      />
      <InputField
        label="Owner Address"
        value={ownerData.ownerAddress}
        onChange={(text) => onChange('ownerAddress', text)}
        placeholder="e.g. 12, MG Road, Malviya Nagar, Jaipur"
        multiline
      />
      <InputField
        label="Parking Number (optional)"
        value={ownerData.parkingNo}
        onChange={(text) => onChange('parkingNo', text)}
        placeholder="e.g. B2-45"
      />
    </View>
  );
};

export default OwnerDetails;
