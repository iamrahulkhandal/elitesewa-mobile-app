import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, Snackbar, Text, Checkbox } from 'react-native-paper';
import axios from 'axios';
import { REACT_NATIVE_SERVER_URL } from '@env';
import { useDispatch } from 'react-redux';
import { setProfileCompletionStatus } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExecutiveProfileUpdate = ({ navigation }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
      const [isFocused, setIsFocused] = useState(null);
  const [role] = useState('executive');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    streetAddress: '',
    apartment: '',
    nearby: '',
    locality: '',
    city: '',
    district: '',
    state: '',
    country: 'India',
    pincode: '',
    services: [], // services instead of selectedServices
  });

  const [servicesList, setServicesList] = useState([]); // List of all available services
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) throw new Error('No user data found');

        const parsedUserData = JSON.parse(userDataString);
        const { role, user } = parsedUserData;
        const response = await axios.get(
          `${REACT_NATIVE_SERVER_URL}/api/${role}/profile`,
          { params: { mobile: user } }
        );

        // Ensure response data is valid before setting state
        if (response?.data) {
          setProfileData(response.data);
          setUser(user); // Store the user's mobile number for profile update
        } else {
          setMessage('Error fetching profile data');
          setShowSnackbar(true);
        }
      } catch (error) {
        setMessage('Error fetching profile data');
        setShowSnackbar(true);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get(`${REACT_NATIVE_SERVER_URL}/api/services`);
        // Ensure the response contains valid service data
        if (Array.isArray(response.data)) {
          //console.log(response.data);
          setServicesList(response.data); // Save available services
        } else {
          setMessage('Error fetching services');
          setShowSnackbar(true);
        }
      } catch (error) {
        setMessage('Error fetching services');
        setShowSnackbar(true);
      }
    };

    fetchProfileData();
    fetchServices(); // Fetch the list of services
  }, []);

  const validateFields = () => {
    const newErrors = {};
    const {
      name,
      email,
      streetAddress,
      apartment,
      nearby,
      locality,
      city,
      district,
      state,
      pincode,
    } = profileData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Email is invalid';
    if (!streetAddress.trim()) newErrors.streetAddress = 'Street Address is required';
    if (!apartment.trim()) newErrors.apartment = 'Apartment/Flat is required';
    if (!nearby.trim()) newErrors.nearby = 'Nearby Landmark is required';
    if (!locality.trim()) newErrors.locality = 'Locality is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!district.trim()) newErrors.district = 'District is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (pincode.trim() && (pincode.length !== 6 || !/^\d{6}$/.test(pincode)))
      newErrors.pincode = 'Pincode should be a 6-digit number';

    // if (profileData.services.length === 0)
    //   newErrors.services = 'Please select at least one service';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateFields()) return;

    try {
      setIsLoading(true);
      await axios.put(`${REACT_NATIVE_SERVER_URL}/api/${role}/update-profile`, {
        mobile: user,
        ...profileData,
      });
      dispatch(setProfileCompletionStatus(true)); // Set profile as completed
      setMessage('Profile updated successfully');
      setShowSnackbar(true);
      navigation.navigate('Main', { screen: 'Home' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePincodeChange = async (pincode) => {
    if (pincode.length <= 6) {
      setProfileData({ ...profileData, pincode });
    }

    if (pincode.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        if (response.data[0].Status === 'Success') {
          const { District, State } = response.data[0].PostOffice[0];
          setProfileData((prevData) => ({
            ...prevData,
            city: response.data[0].PostOffice[0].Name,
            district: District,
            state: State,
          }));
        } else {
          setMessage('Invalid Pincode');
          setShowSnackbar(true);
        }
      } catch (error) {
        setMessage('Error fetching pincode details');
        setShowSnackbar(true);
      }
    }
  };

  // const handleServiceChange = (serviceId) => {
  //   setProfileData((prevData) => {
  //     // Ensure `services` is always an array
  //     const services = Array.isArray(prevData.services) ? prevData.services : [];

  //     const updatedServices = services.includes(serviceId)
  //       ? services.filter((id) => id !== serviceId) // Deselect the service
  //       : [...services, serviceId]; // Select the service

  //     return {
  //       ...prevData,
  //       services: updatedServices, // Update to services instead of selectedServices
  //     };
  //   });
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}>
              <View style={styles.container}>
         
                  <View style={styles.updateform}>

        <View style={styles.divider}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          label="Name"
          onFocus={() => setIsFocused('name')}
          onBlur={() => setIsFocused(null)}
          value={profileData.name}
          onChangeText={name => setProfileData({ ...profileData, name })}
          error={!!errors.name}
          // style={[styles.input, isFocused && styles.focusedInput]}
          style={[
            styles.input,
            isFocused === 'name' && styles.isFocused,
          ]}

          placeholder="Enter your name"
          // mode="outlined"  // Use outlined mode
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>


        <View style={styles.divider}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          label="Email"
          onFocus={() => setIsFocused('email')}
          onBlur={() => setIsFocused(null)}
          value={profileData.email}
          onChangeText={email => setProfileData({ ...profileData, email })}
          error={!!errors.email}
          style={[
            styles.input,
            isFocused === 'email' && styles.isFocused,
          ]}
          placeholder="Enter your email"
          // mode="outlined"  // Use outlined mode
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

         <View style={styles.divider}>
         <Text style={styles.label}>Street Address/House No.</Text>
         <TextInput
           label="Street Address/House No."
           onFocus={() => setIsFocused('streetAddress')}
           onBlur={() => setIsFocused(null)}
           value={profileData.streetAddress}
           onChangeText={streetAddress => setProfileData({ ...profileData, streetAddress })}
           error={!!errors.streetAddress}
           style={[
             styles.input,
             isFocused === 'streetAddress' && styles.isFocused,
           ]}
           placeholder="Enter your streetAddress"
           // mode="outlined"  // Use outlined mode
           theme={{
             colors: {
               primary: 'transparent',  // Remove the border color
               placeholder: '#aaa',
             },
           }}
         />
        {errors.streetAddress && <Text style={styles.errorText}>{errors.streetAddress}</Text>}
         </View>

        <View style={styles.divider}>
        <Text style={styles.label}>Apartment/Suite/Flat</Text>
        <TextInput
          label="Apartment/Suite/Flat"
          onFocus={() => setIsFocused('apartment')}
          onBlur={() => setIsFocused(null)}
          value={profileData.apartment}
          onChangeText={apartment => setProfileData({ ...profileData, apartment })}
          error={!!errors.apartment}
          style={[
            styles.input,
            isFocused === 'apartment' && styles.isFocused,
          ]}
          placeholder="Enter your apartment"
          // mode="outlined"  // Use outlined mode
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.apartment && <Text style={styles.errorText}>{errors.apartment}</Text>}
        </View>


        <View style={styles.divider}>
        <Text style={styles.label}>Nearby Landmark</Text>
        <TextInput
          label="Nearby Landmark"
          onFocus={() => setIsFocused('nearby')}
          onBlur={() => setIsFocused(null)}
          value={profileData.nearby}
          onChangeText={nearby => setProfileData({ ...profileData, nearby })}
          error={!!errors.nearby}
          style={[
            styles.input,
            isFocused === 'nearby' && styles.isFocused,
          ]}
          placeholder="Enter your nearby"
          // mode="outlined"  // Use outlined mode
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.nearby && <Text style={styles.errorText}>{errors.nearby}</Text>}
        </View>

        <View style={styles.divider}>
        <Text style={styles.label}>Area/Locality</Text>
        <TextInput
          label="Area/Locality"
          onFocus={() => setIsFocused('locality')}
          onBlur={() => setIsFocused(null)}
          value={profileData.locality}
          onChangeText={locality => setProfileData({ ...profileData, locality })}
          error={!!errors.nearby}
          style={[
            styles.input,
            isFocused === 'locality' && styles.isFocused,
          ]}
          placeholder="Enter your locality"
          // mode="outlined"  // Use outlined mode 
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.locality && <Text style={styles.errorText}>{errors.locality}</Text>}
        </View>

        <View style={styles.divider}>
        <Text style={styles.label}>City</Text>
        <TextInput
          label="City"
          onFocus={() => setIsFocused('city')}
          onBlur={() => setIsFocused(null)}
          value={profileData.city}
          onChangeText={city => setProfileData({ ...profileData, city })}
          error={!!errors.city}
          style={[
            styles.input,
            isFocused === 'city' && styles.isFocused,
            isDisabled && styles.disabledInput,
          ]}
          placeholder="Enter your city"
          // mode="outlined"  // Use outlined mode
          editable={isDisabled}
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        <View style={styles.divider}>
        <Text style={styles.label}>District</Text>
        <TextInput
          label="District"
          onFocus={() => setIsFocused('district')}
          onBlur={() => setIsFocused(null)}
          value={profileData.district}
          onChangeText={district => setProfileData({ ...profileData, district })}
          error={!!errors.district}
          style={[
            styles.input,
            isFocused === 'district' && styles.isFocused, isDisabled && styles.disabledInput,
          ]}
          placeholder="Enter your district"
          // mode="outlined"  // Use outlined mode
          editable={isDisabled}
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
        </View>

        <View style={styles.divider}>
        <Text style={styles.label}>State</Text>
        <TextInput
          label="State"
          onFocus={() => setIsFocused('state')}
          onBlur={() => setIsFocused(null)}
          value={profileData.state}
          onChangeText={state => setProfileData({ ...profileData, state })}
          error={!!errors.state}
          style={[
            styles.input,
            isFocused === 'state' && styles.isFocused, isDisabled && styles.disabledInput,
          ]}
          placeholder="Enter your state"
          // mode="outlined"  // Use outlined mode
          editable={isDisabled}
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
        </View>

        <View style={styles.divider}>
        <Text style={styles.label}>Pincode</Text>
        <TextInput
          label="Pincode"
          onFocus={() => setIsFocused('pincode')}
          keyboardType="numeric"
          onBlur={() => setIsFocused(null)}
          value={profileData.pincode}
          onChangeText={handlePincodeChange}
          error={!!errors.pincode}
          style={[
            styles.input,
            isFocused === 'pincode' && styles.isFocused, isDisabled && styles.disabledInput,
          ]}
          placeholder="Enter your pincode"
          // mode="outlined"  // Use outlined mode
          editable={!isDisabled}
          theme={{
            colors: {
              primary: 'transparent',  // Remove the border color
              placeholder: '#aaa',
            },
          }}
        />
       {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
        </View>

        {/* Service Selection */}
        {/* <View style={styles.serviceContainer}>
          {servicesList.map((service) => (
            <View key={service._id} style={styles.checkboxContainer}>
              <Checkbox
                status={profileData.services.includes(service._id) ? 'checked' : 'unchecked'}
                onPress={() => handleServiceChange(service._id)}
                color="#09b5e1"  // Checked color
                uncheckedColor="gray"  // Unchecked color
              />
              <Text>{service.name}</Text>
            </View>
          ))}
        </View>
        {errors.services && <Text style={styles.errorText}>{errors.services}</Text>} */}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleUpdateProfile}
          loading={isLoading}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          style={styles.button}>
            
          Update Profile
        </Button>
                </View>
        {/* Snackbar for messages */}
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={Snackbar.DURATION_SHORT}
        >
          {message}
        </Snackbar>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  updateform:{
    backgroundColor:'#fff',
    paddingHorizontal:15,
    paddingVertical:40,
    borderRadius:10,
  },
  title: {
    fontSize: 24,
    fontWeight:'800',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle:{
    fontSize: 14,
    color:'#a3a3a3',
    marginBottom: 32,
    textAlign: 'center',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0', // Grey out the background to indicate it's disabled
    borderColor: '#d1d1d1', // Lighter border color when disabled
  },
  input: {
    backgroundColor:"#fff",
    color: 'inherit',
    borderWidth:1, 
    borderColor:'#d1d5db',
    // lineHeight:1.2,
    borderRadius:4,
    padding:10,
    height:45,
    },
    isFocused: {
      borderColor: '#3b82f6',
      borderWidth:2,
      elevation: 5, // Shadow for Android
      shadowColor:'#3b82f6', // Shadow for iOS
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    label:{
      color:'gray',
      fontSize:14,
      fontWeight:'800',
      marginBottom:5,
    },
    button:{
      marginTop:20,
      borderRadius:4,
    },
    buttonContent: {
      backgroundColor:'#09b5e1',
      borderRadius: 1,
    },
    buttonLabel: {
      color: '#fff',
    },
    slug:{
      fontSize: 12,
      marginTop: 10,
      color:'#4b5563',
      textAlign: 'center',
    },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  button: {
    marginTop: 10,
  },
  divider:{
    marginBottom:10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color:'red'
  },
  submitButton: {
    marginTop: 20,
  },
});

export default ExecutiveProfileUpdate;
