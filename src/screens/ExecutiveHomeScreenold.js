// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAndClear } from '../store/authSlice';
import axios from 'axios';
import { REACT_NATIVE_SERVER_URL } from '@env';
import TopPlacesCarousel from '../components/TopPlacesCarousel';
import Services from '../components/Shared/Services';
import PopularServices from '../components/Shared/PopularServices';
import Testimonial from '../components/Shared/Testimonial';
import { CommonActions } from '@react-navigation/native';
import { TOP_PLACES } from '../data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExecutiveHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, role } = useSelector(state => state.auth);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  // Function to check profile status
  const checkProfileStatus = async () => {
    if (user?.mobile) {
      try {
        const response = await axios.get(
          `${REACT_NATIVE_SERVER_URL}/api/${role}/profile-status`,
          { params: { mobile: user.mobile } }
        );

        // Only update the state if it's different
        if (response.data.isProfileComplete !== isProfileComplete) {
          setIsProfileComplete(response.data.isProfileComplete);

          // Navigate to the profile update screen if the profile is not complete
          if (!response.data.isProfileComplete) {
            const profileUpdateScreen = `${role.charAt(0).toUpperCase() + role.slice(1)}ProfileUpdate`;
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: profileUpdateScreen }],
              })
            );
          }
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Dispatch the logout and clear action to Redux
      await dispatch(logoutAndClear());
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('userData');
      // Navigate the user to the Login screen or Landing page
      navigation.navigate('LandingPage'); // Adjust the route as necessary
      
      // console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Use useEffect to check profile status when user or role changes
  useEffect(() => {
    checkProfileStatus();
  }, [user, role]);

  // Main render
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { id: '1', type: 'TopPlacesCarousel', list: TOP_PLACES },
          { id: '2', type: 'Services' },
          { id: '3', type: 'PopularServices' },
          { id: '4', type: 'Testimonials' },
        ]}
        renderItem={({ item }) => {
          switch (item.type) {
            case 'TopPlacesCarousel':
              return <TopPlacesCarousel list={item.list} />;
            case 'Services':
              return <Services />;
            case 'PopularServices':
              return <PopularServices />;
            case 'Testimonials':
              return <Testimonial />;
            default:
              return (
                <View style={styles.emptyComponent}>
                  <Text>No data available</Text>
                </View>
              ); // Empty component if no type matches
          }
        }}
        keyExtractor={item => item.id}
      />
       
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});

export default ExecutiveHomeScreen;
