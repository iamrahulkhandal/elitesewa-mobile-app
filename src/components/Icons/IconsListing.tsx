import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const IconsListing = () => {
  const [iconsData, setIconsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const fetchIconsData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/icons`);
        setIconsData(response.data.icons || []); // Set fetched data to state
      } catch (error) {
        setError("Error fetching icons data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIconsData();
  }, []);


  // Render each individual icon
  const renderIcon = ({ item }: { item: any }) => {
    const { name, library, label, unicode } = item;

    let IconComponent;
    let iconName: string;

    if (library === 'Font Awesome') {
      IconComponent = FontAwesome;
      iconName = name.replace('fa-', ''); // Remove prefix if necessary
    } else if (library === 'Material Icons') {
      IconComponent = MaterialIcons;
      iconName = name.replace('material-', ''); // Remove prefix if necessary
    } else {
      return <Text style={styles.iconName}>Unsupported library: {library}</Text>;
    }

    // Render the icon or a fallback message for invalid names
    return (
      <View style={styles.iconCard}>
        {IconComponent ? (
          <IconComponent
            name={iconName}
            size={30}
            color="#000"
            onError={() => console.warn(`Invalid icon name: ${iconName}`)} // Log invalid names
            // You can also add a fallback rendering logic here for invalid icons if you prefer
          />
        ) : (
          <Text style={styles.errorText}>Icon not available</Text>
        )}
        {iconName && !IconComponent.hasOwnProperty(iconName) && (
          <Text>Warning: Unsupported icon name '{iconName}'</Text>
        )}
        <Text style={styles.iconName}>{label}</Text>
        <Text style={styles.iconDetail}>Unicode: {unicode}</Text>
        <Text style={styles.iconDetail}>Library: {library}</Text>
      </View>
    );
  };
  

  // Render each icon type and its associated icons
  const renderIconType = ({ item }: { item: any }) => (
    <View style={styles.iconTypeContainer}>
      <Text style={styles.iconType}>{item.type}</Text>
      <FlatList
        data={item.icons}
        renderItem={renderIcon}
        keyExtractor={(iconItem) => `${item.type}-${iconItem.name}`}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={iconsData}
        renderItem={renderIconType}
        keyExtractor={(item) => item.type}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  iconTypeContainer: {
    marginBottom: 16,
  },
  iconType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  iconCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  iconName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
  },
  iconDetail: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
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
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default IconsListing;
