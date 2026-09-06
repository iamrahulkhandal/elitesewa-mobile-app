import React, { useEffect, useState } from 'react';
import { View, Text,Alert, FlatList, TouchableOpacity, StyleSheet,Image,Button,SafeAreaView} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import { fileUrl } from '../../utils/fileUrl';


const VehicleListScreen = () => {

  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState([]);


    // Fetch all vehicles
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${API_URL}/vehicles`);
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Unable to load vehicles. Please try again.',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    };
  
    useFocusEffect(
      React.useCallback(() => {
        fetchVehicles();
      }, [])
    )
  
  
    // Handle vehicle deletion
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/vehicles/${id}`);
        Toast.show({                                                                                         
          type:'success',
          text1:'Vehicle',
          text2:'Vehicle deleted successfully',
        })
        fetchVehicles();
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Unable to delete vehicle. Please try again.',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
    };

  const ConfirmDelete = (id) => {
    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to delete this vehicle?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => handleDelete(id)}
      ]
    );
  };

  // Function to handle edit


  const renderItem = ({ item }) => (
    <View style={styles.vehicleItem} key={item.id}>

      <Image source={{ uri: fileUrl(item.images?.[0]) }} style={styles.vehicleImage} />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <Text style={styles.vehicleNumber}>{item.model}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate('AddEditVehicleScreen', { vehicle: item})}>
          <Icon name="square-edit-outline"  color="blue" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => ConfirmDelete(item._id)} style={styles.deleteIcon}>
          <Icon name="delete" color="red" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView>
    <FlatList
      data={vehicles} 
      keyExtractor={(item, index) => index.toString()} //Add this line
      renderItem={renderItem} 
      contentContainerStyle={styles.listContainer}
    />
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  vehicleImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  vehicleNumber: {
    color: '#777',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  deleteIcon: {
    marginLeft: 10,
  },
});

export default VehicleListScreen;
