import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAppSelector } from '../../store/hooks'; // Import to access Redux state
import axios from "axios";
import { API_URL } from "@env";

const TestimonialCreate = ({ onSuccess }) => {
  const { user } = useAppSelector((state) => state.auth); // Access user details from Redux
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !message) {
      Alert.alert("Validation Error", "Please provide a rating and message.");
      return;
    }

    if (!user) {
      Alert.alert("Authentication Error", "You must be logged in to submit a testimonial.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("message", message);
    formData.append("userName", user); // Assuming user.username contains the mobile number
    if (user.profilePicture) {
      formData.append("userProfilePicture", user.profilePicture);
    }

    try {
      await axios.post(`${API_URL}/api/testimonials`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", "Testimonial submitted successfully!");
      setRating("");
      setMessage("");
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to submit testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rating (1–5):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter rating"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <Text style={styles.label}>Message:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Testimonial</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  textArea: {
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 4,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default TestimonialCreate;
