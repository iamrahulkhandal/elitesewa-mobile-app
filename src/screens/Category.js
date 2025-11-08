import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // You can use any icon library
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {Picker} from '@react-native-picker/picker';
const categories = [
    { id: '1', name: 'Beauty & Spa', icon: 'user' },
    { id: '2', name: 'Appliance Repair', icon: 'user' },
    { id: '3', name: 'Home Cleaning', icon: 'user' },
    { id: '4', name: 'Weddings & Events', icon: 'user' },
    { id: '5', name: 'Paintings', icon: 'user'},
    { id: '6', name: 'Pest Control', icon: 'user' },
    { id: '7', name: 'Moving Homes', icon: 'user' },
    { id: '8', name: 'Plumber', icon: 'user' },
    { id: '9', name: 'Electrician', icon: 'user' },
];

const carTypes = [
    {
      label: 'Hatchback',
      value: 'hatchback',
      price: 'Rs. 499/- Monthly',
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
      label: 'Sedan',
      value: 'sedan',
      price: 'Rs. 599/- Monthly',
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
      label: 'SUV 5 & 7',
      value: 'suv',
      price: 'Rs. 799/- Monthly',
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
      label: 'Luxury',
      value: 'luxury',
      price: 'Rs. 1099/- Monthly',
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
  const selectedItem = {
    title: 'Selected item title',
    description: 'Secondary long descriptive text ...',
  };

const Category = () => {
    const [selectedLanguage, setSelectedLanguage] = useState();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Category</Text>
                <Icon name="search-outline" size={24} color="#fff" />
            </View>
            <Picker
            selectedValue={selectedLanguage}
            style={styles.picker}
            dropdownIconColor="#000" // Custom color for the dropdown icon
          mode="dropdown" // Ensure it uses the dropdown mode
            onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
            }>
                {carTypes.map((item, index) => (
                    <Picker.Item key={index} label={item.label} value={item.value}  style={{ fontSize: 16, color: 'red' }}/>
                ))}
            </Picker>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item}>
                        <FontAwesome6 name={item.icon} style={styles.icon}  size={25}/>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.list}
            />
            {/* <View style={styles.footer}>
                <TouchableOpacity style={styles.footerItem}>
                    <Icon name="home-outline" size={24} color="#333" />
                    <Text style={styles.footerText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Icon name="grid-outline" size={24} color="#333" />
                    <Text style={styles.footerText}>Category</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Icon name="calendar-outline" size={24} color="#333" />
                    <Text style={styles.footerText}>Booking</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Icon name="person-outline" size={24} color="#333" />
                    <Text style={styles.footerText}>Profile</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    picker: {
        height: 50,
        width: 150,
        color: 'blue', // Example of customizing the text color
      },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    list: {
        paddingHorizontal: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 12,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#333',
    },
});
export default Category;