import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, ScrollView, Keyboard, TextInput, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import { Button, Text } from 'react-native-paper';
import axios from 'axios';
import { REACT_NATIVE_SERVER_URL, RAZORPAY_KEY_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "@env";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation } from '@react-navigation/native';

Geocoder.init(GOOGLE_API_KEY);

const VehicleAndOwnerDetails = (props) => {
  const vehicleRoute = props.route;
  const navigation = useNavigation();
  const { serviceId, planPrice, planId, planDuration, vehicleId, planActive, planActiveDate } = vehicleRoute.params;
  // State for dropdown
  const [serviceType, setServiceType] = useState(null);
  const userId = useSelector((state) => state.auth.userId);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(null);

  // State declarations...
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAlternateContact, setOwnerAlternateContact] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [aadharOrPan, setAadharOrPan] = useState('');
  const [parkingNo, setParkingNo] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [rc, setRc] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [insuranceStartDate, setInsuranceStartDate] = useState(moment(new Date()).format('DD/MM/YYYY'));
  const [insuranceExpireDate, setInsuranceExpireDate] = useState(moment(new Date()).format('DD/MM/YYYY'));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showExpireDatePicker, setShowExpireDatePicker] = useState(false);
  const [plan, setPlan] = useState('');
  const [membershipStatus, setMembershipStatus] = useState('active');
  const [startDate, setStartDate] = useState('');
  const [expireDate, setExpireDate] = useState('');

  const [formErrors, setFormErrors] = useState({});

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [distance, setDistance] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [route, setRoute] = useState(null);

  // Fetch location suggestions
  const fetchSuggestions = async (input, setSuggestions) => {
    if (input.length < 3) return;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}&types=geocode`;

    try {
      const response = await axios.get(url);
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };

  const handleMarkerDragEnd = (e, setLocation, setAddress) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    // Reverse geocode the new marker position
    Geocoder.from(latitude, longitude)
      .then((json) => {
        const address = json.results[0]?.formatted_address;
        setAddress(address);
        setLocation({ lat: latitude, lng: longitude });
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to fetch new location name.");
        console.error("Geocoding error:", error);
      });
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode the current location
        Geocoder.from(latitude, longitude)
          .then((json) => {
            const address = json.results[0]?.formatted_address;
            setPickup(address); // Display the address as the name of current location
            setPickupLocation({ lat: latitude, lng: longitude });
          })
          .catch((error) => {
            console.error("Geocoding error:", error);
          });
      },
      (error) => {
        Alert.alert("Error", "Unable to fetch current location.");
        console.error(error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };


  // Handle selection of a suggested location
  const handleSelection = async (placeId, setLocation, setAddress, setSuggestions) => {
    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`;
      const response = await axios.get(detailsUrl);

      if (response.data.status === "OK") {
        const location = response.data.result.geometry.location;
        setLocation(location);
        setAddress(response.data.result.formatted_address);
      }
    } catch (error) {
      console.error("Error fetching location details:", error.message);
    }
    setSuggestions([]);
  };
  // Calculate distance and route
  const calculateDistance = async () => {
    if (!pickupLocation || !dropLocation) {
      Alert.alert("Error", "Please select both pickup and drop locations.");
      return;
    }

    try {
      // Fetch route details
      const routeUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLocation.lat},${pickupLocation.lng}&destination=${dropLocation.lat},${dropLocation.lng}&key=${GOOGLE_API_KEY}`;
      const routeResponse = await axios.get(routeUrl);

      if (routeResponse.data.status === "OK") {
        setRoute(routeResponse.data.routes[0].overview_polyline.points);
      } else {
        setRoute(null);
        Alert.alert("Error", "Failed to fetch the route.");
      }

      // Fetch distance
      const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickupLocation.lat},${pickupLocation.lng}&destinations=${dropLocation.lat},${dropLocation.lng}&key=${GOOGLE_API_KEY}`;
      const distanceResponse = await axios.get(distanceUrl);

      if (
        distanceResponse.data.status === "OK" &&
        distanceResponse.data.rows[0]?.elements[0]?.status === "OK"
      ) {
        setDistance(distanceResponse.data.rows[0].elements[0].distance.text);
      } else {
        setDistance("Distance not available.");
      }
    } catch (error) {
      console.error("Error calculating distance:", error.message);
      Alert.alert("Error", "Failed to calculate distance.");
    }
  };


  // Validation and other functions...
  const validateForm = (field = null) => {
    let errors = {};
    const validationRules = {
      vehicleNumber: {
        pattern: /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/,
        messages: {
          format: 'Vehicle number must be in format: AB12CD1234',
          required: 'Vehicle number is required'
        }
      },
      ownerName: {
        pattern: /^[A-Za-z ]{2,30}$/,
        messages: {
          format: 'Name should only contain letters and spaces',
          length: 'Name must be between 2-30 characters'
        }
      },
      ownerContact: {
        pattern: /^[6-9][0-9]{9}$/,
        messages: {
          format: 'Invalid Indian mobile number',
          length: 'Mobile number must be 10 digits'
        }
      },
      ownerEmail: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        messages: {
          format: 'Invalid email format',
          required: 'Email is required'
        }
      },
      ownerAddress: {
        pattern: (value) => value.length >= 5 && value.length <= 100,
        messages: {
          length: 'Address must be between 5-100 characters',
          required: 'Address is required'
        }
      },
      //aadharOrPan: {
      //  pattern: (value) => /^[2-9]{1}[0-9]{11}$/.test(value) || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
      //  messages: {
      //    aadhar: 'Aadhar must be 12 digits starting with 2-9',
      //    pan: 'PAN must be in format: ABCDE1234F'
      //  }
      //},
      parkingNo: {
        pattern: /^[A-Za-z0-9]{1,10}$/,
        messages: {
          format: 'Only alphanumeric characters allowed',
          length: 'Maximum 10 characters allowed'
        }
      },
      vehicleMake: {
        pattern: /^[A-Za-z0-9 ]{2,20}$/,
        messages: {
          format: 'Only letters, numbers and spaces allowed',
          length: 'Must be between 2-20 characters'
        }
      },
      vehicleColor: {
        pattern: /^[A-Za-z ]{2,20}$/,
        messages: {
          format: 'Only letters and spaces allowed',
          length: 'Must be between 2-20 characters'
        }
      },
      rc: {
        pattern: /^[A-Za-z0-9]{1,15}$/,
        messages: {
          format: 'Only alphanumeric characters allowed',
          length: 'Maximum 15 characters allowed'
        }
      },
      insuranceCompany: {
        pattern: /^[A-Za-z ]{2,50}$/,
        messages: {
          format: 'Only letters and spaces allowed',
          length: 'Must be between 2-50 characters'
        }
      },
      insuranceStartDate: {
        pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        messages: {
          format: 'Date must be in DD/MM/YYYY format',
          valid: 'Please enter a valid date'
        }
      },
      insuranceExpireDate: {
        pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        messages: {
          format: 'Date must be in DD/MM/YYYY format',
          valid: 'Please enter a valid date'
        }
      }
    };

    const validateField = (fieldName, value) => {
      const rule = validationRules[fieldName];
      if (!value) {
        errors[fieldName] = rule?.messages?.required || 'This field is required';
        return false;
      }

      if (typeof rule.pattern === 'function') {
        if (!rule.pattern(value)) {
          errors[fieldName] = Object.values(rule.messages)[0];
          return false;
        }
      } else if (!rule.pattern.test(value)) {
        errors[fieldName] = Object.values(rule.messages)[0];
        return false;
      }
      return true;
    };

    const stateValues = {
      vehicleNumber,
      ownerName,
      ownerContact,
      ownerEmail,
      ownerAddress,
      aadharOrPan,
      parkingNo,
      vehicleMake,
      vehicleColor,
      rc,
      insuranceCompany,
      insuranceStartDate,
      insuranceExpireDate
    };

    if (field) {
      validateField(field, stateValues[field]);
      if (errors[field]) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: errors[field],
          position: 'bottom',
          visibilityTime: 3000
        });
      }
    } else {
      Object.keys(validationRules).forEach(fieldName => {
        //console.log(fieldName);
        validateField(fieldName, stateValues[fieldName]);
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field) => {

    validateForm(field);
  };

  // Payment handling and other functions...
  const handlePayment = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix all errors before proceeding',
        position: 'bottom',
        visibilityTime: 3000
      });
      return;
    }

    setIsLoading(true);

    try {

      // const { mStartDate, mExpireDate } = calculateMembershipDates(planDuration);
      //const planDuration = 12; // Example: 12 months of membership
      const { mStartDate, mExpireDate } = calculateMembershipDates(planDuration);

      const vehicleDetails = {
        vehicleNumber,
        ownerDetails: {
          ownerName,
          ownerContact,
          ownerEmail,
          ownerAlternateContact: ownerAlternateContact || '',
          ownerAddress,
          aadharOrPan: aadharOrPan || '',
          parkingNo,
        },
        vehicleDetails: {
          vehicleMake,
          vehicleColor,
          rc,
        },
        insuranceDetails: {
          insuranceCompany,
          insuranceStartDate,
          insuranceExpireDate,
        },
        membershipDetails: {
          plan: planId,
          status: membershipStatus,
          startDate: mStartDate,
          expireDate: mExpireDate,
        },
        userId,
        serviceId,
        planId,
        amount: planActive ? 1 : planPrice,
        currency: 'INR',
        status: 'PENDING',
        pickDropDetails: {
          pickup,
          pickupLocation,
          drop,
          dropLocation,
          distance
        }


      };
      //console.log('vehicleDetails', vehicleDetails);
      //await storeFormData();

      // Save payment request
      const paymentRequestResponse = await axios.post(
        `${REACT_NATIVE_SERVER_URL}/api/payment/save-request`,
        vehicleDetails
      );
      //console.log('paymentRequestResponse', paymentRequestResponse);

      if (!paymentRequestResponse.data.success) {
        throw new Error('Failed to save payment request');
      }

      const paymentRequestId = paymentRequestResponse.data.paymentRequestId;
      const vehicleId = paymentRequestResponse.data.vehicleId;

      let paymentData = null;  // Change from const to let

      if (!planActive) {
        try {
          const options = {
            description: `Payment for ${vehicleDetails.membershipDetails.plan}`,
            image: `${REACT_NATIVE_SERVER_URL}/uploads/noimage.png`,
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: planPrice * 100,
            name: 'EliteSewa',
            prefill: {
              email: ownerEmail,
              contact: ownerContact,
              name: ownerName,
            },
            notes: { serviceId, planId },
            theme: { color: '#F37254' },
          };

          paymentData = await RazorpayCheckout.open(options);
        } catch (error) {
          console.error('Payment Failed:', error);
          return Alert.alert('Payment Failed', 'Transaction was not completed.');
        }
      }

      // Extract payment ID safely
      const paymentId = planActive ? '0101010011001' : paymentData?.razorpay_payment_id;
      if (!paymentId) {
        return Alert.alert('Payment Failed', 'No payment ID received.');
      }

      // Save payment response
      await axios.post(`${REACT_NATIVE_SERVER_URL}/api/payment/save-response`, {
        userName: ownerName,
        userId,
        serviceId,
        planId,
        paymentId,
        amount: planActive ? 1 : planPrice,
        currency: 'INR',
        status: 'SUCCESS',
        startDate: mStartDate,
        expireDate: mExpireDate,
        paymentRequestId,
        planActiveDate: planActive ? planActiveDate : new Date().toISOString(),// Current date and time in ISO format
        vehicleId,
      });

      // Navigate to success screen if payment ID exists
      if (paymentId) {
        navigation.navigate('PaymentSuccess', {
          paymentId,
          vehicleNumber,
          planActive,
          planPrice: planActive ? 1 : planPrice,
        });
      }

    } catch (error) {
      console.error('Payment error:', error);
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: error.message || 'An error occurred during payment',
        position: 'bottom',
        visibilityTime: 3000
      });
      navigation.navigate('PaymentFailed', {
        planPrice: planActive ? 1 : planPrice,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateMembershipDates = (planDuration) => {
    const today = moment(); // Get today's date

    // Calculate the start date (this can be today or any specific start date)
    const mStartDate = today.format('DD/MM/YYYY'); // You can change the format if needed

    // Calculate the expiry date based on the plan duration (adding months)
    const mExpireDate = today.add(planDuration, 'months').format('DD/MM/YYYY'); // Adding 'planDuration' months to the start date

    return { mStartDate, mExpireDate };
  };

  // const storeFormData = async () => {
  //   try {
  //     await AsyncStorage.setItem('vehicleNumber', vehicleNumber);
  //     await AsyncStorage.setItem('ownerDetails', JSON.stringify({ ownerName, ownerContact, ownerEmail, ownerAlternateContact, ownerAddress, aadharOrPan, parkingNo }));
  //     await AsyncStorage.setItem('vehicleDetails', JSON.stringify({ vehicleMake, vehicleColor, rc }));
  //     await AsyncStorage.setItem('pickDropDetails', JSON.stringify({ pickup, pickupLocation, drop, dropLocation, distance }));
  //     await AsyncStorage.setItem('insuranceDetails', JSON.stringify({ insuranceCompany, insuranceStartDate, insuranceExpireDate }));
  //     await AsyncStorage.setItem('membershipDetails', JSON.stringify({ plan, status: membershipStatus, startDate, expireDate }));
  //   } catch (error) {
  //     console.error('Error saving data to AsyncStorage:', error);
  //   }
  // };
  // const retrieveFormData = async () => {
  //   try {
  //     // Retrieve all stored data
  //     const [
  //       vehicleNumberData,
  //       ownerDetailsData,
  //       vehicleDetailsData,
  //       pickDropDetails,
  //       insuranceDetailsData,
  //       membershipDetailsData
  //     ] = await Promise.all([
  //       AsyncStorage.getItem('vehicleNumber'),
  //       AsyncStorage.getItem('ownerDetails'),
  //       AsyncStorage.getItem('vehicleDetails'),
  //       AsyncStorage.getItem('pickDropDetails'),
  //       AsyncStorage.getItem('insuranceDetails'),
  //       AsyncStorage.getItem('membershipDetails')
  //     ]);

  //     // Update state with retrieved data
  //     if (vehicleNumberData) {
  //       setVehicleNumber(vehicleNumberData);
  //     }

  //     if (ownerDetailsData) {
  //       const ownerData = JSON.parse(ownerDetailsData);
  //       setOwnerName(ownerData.ownerName || '');
  //       setOwnerContact(ownerData.ownerContact || '');
  //       setOwnerEmail(ownerData.ownerEmail || '');
  //       setOwnerAlternateContact(ownerData.ownerAlternateContact || '');
  //       setOwnerAddress(ownerData.ownerAddress || '');
  //       setAadharOrPan(ownerData.aadharOrPan || '');
  //       setParkingNo(ownerData.parkingNo || '');
  //     }
  //     if (pickDropDetails) {
  //       const pickDropData = JSON.parse(pickDropDetails);
  //       setPickup(pickDropData.pickup || '');
  //       setPickupLocation(pickDropData.pickupLocation || '');
  //       setDrop(pickDropData.drop || '');
  //       setDropLocation(pickDropData.dropLocation || '');
  //       setDistance(pickDropData.distance || '');
  //     }

  //     if (vehicleDetailsData) {
  //       const vehicleData = JSON.parse(vehicleDetailsData);
  //       setVehicleMake(vehicleData.vehicleMake || '');
  //       setVehicleColor(vehicleData.vehicleColor || '');
  //       setRc(vehicleData.rc || '');
  //     }

  //     if (insuranceDetailsData) {
  //       const insuranceData = JSON.parse(insuranceDetailsData);
  //       setInsuranceCompany(insuranceData.insuranceCompany || '');
  //       setInsuranceStartDate(
  //         insuranceData.insuranceStartDate ? new Date(insuranceData.insuranceStartDate) : new Date()
  //       );
  //       setInsuranceExpireDate(
  //         insuranceData.insuranceExpireDate ? new Date(insuranceData.insuranceExpireDate) : new Date()
  //       );
  //     }

  //     if (membershipDetailsData) {
  //       const membershipData = JSON.parse(membershipDetailsData);
  //       setPlan(membershipData.plan || '');
  //       setMembershipStatus(membershipData.status || '');
  //       setStartDate(membershipData.startDate || '');
  //       setExpireDate(membershipData.expireDate || '');
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving data from AsyncStorage:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Data Retrieval Error',
  //       text2: 'Failed to load saved form data',
  //       position: 'bottom',
  //       visibilityTime: 3000
  //     });
  //   }
  // };

  const retrieveFormData = async () => {
    try {
      const response = await axios.get(`${REACT_NATIVE_SERVER_URL}/api/payment/vehicle/${vehicleId}`);
      const data = response.data;

      // Log the response for debugging purposes
      // console.log('API Response:', data);

      // If data is an array, use the first element
      const vehicleData = Array.isArray(data) ? data[0] : data;

      // Update state with retrieved data
      if (vehicleData.vehicleNumber) setVehicleNumber(vehicleData.vehicleNumber);
      if (vehicleData.ownerDetails) {
        setOwnerName(vehicleData.ownerDetails.ownerName || '');
        setOwnerContact(vehicleData.ownerDetails.ownerContact || '');
        setOwnerEmail(vehicleData.ownerDetails.ownerEmail || '');
        setOwnerAlternateContact(vehicleData.ownerDetails.ownerAlternateContact || '');
        setOwnerAddress(vehicleData.ownerDetails.ownerAddress || '');
        setAadharOrPan(vehicleData.ownerDetails.aadharOrPan || '');
        setParkingNo(vehicleData.ownerDetails.parkingNo || '');
      }
      if (vehicleData.pickDropDetails) {
        setPickup(vehicleData.pickDropDetails.pickup || '');
        setPickupLocation(vehicleData.pickDropDetails.pickupLocation || '');
        setDrop(vehicleData.pickDropDetails.drop || '');
        setDropLocation(vehicleData.pickDropDetails.dropLocation || '');
        setDistance(vehicleData.pickDropDetails.distance || '');
      }
      if (vehicleData.vehicleDetails) {
        setVehicleMake(vehicleData.vehicleDetails.vehicleMake || '');
        setVehicleColor(vehicleData.vehicleDetails.vehicleColor || '');
        setRc(vehicleData.vehicleDetails.rc || '');
      }
      if (vehicleData.insuranceDetails) {
        setInsuranceCompany(vehicleData.insuranceDetails.insuranceCompany || '');
        setInsuranceStartDate(vehicleData.insuranceDetails.insuranceStartDate || new Date());
        setInsuranceExpireDate(vehicleData.insuranceDetails.insuranceExpireDate || new Date());
      }
      if (vehicleData.membershipDetails) {
        setPlan(vehicleData.membershipDetails.plan || '');
        setMembershipStatus(vehicleData.membershipDetails.status || '');
        setStartDate(vehicleData.membershipDetails.startDate || '');
        setExpireDate(vehicleData.membershipDetails.expireDate || '');
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
      Toast.show({
        type: 'error',
        text1: 'Data Retrieval Error',
        text2: 'Failed to load form data from the server',
        position: 'bottom',
        visibilityTime: 3000
      });
    }
  };
  useEffect(() => {
    if (vehicleId) {
      retrieveFormData();
    }
  }, []);



  // Handle dropdown change
  const handlePlanChange = (value) => {
    setServiceType(value);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.updateform}>
            {/* Form fields */}
            <View style={styles.divider}>
              <Text style={styles.label}>Vehicle Number</Text>
              <TextInput
                style={[styles.input, isFocused === 'vehicleNumber' && styles.isFocused]}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
                error={!!formErrors.vehicleNumber}
                onFocus={() => setIsFocused('vehicleNumber')}
                onBlur={() => handleBlur('vehicleNumber')}
                placeholder="Enter Vehicle Number"
                editable={!planActive}
              />
              {formErrors.vehicleNumber && <Text style={styles.errorText}>{formErrors.vehicleNumber}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Owner Name</Text>
              <TextInput
                style={[styles.input, isFocused === 'ownerName' && styles.isFocused]}
                value={ownerName}
                onChangeText={setOwnerName}
                error={!!formErrors.ownerName}
                onFocus={() => setIsFocused('ownerName')}
                onBlur={() => handleBlur('ownerName')}
                placeholder="Enter Owner Name"
              />
              {formErrors.ownerName && <Text style={styles.errorText}>{formErrors.ownerName}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Owner Contact</Text>
              <TextInput
                style={[styles.input, isFocused === 'ownerContact' && styles.isFocused]}
                value={ownerContact}
                onChangeText={setOwnerContact}
                error={!!formErrors.ownerContact}
                onFocus={() => setIsFocused('ownerContact')}
                onBlur={() => handleBlur('ownerContact')}
                placeholder="Enter Owner Contact"
              />
              {formErrors.ownerContact && <Text style={styles.errorText}>{formErrors.ownerContact}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Owner Email</Text>
              <TextInput
                style={[styles.input, isFocused === 'ownerEmail' && styles.isFocused]}
                value={ownerEmail}
                onChangeText={setOwnerEmail}
                error={!!formErrors.ownerEmail}
                onFocus={() => setIsFocused('ownerEmail')}
                onBlur={() => handleBlur('ownerEmail')}
                placeholder="Enter Owner Email"
              />
              {formErrors.ownerEmail && <Text style={styles.errorText}>{formErrors.ownerEmail}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Owner Alternate Contact</Text>
              <TextInput
                style={[styles.input, isFocused === 'ownerAlternateContact' && styles.isFocused]}
                value={ownerAlternateContact}
                onChangeText={setOwnerAlternateContact}
                //error={!!formErrors.ownerAlternateContact}
                onFocus={() => setIsFocused('ownerAlternateContact')}
                //onBlur={() => handleBlur('ownerAlternateContact')}
                placeholder="Enter Owner Alternate Contact"
              />
              {formErrors.ownerAlternateContact && <Text style={styles.errorText}>{formErrors.ownerAlternateContact}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Owner Address</Text>
              <TextInput
                style={[styles.input, isFocused === 'ownerAddress' && styles.isFocused]}
                value={ownerAddress}
                onChangeText={setOwnerAddress}
                error={!!formErrors.ownerAddress}
                onFocus={() => setIsFocused('ownerAddress')}
                onBlur={() => handleBlur('ownerAddress')}
                placeholder="Enter Owner Address"
              />
              {formErrors.ownerAddress && <Text style={styles.errorText}>{formErrors.ownerAddress}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Aadhar/PAN</Text>
              <TextInput
                style={[styles.input, isFocused === 'aadharOrPan' && styles.isFocused]}
                value={aadharOrPan}
                onChangeText={setAadharOrPan}
                //error={!!formErrors.aadharOrPan}
                onFocus={() => setIsFocused('aadharOrPan')}
                //onBlur={() => handleBlur('aadharOrPan')}
                placeholder="Enter Aadhar or PAN"
              />
              {formErrors.aadharOrPan && <Text style={styles.errorText}>{formErrors.aadharOrPan}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Parking Number</Text>
              <TextInput
                style={[styles.input, isFocused === 'parkingNo' && styles.isFocused]}
                value={parkingNo}
                onChangeText={setParkingNo}
                //error={!!formErrors.parkingNo}
                onFocus={() => setIsFocused('parkingNo')}
                //onBlur={() => handleBlur('parkingNo')}
                placeholder="Enter Parking Number"
              />
              {formErrors.parkingNo && <Text style={styles.errorText}>{formErrors.parkingNo}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Vehicle Make</Text>
              <TextInput
                style={[styles.input, isFocused === 'vehicleMake' && styles.isFocused]}
                value={vehicleMake}
                onChangeText={setVehicleMake}
                error={!!formErrors.vehicleMake}
                onFocus={() => setIsFocused('vehicleMake')}
                onBlur={() => handleBlur('vehicleMake')}
                placeholder="Enter Vehicle Make"
              />
              {formErrors.vehicleMake && <Text style={styles.errorText}>{formErrors.vehicleMake}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Vehicle Color</Text>
              <TextInput
                style={[styles.input, isFocused === 'vehicleColor' && styles.isFocused]}
                value={vehicleColor}
                onChangeText={setVehicleColor}
                error={!!formErrors.vehicleColor}
                onFocus={() => setIsFocused('vehicleColor')}
                onBlur={() => handleBlur('vehicleColor')}
                placeholder="Enter Vehicle Color"
              />
              {formErrors.vehicleColor && <Text style={styles.errorText}>{formErrors.vehicleColor}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>RC Number</Text>
              <TextInput
                style={[styles.input, isFocused === 'rc' && styles.isFocused]}
                value={rc}
                onChangeText={setRc}
                error={!!formErrors.rc}
                onFocus={() => setIsFocused('rc')}
                onBlur={() => handleBlur('rc')}
                placeholder="Enter RC Number"
              />
              {formErrors.rc && <Text style={styles.errorText}>{formErrors.rc}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Insurance Company</Text>
              <TextInput
                style={[styles.input, isFocused === 'insuranceCompany' && styles.isFocused]}
                value={insuranceCompany}
                onChangeText={setInsuranceCompany}
                error={!!formErrors.insuranceCompany}
                onFocus={() => setIsFocused('insuranceCompany')}
                onBlur={() => handleBlur('insuranceCompany')}
                placeholder="Enter Insurance Company"
              />
              {formErrors.insuranceCompany && <Text style={styles.errorText}>{formErrors.insuranceCompany}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Insurance Start Date</Text>
              <TouchableWithoutFeedback onPress={() => setShowStartDatePicker(true)}>
                <View style={[styles.input, isFocused === 'insuranceStartDate' && styles.isFocused]}>
                  <Text>{insuranceStartDate}</Text>
                </View>
              </TouchableWithoutFeedback>
              {showStartDatePicker && (
                <DateTimePicker
                  value={insuranceStartDate ? new Date(insuranceStartDate.split('/').reverse().join('-')) : new Date()}
                  mode="date"
                  display="default"
                  timeZoneName={'Asia/Kolkata'} // Set India time zone
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      const formatted = moment(selectedDate).format('DD/MM/YYYY'); // Using moment.js for date formatting
                      setInsuranceStartDate(formatted);
                    }
                  }}
                />
              )}
              {formErrors.insuranceStartDate && <Text style={styles.errorText}>{formErrors.insuranceStartDate}</Text>}
            </View>

            <View style={styles.divider}>
              <Text style={styles.label}>Insurance Expiry Date</Text>
              <TouchableWithoutFeedback onPress={() => setShowExpireDatePicker(true)}>
                <View style={[styles.input, isFocused === 'insuranceExpireDate' && styles.isFocused]}>
                  <Text>{insuranceExpireDate}</Text>
                </View>
              </TouchableWithoutFeedback>
              {showExpireDatePicker && (
                <DateTimePicker
                  value={insuranceExpireDate ? new Date(insuranceExpireDate.split('/').reverse().join('-')) : new Date()}
                  mode="date"
                  display="default"
                  timeZoneName={'Asia/Kolkata'} // Set India time zone
                  onChange={(event, selectedDate) => {
                    setShowExpireDatePicker(false);
                    if (selectedDate) {
                      const formatted = moment(selectedDate).format('DD/MM/YYYY'); // Using moment.js for date formatting
                      setInsuranceExpireDate(formatted);
                    }
                  }}
                />
              )}
              {formErrors.insuranceExpireDate && <Text style={styles.errorText}>{formErrors.insuranceExpireDate}</Text>}
            </View>
            {(serviceId === '673f16c47a12ef01b200c943' || serviceId === '673f16bd7a12ef01b200c941') && (
              <View style={styles.divider}>
                <Text style={styles.label}>Pickup Location</Text>
                <TextInput
                  style={[styles.input, isFocused === 'pickup' && styles.isFocused]}
                  value={pickup}
                  onChangeText={(text) => {
                    setPickup(text);
                    fetchSuggestions(text, setPickupSuggestions);
                  }}
                  onFocus={() => setIsFocused('pickup')}
                  placeholder="Enter Pickup Location"
                />
                <View>
                  {pickupSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.place_id}
                      style={styles.suggestion}
                      onPress={() =>
                        handleSelection(item.place_id, setPickupLocation, setPickup, setPickupSuggestions)
                      }
                    >
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text onPress={getCurrentLocation} style={styles.currentButton}>Use Current Location</Text>
              </View> // ✅ Closing tag added here
            )}
            {serviceId === '673f16c47a12ef01b200c943' && (
              <View style={styles.divider}>
                <Text style={styles.label}>Drop Location</Text>
                <TextInput
                  style={[styles.input, isFocused === 'drop' && styles.isFocused]}
                  value={drop}
                  onChangeText={(text) => {
                    setDrop(text);
                    fetchSuggestions(text, setDropSuggestions);
                  }}
                  onFocus={() => setIsFocused('drop')}
                  placeholder="Enter Drop Location"
                />
                <View>
                  {dropSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.place_id}
                      style={styles.suggestion}
                      onPress={() =>
                        handleSelection(item.place_id, setDropLocation, setDrop, setDropSuggestions)
                      }
                    >
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text onPress={calculateDistance} style={styles.currentButton}>Calculate Distance</Text>

                {distance && <Text style={styles.result}>Distance: {distance}</Text>}
              </View>
            )}




            {(serviceId === '673f16c47a12ef01b200c943' || serviceId === '673f16bd7a12ef01b200c941') && (
              (pickupLocation || dropLocation) && (
                <View style={styles.divider}>


                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: pickupLocation?.lat || 0,
                      longitude: pickupLocation?.lng || 0,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                    {pickupLocation && (
                      <Marker
                        coordinate={{ latitude: pickupLocation.lat, longitude: pickupLocation.lng }}
                        title="Pickup"
                        draggable
                        onDragEnd={(e) => handleMarkerDragEnd(e, setPickupLocation, setPickup)}
                      />
                    )}
                    {dropLocation && (
                      <Marker
                        coordinate={{ latitude: dropLocation.lat, longitude: dropLocation.lng }}
                        title="Drop"
                        draggable
                        onDragEnd={(e) => handleMarkerDragEnd(e, setDropLocation, setDrop)}
                      />
                    )}
                    {route && <Polyline coordinates={decodePolyline(route)} strokeColor="#0000FF" strokeWidth={3} />}
                  </MapView>
                </View>
              )
            )}
            {serviceId === '673f16bd7a12ef01b200c941' && (
              <View style={styles.divider}>
                <Text style={styles.label}>Service Type</Text>
                <RNPickerSelect
                  onValueChange={handlePlanChange}
                  items={[
                    { label: 'Basic Plan', value: 'basic' },
                    { label: 'Premium Plan', value: 'premium' },
                    { label: 'VIP Plan', value: 'vip' },
                  ]}
                  placeholder={{
                    label: 'Select a service...',
                    value: null,
                  }}
                  style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                  }}
                  value={serviceType}
                />
              </View>
            )}
            <Button
              mode="contained"
              onPress={handlePayment}
              loading={isLoading}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.button}
            >
              {planActive ? 'Proceed to Booking' : 'Proceed to Payment'}
            </Button>
          </View>
        </View>
        <Toast />
      </ScrollView>
    </TouchableWithoutFeedback >
  );
};

const decodePolyline = (encoded) => {
  let polyline = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    let deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    let deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    polyline.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return polyline;
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
    paddingLeft: 20,
    height: 45,
    width: '100%'
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
  currentButton: {
    textAlign: 'left',
    marginTop: 5,
    fontWeight: 'bold',
    color: '#09b5e1'
  },
  suggestion: { padding: 10, backgroundColor: "#f9f9f9", borderBottomWidth: 1 },
  result: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
  map: { width: "100%", height: 300, marginTop: 20 },
});

export default VehicleAndOwnerDetails;
