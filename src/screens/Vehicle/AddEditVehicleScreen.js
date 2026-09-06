import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, FlatList, Image,StyleSheet, TouchableOpacity, Alert, Text,ScrollView} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { ensureCameraPermission } from '../../utils/cameraPermission';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {API_URL} from '@env';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { fetchActiveUserDetails } from '../../../features/userActiveSlice';
import { fileUrl } from '../../utils/fileUrl';

const AddEditVehicleScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { active_user, loading: userLoading, error: userError } = useSelector((state) => state.active_user);
  const { vehicle } = route.params || {};
  const [vehicles, setVehicles] = useState([]);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);
  const [errors, setErrors] = useState({});

 
  const validateForm = () => {
    let valid = true;
    let formErrors = {};

    if (name.trim() === '') {
      formErrors.name = 'Vehicle name is required';
      valid = false;
    }
    if (model.trim() === '') {
      formErrors.model = 'Vehicle model is required';
      valid = false;
    }
    if (selectedImages.length === 0) {
      formErrors.images = 'At least one image is required';
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  };

  useEffect(() => {
    dispatch(fetchActiveUserDetails());
    if (vehicle) {
    setName(vehicle.name);
    setModel(vehicle.model);
    setSelectedImages(vehicle.images.map((img) => ({
      uri: fileUrl(img),
      type: 'image/jpeg',
      name: img,
    })));
    setSelectedVehicleId(vehicle._id);
    setRemovedImages([]); // Reset removed images list
    }
  }, [vehicle]);

  // Handle image selection
  const selectImages = async () => {
    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) return;

    // Camera only — capture a live photo instead of picking from the gallery.
    const options = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.assets) {
        const newImages = response.assets.map((image) => ({
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        }));
        setSelectedImages([...selectedImages, ...newImages]);
      }
    });
  };

  // Submit or update vehicle
  const handleSubmit = async () => {
    if (validateForm()) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('model', model);
    selectedImages.forEach((image) => {
      formData.append('images', {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });
    });
   
    formData.append('removedImages', JSON.stringify(removedImages));
    
    try {
      if (selectedVehicleId) {
        // Update vehicle
        await axios.put(`${API_URL}/vehicles/${selectedVehicleId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Toast.show({                                                                                         
          type:'success',
          text1:'Vehicle',
          text1:'Vehicle Updated Successfully',
        })
        navigation.navigate('VehicleListScreen', vehicle)
      } else {
        formData.append('user_id', active_user._id);
        // Create vehicle
        await axios.post(`${API_URL}/vehicles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Toast.show({                                                                                         
          type:'success',
          text1:'Vehicle',
          text1:'Vehicle added Successfully',
        })
        navigation.navigate('VehicleListScreen')
      }

      resetForm();
    } catch (error) {
      console.error(error);
    }
  }
  };

  // Handle vehicle edit
  // const handleEdit = (vehicle) => {
  //   setName(vehicle.name);
  //   setModel(vehicle.model);
  //   setSelectedImages(vehicle.images.map((img) => ({
  //     uri: fileUrl(img),
  //     type: 'image/jpeg',
  //     name: img,
  //   })));
  //   setSelectedVehicleId(vehicle._id);
  //   setRemovedImages([]); // Reset removed images list
  // };

  // Handle image removal during update
  const handleImageRemove = (image) => {
    setRemovedImages([...removedImages, image.name]);
    setSelectedImages(selectedImages.filter((img) => img.name !== image.name));
  };

  // Reset the form after submission
  const resetForm = () => {
    setName('');
    setModel('');
    setSelectedImages([]);
    setSelectedVehicleId(null);
    setRemovedImages([]);
  };

  return (
    <ScrollView>
      <View style={styles.header}><Text style={styles.headerText}>{selectedVehicleId ? 'Update Vehicle' : 'Add Vehicle'}</Text></View>
      <View style={styles.container}>
      <Text style={styles.label}>Vehicle Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter vehicle name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>Vehicle Model</Text>
      <TextInput
        style={styles.input}
        placeholder="Vehicle Model"
        value={model}
        onChangeText={setModel}
      />
      {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
      <Text style={styles.label}>Vehicle Images</Text>
          <TouchableOpacity
            onPress={() => selectImages(selectImages)}
            style={styles.imagePickerButton}
          >
            <Text style={styles.imagePickerText}>Pick Images</Text>
          </TouchableOpacity>
          {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
        <FlatList
          horizontal
          data={selectedImages}
          keyExtractor={(item, index) => index.toString()} //Add this line
          renderItem={({ item }) => (
            <View  key={item.id}>
              <Image  source={{ uri: item.uri }} style={styles.imagePreview} />
              <TouchableOpacity onPress={() => handleImageRemove(item)} style={styles.imageRemove}>
              <Icon style={styles.imageRemoveIcon} name="highlight-remove" color="red" size={24} />
              </TouchableOpacity>
            </View>
          )}
        />

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>{selectedVehicleId ? 'Update Vehicle' : 'Submit Vehicle'}</Text>
          </TouchableOpacity>
          </View>
          </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header:{
      backgroundColor:'#ab9c17',
      padding:40,  },
  headerText:{
      fontSize:30, 
      fontWeight:'bold',
      color:'#fff',
      textAlign:'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageRemove:{
    position: 'absolute',
    right:10,
    top:0,
  },
});

export default AddEditVehicleScreen;
