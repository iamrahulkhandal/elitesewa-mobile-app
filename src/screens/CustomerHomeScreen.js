import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAndClear } from '../store/authSlice';
import axios from 'axios';
import { API_URL } from '@env';
import Swiper from 'react-native-swiper';
import TopPlacesCarousel from '../components/TopPlacesCarousel';
import HomeServices from '../components/Shared/HomeServices';
import CustomHomeServices from '../components/Shared/CustomHomeServices';
import CleaningService from '../components/Shared/CleaningService';
import Services from '../components/Shared/Services';
import PopularServices from '../components/Shared/PopularServices';
import Testimonial from '../components/Shared/Testimonial';
import { CommonActions } from '@react-navigation/native';
import { TOP_PLACES } from '../data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const CustomerHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, role } = useSelector(state => state.auth);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const categoryId = '6736424636a5412c42c20d53'; // Define the categoryId here
    fetchServices();
    fetchTestimonials();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<Icon key={i} name="star" size={20} color="#FFD700" />);
      } else {
        stars.push(<Icon key={i} name="star-o" size={20} color="#FFD700" />);
      }
    }
    return stars;
  };


  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/testimonials`);
      setTestimonials(response.data.slice(0, 5)); // Get the first 5 testimonials
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    }
  };


  const checkProfileStatus = async () => {
    if (user?.mobile) {
      try {
        const response = await axios.get(
          `${API_URL}/api/${role}/profile-status`,
          { params: { mobile: user.mobile } }
        );
        if (response.data.isProfileComplete !== isProfileComplete) {
          setIsProfileComplete(response.data.isProfileComplete);
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
      await dispatch(logoutAndClear());
      await AsyncStorage.removeItem('userData');
      navigation.navigate('LandingPage');
      // console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    checkProfileStatus();
    // console.log('customer home screen');
  }, [user, role]);


  const handleRefresh = async () => {
    setRefreshing(true);
    const categoryId = '6736424636a5412c42c20d53';
    await fetchServices(categoryId);

    await fetchTestimonials();
    setRefreshing(false);
  };


  const renderServiceItem = ({ item }) => {
    if (!item || !item.iconLib || !item.icon || !item.name || !item.images) {
      return null; // Return nothing if item is invalid
    }

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ServicesView', { serviceId: item._id })
        }>
        <View style={styles.serviceContainer}>
          <View style={styles.serviceContent}>
            {/* {item.iconLib === 'Material Icons' ? ( 
            <MaterialIcon name={item.icon} size={28} color="#007BFF" style={styles.icon} />
          ) : item.iconLib === 'FontAwesome' ? (
            <FontAwesomeIcon name={item.icon} size={28} color="#007BFF" style={styles.icon} />
          ) : null} */}
            <Image source={{ uri: `${API_URL}/${item.images[0]}` }} style={styles.serviceSwiperImage} />
          </View>
           <View style={styles.nameprice}>
            {["673ecdcbf3db97399444bd87", "673f16a97a12ef01b200c93f"].includes(item._id) ? (
              <Text style={styles.serviceSwiperName}> Starting Monthly @</Text>
            ) : (
              <Text style={styles.serviceSwiperName}>Starting From</Text>
            )}
            {item.plans?.[0]?.price && (
            <View style={styles.priceContainer}>
            <Text style={styles.newPrice}>₹ {item.plans[0]['price']}</Text>
          </View>
            )}
            </View>
        </View>
      </TouchableOpacity>
    );
  };


  // const renderTestimonialItem = ({ item }) => {
  //   return (
  //     <View style={styles.testimonialContainer}>
  //       <Text style={styles.testimonialMessage}>{item.message}</Text>
  //       <Text style={styles.testimonialUser}>- {item.name}</Text>
  //     </View>
  //   );
  // };
  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchServices} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { id: '3', type: 'TopPlacesCarousel', list: TOP_PLACES },
          { id: '1', type: 'HomeServices' },
          { id: '8', type: 'CustomHomeServices' },
          { id: '2', type: 'ServicesSlider' },
          // { id: '5', type: 'PopularServices' },
          { id: '7', type: 'CleaningService' },
          { id: '6', type: 'Testimonials' },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => {
          switch (item.type) {
            case 'HomeServices':
              return <HomeServices />;
            case 'CustomHomeServices':
              return <CustomHomeServices />;
            case 'ServicesSlider':
              return (
                <>
                  {services && services.length > 0 ? (
                    <View style={styles.container}>
                      <Text style={styles.header}>Popular</Text>
                      <Swiper
                        showsPagination={false}
                        loop={true}
                        autoplay={true}
                        autoplayTimeout={3}
                        style={styles.swiperServiceContainer}
                      >
                    {services
                      .filter(service => service.isPopular) // ✅ Filter only popular services
                      .map(service => (
                        <View key={service._id} style={styles.swiperItem}>
                          {renderServiceItem({ item: service })}
                        </View>
                      ))}
                      </Swiper>
                    </View>
                  ) : (
                    <Text>No services available</Text> 
                  )}
                </>
              );
            case 'TopPlacesCarousel':
              return <TopPlacesCarousel list={item.list} />;
            // case 'PopularServices':
            //   return <PopularServices />;
            case 'CleaningService': 
              return <CleaningService />;
            case 'Testimonials':
              return (
                <>
                  <View style={styles.container}>
                    <Text style={styles.header}>Testimonial</Text>
                    <Swiper
                      showsPagination={false}
                      loop={true}
                      autoplay={true}
                      autoplayTimeout={3}
                      style={styles.swiperTestimonialsContainer}
                    >
                      {testimonials.map((testimonial, index) => (
                        <View key={index} style={styles.swiperTestimonialsItems}>
                          <View style={styles.testimonialContainer}>
                            <View style={styles.testimonialTop}>
                              <Image source={{ uri: `${API_URL}${testimonial.userProfilePicture}` }} style={styles.image} />
                              <Text style={styles.testimonialAuthor}>{testimonial.name}</Text>
                              <Icon name="quote-left" size={50} color="#FFD700" style={styles.testimonialQuoteIcon} />
                            </View>
                            <View style={styles.rating}>
                              {renderStars(testimonial.rating)}
                            </View>

                            <Text style={styles.testimonialText}>{testimonial.message}</Text>

                          </View>
                        </View>
                      ))}
                    </Swiper>
                  </View>
                </> 
              );

            default:
              return (
                <View style={styles.emptyComponent}>
                  <Text>No data available</Text>
                </View>
              );
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
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },

  icon: {
    marginBottom: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  swiperServiceContainer: {
    height: 250,
  },

  serviceSwiperImage: {
    width: 'auto',
    height: 160,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    objectFit: 'cover'
  },
  swiperItem: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
  },

  serviceSwiperName: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C', // a dark gray that's softer than black
    fontFamily: 'Inter, sans-serif', // clean modern font
    letterSpacing: 0.5,
  },
  swiperTestimonialsContainer: {
    height: 250,
  },
  rating: {
    flexDirection: "row",
    gap: 1
  },
  swiperTestimonialsItems: {
    margin: 5,
    marginTop: 20,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
  },
  testimonialAuthor: {
    fontSize: 14,
    width:200,
    fontWeight: '700',
    color: 'grey',
    marginTop: 20
  },
  testimonialText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10
  },
  testimonialTop: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20
  },
  testimonialQuoteIcon: {
    position: 'absolute',
    top: -52,
    right: 0,
  },
  nameprice:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Aligns items vertically
    padding: 10, // Optional: Add padding for spacing
  },
  priceContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 5,
    alignItems:'center',
    paddingHorizontal:10,
    width:100,
    paddingVertical:5,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
  },
});
export default CustomerHomeScreen;
