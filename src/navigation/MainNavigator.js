import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Alert, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAndClear } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderTitleProvider } from './HeaderTitleContext';
//import PaymentScreen from '../screens/PaymentScreen';
import RoleBasedLogin from '../components/RoleBasedLogin';
import ExecutiveProfileUpdate from '../components/ExecutiveProfileUpdate';
import CustomerProfileUpdate from '../components/CustomerProfileUpdate';
import LandingPage from '../components/LandingPage';
import MoreTestimonialsScreen from '../components/Shared/MoreTestimonialsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import Services from '../components/Shared/Services';
//import ServiceForm from '../components/Services/ServiceForm';
import ServicesList from '../components/Services/ServicesList';
//import ServiceDetails from '../components/Services/ServiceDetails';
import CreateCategory from '../components/Category/CreateCategory';
import CategoryListing from '../components/Category/CategoryListing';
import ServicesCreate from '../components/Services/ServicesCreate';
import ExecutiveServicesCreate from '../components/Services/ExecutiveServicesCreate';
import ExecutiveServicesUpdate from '../components/Services/ExecutiveServicesUpdate';
import ServicesListing from '../components/Services/ServicesListing';
import ActivePlanList from '../components/Services/ActivePlanList';
import ServicesEdit from '../components/Services/ServicesEdit';
import IconsCreate from '../components/Icons/IconsCreate';
import IconsListing from '../components/Icons/IconsListing';
import ServicesView from '../components/Services/ServicesView';
import TestimonialCreate from '../components/Testimonials/TestimonialCreate';
import TestimonialListing from '../components/Testimonials/TestimonialListing';
import BookingDetails from '../components/Services/BookingDetails';
import ProfileScreen from '../screens/ProfileScreen';
import Checkout from '../components/Checkout/Index';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import PaymentFailedScreen from '../screens/PaymentFailedScreen';
import DrawerNavigator from './DrawerNavigator';
const Stack = createStackNavigator();
const MainNavigator = ({ role, startRouteName }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [headerTitle, setHeaderTitle] = useState('Home');
  const navigation = useNavigation();
  const isProfileComplete = useSelector(
    state => state.auth.isProfileComplete,
  );

  // Update header title dynamically
  const updateHeaderTitle = (title) => {
    setHeaderTitle(title);
  };

  const handleLeftButtonPress = () => {
    if (isProfileComplete) {
      navigation.navigate('Main', { screen: 'Home' });
    } else {
      Alert.alert('Profile Incomplete', 'Please complete your profile first.');
    }
  };
  // Logout function using logoutAndClear
  const handleLogout = async navigation => {
    try {
      await dispatch(logoutAndClear()); // Dispatch the logoutAndClear action
      await AsyncStorage.removeItem('userData');
      // Pass role using navigation to 'RoleBasedLogin'
      navigation.dispatch(
        CommonActions.reset({
          index: 0, // Reset to the first route in the stack
          routes: [
            {
              name: 'RoleBasedLogin', // Replace with your desired screen
              params: { role }, // Pass the role as a parameter
            },
          ],
        }),
      );
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const HeaderIconButton = ({ navigation, component }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(component)}
      style={styles.iconButton}>
      <Feather name="plus-circle" size={28} color="#007AFF" />
    </TouchableOpacity>
  );

  return (
    <HeaderTitleProvider>
      <Stack.Navigator initialRouteName={startRouteName}>
        {/* Stack for the Drawer Navigator (which contains tabs) */}
        <Stack.Screen
          name='Main'
          options={{ headerShown: false }}
        >
          {(props) => <DrawerNavigator {...props} role={role} handleLogout={handleLogout} updateHeaderTitle={updateHeaderTitle} headerTitle={headerTitle} />}
        </Stack.Screen>
        {/* Screens added to the stack */}
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{
            title: 'Landing Page',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccessScreen}
          options={{
            title: 'Payment Success Page',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PaymentFailed"
          component={PaymentFailedScreen}
          options={{
            title: 'Payment Failed Page',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RoleBasedLogin"
          component={RoleBasedLogin}
          options={{
            title: 'Login with OTP',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#09b5e1'
            },
          }}
          initialParams={{ role }}
        />
        <Stack.Screen
          name="CustomerProfileUpdate"
          component={CustomerProfileUpdate}
          options={{
            title: 'Update Customer Profile',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerLeft: () => (
              <TouchableOpacity onPress={handleLeftButtonPress} style={styles.headerLeftButton}>
                <Icon name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="ExecutiveProfileUpdate"
          component={ExecutiveProfileUpdate}
          options={{
            title: 'Update Executive Profile',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {
              fontWeight: 'bold'
            },
            headerLeft: () => (
              <TouchableOpacity onPress={handleLeftButtonPress} style={styles.headerLeftButton}>
                <Icon name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="MoreTestimonialsScreen"
          component={MoreTestimonialsScreen}
          options={{
            title: 'More Testimonials',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        { /* }
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{
            title: 'Payment',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        { */ }
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{
            title: 'Checkout',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen
          name="Services"
          component={Services}
          options={{
            title: 'Services',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
{/*}
        <Stack.Screen
          name="ServiceForm"
          component={ServiceForm}
          options={{
            title: 'Add Service',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ServicesList"
          component={ServicesList}
          options={({ navigation }) => ({
            title: 'Services',
            headerRight: () => (
              <HeaderIconButton navigation={navigation} component={ServiceForm} />
            ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
       
        <Stack.Screen
          name="ServiceDetails"
          component={ServiceDetails}
          options={{
            title: 'Service Details',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        {*/} 
        <Stack.Screen
          name="CreateCategory"
          component={CreateCategory}
          options={{
            title: 'Create Category',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen
          name="CategoryListing"
          component={CategoryListing}
          options={{
            title: 'Categories',
            headerRight: () => (
              <HeaderIconButton
                navigation={navigation}
                component={CreateCategory}
              />
            ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ServicesCreate"
          component={ServicesCreate}
          options={{
            title: 'Services Create',

            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ExecutiveServicesCreate"
          component={ExecutiveServicesCreate}
          options={{
            title: 'Services Create',

            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ServicesEdit"
          component={ServicesEdit}
          options={{
            title: 'Services Edit',

            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ServicesView"
          component={ServicesView}
          options={{
            title: 'Services View',

            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          initialParams={{ role }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={({ navigation }) => ({
            title: 'ProfileScreen',
            // headerRight: () => (
            //   <HeaderIconButton
            //     navigation={navigation}
            //     component={ProfileScreen}
            //   />
            // ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
        <Stack.Screen
          name="ServicesListing"
          component={ServicesListing}
          options={({ navigation }) => ({
            title: 'Services',
            // headerRight: () => (
            //   <HeaderIconButton
            //     navigation={navigation}
            //     component={ServicesCreate}
            //   />
            // ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
        <Stack.Screen
          name="ActivePlanList"
          component={ActivePlanList}
          options={{
            title: 'Active Plans',
            // headerRight: () => (
            //   <HeaderIconButton
            //     navigation={navigation}
            //     component={ServicesCreate}
            //   />
            // ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          initialParams={{ role }}
        />

        <Stack.Screen
          name="ExecutiveServicesUpdate"
          component={ExecutiveServicesUpdate}
          options={{
            title: 'Customer Rating',

            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="TestimonialCreate"
          component={TestimonialCreate}
          options={{
            title: 'Testimonial Create',

            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="BookingDetails"
          component={BookingDetails}
          options={{
            title: 'Booking Details',

            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <Stack.Screen
          name="TestimonialListing"
          component={TestimonialListing}
          options={({ navigation }) => ({
            title: 'Testimonial Create',
            headerRight: () => (
              <HeaderIconButton
                navigation={navigation}
                component={TestimonialCreate}
              />
            ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
        <Stack.Screen
          name="IconsListing"
          component={IconsListing}
          options={{
            title: 'Icons Listing',
            headerRight: () => (
              <HeaderIconButton navigation={navigation} component={IconsCreate} />
            ),
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f8f9fa',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </HeaderTitleProvider>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e1e5ea',
  },
  headerLeftButton: {
    padding: 10,
    marginLeft: 0,
  },
});
export default MainNavigator;
