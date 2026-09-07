// src/components/RoleBasedLogin.js
import type { AppNavigation } from '../types/navigation';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet,Keyboard,TouchableWithoutFeedback,TextInput,TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { AppRoute } from '../types/navigation';
import {Button, Text, Snackbar} from 'react-native-paper';
import axios from 'axios'; 
import {API_URL} from '@env';
import { useAppDispatch } from '../store/hooks';
import {loginAndPersist, setProfileCompleted, setProfileCompletionStatus} from '../store/authSlice';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RoleBasedLoginProps = { navigation: AppNavigation };

const RoleBasedLogin = ({navigation}: RoleBasedLoginProps) => {
  const route = useRoute<AppRoute>();
  const { role } = route.params ?? {};
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkUserExists = async () => {
      if (mobile.length === 10) {
        // console.log(`${API_URL}/api/${role}/check-existence`);

        const response = await axios.get(
          `${API_URL}/api/${role}/check-existence`,
          {params: {mobile}},
        );
        setUserExists(response.data.exists);
        // console.log('====================================');
        // console.log(response.data);
        // console.log('====================================');
      }
    };
    checkUserExists();
  }, [mobile]);


  const handleSendOtp = async () => {
    if (!mobile) {
      setMessage('Mobile number is required');
      setShowSnackbar(true);
      return;
    }

    try {
      setIsLoading(true);

      const otpresponse = await axios.post(
        `${API_URL}/api/${role}/send-otp`,
        {mobile},
      );
      // console.log('====================================');
      // console.log(otpresponse.data);
      // console.log('====================================');
      setIsOtpSent(true);
      setMessage(otpresponse.data.message);
      setShowSnackbar(true);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error sending OTP');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage('OTP is required');
      setShowSnackbar(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_URL}/api/${role}/verify-otp`,
        {mobile, otp},
      );

      if (response.data.message === 'OTP verified successfully') {
        // console.log('==============OTP verified successfully======================');
        // console.log(response.data);
        // console.log(response.data.userdata._id);
        // console.log('====================================');
        // Save user data to AsyncStorage and dispatch Redux action
        const userData = {userId: response.data.userdata._id, user: mobile, role, isProfileComplete: response.data.userdata.isProfileComplete};
        dispatch(loginAndPersist(userData)); // Use the new action

        // Check if profile is complete
        const profileResponse = await axios.get(
          `${API_URL}/api/${role}/profile-status`,
          {params: {mobile}},
        );
        if (profileResponse.data.isProfileComplete === true) {
          dispatch(setProfileCompletionStatus(true)); // Set profile as completed
          navigation.navigate('Main', { screen: 'Home' });

          
          // Navigate to Dashboard if profile is complete
        } else {
          const profileUpdateScreen = `${
            role.charAt(0).toUpperCase() + role.slice(1)
          }ProfileUpdate`;
          navigation.navigate(profileUpdateScreen); // Navigate to the appropriate profile update screen
        }
      } else {
        setMessage('OTP verification failed...');
        setShowSnackbar(true);
      }
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error verifying OTP');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTextClick = () => {
    setIsOtpSent(!isOtpSent);
  };
  return (
    <>
  {!isOtpSent && (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.mobileauth}>
      <Text style={styles.title}>
        Welcome {role.charAt(0).toUpperCase() + role.slice(1)}
      </Text>
      <Text style={styles.subtitle}> Enter your mobile number to continue </Text>
      <View>
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        onFocus={() => setIsFocused('mobile')}
        onBlur={() => setIsFocused(null)}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        style={[
          styles.input,
          isFocused === 'mobile' && styles.isFocused,
        ]}
        placeholder="Enter your mobile number"
        // mode="outlined"  // Use outlined mode
      />
      </View>
      <Button
        style={styles.button}
        onPress={handleSendOtp}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        loading={isLoading}>
        {isOtpSent ? (userExists ? 'Login' : 'Register') : 'Send OTP'}
      </Button>
      <Text style={styles.slug}>We'll send a verification code to your mobile number</Text>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}>
        {message}
      </Snackbar>
      </View>
    </View>
    </TouchableWithoutFeedback>
    )}

    {isOtpSent && (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.mobileauth}>
      <Text style={styles.title}> Verify OTP
      </Text>
      <Text style={styles.subtitleOtp}> Enter the 6-digit code sent to your mobile</Text>
      <Text style={styles.subtitleMobile}>+91 {mobile.slice(6, 10) ? mobile.slice(6, 10).padStart(10, '●') : '●●●●'}</Text>
      <View>
      <TextInput
          onFocus={() => setIsFocused('otp')}
          onBlur={() => setIsFocused(null)}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          style={[
            styles.input,
            isFocused === 'otp' && styles.isFocused,
          ]}
        />
      </View>
      <TouchableOpacity onPress={handleSendOtp}>
        <Text style={styles.slugResendOTP}>Resend OTP</Text>
      </TouchableOpacity>
      <Button
        style={styles.button}
        onPress={handleVerifyOtp}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        loading={isLoading}>
        {isOtpSent ? (userExists ? 'Verify & Continue' : 'Register') : 'Send OTP'}
      </Button>
      <TouchableOpacity onPress={handleTextClick}>
        <Text style={styles.slugChange}>Change mobile number</Text>
      </TouchableOpacity>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}>
        {message}
      </Snackbar>
      </View>
    </View>
    </TouchableWithoutFeedback>
 )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  mobileauth:{
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
  slugChange:{
    fontSize: 12,
    marginTop: 10,
    fontWeight:'900',
    color:'#09b5e1',
    textAlign: 'center',
  },
  slugResendOTP:{
    fontSize: 12,
    marginTop: 10,
    fontWeight:'900',
    color:'#09b5e1',
    textAlign: 'right',
  },
  subtitleOtp:{
    fontSize: 14,
    color:'#a3a3a3',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleMobile:{
    fontSize: 14,
    color:'#a3a3a3',
    fontWeight:'800',
    marginBottom: 10,
    textAlign: 'center',
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
      color:'#09b5e1',
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
    }
});

export default RoleBasedLogin;
