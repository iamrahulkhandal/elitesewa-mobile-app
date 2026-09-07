import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, TextInput,Switch, Button, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Image, ScrollView, Keyboard,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import { ensureCameraPermission } from '../../utils/cameraPermission';
import RNPickerSelect from 'react-native-picker-select';
import {API_URL} from '@env';
import YoutubeIframe from 'react-native-youtube-iframe';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fileUrl, isLocalUri } from '../../utils/fileUrl';

const ServicesEdit = ({navigation, route}) => {
  const {serviceId} = route.params;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    duration: '',
    videoUrl: '',
    categoryId: '',
    isPopular: false,
    isShowing: false,
    icon: '',
    iconLib: '',
  });
  const [isUpload, setIsUpload] = useState(false);
  const [images, setImages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [dropdownData, setDropdownData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [parentCategories, setParentCategories] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [isVideoValid, setIsVideoValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [availableIcons, setAvailableIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedIconLib, setSelectedIconLib] = useState(null);
  const [isIconModalVisible, setIsIconModalVisible] = useState(false);
  const [plans, setPlans] = useState([{ name: '', price: '', duration: '', keyPoints: [''] }]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAvailableIcons();

      await fetchServiceData();
    };
    fetchData();
  }, []);

  const getParentChildRelations = async categoryId => {
    try {
      const response = await axios.get(
        `${API_URL}/api/categories/parents/${categoryId}`,
      );
      return response.data; // Assuming this returns an array of parent categories
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      return [];
    }
  };

  const fetchCategoriesByParentId = async parentId => {
    try {
      const response = await axios.get(
        `${API_URL}/api/categories/parent/${parentId}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching child categories:', error);
      return [];
    }
  };

  const fetchServiceData = async () => {
    try {
      // Fetching main service data
      const {data} = await axios.get(
        `${API_URL}/api/services/${serviceId}`,
      );
      // Destructure service data with default fallbacks
      const {
        name = '',
        description = '',
        longDescription = '',
        duration = '',
        videoUrl = '',
        icon = '',
        iconLib = '',
        images: serviceImages = [],
        banners: serviceBanners = [],
        categoryId = '',
        isPopular = false, // <-- added this line
        isShowing = false, // <-- added this line
      } = data;

      // Set the form data state
      setFormData({
        name,
        description,
        longDescription,
        duration,
        videoUrl,
        icon,
        iconLib,
        categoryId,
        isPopular,
        isShowing,
      });
      setSelectedIcon(icon ? icon : null);
      setSelectedIconLib(iconLib ? iconLib : null);
      setImages(serviceImages);
      setBanners(serviceBanners);
      setSelectedCategory(categoryId);

      // console.log('Selected Category ID:', categoryId);

      // Fetch parent categories for the selected category
      const parentChildRelationData = await getParentChildRelations(categoryId);

      // Map parent-child relationships and fetch child categories in parallel
      const newDropdownData = await Promise.all(
        (parentChildRelationData || []).map(async cat => {
          try {
            const dropdownCategories = await fetchCategoriesByParentId(
              cat.parentId,
            );
            return {
              parentId: cat.parentId,
              items: formatPickerItems(dropdownCategories || []),
              selectedId: cat._id,
            };
          } catch (error) {
            console.error(
              `Failed to fetch categories for parent ID ${cat.parentId}:`,
              error,
            );
            return {parentId: cat.parentId, items: [], selectedId: null};
          }
        }),
      );

      setDropdownData(newDropdownData);
      setPlans(data.plans);
    } catch (error) {
      console.error('Error fetching service data:', error);
      Alert.alert('Error', 'Failed to fetch service data. Please try again.');
    }
  };

  const fetchAvailableIcons = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/icons`);
      setAvailableIcons(response.data.icons || []);
    } catch (error) {
      console.error('Error fetching icons:', error);
      Alert.alert('Error', 'Failed to fetch icons. Please try again later.');
    }
  }, []);
  const formatPickerItems = useCallback(categories => {
    return categories.map(category => ({
      label: category.name,
      value: category._id,
    }));
  }, []);

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

  const extractVideoId = url => {
    const regex = /(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

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
    if (isBanner) {
      setBanners(prevBanners => [...prevBanners, uri]);
    } else {
      setImages(prevImages => [...prevImages, uri]);
    }
  };

  const validateFormData = () => {
    const {name, description, duration, videoUrl, categoryId} = formData;

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
      Alert.alert(
        'Validation Error',
        'Please enter a valid YouTube video URL.',
      );
      return false;
    }
    if (!categoryId) {
      Alert.alert('Validation Error', 'Please select a category.');
      return false;
    }
    if (!selectedIcon) {
      Alert.alert('Validation Error', 'Please select an icon.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateFormData()) return;
  
    const lastSelectedId = dropdownData
      .slice()
      .reverse()
      .find(data => data.selectedId !== null)?.selectedId || null;
  
    const updatedFormData = { ...formData, categoryId: lastSelectedId };
    setLoading(true);
    try {
      const uploadData = new FormData();
  
      // Append all regular form fields
      Object.keys(updatedFormData).forEach(key => {
        uploadData.append(key, updatedFormData[key]);
      });

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
      // Handle images
      images.forEach((uri, index) => {
        if (isLocalUri(uri)) {
          const imageFile = {
            uri,
            type: uri.endsWith('.png') ? 'image/png' : 'image/jpeg',
            name: `image-${index}.jpg`,
          };
          uploadData.append('images', imageFile);
        } else {
          // Anything that is not a freshly picked file is an existing server
          // path, and has to be sent back or the API drops it. This used to
          // test `startsWith('Uploads\\')`, which only matched the oldest
          // Windows-era rows — so editing a service silently deleted every
          // image stored in any newer format.
          uploadData.append(`oldImages[]`, uri);
        }
      });
  
      // Handle banners
      banners.forEach((uri, index) => {
        if (isLocalUri(uri)) {
          const bannerFile = {
            uri,
            type: uri.endsWith('.png') ? 'image/png' : 'image/jpeg',
            name: `banner-${index}.jpg`,
          };
          uploadData.append('banners', bannerFile);
        } else {
          // Anything that is not a freshly picked file is an existing server
          // path, and has to be sent back or the API drops it. This used to
          // test `startsWith('Uploads\\')`, which only matched the oldest
          // Windows-era rows — so editing a service silently deleted every
          // image stored in any newer format.
          uploadData.append(`oldBanners[]`, uri);
        }
      });
  
      const response = await axios.put(
        `${API_URL}/api/services/${serviceId}`,
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // console.log('Response:', response);
      Alert.alert('Success', 'Service updated successfully');
      navigation.goBack();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  
// Helper function for handling errors
const handleApiError = (error) => {
  if (error.response) {
    console.error('Response error data:', error.response.data);
    Alert.alert(
      'Error',
      `Server responded with status ${error.response.status}: ${error.response.data.message || error.response.statusText}`
    );
  } else if (error.request) {
    console.error('Request error:', error.request);
    Alert.alert(
      'Network Error',
      'The request was made but no response was received. Check your network connection or server.'
    );
  } else {
    console.error('Error message:', error.message);
    Alert.alert('Error', `Failed to update service: ${error.message}`);
  }
};

  const onDeleteImage = (index, isBanner = false) => {
    if (isBanner) {
      setBanners((prevList) => prevList.filter((_, i) => i !== index));
    } else {
      setImages((prevList) => prevList.filter((_, i) => i !== index));
    }
  };
  
  const renderImagePreviews = (imageList, isBanner = false, isOnChange = true) => {
    if (imageList.length === 0) return null;
  
    return (
      <View style={styles.imagePreviewContainer}>
        {imageList.map((uri, index) => {
 
          // Handles both a freshly picked local URI and every stored path format.
          const sourceUri = fileUrl(uri);
          return (
            <View key={`${isBanner ? 'banner' : 'image'}-${index}-${uri}`} style={styles.imageWrapper}>
            <Image
              source={{ uri: sourceUri }}
              style={isBanner ? styles.bannerPreview : styles.imagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity onPress={() => onDeleteImage(index, isBanner)} style={styles.deleteIcon}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>X</Text>  
            </TouchableOpacity>
          </View>
          );
        })}
      </View>
    );
  };
  
  const openIconModal = () => setIsIconModalVisible(true);
  const closeIconModal = () => setIsIconModalVisible(false);

  const renderSelectedIconPreview = () => {
    if (!selectedIcon) return null;
    const IconComponent =
      selectedIconLib === 'Font Awesome' ? FontAwesome : MaterialIcons;
    return (
      <View style={styles.selectedIconPreview}>
        <Text style={styles.previewText}>Selected Icon:</Text>
        <IconComponent name={selectedIcon} size={40} color="#007BFF" />
      </View>
    );
  };

  const handleCategorySelect = useCallback(
    async (selectedId, level) => {
      setDropdownData(prevData => {
        const updatedDropdownData = [...prevData.slice(0, level + 1)];
        updatedDropdownData[level] = {
          ...updatedDropdownData[level],
          selectedId,
        };
        return updatedDropdownData;
      });

      try {
        const childCategories = await fetchCategoriesByParentId(selectedId);
        if (childCategories.length > 0) {
          setDropdownData(prevData => {
            const updatedDropdownData = [...prevData];
            const childDropdownExists = updatedDropdownData.some(
              data => data.parentId === selectedId,
            );
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
        const selectedCat = dropdownData[level].items.find(
          item => item.value === selectedId,
        );
        setSelectedCategory(selectedCat ? selectedCat.label : '');
      } catch (error) {
        console.error('Error fetching child categories:', error);
      }
    },
    [fetchCategoriesByParentId, formatPickerItems, dropdownData],
  );

  const renderCategoryDropdowns = () => {
    return dropdownData.map((data, index) => (
      <RNPickerSelect
        key={`dropdown-${index}`}
        onValueChange={value => handleCategorySelect(value, index)}
        items={data.items}
        placeholder={{label: 'Select Category', value: null}}
        style={pickerSelectStyles}
        value={data.selectedId}
      />
    ));
  };
  const handleIconSelect = (iconName, library) => {
    const cleanedIconName = getCleanedIconName(iconName, library);
    setSelectedIcon(cleanedIconName);
    setSelectedIconLib(library);
    setIsIconModalVisible(false);
    setFormData({...formData, icon: cleanedIconName, iconLib: library});
  };
  const getCleanedIconName = (iconName, library) => {
    return library === 'Material Icons'
      ? iconName.replace('material-', '')
      : library === 'Font Awesome'
      ? iconName.replace('fa-', '')
      : iconName;
  };

  const renderIcon = ({item}) => {
    return (
      <View style={styles.iconContainer}>
        {item.icons.map(icon => {
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

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index][field] = value;
    setPlans(updatedPlans);
  };

  const addKeyPoint = (planIndex) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].keyPoints.push('');
    setPlans(updatedPlans);
  };

  const handleKeyPointChange = (planIndex, keyPointIndex, value) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].keyPoints[keyPointIndex] = value;
    setPlans(updatedPlans);
  };

  const removeKeyPoint = (planIndex, keyPointIndex) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].keyPoints.splice(keyPointIndex, 1);
    setPlans(updatedPlans);
  };

  const removePlan = (index) => {
    const updatedPlans = [...plans];
    updatedPlans.splice(index, 1);
    setPlans(updatedPlans);
  };

  const addPlan = () => {
    setPlans([...plans, { name: '', price: '', duration: '', keyPoints: [''] }]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Service</Text>

        {/* Form Inputs */}
        {renderSelectedIconPreview()}
        <TouchableOpacity
          onPress={() => openIconModal()}
          style={styles.iconSelectButton}>
          <Text style={styles.iconSelectText}>
            {selectedIcon || 'Select Icon'}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Service Name"
          value={formData.name}
          onChangeText={text => setFormData({...formData, name: text})}
          style={styles.input}
        />

        <TextInput
          placeholder="Description"
          value={formData.description}
          onChangeText={text => setFormData({...formData, description: text})}
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <TextInput
          placeholder="Long Description"
          value={formData.longDescription}
          onChangeText={text =>
            setFormData({...formData, longDescription: text})
          }
          style={styles.input}
          multiline
          numberOfLines={5}
        />
        <TextInput
          placeholder="Duration"
          value={formData.duration}
          onChangeText={text => setFormData({...formData, duration: text})}
          style={styles.input}
        />
        <TextInput
          placeholder="Video URL"
          value={formData.videoUrl}
          onChangeText={text => setFormData({...formData, videoUrl: text})}
          style={styles.input}
        />
        {videoId && isVideoValid && (
          <YoutubeIframe videoId={videoId} height={200} />
        )}

        {dropdownData.map((data, index) => (
          <RNPickerSelect
            key={`dropdown-${index}`}
            onValueChange={value => handleCategorySelect(value, index)}
            items={data.items || []}
            placeholder={{label: 'Select Category', value: null}}
            style={pickerSelectStyles}
            value={data.selectedId}
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
        <TouchableOpacity
          onPress={() => handleImageUpload(false)}
          style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Images</Text>
        </TouchableOpacity>

        {renderImagePreviews(images, false)}

        <TouchableOpacity
          onPress={() => handleImageUpload(true)}
          style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Banners</Text>
        </TouchableOpacity>

        {renderImagePreviews(banners, true)}
 
      {/* Plans Section */}
      <Text style={styles.headerText}>Plans</Text>
      {plans.map((plan, index) => (
        <View key={index} style={styles.planContainer}>
          <TextInput
            style={styles.input}
            placeholder="Plan Name"
            value={plan.name}
            onChangeText={(text) => handlePlanChange(index, 'name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={plan.price}
            onChangeText={(text) => handlePlanChange(index, 'price', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Duration"
            value={plan.duration}
            onChangeText={(text) => handlePlanChange(index, 'duration', text)}
            keyboardType="numeric"
          />

          {/* Key Points */}
          {plan.keyPoints.map((keyPoint, keyIndex) => (
            <View key={keyIndex} style={styles.keyPointContainer}>
              <TextInput
                style={styles.input}
                placeholder="Key Point"
                value={keyPoint}
                onChangeText={(text) => handleKeyPointChange(index, keyIndex, text)}
              />
              <TouchableOpacity onPress={() => removeKeyPoint(index, keyIndex)}>
                <Text style={styles.removeText}>Remove Key Point</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addKeyPoint(index)}>
            <Text style={styles.addText}>Add Key Point</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removePlan(index)}>
            <Text style={styles.removeText}>Remove Plan</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addPlan}>
        <Text style={styles.addText}>Add Plan</Text>
      </TouchableOpacity>

        {/* Submit Button */}
        <Button
          title="Save Changes"
          onPress={handleSubmit}
          disabled={loading}
        />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {/* Icon Selection Modal */}
        <Modal visible={isIconModalVisible} onRequestClose={closeIconModal}>
          <View style={styles.modalContainer}>
            <FlatList
              data={availableIcons}
              renderItem={renderIcon}
              keyExtractor={item => item._id}
              numColumns={3}
            />
            <Button
              title="Close"
              onPress={() => setIsIconModalVisible(false)}
            />
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
  scrollContainer: {
    paddingBottom: 50,
    padding:10
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
    textShadowColor: '#d0d0d0',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textShadowColor: '#d0d0d0',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  iconSelectButton: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconSelectText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  iconPreviewContainer: {
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconPreview: {
    marginRight: 10,
    fontSize: 30,
    color: '#007BFF',
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageWrapper: {
    marginBottom: 10,
    position: 'relative',
    width: '48%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 3, // Shadow for Android
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: '#eaeaea',
  },
  bannerPreview: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: '#eaeaea',
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 3,
  },
  removeText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  addText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  planContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  keyPointContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  keyPointInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 10,
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addPlanButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  addPlanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  planTextInput: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 15,
    width: '30%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
  },
  selectedIconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#007BFF',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  previewText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  modalHeader: {
    backgroundColor: '#007BFF',
    width: '100%',
    paddingVertical: 12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  planDeleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  planDeleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  planAddButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  planAddButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pickerSelect: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIndicator: {
    marginTop: 20,
  },
});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
});

export default ServicesEdit;
