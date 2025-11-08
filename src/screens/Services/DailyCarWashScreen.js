import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import {RNPickerSelect} from '@react-native-picker/picker';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
const carTypes = [
  {
    type: 'Hatchback',
    value: 'hatchback',
    price: 'Rs. 499/- Monthly',
    price_rate:499,
    details: [
      "26 Days Full wash for Protect & Shine",
      "Tire Dressing & rim Cleaning",
      "Air pressure check and refill",
      "Weekly Full car wash and care services",
      "Exterior foam wash",
      "Interior Vacuum",
      "Dashboard Polishing",
      "Mats & Carpets Shampooed",
      "Window Cleaning inside",
    ],
  },
  {
    type: 'Sedan',
    value: 'sedan',
    price: 'Rs. 599/- Monthly',
    price_rate:599,
    details: [
      "26 Days Full exterior Wax wash for Protect & Shine",
      "Tire Dressing & rim Cleaning",
      "Air pressure check and refill",
      "Weekly Full car wash and care services",
      "Exterior foam wash",
      "Interior Vacuum",
      "Dashboard Polishing",
      "Mats & Carpets Shampooed",
      "Window Cleaning inside",
    ],
  },
  {
    type: 'SUV 5 & 7',
    value: 'suv',
    price: 'Rs. 799/- Monthly',
    price_rate:799,
    details: [
      "26 Days Full exterior Wax wash for Protect & Shine",
      "Tire Dressing & rim Cleaning",
      "Air pressure check and refill",
      "Weekly Full car wash and care services",
      "Exterior foam wash",
      "Interior Vacuum",
      "Dashboard Polishing",
      "Mats & Carpets Shampooed",
      "Window Cleaning inside",
    ],
  },
  {
    type: 'Luxury',
    value: 'luxury',
    price: 'Rs. 1099/- Monthly',
    price_rate:1099,
    details: [
      "26 Days Full exterior Wax wash for Protect & Shine",
      "Tire Dressing & rim Cleaning",
      "Air pressure check and refill",
      "Weekly Full car wash and care services",
      "Exterior foam wash",
      "Interior Vacuum",
      "Dashboard Polishing",
      "Mats & Carpets Shampooed",
      "Window Cleaning inside",
    ],
  },
];

  const DailyCarWashScreen = () => {
    const navigation = useNavigation();

  const [selectedCarType, setSelectedCarType] = useState(carTypes[0]);
  return (
    <View style={styles.container}>
     <ScrollView>
      <Text style={styles.title}>Choose Car Type</Text>
        {carTypes.map((car,index) => (
            <View key={index} style={styles.card}>
            <Text style={styles.cartypeheading}>{car.type}</Text>
            <Text style={styles.price}>{car.price}</Text>
            {car.details.map((detail, index) => (
              <Text key={index} style={styles.detail}>
                {detail}
              </Text>
            ))}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PaymentScreen', { price: car })}>
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        ))}
</ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  picker: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#f8c471',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  cartypeheading:{
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    borderBottomWidth:1,
    borderBottomColor:'#fff'
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default DailyCarWashScreen
