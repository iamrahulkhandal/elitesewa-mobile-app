import React, { useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomerHomeScreen from '../screens/CustomerHomeScreen';
import ExecutiveHomeScreen from '../screens/ExecutiveHomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExecutiveProfileScreen from '../screens/ExecutiveProfileScreen';
import Booking from '../components/Services/Booking';
import ExecutiveBooking from '../components/Services/ExecutiveBooking';
import { useHeaderTitle } from './HeaderTitleContext'; 

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ route }) => {
    const { activeTab, role } = route.params || { activeTab: 'Home' };
    const { updateHeaderTitle } = useHeaderTitle();  // Use context for updating header title
// console.log(activeTab, role, 'sdjkfhadajhlf');

    // Update the header title whenever activeTab changes 
    useEffect(() => {
        if (updateHeaderTitle) {  
            updateHeaderTitle(activeTab);
        }
    }, [activeTab, updateHeaderTitle]);

    // Function to show an alert when a tab is clicked
    const showAlert = (tabName) => {
        updateHeaderTitle(tabName);  // Update the header title when a tab is clicked
        //Alert.alert('Tab Clicked', `You clicked the ${tabName} tab!`);
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#09b5e1',  // Active tab color
                tabBarInactiveTintColor: 'gray', // Inactive tab color
                tabBarStyle: { backgroundColor: 'white' }, // Tab bar background color
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Booking') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'EHome') {
                        iconName = focused ? 'business' : 'business-outline';
                    } else if (route.name === 'ExecutiveBooking') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    } else if (route.name === 'ExecutiveProfile') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarButton: (props) => {
                    // Custom behavior for tab click
                    const handlePress = () => {
                        showAlert(route.name);  // Show alert when tab is clicked
                        if (props.onPress) {
                            props.onPress(); // Ensure default navigation behavior is still executed
                        }
                    };

                    return (
                        <TouchableOpacity {...props} onPress={handlePress}>
                            {props.children}
                        </TouchableOpacity>
                    );
                },
            })}
        >
            {/* Conditionally render screens based on the role */}
            {role === 'customer' && (
                <>
                    <Tab.Screen 
                        name="Home" 
                        component={CustomerHomeScreen} 
                        initialParams={{ activeTab: 'Home' }}  
                    />
                    <Tab.Screen 
                        name="Booking" 
                        component={Booking} 
                        initialParams={{ activeTab: 'Booking' }} 
                    />
                    <Tab.Screen 
                        name="Profile" 
                        component={ProfileScreen} 
                        initialParams={{ activeTab: 'Profile' }} 
                    />
                </>
            )}

            {role === 'executive' && (
                <>
                    <Tab.Screen 
                        name="EHome" 
                        component={ExecutiveHomeScreen} 
                        initialParams={{ activeTab: 'EHome' }} 
                    />
                    <Tab.Screen 
                        name="ExecutiveBooking" 
                        component={ExecutiveBooking} 
                        initialParams={{ activeTab: 'ExecutiveBooking' }} 
                    />
                    <Tab.Screen 
                        name="ExecutiveProfile" 
                        component={ExecutiveProfileScreen} 
                        initialParams={{ activeTab: 'ExecutiveProfile' }} 
                    />
                </>
            )}
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
