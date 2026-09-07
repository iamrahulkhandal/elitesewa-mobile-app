import "react-native-get-random-values";
import type { Vehicle } from '../../types/models';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FlatList,StyleSheet, Alert, View, Text, Keyboard, ScrollView,TouchableWithoutFeedback} from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { Snackbar } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import VehicleDetails from './VehicleDetails';
import SavedDetailsModal from './SavedDetailsModal';
import OwnerDetails from './OwnerDetails';
import Schedule from './Schedule';
import PriceBreakout from './PriceBreakout';
import SubmitButton from '../FormComponents/SubmitButton';
import LocationMap from '../FormComponents/LocationMap';
import Dropdown from '../FormComponents/Dropdown';
import RouteMap from '../FormComponents/RouteMap'; 
import { API_URL, RAZORPAY_KEY_ID } from "@env";
import { useNavigation } from '@react-navigation/native';
import type { AppNavigation } from '../../types/navigation';
import { fileUrl } from '../../utils/fileUrl';
import {
  assertApiSuccess,
  getErrorMessage,
  isPaymentCancelled,
} from '../../utils/apiError';
 
const Index = (props: any) => {
  const { route: vehicleRoute } = props;
  const navigation = useNavigation<AppNavigation>();
  const { serviceId, planPrice, planId, planDuration, vehicleId, planActive, planActiveDate, billingType } = vehicleRoute.params;
  const isMonthlyPlan = billingType === 'monthly';
    const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState({ latitude: 28.6132, longitude: 77.2092, address:null});

  const [vehicleData, setVehicleData] = useState({
    number: '',
    model: '',
    manufacturer: '',
    year: '',
    registrationDate: '',
    registrationTime: '',
    fuelType: '',
  });

  // Membership state can be used for display if needed.
  const [membershipDetails, setMembershipDetails] = useState({
    plan: '',
    status: '',
    startDate: '',
    expireDate: '',
  }); 

  const [ownerData, setOwnerData] = useState({
    ownerName: '',
    ownerContact: '',
    ownerAlternateContact: '',
    ownerEmail: '',
    ownerAddress: '',
    aadharOrPan: '',
    parkingNo: '',
  });
  const [membershipStatus] = useState('active');

  // Default the schedule to just past the earliest allowed slot: the 30-minute
  // minimum plus a 3-minute buffer, so the default still passes validation
  // after the 2-3 minutes a user typically spends filling the form.
  const defaultScheduleTime = new Date(Date.now() + 33 * 60 * 1000);
  const [insuranceData, setInsuranceData] = useState({
    policyNumber: '',
    providerName: '',
    startDate: defaultScheduleTime,
    startTime: defaultScheduleTime,
    expiryDate: defaultScheduleTime,
    expiryTime: defaultScheduleTime,
  });

  const userId = useAppSelector((state) => state.auth.userId);
  const userMobile = useAppSelector((state) => state.auth.user); // stored as the customer's mobile
  const [serviceData, setServiceData] = useState({ serviceType: '' });

  const [routeData, setRouteData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // setIsLoading only disables the button on the next render, so a fast double
  // tap can still get through. A ref flips synchronously and closes that gap.
  const isSubmittingRef = useRef(false);
  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const services = ['On Site Repairs', 'Battery Jumpstart', 'Fuel Delivery','Towing Service'];
  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment/vehicle/${vehicleId}`);
      if (response.data && response.data.length > 0) {
        // Extract other data (unchanged)
        const vehicleDetailsData = response.data[0].vehicleDetails;
        setVehicleData({
          number: vehicleDetailsData.number || '',
          model: vehicleDetailsData.model || '',
          manufacturer: vehicleDetailsData.manufacturer || '',
          year: vehicleDetailsData.year || '',
          registrationDate: vehicleDetailsData.registrationDate || '',
          registrationTime: vehicleDetailsData.registrationTime || '',
          fuelType: vehicleDetailsData.fuelType || '',
        });

        const ownerDetailsData = response.data[0].ownerDetails;
        setOwnerData({
          ownerName: ownerDetailsData.ownerName || '',
          ownerContact: ownerDetailsData.ownerContact || '',
          ownerAlternateContact: ownerDetailsData.ownerAlternateContact || '',
          ownerEmail: ownerDetailsData.ownerEmail || '',
          ownerAddress: ownerDetailsData.ownerAddress || '',
          aadharOrPan: ownerDetailsData.aadharOrPan || '',
          parkingNo: ownerDetailsData.parkingNo || '',
        });

        const insuranceDetailsData = response.data[0].insuranceDetails;
        setInsuranceData({
          policyNumber: insuranceDetailsData.policyNumber || '',
          providerName: insuranceDetailsData.providerName || '',
          startDate: insuranceDetailsData.startDate || new Date(),
          startTime: insuranceDetailsData.startTime || new Date(),
          expiryDate: insuranceDetailsData.expiryDate || new Date(),
          expiryTime: insuranceDetailsData.expiryTime || new Date(),
        });

        const serviceDetailsData = response.data[0].serviceDetails;
        setServiceData({
          serviceType: serviceDetailsData.serviceType || '',
        });

        const locationData = response.data[0].location;
        if (locationData) {
        setLocation({
          latitude: locationData.latitude, 
          longitude: locationData.longitude,
          address: locationData.address,
        });
      }
        // NEW: Extract route data if available
        const routeDetails = response.data[0].route;
        if (routeDetails) {
          setRouteData({
            origin: {
              latitude: routeDetails.origin.latitude,
              longitude: routeDetails.origin.longitude,
              address: routeDetails.origin.address,
            },
            destination: {
              latitude: routeDetails.destination.latitude,
              longitude: routeDetails.destination.longitude,
              address: routeDetails.destination.address,
            },
            distance: routeDetails.distance,
            duration: routeDetails.duration,
          });
        }

      } else {
        console.log('No data found for vehicle ID:', vehicleId);
      }
    } catch (error) {
      console.error('Error fetching all data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to fetch vehicle data',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  // Prefill Owner + Vehicle Number from the customer's saved profile so they
  // don't re-type details they already gave at account creation. Used for new
  // bookings (no prior vehicle record to pull from).
  const prefillFromProfile = async () => {
    if (!userMobile) return;
    try {
      const response = await axios.get(`${API_URL}/api/customer/profile`, {
        params: { mobile: userMobile },
      });
      const customer = response.data;
      if (!customer) return;

      const addressParts = [
        customer.streetAddress,
        customer.apartment,
        customer.locality,
        customer.city,
        customer.district,
        customer.state,
        customer.pincode,
      ].filter(Boolean);

      setOwnerData((prev) => ({
        ...prev,
        ownerName: prev.ownerName || customer.name || '',
        ownerContact: prev.ownerContact || customer.mobile || '',
        ownerEmail: prev.ownerEmail || customer.email || '',
        ownerAddress: prev.ownerAddress || addressParts.join(', '),
      }));

      if (customer.vehicleNumber) {
        setVehicleData((prev) => ({ ...prev, number: prev.number || customer.vehicleNumber }));
      }
    } catch (error: any) {
      // Prefill is a convenience only — ignore failures silently.
      console.log('Profile prefill skipped:', error.message);
    }
  };

  // Vehicles from the customer's past successful bookings. When any exist, a
  // modal offers to reuse those details instead of retyping everything.
  const fetchSavedVehicles = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API_URL}/api/payment/saved-vehicles/${userId}`);
      const vehicles = response.data?.vehicles || [];
      if (vehicles.length > 0) {
        setSavedVehicles(vehicles);
        setShowSavedModal(true);
      }
    } catch (error: any) {
      // Reuse is a convenience only — ignore failures silently.
      console.log('Saved vehicles skipped:', error.message);
    }
  };

  const applySavedVehicle = (vehicle: any) => {
    const vehicleDetails = vehicle.vehicleDetails || {};
    const ownerDetails = vehicle.ownerDetails || {};
    setVehicleData({
      number: vehicleDetails.number || '',
      model: vehicleDetails.model || '',
      manufacturer: vehicleDetails.manufacturer || '',
      year: vehicleDetails.year || '',
      registrationDate: vehicleDetails.registrationDate || '',
      registrationTime: vehicleDetails.registrationTime || '',
      fuelType: vehicleDetails.fuelType || '',
    });
    setOwnerData({
      ownerName: ownerDetails.ownerName || '',
      ownerContact: ownerDetails.ownerContact || '',
      ownerAlternateContact: ownerDetails.ownerAlternateContact || '',
      ownerEmail: ownerDetails.ownerEmail || '',
      ownerAddress: ownerDetails.ownerAddress || '',
      aadharOrPan: ownerDetails.aadharOrPan || '',
      parkingNo: ownerDetails.parkingNo || '',
    });
    if (vehicle.location?.latitude && vehicle.location?.longitude) {
      setLocation({
        latitude: vehicle.location.latitude,
        longitude: vehicle.location.longitude,
        address: vehicle.location.address || null,
      });
    }
    setShowSavedModal(false);
  };

  useEffect(() => {
    if (vehicleId) {
      // Existing vehicle: prefill from its saved record.
      fetchAllData();
    } else {
      // New booking: prefill owner + vehicle number from the customer profile,
      // and offer full details from past bookings when available.
      prefillFromProfile();
      fetchSavedVehicles();
    }
  }, []);
  // Validation helper
  const validateField = useCallback((value: any, message: string) => {
    if (!value || value.toString().trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: message,
        position: 'bottom',
        visibilityTime: 3000,
      });
      return false;
    }
    return true;
  }, []);

  // Format helpers. Standard plates like "RJ14 CJ 5000" (spaces/dashes
  // optional) plus the newer BH series like "22 BH 1234 AA".
  const isValidVehicleNumber = (value: any) => {
    const compact = value.trim().replace(/[\s-]/g, '').toUpperCase();
    return /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{1,4}$/.test(compact) || /^\d{2}BH\d{4}[A-Z]{1,2}$/.test(compact);
  };
  const isValidYear = (value: any) => {
    if (!/^\d{4}$/.test(value.trim())) return false;
    const year = Number(value.trim());
    return year >= 1980 && year <= new Date().getFullYear();
  };
  // Manufacturers are names; models may carry digits but a model with no letter
  // (or a long digit run) is typed-in noise. Both mirror the server's rules.
  const isValidManufacturer = (value: any) => /^[A-Za-z][A-Za-z .&'-]{1,29}$/.test(value.trim());
  const isValidVehicleModel = (value: any) => {
    const raw = value.trim();
    if (raw.length < 2 || raw.length > 40) return false;
    if (!/^[A-Za-z0-9][A-Za-z0-9 .\/+-]*$/.test(raw)) return false;
    return /[A-Za-z]/.test(raw) && !/\d{5}/.test(raw);
  };
  const isValidMobile = (value: any) => /^[6-9]\d{9}$/.test(value.trim());
  const isValidEmail = (value: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validateInputs = () => {
    // Vehicle: only number and model are required for a car wash booking.
    if (
      !validateField(vehicleData.number, 'Vehicle number is required') ||
      !validateField(vehicleData.model, 'Vehicle model is required')
    )
      return false;

    if (!isValidVehicleNumber(vehicleData.number)) {
      return validateField('', 'Vehicle number looks invalid (e.g. RJ14 CJ 5000)');
    }
    if (!isValidVehicleModel(vehicleData.model)) {
      return validateField('', 'Vehicle model looks invalid (e.g. Swift VXI)');
    }
    if (vehicleData.manufacturer?.trim() && !isValidManufacturer(vehicleData.manufacturer)) {
      return validateField('', 'Manufacturer looks invalid (e.g. Maruti Suzuki)');
    }
    if (vehicleData.year && !isValidYear(vehicleData.year)) {
      return validateField('', `Year must be between 1980 and ${new Date().getFullYear()}`);
    }

    // Registration date/time must not be in the future (also guards prefilled data).
    const now = new Date();
    const regDate = vehicleData.registrationDate ? new Date(vehicleData.registrationDate) : null;
    const regTime = vehicleData.registrationTime ? new Date(vehicleData.registrationTime) : null;
    const regDateInFuture =
      regDate && !isNaN(regDate.getTime()) && regDate.toDateString() !== now.toDateString() && regDate > now;
    const regTimeInFuture =
      regTime && !isNaN(regTime.getTime()) &&
      (!regDate || isNaN(regDate.getTime()) || regDate.toDateString() === now.toDateString()) &&
      (regTime.getHours() > now.getHours() ||
        (regTime.getHours() === now.getHours() && regTime.getMinutes() > now.getMinutes()));
    if (regDateInFuture || regTimeInFuture) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Registration date/time cannot be in the future',
        position: 'bottom',
        visibilityTime: 3000,
      });
      return false;
    }

    // Owner: Aadhaar/PAN and parking number are optional now.
    if (
      !validateField(ownerData.ownerName, 'Owner name is required') ||
      !validateField(ownerData.ownerContact, 'Owner contact is required') ||
      !validateField(ownerData.ownerEmail, 'Owner email is required') ||
      !validateField(ownerData.ownerAddress, 'Owner address is required')
    )
      return false;

    if (!isValidMobile(ownerData.ownerContact)) {
      return validateField('', 'Owner contact must be a valid 10-digit mobile number');
    }
    if (ownerData.ownerAlternateContact?.trim() && !isValidMobile(ownerData.ownerAlternateContact)) {
      return validateField('', 'Alternate contact must be a valid 10-digit mobile number');
    }
    if (!isValidEmail(ownerData.ownerEmail)) {
      return validateField('', 'Owner email looks invalid');
    }

    if (serviceId === '673f16bd7a12ef01b200c941') {
      if (!validateField(serviceData.serviceType, 'Service type is required')) return false;
    }

    // Scheduled services need at least 30 minutes of lead time. Merge the
    // date field with the time-of-day field before comparing.
    const combineDateTime = (dateValue: any, timeValue: any) => {
      const date = dateValue ? new Date(dateValue) : null;
      const time = timeValue ? new Date(timeValue) : null;
      if (!date || isNaN(date.getTime()) || !time || isNaN(time.getTime())) return null;
      const combined = new Date(date);
      combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
      return combined;
    };
    // Zero the seconds so the comparison works in whole minutes, matching the
    // minute-level precision of the pickers.
    const minSchedule = new Date(Date.now() + 30 * 60 * 1000);
    minSchedule.setSeconds(0, 0);
    const scheduleChecks = [
      ...(serviceId !== '673f16bd7a12ef01b200c941'
        ? [{ date: insuranceData.startDate, time: insuranceData.startTime, label: 'Schedule' }]
        : []),
      ...(serviceId === '673f16c47a12ef01b200c943'
        ? [{ date: insuranceData.expiryDate, time: insuranceData.expiryTime, label: 'Drop' }]
        : []),
    ];
    for (const check of scheduleChecks) {
      const scheduled = combineDateTime(check.date, check.time);
      if (scheduled && scheduled < minSchedule) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: `${check.label} time must be at least 30 minutes from now`,
          position: 'bottom',
          visibilityTime: 3000,
        });
        return false;
      }
    }

    if (
      !validateField(location.latitude, 'Location latitude is required') ||
      !validateField(location.longitude, 'Location longitude is required')
    )
      return false;

    if (serviceId === '673f16c47a12ef01b200c943' && routeData === null) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a route (From and To addresses) using RouteMap',  
        position: 'bottom',
        visibilityTime: 3000,
      });
      return false;
    }
    return true;
  };

  const handlePlanChange = (value: any) => {
    setServiceData({ serviceType: value });
  };

  const handleVehicleChange = (field: string, value: any) => {
    setVehicleData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleOwnerChange = (field: string, value: any) => {
    setOwnerData((prevData) => ({ ...prevData, [field]: value }));
  };
  const handleInsuranceChange = (field: string, value: any) => {
    setInsuranceData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleLocationChange = (region: any) => {
    setLocation(region);
  };

  const handleRouteSelect = useCallback((data: any) => {
    setRouteData(data);
  }, []);

  // Use cloned moment to avoid mutating the original date.
  const calculateMembershipDates = (duration: string) => {
    const start = moment();
    const mStartDate = start.format('DD/MM/YYYY');
    const mExpireDate = start.clone().add(duration, 'months').format('DD/MM/YYYY');
    return { mStartDate, mExpireDate };
  };

  // Razorpay's checkout page is served over HTTPS and blocks mixed content, so
  // an http logo (the local dev API) is dropped rather than sent and rejected.
  const checkoutLogo = () => {
    const url = fileUrl(null);
    return typeof url === 'string' && url.startsWith('https://') ? { image: url } : {};
  };

  const handlePayment = async () => {
    if (isSubmittingRef.current) return;
    if (!validateInputs()) return;
    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      const { mStartDate, mExpireDate } = calculateMembershipDates(planDuration);
      // Create a local membership object
      const membership = {
        plan: planId,
        status: membershipStatus,
        startDate: mStartDate,
        expireDate: mExpireDate,
      };

      // Optionally update state if you need to display membership details
      setMembershipDetails(membership);

      const paymentRequestResponse = await axios.post(
        `${API_URL}/api/payment/save-request`,
        {
          vehicleData,
          membershipDetails: membership,
          ownerData,
          insuranceData,
          serviceType: serviceData.serviceType,
          location,
          route: routeData,
          userId,
          serviceId,
          planId,
          amount: planActive ? planPrice : planPrice,
          currency: 'INR',
          status: 'PENDING',
        }
      );

      assertApiSuccess(paymentRequestResponse, 'Could not save your booking details.');
      console.log('paymentRequest', paymentRequestResponse.data);
      const paymentRequestId = paymentRequestResponse.data.paymentRequestId;
      const fetchedVehicleId = paymentRequestResponse.data.vehicleId;

      if (isMonthlyPlan && !planActive) {
        // --- Monthly plan: Razorpay Autopay subscription (mandate + month 1). ---
        const subResponse = await axios.post(`${API_URL}/api/subscription/create`, {
          userId,
          serviceId,
          planId,
          vehicleId: fetchedVehicleId,
          paymentRequestId,
        });
        assertApiSuccess(subResponse, 'Unable to start the subscription.');
        if (!subResponse.data?.subscriptionId) {
          throw new Error('The subscription could not be created. Please try again.');
        }

        const subOptions = {
          description: `Monthly subscription for plan ${membership.plan}`,
          ...checkoutLogo(),
          currency: 'INR',
          key: subResponse.data.keyId || RAZORPAY_KEY_ID,
          subscription_id: subResponse.data.subscriptionId,
          name: 'EliteSewa',
          prefill: {
            email: ownerData.ownerEmail,
            contact: ownerData.ownerContact,
            name: ownerData.ownerName,
          },
          notes: { serviceId, planId },
          theme: { color: '#F37254' },
        };

        const paymentData = await RazorpayCheckout.open(subOptions);

        const verifyResponse = await axios.post(`${API_URL}/api/subscription/verify`, {
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_subscription_id: paymentData.razorpay_subscription_id || subResponse.data.subscriptionId,
          razorpay_signature: paymentData.razorpay_signature,
        });
        assertApiSuccess(verifyResponse, 'We could not confirm your subscription.');

        navigation.navigate('PaymentSuccess', {
          paymentId: verifyResponse.data.paymentResponse?.paymentId,
          vehicleNumber: vehicleData.number,
          planActive,
          planPrice,
        });
      } else if (!planActive) {
        // --- New paid booking: create a server-side order, pay, then verify. ---
        // 1) Create the Razorpay order on the server so the payment can be
        //    cryptographically verified afterwards (never trust the client).
        const orderResponse = await axios.post(`${API_URL}/api/payment/create-order`, {
          amount: planPrice,
          currency: 'INR',
          notes: { serviceId, planId, userId },
        });

        assertApiSuccess(orderResponse, 'Unable to start the payment.');
        if (!orderResponse.data?.orderId) {
          throw new Error('The payment order could not be created. Please try again.');
        }

        const { orderId, keyId } = orderResponse.data;

        // 2) Open Razorpay Checkout bound to that order.
        const options = {
          description: `Payment for plan ${membership.plan}`,
          ...checkoutLogo(),
          currency: 'INR',
          key: keyId || RAZORPAY_KEY_ID,
          order_id: orderId,
          amount: planPrice * 100,
          name: 'EliteSewa',
          prefill: {
            email: ownerData.ownerEmail,
            contact: ownerData.ownerContact,
            name: ownerData.ownerName,
          },
          notes: { serviceId, planId },
          theme: { color: '#F37254' },
        };

        // RazorpayCheckout.open rejects on user cancel / failure — let it bubble
        // to the outer catch so we never record an unpaid booking as success.
        const paymentData = await RazorpayCheckout.open(options);

        // 3) Verify the signature server-side. The PaymentResponse is only
        //    persisted (status SUCCESS) when verification passes.
        const verifyResponse = await axios.post(`${API_URL}/api/payment/verify`, {
          razorpay_order_id: paymentData.razorpay_order_id || orderId,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          userId,
          serviceId,
          planId,
          amount: planPrice,
          currency: 'INR',
          paymentRequestId,
          planActiveDate: new Date().toISOString(),
          vehicleId: fetchedVehicleId,
        });

        assertApiSuccess(verifyResponse, 'We could not confirm your payment.');

        navigation.navigate('PaymentSuccess', {
          paymentId: verifyResponse.data.paymentResponse?.paymentId,
          vehicleNumber: vehicleData.number,
          planActive,
          planPrice,
        });
      } else {
        // --- Re-service request on an already-paid active plan: no new charge. ---
        const paymentResponse = await axios.post(`${API_URL}/api/payment/save-response`, {
          userName: ownerData.ownerName,
          userId,
          serviceId,
          planId,
          paymentId: `PLAN-${paymentRequestId}`,
          amount: planPrice,
          currency: 'INR',
          status: 'SUCCESS',
          startDate: mStartDate,
          expireDate: mExpireDate,
          paymentRequestId,
          planActiveDate: new Date().toISOString(),
          vehicleId: fetchedVehicleId,
        });

        navigation.navigate('PaymentSuccess', {
          paymentId: paymentResponse.data?.paymentResponse?.paymentId,
          vehicleNumber: vehicleData.number,
          planActive,
          planPrice,
        });
      }
    } catch (error) {
      // Backing out of the Razorpay sheet is a deliberate choice, not a
      // failure — leave the user on checkout with their details intact.
      if (isPaymentCancelled(error)) {
        Toast.show({
          type: 'info',
          text1: 'Payment cancelled',
          text2: 'Your booking has not been placed.',
          position: 'bottom',
          visibilityTime: 3000,
        });
        return;
      }

      const reason = getErrorMessage(error, 'An error occurred during payment.');
      console.error('Checkout failed:', reason, error);
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: reason,
        position: 'bottom',
        visibilityTime: 4000,
      });
      navigation.navigate('PaymentFailed', { planPrice, reason });
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };
 
  const handleSubmit = () => {
    handlePayment();
  };

  // useEffect(() => {
  //   if (vehicleId) {
  //     const fetchAllData = async () => {
  //       try {
  //         const response = await axios.get(`${API_URL}/api/payment/vehicle/${vehicleId}`);
  //         if (response.data && response.data.length > 0) {
  //           // Extract other data (unchanged)
  //           const vehicleDetailsData = response.data[0].vehicleDetails;
  //           setVehicleData({
  //             number: vehicleDetailsData.number || '',
  //             model: vehicleDetailsData.model || '',
  //             manufacturer: vehicleDetailsData.manufacturer || '',
  //             year: vehicleDetailsData.year || '',
  //             registrationDate: vehicleDetailsData.registrationDate || '',
  //             fuelType: vehicleDetailsData.fuelType || '',
  //           });
  
  //           const ownerDetailsData = response.data[0].ownerDetails;
  //           setOwnerData({
  //             ownerName: ownerDetailsData.ownerName || '',
  //             ownerContact: ownerDetailsData.ownerContact || '',
  //             ownerAlternateContact: ownerDetailsData.ownerAlternateContact || '',
  //             ownerEmail: ownerDetailsData.ownerEmail || '',
  //             ownerAddress: ownerDetailsData.ownerAddress || '',
  //             aadharOrPan: ownerDetailsData.aadharOrPan || '',
  //             parkingNo: ownerDetailsData.parkingNo || '',
  //           });
  
  //           const insuranceDetailsData = response.data[0].insuranceDetails;
  //           setInsuranceData({
  //             policyNumber: insuranceDetailsData.policyNumber || '',
  //             providerName: insuranceDetailsData.providerName || '',
  //             startDate: insuranceDetailsData.startDate || new Date(),
  //             expiryDate: insuranceDetailsData.expiryDate || new Date(),
  //           });
  
  //           const serviceDetailsData = response.data[0].serviceDetails;
  //           setServiceData({
  //             serviceType: serviceDetailsData.serviceType || '',
  //           });
  
  //           const locationData = response.data[0].location;
  //           if (locationData) {
  //           setLocation({
  //             latitude: locationData.latitude, 
  //             longitude: locationData.longitude,
  //             address: locationData.address,
  //           });
  //         }
  //           // NEW: Extract route data if available
  //           const routeDetails = response.data[0].route;
  //           if (routeDetails) {
  //             setRouteData({
  //               origin: {
  //                 latitude: routeDetails.origin.latitude,
  //                 longitude: routeDetails.origin.longitude,
  //                 address: routeDetails.origin.address,
  //               },
  //               destination: {
  //                 latitude: routeDetails.destination.latitude,
  //                 longitude: routeDetails.destination.longitude,
  //                 address: routeDetails.destination.address,
  //               },
  //               distance: routeDetails.distance,
  //               duration: routeDetails.duration,
  //             });
  //           }
  
  //         } else {
  //           console.log('No data found for vehicle ID:', vehicleId);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching all data:', error);
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Error',
  //           text2: 'Unable to fetch vehicle data',
  //           position: 'bottom',
  //           visibilityTime: 3000,
  //         });
  //       }
  //     }; 
   
  //     fetchAllData();
  //   }
  // }, [vehicleId]);

  
  const formComponents = [
    { key: 'vehicleDetails', component: <VehicleDetails vehicleData={vehicleData} onChange={handleVehicleChange} active={planActive}/> },
    { key: 'ownerDetails', component: <OwnerDetails ownerData={ownerData} onChange={handleOwnerChange} /> },
    { key: 'schedule', component: <Schedule insuranceData={insuranceData} onChange={handleInsuranceChange} serviceid={serviceId} /> },
    ...(serviceId === '673f16bd7a12ef01b200c941'
      ? [{ key: 'locationMap', component: <LocationMap label="Choose Location" onLocationSelect={handleLocationChange} locationData={location} /> }]
      : []),
    ...(serviceId === '673f16c47a12ef01b200c943'
      ? [{ key: 'routeMap', component: <RouteMap onRouteSelect={handleRouteSelect} routeData={routeData}  /> }]
      : []),
    ...(serviceId === '673f16bd7a12ef01b200c941'
      ? [{ key: 'dropdown', component: <Dropdown label="Select Service Type" selectedValue={serviceData.serviceType} onValueChange={handlePlanChange} options={services}  /> }]
      : []),
    ...(isMonthlyPlan && !planActive
      ? [{
          key: 'autopayNote',
          component: (
            <Text style={styles.autopayNote}>
              This plan auto-renews every month for 12 months via Razorpay Autopay.
              You can cancel anytime from Active Plans.
            </Text>
          ),
        }]
      : []),
    {
      key: 'submitButton',
      component: <SubmitButton onSubmit={handleSubmit} disabled={isLoading} loading={isLoading} />,
    },
    ...(serviceId === '673f16c47a12ef01b200c943'
      ? [{ key: 'priceBreakout', component: <PriceBreakout serviceid={serviceId} locationData={routeData}  planPrice={planPrice} /> }]
      : []),
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.updateform}>
            <FlatList
              data={formComponents}
              renderItem={({ item }) => <View>{item.component}</View>}
              keyExtractor={(item) => item.key}
            />
          </View>

          <SavedDetailsModal
            visible={showSavedModal}
            vehicles={savedVehicles}
            onSelect={applySavedVehicle}
            onNew={() => setShowSavedModal(false)}
          />

          {/* Snackbar to show messages */}
          <Snackbar
            visible={showSnackbar}
            onDismiss={() => setShowSnackbar(false)}
            duration={Snackbar.DURATION_SHORT}
          >
            {message}
          </Snackbar>
      </View>
    </TouchableWithoutFeedback >
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 10 },
  autopayNote: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
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
export default Index;
