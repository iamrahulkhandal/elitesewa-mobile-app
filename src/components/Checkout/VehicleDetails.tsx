import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../FormComponents/InputField';
import DatePicker from '../FormComponents/DatePicker';
import Dropdown from '../FormComponents/Dropdown';
import TimePicker from '../FormComponents/TimePicker';

type VehicleDetailsProps = { vehicleData: any; onChange: (...args: any[]) => void; active: boolean };

const VehicleDetails = ({ vehicleData, onChange,active }: VehicleDetailsProps) => {
    // Registration can't be in the future. The time-of-day cap only applies
    // when the registration date is today (or not yet chosen).
    const now = new Date();
    const regDate = vehicleData.registrationDate ? new Date(vehicleData.registrationDate) : null;
    const regDateIsToday = !regDate || isNaN(regDate.getTime()) || regDate.toDateString() === now.toDateString();

    return (
        <View>
            <InputField label="Vehicle Number" value={vehicleData.number} onChange={(text) => onChange('number', text)} placeholder="e.g. RJ14 AB 1234" editable={!active} />

            <InputField  label="Model" value={vehicleData.model} onChange={(text) => onChange('model', text)} placeholder="e.g. Swift VXI" />

            <InputField label="Manufacturer" value={vehicleData.manufacturer} onChange={(text) => onChange('manufacturer', text)} placeholder="e.g. Maruti Suzuki" />

            <InputField label="Year" value={vehicleData.year} onChange={(text) => onChange('year', text)} placeholder="e.g. 2022" keyboardType="numeric" />

            <DatePicker label="Registration Date" date={vehicleData.registrationDate} onChange={(date) => onChange('registrationDate', date)} maximumDate={now} />

            <TimePicker label="Registration Time" time={vehicleData.registrationTime} onChange={(time) => onChange('registrationTime', time)} maximumDate={regDateIsToday ? now : undefined} />

            <Dropdown label="Fuel Type" selectedValue={vehicleData.fuelType} onValueChange={(value) => onChange('fuelType', value)} options={['Petrol', 'Diesel', 'Electric', 'CNG']} />
        </View>
    );
}; 


export default VehicleDetails;
