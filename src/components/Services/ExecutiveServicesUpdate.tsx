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
import { API_URL } from '@env';

// Form Reducer for Managing State More Efficiently
const formReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return { customerRating: '', customerReview: '',};
    default:
      return state;
  }
};

type ExecutiveServicesUpdateProps = { route: AppRoute; navigation: AppNavigation };

const ExecutiveServicesUpdate = ({route ,navigation}: ExecutiveServicesUpdateProps) =>{

  const { item_id,payment_id } = route.params ?? {}; 

  const [formState, dispatch] = useReducer(formReducer, {
    customerRating: '',
    customerReview: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  // Form Validation
  const validateFormData = () => {
    const { customerRating,customerReview} = formState;
    if (!customerRating.trim() || Number.isNaN(Number(customerRating))) {
      setError('Rating must be a valid number.');
      return false;
    }
    if (!customerReview.trim()) {
      setError('Review is required.');
      return false;
    }
    setError(null);
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!validateFormData()) return;

    setLoading(true);
    // Send the request 
    try {
      const response = await axios.put(`${API_URL}/api/executiveservices/${item_id}`, {
        payment_id:payment_id,
        customerRating: formState.customerRating,
        customerReview: formState.customerReview}, {
        headers: {
            'Content-Type': 'application/json',
          },
      });
      // console.log(response.data);
      Alert.alert('Success', 'Executive Service update successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading data:', error);
      setError('Failed to update executive service');
    } finally {
      setLoading(false);
    }
  };
 

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Text style={styles.headerText}>Create Rating</Text>

        {/* Service Form */}
       

        <InputField
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
        />

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

export default ExecutiveServicesUpdate;
