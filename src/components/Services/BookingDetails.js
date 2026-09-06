import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, Image, Dimensions,ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Swiper from 'react-native-swiper';
import { API_URL } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import DailyWashUpdates from './DailyWashUpdates';
import { fileUrl } from '../../utils/fileUrl';
const { width: screenWidth } = Dimensions.get('window');
const BookingDetails = ({ route }) => {
  const { item_id } = route.params;
  const [bookingDetails, setBookingDetails] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
    const [shortImages, setShortImages] = useState([]);
    const [longImages, setLongImages] = useState([]); 
    const [imageDimensions, setImageDimensions] = useState([]);
    const [imageServiceId, setImageServiceId] = useState();
    const [maxImageHeight, setMaxImageHeight] = useState(300);
 
useFocusEffect(
  useCallback(() => {
    fetchBookingDetails();  
    //fetchShortImages(); 
  }, [])
); 

    useEffect(() => {
       if (longImages?.length) {
         const promises = longImages.map((img) => {
           return new Promise((resolve) => {
             Image.getSize(
               fileUrl(img),
               (width, height) => {
                 const scaledHeight = (height / width) * screenWidth * 0.85;
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
 
const fetchShortImages = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/services/shorting/${id}`);
    setShortImages(response.data.shortdescription || []);
    setLongImages(response.data.longdescription || []);
    console.log('Long description images:', response.data.longdescription);
  } catch (error) {
    console.error('Failed to load images:', error.message);
  }
}; 

  const handleRefresh = async () => {
    console.log(bookingDetails)
    setRefreshing(true);
    fetchBookingDetails();
    setRefreshing(false);
  };

const fetchBookingDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/payment/payment-details/${item_id}`);
    const bookingData = response.data.paymentResponse;
    setBookingDetails(bookingData);
    
    if (bookingData?.serviceId?._id) {
      setImageServiceId(bookingData.serviceId._id);
      fetchShortImages(bookingData.serviceId._id); // ✅ Move call here
    } else {
      console.warn('serviceId._id is missing');
    }
  } catch (error) {
    console.error('Error fetching booking details:', error.message);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

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

  const { 
    serviceId, 
    planId, 
    userId, 
    amount, 
    status, 
    service, 
    rating, 
    executiveId, 
    reviews, 
    executiveServiceId,
    vehicleId 
  } = bookingDetails;

  return (
    <ScrollView style={styles.container} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      {/* <Text style={styles.header}>Booking Details</Text> */}

      {/* Booking Information */}
      <Card title="Booking Information">
        <DetailsRow label="Plan" value={planId?.name || 'N/A'} />
        <DetailsRow label="Service" value={serviceId?.name || 'N/A'} />
        <DetailsRow label="User" value={userId?.name || 'N/A'} />
        <DetailsRow label="Amount" value={`₹${amount}`} />
        <DetailsRow label="Status" value={status} isHighlighted />
        <DetailsRow label="Service Status" value={service || 'N/A'} />
        <DetailsRow label="Rating" value={rating || 'N/A'} />
      </Card>

      <Card title="Vehicle Information">
        <DetailsRow label="Vehicle Number" value={vehicleId?.vehicleDetails?.number || 'N/A'} />
        <DetailsRow label="Model" value={vehicleId.vehicleDetails?.model || 'N/A'} />
        <DetailsRow label="Manufacturer" value={vehicleId.vehicleDetails?.manufacturer || 'N/A'} />
        <DetailsRow label="Year" value={vehicleId.vehicleDetails?.year ||'N/A'} />
        <DetailsRow label="Fuel Type" value={vehicleId.vehicleDetails?.fuelType || 'N/A'} />
        <DetailsRow label="registrationDate" value={vehicleId.vehicleDetails?.registrationDate ? new Date(vehicleId.vehicleDetails.registrationDate).toLocaleDateString('en-GB')  // Format: DD/MM/YYYY
: 'N/A'} />
      </Card>

      {/* Daily Wash Updates (date-wise photos + per-day customer comments) */}
      <Card title="Daily Wash Updates">
        <DailyWashUpdates paymentResponseId={item_id} />
      </Card>

      {/* Service Details */}
      <Card title="Service Information">
        {/* <DetailsRow label="Description" value={serviceId?.description || 'N/A'} isMultiline /> */}
          <View style={styles.imageContainer}>
                    {longImages.length > 0 ? (
          <Swiper
            style={{ height: maxImageHeight ,backgroundColor:'#fff'}}
            showsPagination={true}
            autoplay={true}
            autoplayTimeout={3} 
            loop={true}
            paginationStyle={styles.pagination}
            dotColor="#CCCCCC"
            activeDotColor="#007BFF"
          >
                      {longImages.map((img, index) => (
                        <TouchableOpacity key={`banner-${index}`} onPress={() => handleImagePress(index, 'banners')}>
                    <Image
                    key={index}
                    source={{ uri: fileUrl(img) }}
                    style={{
                      width: imageDimensions[index]?.width || screenWidth* 0.85,
                      height: imageDimensions[index]?.height || 200, 
                      alignSelf: 'center', 
                      resizeMode: 'contain', 
                    }}
                  />
                  </TouchableOpacity>
                      ))}

                     </Swiper>
                    ) : (
                      serviceId.longDescription && serviceId.longDescription.trim() !== '' && (
                        <Text style={styles.description}>{serviceId.longDescription}</Text>
                      )
                    )}
          </View>
      </Card>

      {/* Plan Details */}
      <Card title="Plan Information">
        <DetailsRow label="Plan Name" value={planId?.name || 'N/A'} />
        <DetailsRow label="Price" value={`₹${planId?.price || 'N/A'}`} />
        <DetailsRow label="Duration" value={`${planId?.duration || 'N/A'} days`} />
        <DetailsRow label="Key Points" value={planId?.keyPoints?.join(', ') || 'N/A'} isMultiline />
      </Card>

      {/* User Information */}
      <Card title="User Information">
        <DetailsRow label="Name" value={userId?.name || 'N/A'} />
        <DetailsRow label="Email" value={userId?.email || 'N/A'} isMultiline/>
        <DetailsRow label="Location" value={`${userId?.city}, ${userId?.state}, ${userId?.country}`} isMultiline/>
      </Card>

      {/* Executive Service Details */}
      {executiveServiceId && (
        
        <Card title="Executive Service Information">
          <DetailsRow label="Service Name" value={executiveServiceId?.name || 'N/A'} />
          <DetailsRow label="Description" value={executiveServiceId?.description || 'N/A'} isMultiline />
          <DetailsRow label="Duration" value={executiveServiceId?.duration || 'N/A'} />
          {executiveServiceId?.images?.length > 0 && (
        <View style={styles.servicesexeimage}>
            {executiveServiceId.images.map((img, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Image source={{ uri: fileUrl(img) }} style={styles.image} />
              </View>
            ))}
        </View>
          )}
        </Card>
      )}

 
       {executiveServiceId &&(
      <Card title="Executive Ratings & Reviews">
        <DetailsRow label="Executive Name" value={executiveId?.name || 'N/A'} />
        <DetailsRow label="Executive Rating" value={renderStars(executiveServiceId.executiveRating)} />
        <DetailsRow label="Executive Review" value={executiveServiceId?.executiveReview || 'N/A'} isMultiline />
      </Card>
       )}
 
      {/* Executive Images */}
      {/* {executiveServiceId?.images && executiveServiceId.images.length > 0 && (
        <Card title="Executive Images">
          <View style={styles.imageGallery}>
            {executiveId.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </View>
        </Card>
      )} */}

      {/* Reviews Section */}
      {executiveServiceId?.customerRating &&(
      <Card title="Customer Ratings & Reviews">
        <DetailsRow label="Customer Name" value={userId?.name || 'N/A'} />
        <DetailsRow label="Customer Rating" value={renderStars(executiveServiceId.customerRating)}  />
        <DetailsRow label="Customer Review" value={executiveServiceId?.customerReview || 'N/A'} isMultiline />
      </Card>
       )}
    </ScrollView>
  );
};

/**
 * Reusable Card Component
 */
const Card = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

/**
 * Reusable Row Component for Details
 */
const DetailsRow = ({ label, value, isHighlighted, isMultiline }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    <Text
      style={[styles.value, isHighlighted && styles.highlightedValue, isMultiline && styles.multilineValue]}
      numberOfLines={isMultiline ? undefined : 1}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  servicesexeimage:{
    paddingVertical: 10,
    display:'flex',
    flexDirection:'row',
    gap:10,
    flexWrap:'wrap'
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4caf50',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    margin:10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#09b5e1',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#09b5e1',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: '40%',
  },
  value: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    width: '60%',
  },
  highlightedValue: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  multilineValue: {
    textAlign: 'left',
  },
  imageGallery: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  reviewContainer: {
    marginBottom: 12,
  },
  reviewUser: {
    fontWeight: 'bold',
    color: '#4caf50',
  },
  reviewText: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  reviewRating: {
    marginTop: 4,
    fontSize: 14,
    color: '#f57c00',
  },
    description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',

  },
    swiper: {
    height: 180,
  },
    imageContainer: {
    flexDirection: 'column', // Stack images vertically
    alignItems: 'center',   // Ensures images take full width
    justifyContent: 'center', // Centers content if needed
  },

});

export default BookingDetails;
