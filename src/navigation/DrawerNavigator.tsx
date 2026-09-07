import React, { useEffect, useState } from 'react';
import type { AppNavigation, AppRoute } from '../types/navigation';
import { TouchableOpacity, View, Text,Image, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomTabNavigator from './BottomTabNavigator'; // Import BottomTabNavigator
import HomeDrawerContent from './HomeDrawerContent';
import { useHeaderTitle } from './HeaderTitleContext';

const Drawer = createDrawerNavigator();

type DrawerNavigatorProps = { role: any; handleLogout: (...args: any[]) => void; navigation: AppNavigation; route: AppRoute };

const DrawerNavigator = ({ role, handleLogout, navigation, route }: DrawerNavigatorProps) => {
  const { headerTitle, updateHeaderTitle } = useHeaderTitle(); // Destructure from context
  
  // Local state for role if needed
  const [currentRole, setCurrentRole] = useState(role);

  useEffect(() => {
    // Whenever the role changes, update the local state
    if (role !== currentRole) {
      setCurrentRole(role);
    }
  }, [role]); // Only update when `role` changes

  useEffect(() => {
    // Whenever DrawerNavigator is loaded, update the header title
    updateHeaderTitle(headerTitle || 'Home'); // Default to 'Home' if no headerTitle is set
  }, [headerTitle, updateHeaderTitle]);

  return (
    <Drawer.Navigator
      id={undefined}
      drawerContent={(props) => (
        <HomeDrawerContent {...props} role={currentRole} handleLogout={handleLogout} />
      )}
      screenOptions={{
        headerShown: true,
      }}
    >
<Drawer.Screen
  name="HomeTabs"
  component={BottomTabNavigator}
  initialParams={{
    activeTab: headerTitle,
    role: currentRole,
  }}
  options={({ navigation }) => ({
    title: headerTitle,
    drawerLabel: headerTitle,
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" size={30} style={{ marginLeft: 15 }} />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View style={{ marginRight:0 }}>
        <Image
          source={require('./elitesewa.png')} // 👈 Change this path to your actual logo
          style={{ width: 180, height: 80, resizeMode: 'contain' }}
        />
      </View>
    ),
  })}
/>

    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
