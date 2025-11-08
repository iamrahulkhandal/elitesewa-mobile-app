
import "react-native-get-random-values"; 
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
  PermissionsAndroid,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import Geocoder from "react-native-geocoding";
import Geolocation from "react-native-geolocation-service";
import { GOOGLE_API_KEY } from "@env";
import { v4 as uuidv4 } from "uuid";
 
Geocoder.init(GOOGLE_API_KEY, { language: "en" });
const LocationMap = ({ onLocationSelect, locationData }) => {
  // Basic states
  const [location, setLocation] = useState(
    locationData || { latitude: 28.6132, longitude: 77.2092 }
  );
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState();
  const [isManualInput, setIsManualInput] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(false);

  // Additional features
  const [isTracking, setIsTracking] = useState(false); 
  const [searchHistory, setSearchHistory] = useState([]);
  
  const mapRef = useRef(null);
  const watchId = useRef(null);
  useEffect(() => {
    if (locationData && (locationData.latitude !== location.latitude || locationData.longitude !== location.longitude)) {
      setLocation(locationData);
      setQuery(locationData?.address || '');
      setSuggestions([]);
      setIsManualInput(false); // Reset manual input flag
      animateMapToLocation(locationData.latitude, locationData.longitude, 0.01);
      fetchAddressFromCoords(locationData.latitude, locationData.longitude).then((fetchedAddress) => {
        setAddress(fetchedAddress);  // Update address state
      });
    }
  }, [locationData]);
  
  
  
  
  // Update address and animate map when location changes
  useEffect(() => {
    fetchAddressFromCoords(location.latitude, location.longitude);
    animateMapToLocation(location.latitude, location.longitude, 0.01);
  }, [location]);

  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const response = await Geocoder.from(lat, lng);
      const formattedAddress =
        response.results[0]?.formatted_address || "Unknown location";
      setAddress(formattedAddress);
      return formattedAddress;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setAddress("Could not fetch address");
      return "Could not fetch address";
    }
  };

  const animateMapToLocation = (lat, lng, delta = 0.005) => {
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: delta,
        longitudeDelta: delta,
      },
      1000
    );
  };

  const fetchSuggestions = async (input) => {
    if (!input || !isManualInput) {  // Only fetch suggestions if manually typed
      setSuggestions([]);
      return;
    }
    try {
      setLoadingSuggestions(true);
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        {
          params: {
            input,
            key: GOOGLE_API_KEY,
            components: "country:in", // Restrict results to India; modify as needed
          },
        }
      );
      if (response.data.status === "OK") {
        setSuggestions(response.data.predictions);
      } else {
        console.error("Error fetching suggestions:", response.data.status);
      }
      setLoadingSuggestions(false);
    } catch (error) {
      console.error("Suggestion fetch error:", error);
      setLoadingSuggestions(false);
    }
  };

  // Debounce query changes before fetching suggestions
  useEffect(() => {
    if (isManualInput && query) {
      const timer = setTimeout(() => {
        fetchSuggestions(query);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [query, isManualInput]);
   
  

  const addToHistory = (entry) => {
    // Optionally limit history to a fixed number (here, last 5 searches)
    setSearchHistory((prev) => [entry, ...prev].slice(0, 5));
  };

  const handleSelectSuggestion = async (item) => {
    setQuery(item.description);
    setSuggestions([]);
    Keyboard.dismiss();

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id: item.place_id,
            key: GOOGLE_API_KEY,
            fields: "geometry,formatted_address",
          },
        }
      );
      if (response.data.status === "OK") {
        const details = response.data.result;
        const { lat, lng } = details.geometry.location;
        const newLocation = { id: uuidv4(), latitude: lat, longitude: lng,address: details.formatted_address};
        setLocation(newLocation);
        setAddress(details.formatted_address);
        onLocationSelect(newLocation);
        animateMapToLocation(lat, lng, 0.015);
        addToHistory({
          id: uuidv4(),
          description: details.formatted_address,
          location: newLocation,
        });
      } else {
        Alert.alert("Error", "Could not fetch place details");
      }
    } catch (error) {
      console.error("Place details error:", error);
      Alert.alert("Error", "An error occurred while fetching place details");
    }
  };

  const getCurrentLocation = async () => {
    setLoadingCurrent(true);
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'EliteSewa needs your location to find nearby service providers and enable location-based service booking.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Location permission is required to find nearby service providers. You can enable it in your device settings.");
          setLoadingCurrent(false);
          return;
        }
      }
      Geolocation.getCurrentPosition(
        async (position) => {
          setLoadingCurrent(false);
          const { latitude, longitude } = position.coords;
          const newLocation = { id: uuidv4(), latitude, longitude };
          setLocation(newLocation);
          const fetchedAddress = await fetchAddressFromCoords(latitude, longitude);
          setAddress(fetchedAddress);
          onLocationSelect(newLocation);
          animateMapToLocation(latitude, longitude, 0.015);
          addToHistory({ id: uuidv4(), description: fetchedAddress, location: newLocation,address:query });
        },
        (error) => {
          setLoadingCurrent(false);
          console.error("Current location error:", error);
          Alert.alert("Error", "Unable to fetch current location");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      setLoadingCurrent(false);
      console.error("Current location error:", error);
      Alert.alert("Error", "An error occurred while fetching current location");
    }
  };

  const toggleTracking = async () => {
    if (!isTracking) {
      // Start tracking continuously
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'EliteSewa needs your location to track service provider location during service delivery and provide real-time updates.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission Denied", "Location permission is required for service tracking. You can enable it in your device settings.");
            return;
          }
        }
        watchId.current = Geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = { id: uuidv4(), latitude, longitude };
            setLocation(newLocation);
            const fetchedAddress = await fetchAddressFromCoords(latitude, longitude);
            setAddress(fetchedAddress);
            onLocationSelect(newLocation);
            animateMapToLocation(latitude, longitude, 0.015);
          },
          (error) => {
            console.error("Tracking error:", error);
          },
          { enableHighAccuracy: true, distanceFilter: 10, interval: 5000, fastestInterval: 2000 }
        );
        setIsTracking(true);
      } catch (error) {
        console.error("Error starting tracking:", error);
      }
    } else {
      // Stop continuous tracking
      if (watchId.current != null) {
        Geolocation.clearWatch(watchId.current);
      }
      setIsTracking(false);
    }
  };

  const handleHistorySelect = (entry) => {
    setQuery(entry.description);
    setLocation(entry.location);
    setAddress(entry.description);
    onLocationSelect(entry.location);
    animateMapToLocation(entry.location.latitude, entry.location.longitude, 0.015);
  };

  return (
    <View style={styles.container}>
      {/* Custom Autocomplete & Search History */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for an address"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setIsManualInput(true);  // Set flag to indicate manual input
          }}
        />
        {loadingSuggestions && <ActivityIndicator size="small" color="#007AFF" />}
        {suggestions.length > 0 && (
          <FlatList
            style={styles.suggestionList}
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {/* {searchHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Recent Searches:</Text>
            <FlatList
              data={searchHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.historyItem} onPress={() => handleHistorySelect(item)}>
                  <Text>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )} */}
      </View>

      {/* MapView with Marker */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          }}
        >
          <Marker coordinate={location} />
        </MapView>
      </View>

      {/* Display Selected Address */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>📍 {address || "Select a location"}</Text>
      </View>

      {/* Current Location Button */}
      {/* <TouchableOpacity style={styles.currentLocationButton} onPress={getCurrentLocation}>
        {loadingCurrent ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Use Current Location</Text>
        )}
      </TouchableOpacity> */}

      {/* Tracking Toggle Button */}
      {/* <TouchableOpacity style={styles.trackingButton} onPress={toggleTracking}>
        <Text style={styles.buttonText}>{isTracking ? "Stop Tracking" : "Follow Me"}</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 ,marginBottom:10},
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 2,
    right: 2,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
  },
  label: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    color: 'inherit',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    height: 45,
  },
  suggestionList: {
    backgroundColor: "white",
    marginTop: 5,
    borderRadius: 5,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  historyContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 5,
  },
  historyTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  historyItem: {
    paddingVertical: 5,
  },
  mapContainer: {
    height: 350,
    width: "100%",
    marginTop: 100,
  },
  map: { flex: 1 },
  addressContainer: {
    position: "absolute",
    bottom: 160,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addressText: {
    fontSize: 14,
    fontWeight: "600",
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 100,
    left: 10,
    right: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  trackingButton: {
    position: "absolute",
    bottom: 40,
    left: 10,
    right: 10,
    backgroundColor: "#FF9500",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default LocationMap;
