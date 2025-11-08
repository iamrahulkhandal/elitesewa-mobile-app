import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { REACT_NATIVE_SERVER_URL } from '@env';
import Swiper from 'react-native-swiper';
import Activeplan from '../../components/Services/Activeplan'
// import RNPickerSelect from 'react-native-picker-select';

const { width: screenWidth } = Dimensions.get('window');

const ActivePlanList = ({ route, navigation }) => {
  const { role } = route.params;
  const user = useSelector((state) => state.auth.user);
  const userId = useSelector((state) => state.auth.userId);
  const userRole = useSelector((state) => state.auth.role);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []); 
   
  // Remove duplicates based on planId._id

  // Prepare the plans for the picker
  // const plans = service?.plans?.map(item => ({
  //   label: item.name,
  //   value: item._id,
  // })) || [];

  const fetchPayments = async () => {
    if (!userId || !userRole) return;

    setLoading(true);

    try { 

      const response = await axios.get(
        `${REACT_NATIVE_SERVER_URL}/api/payment/activeplan/${userRole}/${userId}` 
      );
      setPayments(response.data.payments || []); 
      console.log('view',response.data.payments); 
    } catch (error) {  

    } finally { 
      setLoading(false); 
    } 
  };


  // Function to extract video ID from YouTube U

  const handleActivePlanSelect = (plan,serviceId, vehicle, planActiveDate) => {
    setSelectedPlan(plan); // Save the selected plan
    // Navigate to VehicleAndOwnerDetails and pass the selected plan along with serviceId
    navigation.navigate('Checkout', {
      serviceId: serviceId._id,
      planId: plan._id,
      planPrice: plan.price,
      planActive: true,
      planActiveDate,
      vehicleNumber: vehicle.vehicleNumber,
      vehicleId: vehicle._id,
      planDuration: plan.duration,
    });
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchServiceDetails} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const convertDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

    return (
    <>
        {role === 'customer' && ( 
          <>
         {payments?.length > 0 && (
        
            <>
      
  <ScrollView
    refreshControl={
      <RefreshControl refreshing={loading} onRefresh={fetchPayments} />
    }
  style={styles.container}>
            {payments?.map((payment, index) => {
              const { planId, vehicleId, createdAt,serviceId, planActiveDate } = payment;
              const vehicle = vehicleId; // Assuming vehicleId has vehicle details like { name, number }
              console.log(vehicle.vehicleDetails.number);
                const calculateEndDate = (planActiveDate, duration) => {
                  const startDate = new Date(planActiveDate); // Parse the ISO string
                  const durationInDays = parseInt(duration, 10); // Ensure duration is treated as a number
                  startDate.setUTCDate(startDate.getUTCDate() + durationInDays); // Add duration (in days)
                  return startDate; // Return the end date as a Date object
                };

                // Function to check if the plan is active or expired
                const isPlanActive = (endDate) => {
                  const currentDate = new Date();
                  return endDate > currentDate;
                };

                const endDate = calculateEndDate(planActiveDate, planId.duration); // Calculate expiration date
                const isActive = isPlanActive(endDate); 
              return (
                isActive && (

                    <View key={index}>
                      {/* Pass relevant props to Activeplan component */}
                      <Activeplan
                        plan={planId}
                        service={serviceId}
                        vehicle={vehicle} 
                        createdAt={createdAt}
                        planActiveDate={planActiveDate}
                        onSelect={handleActivePlanSelect}
                      />


                    </View>
                )
              );
            })}
              </ScrollView>
            </>
          )}
          </>
        )}
    </>
  ); 

};



const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
   container: {
    padding: 10,
    paddingBottom: 30,  // Add this to make sure the content is scrollable if there's a bottom element
  },
});

export default ActivePlanList;
