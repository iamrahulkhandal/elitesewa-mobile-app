import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { AppNavigation } from '../../types/navigation';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import { ensureCameraPermission } from '../../utils/cameraPermission';
import RNPickerSelect from 'react-native-picker-select';
import { API_URL } from '@env';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import YoutubeIframe from 'react-native-youtube-iframe';

type ServicesCreateProps = { navigation: AppNavigation };

const ServicesCreate = ({ navigation }: ServicesCreateProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    duration: '',
    videoUrl: '',
    categoryId: '',
    isPopular: false,
    isShowing:false,
    icon: '',
    iconLib: '',
  });

  const [images, setImages] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [videoId, setVideoId] = useState<any | null>(null);
  const [isVideoValid, setIsVideoValid] = useState(true);
  const [availableIcons, setAvailableIcons] = useState<any[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<any | null>(null);
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState([{ parentId: null, items: [], selectedId: null }]);

  // New state for plans
  const [plans, setPlans] = useState([{ name: '', price: '', duration: '', keyPoints: [''] }]);

  const richText = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAvailableIcons();
      await fetchTopLevelCategories();
    };
    fetchData();
  }, []);

  // Fetch available icons and categories
  const fetchAvailableIcons = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/icons`);
      setAvailableIcons(Array.isArray(response.data.icons) ? response.data.icons : []);
    } catch (error) {
      console.error('Error fetching icons:', error);
      Alert.alert('Error', 'Failed to fetch icons. Please try again later.');
    }
  }, []);

  const fetchTopLevelCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      const topLevelCategories = response.data.filter((cat: any) => cat.parentId === null);
      setDropdownData([{ parentId: null, items: formatPickerItems(topLevelCategories), selectedId: null }]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const formatPickerItems = useCallback((categories: any) => {
    return categories.map((category: any) => ({
      label: category.name,
      value: category._id,
    }));
  }, []);

  const fetchChildCategories = async (parentId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/categories/parent/${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching child categories:', error);
      return [];
    }
  };

  const handleCategorySelect = useCallback(async (selectedId: any, level: any) => {
    setDropdownData(prevData => {
      const updatedDropdownData = [...prevData.slice(0, level + 1)];
      updatedDropdownData[level] = { ...updatedDropdownData[level], selectedId };
      return updatedDropdownData;
    });
    try {
      const childCategories = await fetchChildCategories(selectedId);
      if (childCategories && childCategories.length > 0) {
        setDropdownData(prevData => {
          const updatedDropdownData = [...prevData];
          const childDropdownExists = updatedDropdownData.some(data => data.parentId === selectedId);
          if (!childDropdownExists) {
            updatedDropdownData.push({
              parentId: selectedId,
              items: formatPickerItems(childCategories),
              selectedId: null,
            });
          }
          return updatedDropdownData;
        });
      }
    } catch (error) {
      console.error('Error fetching child categories:', error);
    }
  }, [fetchChildCategories, formatPickerItems]);

  // Handle video URL validation
  useEffect(() => {
    if (formData.videoUrl) {
      const videoId = extractVideoId(formData.videoUrl);
      setVideoId(videoId);
      setIsVideoValid(!!videoId);
    } else {
      setVideoId(null);
      setIsVideoValid(true);
    }
  }, [formData.videoUrl]);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handle image upload
  const handleImageUpload = async (isBanner = false) => {
    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) return;

    // Camera only — users must capture a live photo, not pick from the gallery.
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    });
    if (result.didCancel || !result.assets || result.assets.length === 0)
      return;

    const uri = result.assets[0].uri;
    // console.log(uri);
    
    if (isBanner) {
      setBanners(prevBanners => [...prevBanners, uri]);
    } else {
      setImages(prevImages => [...prevImages, uri]);
    }
  };

  // Plan management functions
  const addPlan = () => {
    setPlans([...plans, { name: '', price: '', duration: '', keyPoints: [''] }]);
  };

  const removePlan = (index: number) => {
    const newPlans = [...plans];
    newPlans.splice(index, 1);
    setPlans(newPlans);
  };

  const handlePlanChange = (index: number, field: string, value: any) => {
    const newPlans = [...plans];
    (newPlans[index] as Record<string, any>)[field] = value;
    setPlans(newPlans);
  };

  const addKeyPoint = (planIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].keyPoints.push('');
    setPlans(newPlans);
  };

  const removeKeyPoint = (planIndex: number, keyPointIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex].keyPoints.splice(keyPointIndex, 1);
    setPlans(newPlans);
  };

  const handleKeyPointChange = (planIndex: number, keyPointIndex: number, value: any) => {
    const newPlans = [...plans];
    newPlans[planIndex].keyPoints[keyPointIndex] = value;
    setPlans(newPlans);
  };

  // Validate form data, including plans and key points
  const validateFormData = () => {
    const { name, description, duration, videoUrl, categoryId } = formData;
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Service name is required.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Description is required.');
      return false;
    }
    if (!duration.trim() || isNaN(Number(duration))) {
      Alert.alert('Validation Error', 'Duration must be a valid number.');
      return false;
    }
    if (videoUrl && !isVideoValid) {
      Alert.alert('Validation Error', 'Please enter a valid YouTube video URL.');
      return false;
    }
    const lastSelectedId = dropdownData.slice().reverse().find(data => data.selectedId !== null)?.selectedId || null;
    if (!lastSelectedId) {
      Alert.alert('Validation Error', 'Please select a category.');
      return false;
    }
    if (!selectedIcon) {
      Alert.alert('Validation Error', 'Please select an icon.');
      return false;
    }

    // Validate plans and key points
    for (const plan of plans) {
      if (!plan.name.trim() || !plan.price.trim() || !plan.duration.trim()) {
        Alert.alert('Validation Error', 'Please fill out all fields for each plan.');
        return false;
      }
      for (const keyPoint of plan.keyPoints) {
        if (!keyPoint.trim()) {
          Alert.alert('Validation Error', 'All key points must be filled.');
          return false;
        }
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateFormData()) return;

    const lastSelectedId = dropdownData.slice().reverse().find(data => data.selectedId !== null)?.selectedId || null;
    const updatedFormData = { ...formData, categoryId: lastSelectedId };

    setLoading(true);
    try {
      const uploadData = new FormData();
      Object.keys(updatedFormData).forEach(key => {
        // console.log(key);

        uploadData.append(key, (updatedFormData as Record<string, any>)[key]);
      });

      // Append plans data to the uploadData
      // Append plans data to the uploadData
      plans.forEach((plan, index) => {
        // Append plan fields individually
        uploadData.append(`plans[${index}][name]`, plan.name);
        uploadData.append(`plans[${index}][price]`, plan.price);
        uploadData.append(`plans[${index}][duration]`, plan.duration);

        // Append each key point in the plan
        plan.keyPoints.forEach((keyPoint, keyPointIndex) => {
          uploadData.append(`plans[${index}][keyPoints][${keyPointIndex}]`, keyPoint);
        });
      });

      // Add images and banners to upload data
      images.forEach((uri, i) => {
        uploadData.append('images', {
          uri,
          type: 'image/jpeg',
          name: `image-${i}.jpg`,
        });
      });
      banners.forEach((uri, i) => {
        uploadData.append('banners', {
          uri,
          type: 'image/jpeg',
          name: `banner-${i}.jpg`,
        });
      });
      // console.log(uploadData);

      await axios.post(`${API_URL}/api/services`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Service created successfully');
      // navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', `Failed to create service: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const getCleanedIconName = (iconName: string, library: string) => {
    return library === 'Material Icons'
      ? iconName.replace('material-', '')
      : library === 'Font Awesome'
        ? iconName.replace('fa-', '')
        : iconName;
  };

  const renderIcon = ({ item }: { item: any }) => {
    return (
      <View style={styles.iconContainer}>
        {item.icons.map((icon: any) => {
          const IconComponent =
            icon.library === 'Font Awesome' ? FontAwesome : MaterialIcons;
          const iconName = getCleanedIconName(icon.name, icon.library);

          return (
            <TouchableOpacity
              onPress={() => handleIconSelect(iconName, icon.library)}
              key={icon._id}
              style={styles.iconButton}>
              <IconComponent name={iconName} size={30} color="#000" />
              <Text style={styles.iconLabel}>{icon.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const handleIconSelect = (iconName: string, library: string) => {
    const cleanedIconName = getCleanedIconName(iconName, library);
    setSelectedIcon(cleanedIconName);
    setIsIconModalVisible(false);
    setFormData({ ...formData, icon: cleanedIconName, iconLib: library });
  };


  const renderSelectedIconPreview = () => {
    if (!selectedIcon) return null;
    const IconComponent =
      formData.iconLib === 'Font Awesome' ? FontAwesome : MaterialIcons;
    return (
      <View>
        <Text>Selected Icon:</Text>
        <IconComponent name={selectedIcon} size={40} color="#007BFF" />
      </View>
    );
  };

  const renderImagePreviews = (imageList: any, isBanner = false) => {
    if (imageList.length === 0) return null;

    return (
      <View style={styles.imagePreviewContainer}>
        {imageList.map((uri: string, index: number) => (
          <Image
            key={`${isBanner ? 'banner' : 'image'}-${index}-${uri}`}
            source={{uri}}
            style={isBanner ? styles.bannerPreview : styles.imagePreview}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Create Service</Text>
        {renderSelectedIconPreview()}

        {/* Icon Selection */}
        <TouchableOpacity onPress={() => setIsIconModalVisible(true)} style={styles.iconSelectButton}>
          <Text style={styles.iconSelectText}>{formData.icon || 'Select Icon'}</Text>
        </TouchableOpacity>

        {/* Service Form */}
        <TextInput
          style={styles.input}
          placeholder="Service Name"
          value={formData.name}
          onChangeText={text => setFormData({ ...formData, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={formData.description}
          onChangeText={text => setFormData({ ...formData, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Long Description"
          value={formData.longDescription}
          onChangeText={text => setFormData({ ...formData, longDescription: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration (in minutes)"
          value={formData.duration}
          onChangeText={text => setFormData({ ...formData, duration: text })}
          keyboardType="numeric"
        />

        {/* YouTube Video URL */}
        <Text style={styles.label}>YouTube Video URL</Text>
        <TextInput
          style={[styles.input, !isVideoValid && { borderColor: 'red', borderWidth: 1 }]}
          value={formData.videoUrl}
          onChangeText={text => setFormData({ ...formData, videoUrl: text })}
          placeholder="Enter YouTube video URL"
        />

        {videoId && isVideoValid && (
          <View>
            <YoutubeIframe height={200} videoId={videoId} play={false} />
          </View>
        )}

        {/* Category and Subcategory Dropdown */}
        {dropdownData.map((data, index) => (
          <RNPickerSelect
            key={index}
            placeholder={{ label: `Select ${index === 0 ? 'Category' : 'Subcategory'}...`, value: null }}
            onValueChange={value => handleCategorySelect(value, index)}
            items={data.items}
          />
        ))}

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Popular Service</Text>
        <Switch
          value={formData.isPopular}
          onValueChange={value => setFormData({ ...formData, isPopular: value })}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Hide Service in listing</Text>
        <Switch
          value={formData.isShowing}
          onValueChange={value => setFormData({ ...formData, isShowing: value })}
        />
      </View>
        {/* Plans Section */}
        <Text style={styles.headerText}>Plans</Text>
        {plans.map((plan, index) => (
          <View key={index} style={styles.planContainer}>
            <TextInput
              style={styles.input}
              placeholder="Plan Name"
              value={plan.name}
              onChangeText={text => handlePlanChange(index, 'name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={plan.price}
              onChangeText={text => handlePlanChange(index, 'price', text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Duration"
              value={plan.duration}
              onChangeText={text => handlePlanChange(index, 'duration', text)}
              keyboardType="numeric"
            />
            {/* Key Points */}
            <Text style={styles.label}>Key Points</Text>
            {plan.keyPoints.map((keyPoint, keyIndex) => (
              <View key={keyIndex} style={styles.keyPointContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Key Point"
                  value={keyPoint}
                  onChangeText={text => handleKeyPointChange(index, keyIndex, text)}
                />
                <TouchableOpacity onPress={() => removeKeyPoint(index, keyIndex)} style={styles.removeKeyPointButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => addKeyPoint(index)} style={styles.addKeyPointButton}>
              <Text style={styles.addButtonText}>Add Key Point</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removePlan(index)} style={styles.removePlanButton}>
              <Text style={styles.removeButtonText}>Remove Plan</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addPlan} style={styles.addPlanButton}>
          <Text style={styles.addButtonText}>Add Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleImageUpload()}
          style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Images</Text>
        </TouchableOpacity>
        {renderImagePreviews(images)}

        <TouchableOpacity
          onPress={() => handleImageUpload(true)}
          style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Banners</Text>
        </TouchableOpacity>
        {renderImagePreviews(banners, true)}

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Icon Selection Modal */}
      <Modal visible={isIconModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={availableIcons}
            renderItem={renderIcon}
            keyExtractor={item => item._id}
            numColumns={3}
          />
          <Button title="Close" onPress={() => setIsIconModalVisible(false)} />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  iconSelectButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 12,
  },
  iconSelectText: {
    fontSize: 16,
    color: '#333',
  },
  planContainer: {
    marginBottom: 16,
  },
  keyPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addKeyPointButton: {
    backgroundColor: '#28A745',
    padding: 8,
    borderRadius: 5,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  removeKeyPointButton: {
    backgroundColor: '#FF6347',
    padding: 4,
    borderRadius: 5,
    marginLeft: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  removePlanButton: {
    backgroundColor: '#FF6347',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  addPlanButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 5,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  iconButton: {
    alignItems: 'center',
    margin: 10,
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 14,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 4,
  },
  bannerPreview: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 4,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
});

export default ServicesCreate;
