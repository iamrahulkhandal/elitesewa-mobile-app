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
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Error from 'react-native-vector-icons/MaterialIcons';
import {useEffect, useState} from 'react';
// Removed invalid import from reanimated
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

function LoginPage({props}) {
  const navigation = useNavigation();
  const [mobile, setMobile] = useState([]);
  const [mobileVerify, setMobileVerify] = useState(false);
  const [mobileExist, setMobileExist] = useState(false);
  const [otp, setOtp] = useState([]);
  const [otpVerify, setOtpVerify] = useState(false);
  const [userVerify, setUserVerify] = useState([]);

  const [mobileOtpVerify, setmobileOtpVerify] = useState(false);
  const [userData, setUserData] = useState([]);

  const handleMobile = text => {
    // console.log(text);

    setMobileVerify(false);
    if (/[6-9]{1}[0-9]{9}/.test(text)) {
      setMobileVerify(true);
      setMobile(text);
      const userData = {
        mobile: text,
      };
      axios.post(`${API_URL}/login-user`, userData).then(res => {
        if (res.data.status == 'ok') {
          setMobileExist(true);
        } else {
          setMobileExist(false);
        }
      });
    } else {
      setMobile([]);
    }
  };

  function handleSubmit() {
    const userData = {
      mobile: mobile,
    };
    if (mobileVerify) {
      //if (mobileVerify && otpVerify) {
        axios.post(`${API_URL}/login-user`, userData).then(res => {
          if (res.data.status == 'ok') {
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Logged In Successfull',
              visibilityTime: 5000,
            });
            AsyncStorage.setItem('token', res.data.data);
            AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
            AsyncStorage.setItem('userType', res.data.userType);
            navigation.navigate('AuthLoadingScreen');
          } else {
            Toast.show({
              type: 'error',
              text1: "User doesn't exists!!",
              text2: 'Please login your registered mobile number',
              visibilityTime: 5000,
            });
          }
        });
      /*
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error!!',
          text2: 'Please Verify Your Mobile Number ',
          visibilityTime: 1000,
        });
      }
      */
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error!!',
        text2: 'Fill mandatory details',
        visibilityTime: 1000,
      });
    }
  }
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
  }
  useEffect(() => {
    getData();
  }, []);

  const [motp, setmOtp] = useState(null);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const sendOtp = async () => {
    if (mobileExist) {
      try {
        const response = await axios.get(`${API_URL}/send-otp`);
        const {otp} = response.data;
        setmOtp(otp);
        setmobileOtpVerify(true);
        setIsResendDisabled(true);
        setTimer(30);

        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: `Your OTP is: ${otp}`,
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
    } else {
      Toast.show({
        type: 'error',
        text1: "User doesn't exists!!",
        text2: 'Please login your registered mobile number',
        visibilityTime: 5000,
      });
    }
  };

  function handleOtp(e) {
    const otpVar = e.nativeEvent.text;
    setOtp(otpVar);
    setOtpVerify(false);
    if (otpVar == motp) {
      setOtp(otpVar);
      setOtpVerify(true);
    } else {
      setOtp([]);
    }
  }
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
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={styles.logoContainer}>
          {/* <Image
      style={styles.logo}
      source={require('../../assets/signUp.png')}
    /> */}
          <Text style={styles.logoName}>Bigg Buggi</Text>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>Login</Text>
          {/* <View style={styles.action}>
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
              {mobile.length < 1 ? <Feather name="check-circle" color="green" size={20} /> : <Error name="error" color="red" size={20} />}
          </View> */}
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
              onChangeText={handleMobile}
              maxLength={10}
            />
            {mobile.length < 1 ? null : mobileVerify ? (
              isResendDisabled ? (
                <Text>{timer} Sec</Text>
              ) : (
                <Button title="Send OTP" onPress={sendOtp} />
              )
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>

          {mobile.length < 9 ? null : mobileVerify ? null : (
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
                <FontAwesome
                  name="lock"
                  color="#420475"
                  style={styles.smallIcon}
                />
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
              {otp.length < 6 ? null : otpVerify ? null : (
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
          <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
            <View>
              <Text style={styles.textSign}>Log in</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text style={styles.bottomText}>
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
export default LoginPage;
