// src/components/Dashboard.js
import type { AppNavigation } from '../types/navigation';
import React, {useEffect, useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {CommonActions} from '@react-navigation/native';
import {logoutAndClear} from '../store/authSlice'; // Updated import
import axios from 'axios';
import {API_URL} from '@env';

type DashboardProps = { navigation: AppNavigation };

const Dashboard = ({navigation}: DashboardProps) => {
  const dispatch = useAppDispatch();
  const {user, role} = useAppSelector(state => state.auth);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${API_URL}/api/${role}/profile-status`,
            {params: {mobile: user}},
          );
          setIsProfileComplete(response.data.isProfileComplete);

          if (!response.data.isProfileComplete) {
            const profileUpdateScreen = `${
              (role ?? '').charAt(0).toUpperCase() + (role ?? '').slice(1)
            }ProfileUpdate`;
           // navigation.navigate(profileUpdateScreen);
            // Resetting the stack and navigating to HomeScreen
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: profileUpdateScreen}],
              }),
            );
          }
        } catch (error) {
          console.error('Error checking profile status:', error);
        }
      }
    };

    checkProfileStatus();
  }, [user, role, navigation]);

  const handleLogout = () => {
    dispatch(logoutAndClear()); // Updated logout action
    navigation.navigate('LandingPage');
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      {/* Optionally, display additional dashboard content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;
