const {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
} = require('react-native');
import {useNavigation} from '@react-navigation/native';
import type { AppNavigation } from '../../types/navigation';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Error from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {RadioButton} from 'react-native-paper';
import {API_URL} from '@env';

function RegisterPage({props}) {
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  // const [email, setEmail] = useState('');
  // const [emailVerify, setEmailVerify] = useState(false);
  const [mobile, setMobile] = useState('');
  const [mobileVerify, setMobileVerify] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerify, setOtpVerify] = useState(false);
  const [mobileOtpVerify, setmobileOtpVerify] = useState(false);
  const [userType, setUserType] = useState('');
  const [secretText, setSecretText] = useState('');
  const [verify, setVerify] = useState(false);
  const navigation = useNavigation<AppNavigation>();
  function handelSubmit() {
    const userData = {
      name: name,
      verify:true,
      mobile,
      userType 
    };
    if (nameVerify && mobileVerify) {
      if(nameVerify && mobileVerify && otpVerify){
      if (userType == 'Admin' && secretText != 'plux') {
        return Alert.alert('Invalid Admin');
      } 
      // console.log('API URL 2:', API_URL);
      axios 
        .post(`${API_URL}/register`, userData)
        .then(res => {
          // console.log(res.data);
          if (res.data.status == 'ok') {
            setVerify(false);
            // Alert.alert('Registered Successfull!!');
            Toast.show({
              type: 'success',
              text1: 'Registered Successfull!!',
              text2: 'Please Login',
              visibilityTime: 5000,
            });
            
            navigation.navigate('Login');
          } else { 
            // console.log(JSON.stringify(res.data));
          }
        })
        .catch(e => console.log(e));
      }else{
        Toast.show({
          type: 'error',
          text1: 'Error!!',
          text2: 'Please Verify Your Mobile Number ',
          visibilityTime: 1000,
        });
      } 
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error!!',
        text2: 'Fill mandatory details',
        visibilityTime: 1000,
      });
    }
  }

  function handleName(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerify(false);

    if (nameVar.length > 1) {
      setNameVerify(true);
    }
  }
  // function handleEmail(e) {
  //   const emailVar = e.nativeEvent.text;
  //   setEmail(emailVar);
  //   setEmailVerify(false);
  //   if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
  //     setEmail(emailVar);
  //     setEmailVerify(true);
  //   }
  // }
  function handleMobile(e) {
    const mobileVar = e.nativeEvent.text;
    setMobile(mobileVar);
    setMobileVerify(false);
    if (/[6-9]{1}[0-9]{9}/.test(mobileVar)) {
      setMobile(mobileVar);
      setMobileVerify(true);
    }
  }


  const [motp, setmOtp] = useState(null);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const sendOtp = async () => {
    try {       
      const response = await axios.get(`${API_URL}/send-otp`);
      const { otp } = response.data;
      setmOtp(otp);
      setmobileOtpVerify(true);
      setIsResendDisabled(true);
      setTimer(30);   

      Toast.show({
        type: 'success',
        text1: 'OTP Sent',    
        text2: (`Your OTP is: ${otp}`),
        visibilityTime: 9000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send OTP',
        visibilityTime: 5000,
      });
    }
  };
  // const verifyOtp = () => {
  //   if (inputOtp === motp.toString()) {
  //     Alert.alert('Success', 'OTP verified successfully');
  //   } else {
  //     Alert.alert('Failure', 'Invalid OTP');
  //   }
  // };

  function handleOtp(e) {
    const otpVar = e.nativeEvent.text;
    setOtp(otpVar);
    setOtpVerify(false);
    if (otpVar == motp) {
      setOtp(otpVar);
      setOtpVerify(true);
    }
  };
    // Effect to handle the countdown timer
    useEffect(() => {
      let countdown;
      if (isResendDisabled) {
        countdown = setInterval(() => {
          setTimer(prevTimer => {
            if (prevTimer <= 1) {
              setIsResendDisabled(false); // Enable the resend button
              setmobileOtpVerify(false);
              setOtpVerify(false);
              clearInterval(countdown);
              return 30;

            }
            return prevTimer - 1;
          });
        }, 1000);
      }
      return () => clearInterval(countdown);
    }, [isResendDisabled]);


  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}
      style={{backgroundColor: 'white'}}>
      <View style={{backgroundColor: 'white',flex:1,justifyContent:'center',alignContent:'center'}}>
        <View style={styles.logoContainer}>
          {/* <Image
            style={styles.logo}
            source={require('../../assets/signUp.png')}
          /> */}
          <Text style={styles.logoName}>Bigg Buggi</Text>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>Register!!!</Text>

          <View style={styles.radioButton_div}>
            <Text style={styles.radioButton_title}> Login as</Text>
            <View style={styles.radioButton_inner_div}>
              <Text style={styles.radioButton_text}>Customer</Text>
              <RadioButton
                value="User"
                status={userType == 'User' ? 'checked' : 'unchecked'}
                onPress={() => setUserType('User')}
              />
            </View>
            <View style={styles.radioButton_inner_div}>
              <Text style={styles.radioButton_text}>Executive</Text>
              <RadioButton
                value="Admin"
                status={userType == 'Admin' ? 'checked' : 'unchecked'}
                onPress={() => setUserType('Admin')}
              />
            </View>
          </View>

          {userType == 'Admin' ? (
            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#420475"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Secret Text"
                style={styles.textInput}
                onChange={e => setSecretText(e.nativeEvent.text)}
              />
            </View>
          ) : (
            ''
          )}

          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#420475"
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Name"
              style={styles.textInput}
              onChange={e => handleName(e)}
            />
            {name.length < 1 ? null : nameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>
          {name.length < 1 ? null : nameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Name sholud be more then 1 characters.
            </Text>
          )}
          {/* <View style={styles.action}>
            <Fontisto
              name="email"
              color="#420475"
              size={24}
              style={{marginLeft: 0, paddingRight: 5}}
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              onChange={e => handleEmail(e)}
            />
            {email.length < 1 ? null : emailVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>
          {email.length < 1 ? null : emailVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Enter Proper Email Address
            </Text>
          )} */}
          <View style={styles.action}>
            <FontAwesome
              name="mobile"
              color="#420475"
              size={35}
              style={{paddingRight: 10, marginTop: -7, marginLeft: 5}}
            />
            <TextInput
              placeholder="Mobile"
              style={styles.textInput}
              onChange={e => handleMobile(e)}
              maxLength={10}
            />
            


            {mobile.length < 1 ? null : mobileVerify ? 
              isResendDisabled ? <Text>{timer} Sec</Text>:<Button title="Send OTP" onPress={sendOtp} />:<Error name="error" color="red" size={20} />
            }
          </View>
          
          {mobile.length < 1 ? null : mobileVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Phone number with 6-9 and remaing 9 digit with 0-9
            </Text>
          )}

          {mobileOtpVerify == true ? (
            <View>
            <View style={styles.action}>
              <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
              <TextInput
                placeholder="OTP"
                style={styles.textInput}
                onChange={e => handleOtp(e)}
              />
            {otp.length < 1 ? null : otpVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}


          </View>
          {otp.length < 6 ? null : otpVerify ? null :(
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Please Check 6 number otp
            </Text>
          )}
          </View>

          ) : (
            ''
          )}


        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.inBut} onPress={() => handelSubmit()}>
            <View>
              <Text style={styles.textSign}>Register</Text>
            </View>
          </TouchableOpacity>
          <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}>
<Text style={styles.bottomText}>Already have an account? Sign in</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </ScrollView>
  );
}
export default RegisterPage;