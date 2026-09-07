import React, { useState, useCallback, useReducer, useRef } from 'react';
import type { AppNavigation, AppRoute } from '../../types/navigation';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import { ensureCameraPermission } from '../../utils/cameraPermission';
import { API_URL } from '@env';

type ExecutiveServiceForm = {
  name: string;
  description: string;
  longDescription: string;
  duration: string;
  executiveRating: string;
  executiveReview: string;
  customerRating: string;
  customerReview: string;
};

type FormAction =
  | { type: 'SET_FIELD'; field: keyof ExecutiveServiceForm; value: string }
  | { type: 'RESET' };

const EMPTY_FORM: ExecutiveServiceForm = {
  name: '',
  description: '',
  longDescription: '',
  duration: '',
  executiveRating: '',
  executiveReview: '',
  customerRating: '',
  customerReview: '',
};

// Form Reducer for Managing State More Efficiently
const formReducer = (state: ExecutiveServiceForm, action: FormAction): ExecutiveServiceForm => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return EMPTY_FORM;
    default:
      return state;
  }
};

type ExecutiveServicesCreateProps = { route: AppRoute; navigation: AppNavigation };

const ExecutiveServicesCreate = ({route , navigation}: ExecutiveServicesCreateProps) =>{

  const { item_id } = route.params; 

  const [formState, dispatch] = useReducer(formReducer, EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useRef<Record<string, TextInput | null>>({});

  // Image Picker Callback Function
  const handleImageUpload = useCallback(async () => {
    if (images.length >= 6) {
      setError('You can only upload up to 6 images.');
      return;
    }

    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) return;

    // Camera only — users must capture a live photo, not pick from the gallery.
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }

    const uri = result.assets[0].uri;
    setImages(prevImages => [...prevImages, uri]);
  }, [images]);

  // Form Validation
  const validateFormData = () => {
    const { name, description, duration ,executiveRating,executiveReview} = formState;
    if (!name.trim()) {
      setError('Service name is required.');
      return false;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return false;
    }
    if (!duration.trim() || isNaN(Number(duration))) {
      setError('Duration must be a valid number.');
      return false;
    }
    if (images.length < 1) {
      setError('At least 1 image is required.');
      return false;
    }
    if (!executiveRating.trim() || isNaN(Number(executiveRating))) {
      setError('Rating must be a valid number.');
      return false;
    }
    if (!executiveReview.trim()) {
      setError('Review is required.');
      return false;
    }
    // if (!customerRating.trim() || isNaN(Number(customerRating))) {
    //   setError('Rating must be a valid number.');
    //   return false;
    // }
    // if (!customerReview.trim()) {
    //   setError('Review is required.');
    //   return false;
    // }
    setError(null);
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!validateFormData()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('payment_id', item_id);
    formData.append('name', formState.name);
    formData.append('description', formState.description);
    formData.append('longDescription', formState.longDescription);
    formData.append('duration', formState.duration);
    formData.append('executiveRating', formState.executiveRating);
    formData.append('executiveReview', formState.executiveReview);
    formData.append('customerRating', formState.customerRating);
    formData.append('customerReview', formState.customerReview);

    // Add image files to the formData
    images.forEach((imageUri, index) => {
      formData.append('images', { 
        uri: imageUri,
        type: 'image/jpeg',
        name: `image-${index}.jpg`,
      });
    });

    try {
      const response = await axios.post(`${API_URL}/api/executiveservices`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // console.log(response.data);
      Alert.alert('Success', 'Executive Service created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading data:', error);
      setError('Failed to create executive service');
    } finally {
      setLoading(false);
    }
  };

  // Render Image Previews
  const renderImagePreviews = () => {
    if (images.length === 0) return null;
    return (
      <View style={styles.imagePreviewContainer}>
        {images.map((uri, index) => (
          <Image key={`image-${index}-${uri}`} source={{ uri }} style={styles.imagePreview} resizeMode="cover" />
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.headerText}>Create Service</Text>

        {/* Service Form */}
        <InputField
          label="Service Name"
          placeholder="Enter Service Name"
          value={formState.name}
          onChangeText={text => dispatch({ type: 'SET_FIELD', field: 'name', value: text })}
        />
        <InputField
          label="Description"
          placeholder="Enter Description"
          value={formState.description}
          onChangeText={text => dispatch({ type: 'SET_FIELD', field: 'description', value: text })}
        />
        <InputField
          label="Long Description"
          placeholder="Enter Long Description"
          value={formState.longDescription}
          onChangeText={text => dispatch({ type: 'SET_FIELD', field: 'longDescription', value: text })}
        />
        <InputField
          label="Duration (in minutes)"
          placeholder="Enter Duration"
          value={formState.duration}
          onChangeText={text => dispatch({ type: 'SET_FIELD', field: 'duration', value: text })}
          keyboardType="numeric"
        />

         <InputField
          label="Rating (1-5):"
          placeholder="Enter Rating"
          value={formState.executiveRating}
          onChangeText={text => dispatch({ type: 'SET_FIELD', field: 'executiveRating', value: text })}
          keyboardType="numeric"
        />
         <InputField
          label="Rating Raview:"
          placeholder="Enter your Raview"
          value={formState.executiveReview}
          onChangeText={text => dispatch({ type: 'SET_FIELD', field: 'executiveReview', value: text })}
        />

        {/* Image Upload */}
        <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Images (Max 6)</Text>
        </TouchableOpacity>
        {renderImagePreviews()}

        {/* <InputField
          label="Rating (1-5):"
          placeholder="Enter Rating"
          value={formState.customerRating}
          onChangeText={text => dispatch({ type: 'SET_FIELD', field: 'customerRating', value: text })}
          keyboardType="numeric"
        />
         <InputField
          label="Rating Raview:"
          placeholder="Enter your Raview"
          value={formState.customerReview}
          onChangeText={text => dispatch({ type: 'SET_FIELD', field: 'customerReview', value: text })}
        /> */}




        

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Reusable Input Component
type InputFieldProps = TextInputProps & { label?: string };

const InputField = React.forwardRef<TextInput, InputFieldProps>(({ label, ...props }, ref) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput {...props} ref={ref} style={styles.input} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
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
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 4,
  },
  errorText: {
    color: '#FF6347',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
});

export default ExecutiveServicesCreate;
