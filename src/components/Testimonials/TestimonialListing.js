import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { useSelector } from "react-redux"; // Import to access Redux state
import axios from "axios";
import { REACT_NATIVE_SERVER_URL } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const TestimonialListing = () => {
  const { user } = useSelector((state) => state.auth); // Access user details from Redux
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from the server
  const fetchTestimonials = async () => {
    try {
      if (!user) {
        Alert.alert("Authentication Error", "You must be logged in to view testimonials.");
        return;
      }

      const response = await axios.get(`${REACT_NATIVE_SERVER_URL}/api/testimonials`, {
        params: {
          username: user, // Send the username as a query parameter
        },
      });
      setTestimonials(response.data);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [user]);

  // Render each testimonial item
  const renderTestimonialItem = ({ item }) => {
    const profilePicture = item.userProfilePicture
      ? `${REACT_NATIVE_SERVER_URL}${item.userProfilePicture}` // If the userProfilePicture exists, use it
      : "/uploads/noimage.png"; // Default image path if the userProfilePicture is null or not available

    // Render stars based on rating
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

    return (
      <View style={styles.testimonialCard}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: profilePicture }} // Use the profile picture URL
            style={styles.profilePicture}
          />
          <View>
            <Text style={styles.userName}>{item.name}</Text>
            <View style={styles.rating}>
              {renderStars(item.rating)} 
            </View>
          </View>
        </View>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }
 
  return (
    <View style={styles.container}>
      <FlatList
        data={testimonials}
        renderItem={renderTestimonialItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No testimonials available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  testimonialCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    flexDirection: "row",  
  },
  message: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

export default TestimonialListing;
