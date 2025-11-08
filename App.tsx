import React, { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './src/store/store';
import MainNavigator from './src/navigation/MainNavigator';
import LoadingIndicator from './src/components/LoadingIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_NATIVE_SERVER_URL } from '@env';
import LandingPage from './src/components/LandingPage';
import 'react-native-gesture-handler';
import 'react-native-vector-icons/Fonts/Ionicons.ttf';
import Toast from 'react-native-toast-message';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [profileUpdateScreen, setProfileUpdateScreen] = useState('LandingPage');
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState('');
  const [navigationContainer, setNavigationContainer] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        if (storedRole) {
          setRole(storedRole);
        }

        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString || userDataString === 'null' || userDataString === 'undefined') {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        const parsedUserData = JSON.parse(userDataString);
        if (!parsedUserData || typeof parsedUserData !== 'object' || !parsedUserData.role || !parsedUserData.user) {
          throw new Error('Invalid or incomplete user data');
        }

        setUserData(parsedUserData);
        setIsLoggedIn(true);
        const userRole = parsedUserData.role;
        setRole(userRole);
        setProfileUpdateScreen(`${userRole.charAt(0).toUpperCase() + userRole.slice(1)}ProfileUpdate`);

        const response = await axios.get(
          `${REACT_NATIVE_SERVER_URL}/api/${userRole}/profile-status`,
          { params: { mobile: parsedUserData.user } },
        );

        if (response && response.data && typeof response.data.isProfileComplete === 'boolean') {
          setIsProfileComplete(response.data.isProfileComplete);
        } else {
          throw new Error('Invalid response data for profile status');
        }
      } catch (error) {
        console.error('Failed to load auth data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    AsyncStorage.setItem('userRole', selectedRole);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!role) {
    return (
      <ReduxProvider store={store}>
        <PaperProvider>
          <NavigationContainer ref={setNavigationContainer}>
            <LandingPage onRoleSelect={handleRoleSelect} />
          </NavigationContainer>
          <Toast />
        </PaperProvider>
      </ReduxProvider>
    );
  }

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>  
        <PaperProvider>
          <NavigationContainer ref={setNavigationContainer}>
            {!role ? (
              <LandingPage onRoleSelect={handleRoleSelect} />
            ) : (
              <MainNavigator
                role={role}
                startRouteName={
                  isLoggedIn
                    ? isProfileComplete
                      ? 'Main'
                      : profileUpdateScreen
                    : 'RoleBasedLogin'
                }
              />
            )}
          </NavigationContainer>
          <Toast />
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;