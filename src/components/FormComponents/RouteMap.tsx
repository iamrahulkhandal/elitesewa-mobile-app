import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Keyboard, 
  Dimensions 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type RouteMapProps = { onRouteSelect: (...args: any[]) => void; routeData?: any };

const RouteMap = ({ onRouteSelect, routeData = { origin: null, destination: null }}: RouteMapProps) => {

  // State for "From" (origin)
  const [originQuery, setOriginQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [origin, setOrigin] = useState<any | null>(null);
  
  // State for "To" (destination)
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [destination, setDestination] = useState<any | null>(null);

  const [distance, setDistance] = useState<any | null>(null);
  const [duration, setDuration] = useState<any | null>(null);
  
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (routeData?.origin && routeData?.destination) {
      setOrigin(routeData.origin|| '');
      setDestination(routeData.destination || '');

      // Set originQuery and destinationQuery without triggering suggestions
      setOriginQuery(routeData.origin.address || '');
      setDestinationQuery(routeData.destination.address || '');
       
      // Clear suggestions immediately
      setOriginSuggestions([]);
      setDestinationSuggestions([]);
    }
  }, [routeData]);
  // Fetch suggestions using Google Places Autocomplete API
  const fetchSuggestions = async (input: any, setSuggestions: any, setLoading: any) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input,
            key: GOOGLE_API_KEY,
            components: 'country:in',
          },
        }
      );
      if (response.data.status === 'OK') {
        setSuggestions(response.data.predictions);
      } else if (response.data.status === 'ZERO_RESULTS') {
        setSuggestions([]);
      } else {
        console.error('Error fetching suggestions:', response.data.status);
      }
    } catch (error) {
      console.error('Suggestion fetch error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (originQuery && originQuery !== routeData?.origin?.address) {
      const timer = setTimeout(() => { 
        fetchSuggestions(originQuery, setOriginSuggestions, setOriginLoading);
      }, 500);
      return () => clearTimeout(timer);
    } else { 
      setOriginSuggestions([]);
    }
  }, [originQuery, routeData]);
  

  useEffect(() => {
    if (destinationQuery && destinationQuery !== routeData?.destination?.address) {
      const timer = setTimeout(() => {
        fetchSuggestions(destinationQuery, setDestinationSuggestions, setDestinationLoading);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setDestinationSuggestions([]);
    }
  }, [destinationQuery]);


  // Helper to get place details
  const getPlaceDetails = async (placeId: any) => {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
            fields: 'geometry,formatted_address',
          },
        }
      );
      if (response.data.status === 'OK') {
        return response.data.result;
      } else {
        console.error('Error fetching place details:', response.data.status);
        return null;
      }
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  };

  // When an origin suggestion is selected
  const handleSelectOrigin = async (item: any) => {
    setOriginQuery(item.description);
    setOriginSuggestions([]);
    Keyboard.dismiss();
    const details = await getPlaceDetails(item.place_id);
    if (details?.geometry?.location) {
      setOrigin({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: details.formatted_address || item.description,
      });
    }
  };

  // When a destination suggestion is selected
  const handleSelectDestination = async (item: any) => {
    setDestinationQuery(item.description);
    setDestinationSuggestions([]);
    Keyboard.dismiss();
    const details = await getPlaceDetails(item.place_id);
    if (details?.geometry?.location) {
      setDestination({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: details.formatted_address || item.description,
      });
    } 
  };

  // Call onRouteSelect when both origin and destination are set
  useEffect(() => {
    if (origin && destination && onRouteSelect) {
      
      onRouteSelect({ origin, destination,distance,duration});
    }
  }, [origin, destination, onRouteSelect,distance]); 

  return (  
    <View style={styles.container}>
      {/* Origin Search */}
      <View style={styles.searchSection}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input} 
          placeholder="From"
          value={originQuery}
          onChangeText={setOriginQuery}
        />
        
        {originLoading && <ActivityIndicator size="small" color="#007AFF" />}
        <FlatList
          data={originSuggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectOrigin(item)}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Destination Search */}
      <View style={[styles.searchSection, { marginTop: 10 }]}>
      <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          placeholder="To"
          value={destinationQuery}
          onChangeText={setDestinationQuery}
        />
        {destinationLoading && <ActivityIndicator size="small" color="#007AFF" />}
        <FlatList
          data={destinationSuggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectDestination(item)}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: origin ? origin.latitude : 28.6132,
          longitude: origin ? origin.longitude : 77.2092,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {origin && <Marker coordinate={origin} title="Origin" description={origin.address} />}
        {destination && <Marker coordinate={destination} title="Destination" description={destination.address} />}
        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor="#1E90FF"
            optimizeWaypoints={true}
            onReady={(result) => {
              setDistance(result.distance);
              setDuration(result.duration);
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { right: 50, bottom: 50, left: 50, top: 50 },
              });
            }}
            onError={(errorMessage) => {
              console.error("Directions error:", errorMessage);
            }}
          />
        )}
      </MapView>

      {distance && duration && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Distance: {distance.toFixed(2)} km | Duration: {Math.ceil(duration)} mins
          </Text>
        </View>
      )}
    </View>
  ); 
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchSection: {
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 10,
    zIndex: 1,
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
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  // Fixed map height for visibility
  map: {
    height: 300,
    marginTop: 20,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RouteMap;