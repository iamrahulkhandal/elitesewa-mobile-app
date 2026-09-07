import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Avatar, Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import defaultImage from '../assets/male.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ExecutiveProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [userData, setUserData] = useState({});
  const [userRole, setUserRole] = useState('');
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
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

      const response = await axios.get(`${API_URL}/api/${role}/profile`, {
        params: { mobile: user }, // Use the appropriate identifier
      });

      setUserData(response.data);
    } catch (error) {
      showSnackbarMessage('Error fetching user data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbarMessage = (msg) => {
    setMessage(msg);
    setShowSnackbar(true);
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Run once on mount

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  // Define the essential details to display
  // const valuableDetails = [
  //   { label: 'Name', value: userData.name },
  //   { label: 'Email', value: userData.email },
  //   { label: 'Mobile', value: userData.mobile },
  //   { label: 'Address', value: userData.streetAddress },
  //   { label: 'Locality', value: userData.locality },
  //   { label: 'Nearby', value: userData.nearby },
  //   { label: 'City', value: userData.city },
  //   { label: 'District', value: userData.district },
  //   { label: 'State', value: userData.state },
  // ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} 
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={120}
            style={styles.avatar}
            source={userData.image ? { uri: userData.image } : defaultImage}
          />
          <Text style={styles.nameText}>{isLoading ? 'Loading...' : userData.name}</Text>
        </View>
      </View>
    {isLoading ? (
        <ActivityIndicator size="large" color="#6200ee" style={styles.loadingIndicator} />
      ) : (
        <>
     <View style={styles.containerBox}>
          <View style={styles.box}>
            <View style={styles.icon}>
              <Svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  stroke="#09b5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{userData.name}</Text>
            </View>
          </View>
    
          <View style={styles.box}>
            <View style={styles.icon}>
              <Svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  stroke="#09b5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{userData.email}</Text>
            </View>
          </View>
    
          <View style={styles.box}>
            <View style={styles.icon}>
              <Svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  stroke="#09b5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Mobile</Text>
              <Text style={styles.value}>{userData.mobile}</Text>
            </View>
          </View>
    
          <View style={styles.box}>
            <View style={styles.icon}>
              <Svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  stroke="#09b5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  stroke="#09b5e1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{userData.state}, {userData.country}</Text>
            </View>
          </View>
        </View>
        <View style={styles.containerBox}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Contact Information</Text>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.icon}>
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#09b5e1" width={20} height={20}>
                  <Path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </Svg>
              </View>
              <View style={styles.detailText}>
                <Text style={styles.label}>Phone Number</Text>
                <Text style={styles.value}>{userData.mobile}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.icon}>
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#09b5e1" width={20} height={20}>
                  <Path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <Path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </Svg>
              </View>
              <View style={styles.detailText}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.value}>{userData.email}</Text>
              </View>
            </View>
            {/* <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.icon}>
                <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6B46C1" width={20} height={20}>
                  <Path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </Svg>
              </View>
              <View style={styles.detailText}>
                <Text style={styles.label}>Website</Text>
                <Text style={styles.value}>www.example.com</Text>
              </View>
            </View> */}
          </View>
        </View>
    
        <View style={styles.containerBox}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Address Information</Text>
          </View>
          <View style={styles.detailsContainer}>
            
          {userData.streetAddress && (
            <View style={styles.detailRow}>
              <View style={styles.icon}>
              <Svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24" stroke="#09b5e1">
                  <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </Svg>
              </View>
              <View style={styles.detailText}>
                <Text style={styles.label}>Street Address</Text>
                <Text style={styles.value}>{userData.streetAddress} {userData.apartment}</Text>
              </View>
            </View>
          )}
            {(userData.locality || userData.nearby) && (
              <>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.icon}>
              <Svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24" stroke="#09b5e1">
                  <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </Svg>
              </View>
              <View style={styles.detailText}>
                <Text style={styles.label}>Locality & Nearby</Text>
    
                {userData.locality && (
                <Text style={styles.value}>{userData.locality}</Text>
                  )}
                {userData.nearby && (
                <Text style={styles.value}>{userData.nearby}</Text>
                )}
              </View>
            </View>
            </>
            )}
            {(userData.city || userData.district || userData.state) && (
              <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.icon}>
                <Svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24" stroke="#09b5e1">
                  <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </Svg>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.label}>Region</Text>
                  {userData.pincode && (
                  <Text style={styles.value}>{userData.city}</Text>
                  )}
                  {userData.pincode && (
                  <Text style={styles.value}>{userData.district}</Text>
                  )}
                  {userData.pincode && (
                  <Text style={styles.value}>{userData.state}</Text>
                  )}
                </View>
              </View>
              </>
               )}
              {userData.pincode && (
                <>
              <View style={styles.divider} ></View>
              <View style={styles.detailRow}>
                <View style={styles.icon}>
                <Svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24" stroke="#09b5e1">
                  <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </Svg>
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.label}>Postal Code</Text>
                  <Text style={styles.value}>{userData.pincode}</Text>
                </View>
              </View>
              </>
              )}
            </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
          <View style={{ flexDirection: 'column', space: 16 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#09b5e1',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
                marginBottom:10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
              }}
              onPress={() => {
                if (userRole === 'customer') {
                  navigation.navigate('CustomerProfileUpdate', { userData });
                } else if (userRole === 'executive') {
                  navigation.navigate('ExecutiveProfileUpdate', { userData });
                }
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#fff">
                  <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </Svg>
                <Text style={{ color: 'white', marginLeft: 8 }}>Edit Profile</Text>
              </View>
              <Svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="#fff" viewBox="0 0 20 20">
                <Path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
        </>
      )}


      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
      >
        {message}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  nameText: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  editButton: {
    marginTop: 20,
  }, 


  
  box: {
    // backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    backgroundColor: '#E9D8FD',
    padding: 8,
    borderRadius: 8,
  },
  infoContainer: {
    marginLeft: 16,
    flex: 1,
  },

  containerBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    backgroundColor: '#ebfbff',
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#09b5e1',
  },
  detailsContainer: {
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    width: 20,
    height: 20,
  },
  detailText: {
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    color: '#718096',
  },
  value: {
    fontSize: 16,
    color: '#1A202C',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },

});

export default ExecutiveProfileScreen;
