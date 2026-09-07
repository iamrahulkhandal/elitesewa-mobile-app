import React, { useState, useEffect } from 'react';
import type { Booking, ServiceSummary } from '../../types/models';
import type { AppNavigation, AppRoute } from '../../types/navigation';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';
import { API_URL } from '@env';
import Swiper from 'react-native-swiper';
import {Plan,PlanPick,PlanBreak} from '../../components/Services/Plan'
import Activeplan from '../../components/Services/Activeplan'
import ImageViewing from 'react-native-image-viewing';
import YoutubeIframe from 'react-native-youtube-iframe';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { fileUrl } from '../../utils/fileUrl';
// import RNPickerSelect from 'react-native-picker-select';

const { width: screenWidth } = Dimensions.get('window');

type ServicesViewProps = { route: AppRoute; navigation: AppNavigation };

const ServicesView = ({ route, navigation }: ServicesViewProps) => {
  const { serviceId, role } = route.params ?? {};
  const user = useAppSelector((state) => state.auth.user);
  const userId = useAppSelector((state) => state.auth.userId);
  const userRole = useAppSelector((state) => state.auth.role);
  const [service, setService] = useState<ServiceSummary | null>(null);
  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewingType, setViewingType] = useState('banners'); // State to track whether we are viewing banners or gallery images
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const staticVideoId = 'dQw4w9WgXcQ'; // Static YouTube video ID (replace with any valid ID)
  const [payments, setPayments] = useState<Booking[]>([]);
  const [shortImages, setShortImages] = useState<any[]>([]);
  const [longImages, setLongImages] = useState<any[]>([]);
  const [imageDimensions, setImageDimensions] = useState<any[]>([]);
  const [maxImageHeight, setMaxImageHeight] = useState(300);

  useEffect(() => {
    fetchServiceDetails();
    fetchPayments();
    fetchShortImages();
  }, []); 
 
  useEffect(() => {
    if (longImages?.length) {
      const promises = longImages.map((img) => {
        return new Promise<{ width: number; height: number }>((resolve) => {
          Image.getSize(
            fileUrl(img),
            (width, height) => {
              const scaledHeight = (height / width) * screenWidth * 0.95;
              resolve({ width: screenWidth * 0.95, height: scaledHeight });
            },
            () => resolve({ width: screenWidth * 0.95, height: 200 }) // fallback
          );
        });
      });
  
      Promise.all(promises).then((sizes) => {
        setImageDimensions(sizes);
        const max = Math.max(...sizes.map((size) => size.height));
        setMaxImageHeight(max); // ✅ Save max height in state
      });
    }
  }, [longImages]);
   
 
  const fetchShortImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services/shorting/${serviceId}`);
      setShortImages(response.data.shortdescription || []);
      setLongImages(response.data.longdescription || []);

    } catch (error) {
      // setError('Failed to load images.');
    } finally {
      setLoading(false);
    }
  };  
  

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
        `${API_URL}/api/payment/${userRole}/${userId}/${serviceId}`
      );
      setPayments(response.data.payments || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to load your plan status. Pull to refresh to retry.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/services/${serviceId}`);
      // Get the video ID from service.videoUrl
      setVideoId(extractVideoId(response?.data?.videoUrl) ?? '');
      setService(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load service details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  const handleDeleteService = () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/services/${serviceId}`);
              Alert.alert('Success', 'Service deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete service');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleImagePress = (index: number, type: any) => {
    setSelectedImageIndex(index);
    setViewingType(type); // Set to either "banners" or "images"
    setIsImageViewVisible(true);
  };

  const handlePlanSelect = (plan: any) => {
    // console.log(plan,'plan...');

    setSelectedPlan(plan); // Save the selected plan
    // Navigate to VehicleAndOwnerDetails and pass the selected plan along with serviceId
    navigation.navigate('Checkout', {
      serviceId: service?._id,
      planId: plan._id,
      planPrice: plan.price,
      planActive: false,
      planDuration: plan.duration,
      billingType: plan.billingType || 'onetime',
    });
  };
  const handleActivePlanSelect = (plan: any, vehicle: any, planActiveDate: string) => {
    setSelectedPlan(plan); // Save the selected plan
    // Navigate to VehicleAndOwnerDetails and pass the selected plan along with serviceId
    navigation.navigate('Checkout', {
      serviceId: service?._id,
      planId: plan._id,
      planPrice: plan.price,
      planActive: true,
      planActiveDate,
      vehicleNumber: vehicle.vehicleNumber,
      vehicleId: vehicle._id,
      planDuration: plan.duration,
    });
  };

  const viewingImages = viewingType === 'banners'
    ? service?.banners?.map((banner: any) => ({ uri: fileUrl(banner) }))
    : service?.images?.map((image: any) => ({ uri: fileUrl(image) }));

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

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service not found.</Text>
      </View>
    );
  }

  const convertDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };


  return (
    <>

    {["673f17177a12ef01b200c944", "678a00e2a0f52ff94e016f40", "678a0366a0f52ff94e017260"].includes(serviceId) ? (
        <>
        

        <View style={styles.comingsoon}>
        <View>
          <Text style={styles.comingsoon_name}>{service.name}</Text>
          <Text style={styles.comingsoon_name}>Service</Text>
        </View> 
        <Image source={require('../../assets/coming/coming-soon.png')} style={styles.comingsoonimg} /> 
      </View>

 
        </>
  ) : (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.carouselContainer}>
          <Swiper
            style={styles.swiper}
            showsPagination={true}
            autoplay={true}
            autoplayTimeout={3}
            loop={true}
            paginationStyle={styles.pagination}
            dotColor="#CCCCCC"
            activeDotColor="#007BFF"
          >

            {service?.banners?.map((banner: any, index: number) => (
              <TouchableOpacity key={`banner-${index}`} onPress={() => handleImagePress(index, 'banners')}>
                <Image
                  source={{ uri: fileUrl(banner) }}
                  style={styles.bannerImage}
                />
              </TouchableOpacity>
            ))}
          </Swiper>
        </View>
        <View>

      </View> 
        {/* Image Zoom Gallery */}
        <ImageViewing 
          images={viewingImages ?? []}
          imageIndex={selectedImageIndex}
          visible={isImageViewVisible}
          onRequestClose={() => setIsImageViewVisible(false)}
        />
        {/* Icon with Name */}
        <View style={styles.iconContainer}>
          <Text style={styles.name}>{service.name}</Text>
          {["673f16c47a12ef01b200c943"].includes(serviceId) && (
          <Text style={styles.servicesubname}>Your Car, Our Driver</Text>
          )}

        </View>
       

        {!["673f16c47a12ef01b200c943", "673f16bd7a12ef01b200c941"].includes(serviceId) ? (
         <>
        <View style={styles.imageContainer}>
          {shortImages.length > 0 ? (
            shortImages.map((img, index) => (
              <Image 
                key={index} 
                source={{ uri: fileUrl(img) }} 
                style={styles.contentImage} 
                resizeMode="cover" 
              />
            ))
          ) : (
            <Text style={styles.description}>{service.description}</Text>
          )}
        </View>
        <View style={styles.iconContainer}>
          {/* Service Duration */}
          <Text style={styles.name}>Service Time - {convertDuration(Number(service?.duration ?? 0))}</Text>
        </View>

        {videoId && (
          <View style={styles.videoContainer}>
            <YoutubeIframe
              height={250}
              videoId={videoId} // Now we use the video ID extracted from service.videoUrl
              play={false}
              onError={(error: any) => console.log("Error playing video:", error)}
              onReady={() => console.log("Video is ready to play")}
            />
          </View>
        )}

        <View style={styles.galleryContainer}>
          <Text style={styles.galleryTitle}>Gallery Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {service?.images?.map((image: any, index: number) => (
              <TouchableOpacity key={`gallery-${index}`} onPress={() => handleImagePress(index, 'images')}>
                <Image source={{ uri: fileUrl(image) }} style={styles.galleryImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.imageContainer}>
                  {longImages.length > 0 ? (
                    longImages.map((img, index) => (
                  <Image
                  key={index}
                  source={{ uri: fileUrl(img) }}
                  style={{
                    width: imageDimensions[index]?.width || screenWidth* 0.95,
                    height: imageDimensions[index]?.height || 200,
                    alignSelf: 'center',
                    resizeMode: 'cover',
                  }}
                />
                    ))
                  ) : (
                    service.longDescription && service.longDescription.trim() !== '' && (
                      <Text style={styles.description}>{service.longDescription}</Text>
                    )
                  )}
        </View>
            </>
    ) : (
    <View>
          <Swiper
            style={{ height: maxImageHeight ,backgroundColor:'#fff'}}
            showsPagination={false}
            autoplay={true}
            autoplayTimeout={3}
            loop={true}
            paginationStyle={styles.pagination}
            dotColor="#CCCCCC"
            activeDotColor="#007BFF"
          >
            {longImages?.map((banner, index) => (
              <TouchableOpacity key={`longdesImage-${index}`}>
                <Image
                  source={{ uri: fileUrl(banner) }}
                  style={{
                    width: imageDimensions[index]?.width || screenWidth* 0.95,
                    height: imageDimensions[index]?.height || 200,
                    alignSelf: 'center',
                    resizeMode: 'cover',
                  }}
                />
              </TouchableOpacity>
            ))}
          </Swiper> 
        </View>
    )}


        {role === 'customer' && ( 
          <>
         {/* {payments?.length > 0 && (
        
            <>
            
              <Text style={styles.title}>ACTIVE PLANS</Text>

              {payments?.map((payment, index) => {
                const { planId, vehicleId, createdAt,planActiveDate } = payment;
                const vehicle = vehicleId; // Assuming vehicleId contains vehicle details (name, number)
                // Function to calculate the expiration date
                const calculateEndDate = (planActiveDate, duration) => {
                  const startDate = new Date(planActiveDate); // Parse the ISO string
                  const durationInDays = Number.parseInt(duration, 10); // Ensure duration is treated as a number
                  startDate.setUTCDate(startDate.getUTCDate() + durationInDays); // Add duration (in days)
                  return startDate; // Return the end date as a Date object
                };

                // Function to check if the plan is active or expired
                const isPlanActive = (endDate) => {
                  const currentDate = new Date();
                  return endDate > currentDate;
                };

                const endDate = calculateEndDate(planActiveDate, planId.duration); // Calculate expiration date
                const isActive = isPlanActive(endDate); // Check if the plan is active or expired

                // Only render Activeplan if the plan is active
                return (
                  isActive && (
                    <View key={index}>
                      <Activeplan
                        plan={planId}
                        vehicle={vehicle}
                        createdAt={createdAt}
                        planActiveDate={planActiveDate}
                        onSelect={handleActivePlanSelect}
                      />
                    </View>
                  )
                );
              })}
            </>
          )} */}
          {["673f16bd7a12ef01b200c941"].includes(serviceId) && (
          <View style={styles.card}>
            <Text style={styles.titlebreakpick}>Get Assistance Now</Text>

            {service.plans?.map((plan: any, index: number) => (
              <PlanBreak key={index} plan={plan} onSelect={handlePlanSelect} /> 
            ))}
          </View>
          )}
          {["673f16c47a12ef01b200c943"].includes(serviceId) && (
          <View style={styles.card}>
            <Text style={styles.titlebreakpick}>Higher Professional Drivers</Text>
            {service.plans?.map((plan: any, index: number) => (
              <PlanPick key={index} plan={plan} onSelect={handlePlanSelect} />
            ))}
          </View>
          )}
          {!["673f16bd7a12ef01b200c941","673f16c47a12ef01b200c943"].includes(serviceId) && (
          <View>
            <Text style={styles.title}>OUR PLANS</Text>
            {service.plans?.map((plan: any, index: number) => (
              <Plan key={index} plan={plan} onSelect={handlePlanSelect} serviceid={serviceId} />
            ))}
          </View>
          )}
          
          </>
        )}
      </ScrollView>
     )}
    </>
  );
};
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to make space for the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
    width: '100%', // Full width
  },
  placeholder: {
    color: 'gray',
  },
});


const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  titlebreakpick: {
    fontSize: 24,
    color:'#2074b7',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  longDescriptionImage: {
    width: screenWidth * 0.95,
    height: 400,
    marginRight: 10,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  pickerContainer: {
    width: '100%', // Full width of the parent container
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cartypeheading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff'
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicesubname:{
    color: 'grey',
    fontSize: 18,
    marginVertical:10,
    textAlign:'center',
    fontWeight: 'bold',
  },
  comingsoon: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    padding: 10,
    width: "100%",
    borderRadius: 10,
  },
  
  comingsoonimg: {
    width: '100%', // Adjust as needed
    height: 80,
  },
  
  comingsoon_name:{
    fontSize: 25,
    color: '#666',
    fontWeight: "bold",
    textAlign: "center", // Center text inside the Text component
  },

  container: {
    padding: 10,
    paddingBottom: 30,  // Add this to make sure the content is scrollable if there's a bottom element
  },
  carouselContainer: {
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    width: screenWidth * 0.95,  // Limit the banner width to make it look good
  },
  swiper: {
    height: 180,
  },
  bannerImage: {
    width: screenWidth * 0.95,  // Adjust banner width
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  pagination: {
    bottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  iconContainer: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',

  },
  videoContainer: {
    paddingTop: 20,
    width: screenWidth * 0.95,
    borderTopWidth: 1,
    borderColor: 'grey'

  },
  galleryContainer: {
    width: screenWidth * 0.95,
    marginBottom: 20,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  detailsContainer: {
    marginBottom: 20,
    width: screenWidth * 0.95,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth * 0.95,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE6E6',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    justifyContent: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 16,
  },
  payButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#F37254',
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'column', // Stack images vertically
    alignItems: 'center',   // Ensures images take full width
    justifyContent: 'center', // Centers content if needed
  },
  contentImage: {
    width: '100%',  // Full width of the container
    height: 420,    // Slightly increased for better visibility
    marginBottom: 10, // Ensures consistent spacing
    borderRadius: 8,  // Optional: Smooth rounded corners
  },
});

export default ServicesView;
