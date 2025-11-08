import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { REACT_NATIVE_SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HomeDrawerContent = ({ navigation, role, handleLogout }) => {
  const [activeRoute, setActiveRoute] = useState('Home'); // Set default active route
  const [userData, setUserData] = useState({});
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');

      if (!userDataString) {
        throw new Error('No user data found');
      }

      const parsedUserData = JSON.parse(userDataString);
      const { role, user } = parsedUserData;

      if (!role || !user) {
        throw new Error('Invalid or incomplete user data');
      }
      setUserRole(role);

      const response = await axios.get(`${REACT_NATIVE_SERVER_URL}/api/${role}/profile`, {
        params: { mobile: user }, // Use the appropriate identifier
      });

      setUserData(response.data);
    } catch (error) {
      showSnackbarMessage('Error fetching user data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  // Function to handle navigation and set active route
  const handleNavigation = (route) => {
    setActiveRoute(route);
    navigation.navigate(route);
  };
  const handleTabNavigation = (route) => {
    setActiveRoute(route);
    //navigation.navigate('Main', { screen: route });
    navigation.navigate('HomeTabs', { screen: route });

  };

  

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/male.png')} // Replace with actual profile image
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileEmail}>{userData.email}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {/* Common Menu Items */}
        {/* <TouchableOpacity
          style={[styles.menuItem, activeRoute === 'Home' ? styles.activeMenuItem : null]} 
          onPress={() => handleNavigation('Home')} 
          activeOpacity={0.7}
        >
          <Icon name="home-outline" size={22} color={activeRoute === 'Home' ? '#fff' : '#09b5e1'} />
          <Text style={[styles.menuItemText, activeRoute === 'Home' ? styles.activeMenuItemText : null]}>Home</Text>
        </TouchableOpacity> */}

        {/* Role-based Menu Items */}
        {role === 'customer' ? (
          <>
            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'Home' ? styles.activeMenuItem : null]}
              onPress={() => handleTabNavigation('Home')}
              activeOpacity={0.7}
            >
              <Icon name="home-outline" size={22} color={activeRoute === 'Home' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'Home' ? styles.activeMenuItemText : null]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'Profile' ? styles.activeMenuItem : null]}
              onPress={() => handleTabNavigation('Profile')}
              activeOpacity={0.7}
            >
              <Icon name="person-outline" size={22} color={activeRoute === 'Profile' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'Profile' ? styles.activeMenuItemText : null]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'ServicesList' ? styles.activeMenuItem : null]}
              onPress={() => handleNavigation('ServicesListing')}
              activeOpacity={0.7}
            >
              <Icon name="person-outline" size={22} color={activeRoute === 'ServicesList' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'ServicesList' ? styles.activeMenuItemText : null]}>Services</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'Booking' ? styles.activeMenuItem : null]}
              onPress={() => handleTabNavigation('Booking')}
              activeOpacity={0.7}
            >
              <Icon name="person-outline" size={22} color={activeRoute === 'Booking' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'Booking' ? styles.activeMenuItemText : null]}>Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'ActivePlan' ? styles.activeMenuItem : null]}
              onPress={() => handleNavigation('ActivePlanList')}
              activeOpacity={0.7}
            >
              <Icon name="person-outline" size={22} color={activeRoute === 'ActivePlan' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'ActivePlan' ? styles.activeMenuItemText : null]}>Active Plans</Text>
            </TouchableOpacity>

            {/*}
            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'Profile' ? styles.activeMenuItem : null]}
              onPress={() => handleTabNavigation('Profile')}
              activeOpacity={0.7}
            >
              <Icon name="person-outline" size={22} color={activeRoute === 'Profile' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'Profile' ? styles.activeMenuItemText : null]}>Profile</Text>
            </TouchableOpacity>
            {*/}
          </>
        ) : role === 'executive' ? (
          <>
            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'EHome' ? styles.activeMenuItem : null]}
              onPress={() => handleNavigation('EHome')}
              activeOpacity={0.7}
            >
              <Icon name="business-outline" size={22} color={activeRoute === 'EHome' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'EHome' ? styles.activeMenuItemText : null]}>Executive Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'ExecutiveProfile' ? styles.activeMenuItem : null]}
              onPress={() => handleNavigation('ExecutiveProfile')}
              activeOpacity={0.7}
            >
              <Icon name="person-circle-outline" size={22} color={activeRoute === 'ExecutiveProfile' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'ExecutiveProfile' ? styles.activeMenuItemText : null]}>Executive Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, activeRoute === 'ExecutiveBooking' ? styles.activeMenuItem : null]}
              onPress={() => handleNavigation('ExecutiveBooking')}
              activeOpacity={0.7}
            >
              <Icon name="briefcase-outline" size={22} color={activeRoute === 'ExecutiveBooking' ? '#fff' : '#09b5e1'} />
              <Text style={[styles.menuItemText, activeRoute === 'ExecutiveBooking' ? styles.activeMenuItemText : null]}>Executive Booking</Text>
            </TouchableOpacity>
          </>
        ) : null}

        {/* Common Menu Items */}
        {/* <TouchableOpacity
          style={[styles.menuItem, activeRoute === 'Settings' ? styles.activeMenuItem : null]}
          onPress={() => handleNavigation('Settings')}
          activeOpacity={0.7}
        >
          <Icon name="settings-outline" size={22} color={activeRoute === 'Settings' ? '#fff' : '#09b5e1'} />
          <Text style={[styles.menuItemText, activeRoute === 'Settings' ? styles.activeMenuItemText : null]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, activeRoute === 'Support' ? styles.activeMenuItem : null]}
          onPress={() => handleNavigation('Support')}
          activeOpacity={0.7}
        >
          <Icon name="help-circle-outline" size={22} color={activeRoute === 'Support' ? '#fff' : '#09b5e1'} />
          <Text style={[styles.menuItemText, activeRoute === 'Support' ? styles.activeMenuItemText : null]}>Support</Text>
        </TouchableOpacity> */}
      </View>

      {/* Logout Button */}
      <View style={styles.menuSection}>
      <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout(navigation)} activeOpacity={0.7}>
        <Icon name="log-out-outline" size={22} color="red" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    padding: 20,
    backgroundColor: '#09b5e1', // Main color for the header
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#dcdcdc',
  },
  menuSection: {
    flex: 1,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    marginVertical: 5,
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 5, // iOS shadow
  },
  menuItemText: {
    fontSize: 15,
    marginLeft: 15,
    color: '#333',
  },
  activeMenuItem: {
    backgroundColor: '#09b5e1', // Highlight the active item
  },
  activeMenuItemText: {
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor:'red',
    borderWidth:1,
    marginBottom: 20,
    marginTop: 'auto', // Pushes it to the bottom
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    fontSize: 16,
    marginLeft: 15,
    color: 'red',
  },
});

export default HomeDrawerContent;
