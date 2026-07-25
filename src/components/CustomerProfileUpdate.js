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
import { Button, Snackbar, Text } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '@env';
import { useSelector, useDispatch } from 'react-redux';
import { setProfileCompletionStatus } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerProfileUpdate = ({ navigation }) => {
  const dispatch = useDispatch();

  // Access user and role from Redux store
  const userId = useSelector((state) => state.auth.userId);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const isProfileComplete = useSelector((state) => state.auth.isProfileComplete);
// console.log(userId, user, role, isProfileComplete);

  // State hooks
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(null);
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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user || !role) throw new Error('No user data found');

        const response = await axios.get(
          `${API_URL}/api/${role}/profile`,
          { params: { mobile: user } }
        );

        setProfileData(response.data);
      } catch (error) {
        setMessage('Error fetching profile data');
        setShowSnackbar(true);
        console.error("Error fetching profile data", error);
      }
    };
    fetchProfileData();
  }, [user, role]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateFields()) return;

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${API_URL}/api/${role}/update-profile`,
        {
          mobile: user,
          ...profileData,
        }
      );
      dispatch(setProfileCompletionStatus(true));
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

  const handleFocus = (field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: null }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.updateform}>
            {/* Name */}
            <View style={styles.divider}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                label="Name"
                onFocus={() => setIsFocused('name')}
                onBlur={() => setIsFocused(null)}
                value={profileData.name}
                onChangeText={(name) => setProfileData({ ...profileData, name })}
                error={!!errors.name}
                style={[styles.input, isFocused === 'name' && styles.isFocused]}
                placeholder="Enter your name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email */}
            <View style={styles.divider}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                label="Email"
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                value={profileData.email}
                onChangeText={(email) => setProfileData({ ...profileData, email })}
                error={!!errors.email}
                style={[styles.input, isFocused === 'email' && styles.isFocused]}
                placeholder="Enter your email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Street Address */}
            <View style={styles.divider}>
              <Text style={styles.label}>Street Address/House No.</Text>
              <TextInput
                label="Street Address/House No."
                onFocus={() => setIsFocused('streetAddress')}
                onBlur={() => setIsFocused(null)}
                value={profileData.streetAddress}
                onChangeText={(streetAddress) => setProfileData({ ...profileData, streetAddress })}
                error={!!errors.streetAddress}
                style={[styles.input, isFocused === 'streetAddress' && styles.isFocused]}
                placeholder="Enter your street address"
              />
              {errors.streetAddress && <Text style={styles.errorText}>{errors.streetAddress}</Text>}
            </View>

            {/* Apartment/Suite */}
            <View style={styles.divider}>
              <Text style={styles.label}>Apartment/Suite/Flat</Text>
              <TextInput
                label="Apartment/Suite/Flat"
                onFocus={() => setIsFocused('apartment')}
                onBlur={() => setIsFocused(null)}
                value={profileData.apartment}
                onChangeText={(apartment) => setProfileData({ ...profileData, apartment })}
                error={!!errors.apartment}
                style={[styles.input, isFocused === 'apartment' && styles.isFocused]}
                placeholder="Enter your apartment"
              />
              {errors.apartment && <Text style={styles.errorText}>{errors.apartment}</Text>}
            </View>

            {/* Nearby Landmark */}
            <View style={styles.divider}>
              <Text style={styles.label}>Nearby Landmark</Text>
              <TextInput
                label="Nearby Landmark"
                onFocus={() => setIsFocused('nearby')}
                onBlur={() => setIsFocused(null)}
                value={profileData.nearby}
                onChangeText={(nearby) => setProfileData({ ...profileData, nearby })}
                error={!!errors.nearby}
                style={[styles.input, isFocused === 'nearby' && styles.isFocused]}
                placeholder="Enter a nearby landmark"
              />
              {errors.nearby && <Text style={styles.errorText}>{errors.nearby}</Text>}
            </View>

            {/* Locality */}
            <View style={styles.divider}>
              <Text style={styles.label}>Area/Locality</Text>
              <TextInput
                label="Area/Locality"
                onFocus={() => setIsFocused('locality')}
                onBlur={() => setIsFocused(null)}
                value={profileData.locality}
                onChangeText={(locality) => setProfileData({ ...profileData, locality })}
                error={!!errors.locality}
                style={[styles.input, isFocused === 'locality' && styles.isFocused]}
                placeholder="Enter your locality"
              />
              {errors.locality && <Text style={styles.errorText}>{errors.locality}</Text>}
            </View>

            {/* Pincode */}
            <View style={styles.divider}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                label="Pincode"
                onFocus={() => setIsFocused('pincode')}
                onBlur={() => setIsFocused(null)}
                value={profileData.pincode}
                onChangeText={handlePincodeChange}
                error={!!errors.pincode}
                style={[styles.input, isFocused === 'pincode' && styles.isFocused]}
                placeholder="Enter your pincode"
                keyboardType="number-pad"
              />
              {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
            </View>
            
            {/* City */}
            <View style={styles.divider}>
              <Text style={styles.label}>City</Text>
              <TextInput
                label="City"
                onFocus={() => setIsFocused('city')}
                onBlur={() => setIsFocused(null)}
                value={profileData.city}
                onChangeText={(city) => setProfileData({ ...profileData, city })}
                error={!!errors.city}
                style={[styles.input, isFocused === 'city' && styles.isFocused]}
                placeholder="Enter your city"
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            {/* District */}
            <View style={styles.divider}>
              <Text style={styles.label}>District</Text>
              <TextInput
                label="District"
                onFocus={() => setIsFocused('district')}
                onBlur={() => setIsFocused(null)}
                value={profileData.district}
                onChangeText={(district) => setProfileData({ ...profileData, district })}
                error={!!errors.district}
                style={[styles.input, isFocused === 'district' && styles.isFocused]}
                placeholder="Enter your district"
				editable={false}
              />
              {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
            </View>

            {/* State */}
            <View style={styles.divider}>
              <Text style={styles.label}>State</Text>
              <TextInput
                label="State"
                onFocus={() => setIsFocused('state')}
                onBlur={() => setIsFocused(null)}
                value={profileData.state}
                onChangeText={(state) => setProfileData({ ...profileData, state })}
                error={!!errors.state}
                style={[styles.input, isFocused === 'state' && styles.isFocused]}
                placeholder="Enter your state"
				editable={false}
              />
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
            </View>

            {/* Country */}
            <View style={styles.divider}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                label="Country"
                onFocus={() => setIsFocused('country')}
                onBlur={() => setIsFocused(null)}
                value={profileData.country}
                onChangeText={(country) => setProfileData({ ...profileData, country })}
                error={!!errors.country}
                style={[styles.input, isFocused === 'country' && styles.isFocused]}
                placeholder="Enter your country"
                editable={false}
              />
            </View>

            {/* Update Profile Button */}
            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              loading={isLoading}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.button}
            >
              Update Profile
            </Button>
          </View>

          {/* Snackbar to show messages */}
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
  container: { flex: 1, justifyContent: 'center', padding: 10 },
  updateform: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 40, borderRadius: 10 },
  input: {
    backgroundColor: "#fff",
    color: 'inherit',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    height: 45,
  },
  label: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    borderRadius: 4,
  },
  buttonContent: {
    backgroundColor: '#09b5e1',
    borderRadius: 1,
  },
  buttonLabel: { color: '#fff' },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  isFocused: {
    borderColor: '#09b5e1',
    borderWidth: 2,
    elevation: 5,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  divider: {
    marginBottom: 15,
  },
});

export default CustomerProfileUpdate;
