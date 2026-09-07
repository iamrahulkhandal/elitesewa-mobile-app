import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Geocoder from "react-native-geocoding";
import axios from "axios";
import { GOOGLE_API_KEY } from "@env";
import MapView, { Marker, Polyline } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

// Initialize Geocoding with API Key
Geocoder.init(GOOGLE_API_KEY);

const DistanceCalculator = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [distance, setDistance] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [route, setRoute] = useState(null);

  // Fetch location suggestions
  const fetchSuggestions = async (input, setSuggestions) => {
    if (input.length < 3) return;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}&types=geocode`;

    try {
      const response = await axios.get(url);
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };

  // Handle selection of a suggested location
  const handleSelection = async (placeId, setLocation, setAddress, setSuggestions) => {
    try {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`;
      const response = await axios.get(detailsUrl);

      if (response.data.status === "OK") {
        const location = response.data.result.geometry.location;
        setLocation(location);
        setAddress(response.data.result.formatted_address);
      }
    } catch (error) {
      console.error("Error fetching location details:", error.message);
    }
    setSuggestions([]);
  };

  // Calculate distance and route
  const calculateDistance = async () => {
    if (!pickupLocation || !dropLocation) {
      Alert.alert("Error", "Please select both pickup and drop locations.");
      return;
    }

    try {
      // Fetch route details
      const routeUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLocation.lat},${pickupLocation.lng}&destination=${dropLocation.lat},${dropLocation.lng}&key=${GOOGLE_API_KEY}`;
      const routeResponse = await axios.get(routeUrl);

      if (routeResponse.data.status === "OK") {
        setRoute(routeResponse.data.routes[0].overview_polyline.points);
      } else {
        setRoute(null);
        Alert.alert("Error", "Failed to fetch the route.");
      }

      // Fetch distance
      const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickupLocation.lat},${pickupLocation.lng}&destinations=${dropLocation.lat},${dropLocation.lng}&key=${GOOGLE_API_KEY}`;
      const distanceResponse = await axios.get(distanceUrl);

      if (
        distanceResponse.data.status === "OK" &&
        distanceResponse.data.rows[0]?.elements[0]?.status === "OK"
      ) {
        setDistance(distanceResponse.data.rows[0].elements[0].distance.text);
      } else {
        setDistance("Distance not available.");
      }
    } catch (error) {
      console.error("Error calculating distance:", error.message);
      Alert.alert("Error", "Failed to calculate distance.");
    }
  };

  // Fetch current location and reverse geocode to get the name
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode the current location
        Geocoder.from(latitude, longitude)
          .then((json) => {
            const address = json.results[0]?.formatted_address;
            setPickup(address); // Display the address as the name of current location
            setPickupLocation({ lat: latitude, lng: longitude });
          })
          .catch((error) => {
            Alert.alert("Error", "Unable to fetch location name.");
            console.error("Geocoding error:", error);
          });
      },
      (error) => {
        Alert.alert("Error", "Unable to fetch current location.");
        console.error(error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  // Handle marker drag end for updating location
  const handleMarkerDragEnd = (e, setLocation, setAddress) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    // Reverse geocode the new marker position
    Geocoder.from(latitude, longitude)
      .then((json) => {
        const address = json.results[0]?.formatted_address;
        setAddress(address);
        setLocation({ lat: latitude, lng: longitude });
      })
      .catch((error) => {
        Alert.alert("Error", "Unable to fetch new location name.");
        console.error("Geocoding error:", error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Pickup Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Pickup Location"
        value={pickup}
        onChangeText={(text) => {
          setPickup(text);
          fetchSuggestions(text, setPickupSuggestions);
        }}
      />
      {/* Pickup Suggestions */}
      <FlatList
        data={pickupSuggestions}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestion}
            onPress={() => handleSelection(item.place_id, setPickupLocation, setPickup, setPickupSuggestions)}
          >
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
      {/* Button to get current location */}
      <Button title="Use Current Location" onPress={getCurrentLocation} />

      {/* Drop Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Drop Location"
        value={drop}
        onChangeText={(text) => {
          setDrop(text);
          fetchSuggestions(text, setDropSuggestions);
        }}
      />
      {/* Drop Suggestions */}
      <FlatList
        data={dropSuggestions}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestion}
            onPress={() => handleSelection(item.place_id, setDropLocation, setDrop, setDropSuggestions)}
          >
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Calculate Distance" onPress={calculateDistance} />
      {distance && <Text style={styles.result}>Distance: {distance}</Text>}

      {/* Map Display */}
      {(pickupLocation || dropLocation) && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: pickupLocation?.lat || 0,
            longitude: pickupLocation?.lng || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {pickupLocation && (
            <Marker
              coordinate={{ latitude: pickupLocation.lat, longitude: pickupLocation.lng }}
              title="Pickup"
              draggable
              onDragEnd={(e) => handleMarkerDragEnd(e, setPickupLocation, setPickup)}
            />
          )}
          {dropLocation && (
            <Marker
              coordinate={{ latitude: dropLocation.lat, longitude: dropLocation.lng }}
              title="Drop"
              draggable
              onDragEnd={(e) => handleMarkerDragEnd(e, setDropLocation, setDrop)}
            />
          )}
          {route && <Polyline coordinates={decodePolyline(route)} strokeColor="#0000FF" strokeWidth={3} />}
        </MapView>
      )}
    </View>
  );
};

// Function to decode polyline string into coordinates
const decodePolyline = (encoded) => {
  let polyline = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    let deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    let deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    polyline.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return polyline;
};

export default DistanceCalculator;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  suggestion: { padding: 10, backgroundColor: "#f9f9f9", borderBottomWidth: 1 },
  result: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
  map: { width: "100%", height: 300, marginTop: 20 },
});
