import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../FormComponents/InputField';

const OwnerDetails = ({ ownerData, onChange }) => {
  return (
    <View>
      <InputField
        label="Owner Name"
        value={ownerData.ownerName}
        onChange={(text) => onChange('ownerName', text)}
        placeholder="Enter owner name"
      />
      <InputField
        label="Owner Contact"
        value={ownerData.ownerContact}
        onChange={(text) => onChange('ownerContact', text)}
        placeholder="Enter contact number"
        keyboardType="phone-pad"
      /> 
      <InputField
        label="Alternate Contact"
        value={ownerData.ownerAlternateContact}
        onChange={(text) => onChange('ownerAlternateContact', text)}
        placeholder="Enter alternate contact"
        keyboardType="phone-pad"
      />
      <InputField
        label="Owner Email"
        value={ownerData.ownerEmail}
        onChange={(text) => onChange('ownerEmail', text)}
        placeholder="Enter email address"
        keyboardType="email-address"
      />
      <InputField
        label="Owner Address"
        value={ownerData.ownerAddress}
        onChange={(text) => onChange('ownerAddress', text)}
        placeholder="Enter address"
        multiline
      />
      <InputField
        label="Parking Number (optional)"
        value={ownerData.parkingNo}
        onChange={(text) => onChange('parkingNo', text)}
        placeholder="Enter parking number"
      />
    </View>
  );
};

export default OwnerDetails;
