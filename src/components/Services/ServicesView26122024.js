import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { REACT_NATIVE_SERVER_URL } from '@env';
import Swiper from 'react-native-swiper';
import Plans from '../../components/Services/Plans'
import ImageViewing from 'react-native-image-viewing';
import YoutubeIframe from 'react-native-youtube-iframe';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const { width: screenWidth } = Dimensions.get('window');

const ServicesView = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const user = useSelector((state) => state.auth.user);
  const [service, setService] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewingType, setViewingType] = useState('banners'); // State to track whether we are viewing banners or gallery images

  const staticVideoId = 'dQw4w9WgXcQ'; // Static YouTube video ID (replace with any valid ID)

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${REACT_NATIVE_SERVER_URL}/api/services/${serviceId}`);
        // Get the video ID from service.videoUrl
      setVideoId(extractVideoId(response?.data?.videoUrl));
      // console.log('====================================');
      // console.log(response.data);
      // console.log('====================================');
      setService(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load service details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Function to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
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
              await axios.delete(`${REACT_NATIVE_SERVER_URL}/api/services/${serviceId}`);
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

  const handleImagePress = (index, type) => {
    setSelectedImageIndex(index);
    setViewingType(type); // Set to either "banners" or "images"
    setIsImageViewVisible(true);
  };

  const viewingImages = viewingType === 'banners'
    ? service?.banners?.map(banner => ({ uri: `${REACT_NATIVE_SERVER_URL}/${banner}` }))
    : service?.images?.map(image => ({ uri: `${REACT_NATIVE_SERVER_URL}/${image}` }));

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner Slider */}
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
          {service?.banners?.map((banner, index) => (
            <TouchableOpacity key={index} onPress={() => handleImagePress(index, 'banners')}>
              <Image
                source={{ uri: `${REACT_NATIVE_SERVER_URL}/${banner}` }}
                style={styles.bannerImage}
              />
            </TouchableOpacity>
          ))}
        </Swiper>
      </View>

      {/* Image Zoom Gallery */}
      <ImageViewing
        images={viewingImages}
        imageIndex={selectedImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />

      {/* Icon with Name */}
      <View style={styles.iconContainer}>
        {/* {service.iconLib === 'Material Icons' ? (
          <MaterialIcon name={service.icon} size={60} color="#007BFF" />
        ) : (
          <FontAwesomeIcon name={service.icon} size={60} color="#007BFF" />
        )} */}
        <Text style={styles.name}>{service.name}</Text>
      </View>

      {/* Service Description */}
      <Text style={styles.description}>{service.description}</Text>

      {/* Static Video Preview */}
      {videoId && (
        <View style={styles.videoContainer}>
          <YoutubeIframe
            height={250}
            videoId={videoId} // Now we use the video ID extracted from service.videoUrl
            play={true}
            onError={(error) => console.log("Error playing video:", error)}
            onReady={() => console.log("Video is ready to play")}
          />
        </View>
      )}

      {/* Gallery Images Section */}
      <View style={styles.galleryContainer}>
        <Text style={styles.galleryTitle}>Gallery Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {service?.images?.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleImagePress(index, 'images')}>
              <Image source={{ uri: `${REACT_NATIVE_SERVER_URL}/${image}` }} style={styles.galleryImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Text style={styles.description}>{service.longDescription}</Text>    
      

      {/* Edit and Delete Actions */}
      <View > 
       {/* <Text style={styles.title}>OUR PLANS</Text>
          {service.plans.map((plan,index) => (
            <Plans key={index} plan={plan} serviceId={service._id} user={user} /> 
           
          ))} */}
          <TouchableOpacity style={styles.payButton} onPress={() => navigation.navigate('VehicleAndOwnerDetails')}>
            <Text style={styles.payButtonText}>Apply  Now</Text>
          </TouchableOpacity>
      </View> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({

 

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#f8c471',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  cartypeheading:{
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    borderBottomWidth:1,
    borderBottomColor:'#fff'
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
    paddingTop:20,
    width: screenWidth * 0.95,
    borderTopWidth:1,
    borderColor:'grey'

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
});

export default ServicesView;
