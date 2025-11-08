import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../FormComponents/InputField';
import DatePicker from '../FormComponents/DatePicker';
import Dropdown from '../FormComponents/Dropdown';
import TimePicker from '../FormComponents/TimePicker';

const VehicleDetails = ({ vehicleData, onChange,active }) => {
    return (
        <View>
            <InputField label="Vehicle Number" value={vehicleData.number} onChange={(text) => onChange('number', text)} placeholder="Enter vehicle number" editable={!active} />

            <InputField  label="Model" value={vehicleData.model} onChange={(text) => onChange('model', text)} placeholder="Enter vehicle model" />

            <InputField label="Manufacturer" value={vehicleData.manufacturer} onChange={(text) => onChange('manufacturer', text)} placeholder="Enter manufacturer" />

            <InputField label="Year" value={vehicleData.year} onChange={(text) => onChange('year', text)} placeholder="Enter vehicle year" keyboardType="numeric" />

            <DatePicker label="Registration Date" date={vehicleData.registrationDate} onChange={(date) => onChange('registrationDate', date)} />

            <TimePicker date={vehicleData.registrationTime} onChange={(time) => onChange('registrationTime', time)} />

            <Dropdown label="Fuel Type" selectedValue={vehicleData.fuelType} onValueChange={(value) => onChange('fuelType', value)} options={['Petrol', 'Diesel', 'Electric', 'CNG']} />
        </View>
    );
}; 


export default VehicleDetails;
