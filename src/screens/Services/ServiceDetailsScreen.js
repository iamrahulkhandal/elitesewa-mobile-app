import React from 'react';
import { ScrollView } from 'react-native-virtualized-view'
import { View, Text, StyleSheet, Image, TouchableOpacity,FlatList } from 'react-native';

const ServiceDetailsScreen = ({ route }) => {
    const { service } = route.params;

  return (
    <View style={styles.container}>
<ScrollView nestedScrollEnabled={true} style={{ width: "100%" }} >
      {/* Header Image */}
      <Image
        source={{ uri: 'https://www.obsessedgarage.com/cdn/shop/articles/Banner_Image_Template_5ca020fa-f643-4599-afb2-f6df4974d328.png?v=1648755806' }} // Replace with your image URL
        style={styles.headerImage}
      />

      {/* Service Title */}
      <Text style={styles.title}>{service.name}</Text>

      {/* Service Description */}
      <Text style={styles.description}>
         {service.description}
      </Text>

      {/* Service Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Features:</Text>
        <FlatList
        data={service.features}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
              <Text style={styles.featureItem}>• {item.feature}</Text>
            </TouchableOpacity>
        )}
      />
      </View>

      {/* Price and Booking */}
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Price:</Text>
        <Text style={styles.price}>₹ {service.price}</Text>
      </View>

      {/* Book Now Button */}
      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>

      {/* Additional Information */}
      <View style={styles.additionalInfo}>
      <Text style={styles.additionalTitle}>Additional Information:</Text>
      <FlatList
        data={service.additionalInfo}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <Text style={styles.additionalItem}>• {item.feature}</Text>
            </TouchableOpacity>
        )}
      />
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  featuresContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 18,
    color: '#333',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  bookButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  bookButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  additionalInfo: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom:20
  },
  additionalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  additionalItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});

export default ServiceDetailsScreen;