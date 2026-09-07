// src/components/ServiceForm.js
import React, { useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import BasicInfo from './BasicInfo';
import PricingAndDuration from './PricingAndDuration';
import Availability from './Availability';
import ServiceProviderDetails from './ServiceProviderDetails';
import AddonsAndReview from './AddonsAndReview';
import axios from 'axios';
import { API_URL } from '@env';
import {
  updateField,
  setError,
  resetForm,
  setValidationStatus,
  setFormData
} from '../../store/serviceFormSlice';

const ServiceForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.serviceForm.formData);
  const errors = useAppSelector((state) => state.serviceForm.errors);

  const validateField = (fieldName: any, value: any) => {
    let isValid = true;
    let error = '';

    // Validation logic
    switch (fieldName) {
      case 'title':
      case 'subtitle':
      case 'name':
        if (!value || value.length < 3 || value.length > 50) {
          isValid = false;
          error = `${fieldName} must be 3 to 50 characters long.`;
        }
        break;
      case 'type':
        const validTypes = ['Type1', 'Type2', 'Type3'];
        if (!value || !validTypes.includes(value)) {
          isValid = false;
          error = 'Type is required and must be one of the predefined types.';
        }
        break;
      case 'shortDescription':
        if (!value || value.length < 10 || value.length > 200) {
          isValid = false;
          error = 'Short description must be 10 to 200 characters long.';
        }
        break;
      case 'description':
        if (!value || value.length < 20 || value.length > 500) {
          isValid = false;
          error = 'Description must be 20 to 500 characters long.';
        }
        break;
      case 'price':
        if (!value || Number.isNaN(Number(value)) || value <= 0) {
          isValid = false;
          error = 'Price must be a valid positive number.';
        }
        break;
      case 'discount':
        if (value && (Number.isNaN(Number(value)) || value < 0 || value > formData.price)) {
          isValid = false;
          error = 'Discount must not exceed the price.';
        }
        break;
      case 'duration':
        if (!value || Number.isNaN(Number(value)) || value <= 0 || value > 120) {
          isValid = false;
          error = 'Duration must be a positive number not exceeding 120.';
        }
        break;
      case 'availability.days':
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!value || !value.every((day: any) => validDays.includes(day))) {
          isValid = false;
          error = 'Days must be valid days of the week.';
        }
        break;
      case 'availability.startTime':
      case 'availability.endTime':
        if (!value) {
          isValid = false;
          error = 'Time is required.';
        }
        break;
      case 'serviceProvider.name':
        if (!value || value.length < 3 || value.length > 50) {
          isValid = false;
          error = 'Service Provider name must be between 3 and 50 characters long.';
        }
        break;
      case 'serviceProvider.experience':
        if (!value || Number.isNaN(Number(value)) || value <= 0) {
          isValid = false;
          error = 'Experience must be a positive number.';
        }
        break;
      case 'serviceProvider.certifications':
        if (!value || value.length === 0 || value.length > 5) {
          isValid = false;
          error = 'At least one certification is required and cannot exceed 5.';
        }
        break;
      case 'serviceProvider.contact.phone':
        const phoneRegex = /^\d{10}$/;
        if (!value || !phoneRegex.test(value)) {
          isValid = false;
          error = 'Phone number must be exactly 10 digits long.';
        }
        break;
      case 'serviceProvider.contact.email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          isValid = false;
          error = 'Invalid email format.';
        }
        break;
      case 'terms':
        if (!value) {
          isValid = false;
          error = 'You must accept the terms and conditions.';
        }
        break;
      case 'cancellationPolicy':
        if (!value || value.length > 300) {
          isValid = false;
          error = 'Cancellation policy must not exceed 300 characters.';
        }
        break;
      default:
        break;
    }

    dispatch(setError({ field: fieldName, error }));
    return isValid;
  };

  const handleChange = (field: string, value: any) => {
    dispatch(updateField({ field, value }));
    validateField(field, value);
  };

  const validateStep = () => {
    let stepValid = true;
    switch (currentStep) {
      case 0:
        stepValid =
          validateField('title', formData.title) &&
          validateField('subtitle', formData.subtitle) &&
          validateField('type', formData.type) &&
          validateField('shortDescription', formData.shortDescription) &&
          validateField('description', formData.description);
        break;
      case 1:
        stepValid =
          validateField('price', formData.price) &&
          validateField('discount', formData.discount) &&
          validateField('duration', formData.duration);
        break;
      case 2:
        stepValid =
          validateField('availability.days', formData.availability.days) &&
          validateField('availability.startTime', formData.availability.startTime) &&
          validateField('availability.endTime', formData.availability.endTime);
        break;
      case 3:
        stepValid =
          validateField('serviceProvider.name', formData.serviceProvider.name) &&
          validateField('serviceProvider.experience', formData.serviceProvider.experience) &&
          validateField('serviceProvider.certifications', formData.serviceProvider.certifications) &&
          validateField('serviceProvider.contact.phone', formData.serviceProvider.contact.phone) &&
          validateField('serviceProvider.contact.email', formData.serviceProvider.contact.email);
        break;
      case 4:
        stepValid =
          validateField('addons', formData.addons) &&
          validateField('terms', formData.terms) &&
          validateField('cancellationPolicy', formData.cancellationPolicy);
        break;
      default:
        break;
    }

    // Update validation status in Redux store
    dispatch(setValidationStatus(stepValid));
    return stepValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    } else {
      Alert.alert('Validation Error', 'Please correct the errors in the form.');
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        // console.log('===============ffff=====================');
        // console.log(`${API_URL}/api/services`);
        // console.log('====================================');
        const response = await axios.post(`${API_URL}/api/services`, formData);
        // console.log(response.data);
        Alert.alert('Success', 'Service submitted successfully!');
        dispatch(resetForm());
      } catch (error) {
        console.error(error);
        Alert.alert('Submission Error', 'Failed to submit the service. Please try again.');
      }
    } else {
      Alert.alert('Validation Error', 'Please correct the errors in the form.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {currentStep === 0 && (
        <BasicInfo formData={formData} onChange={handleChange} errors={errors} />
      )}
      {currentStep === 1 && (
        <PricingAndDuration formData={formData} onChange={handleChange} errors={errors} />
      )}
      {currentStep === 2 && (
        <Availability formData={formData} onChange={handleChange} errors={errors} />
      )}
      {currentStep === 3 && (
        <ServiceProviderDetails formData={formData} onChange={handleChange} errors={errors} />
      )}
      {currentStep === 4 && (
        <AddonsAndReview formData={formData} onChange={handleChange} errors={errors} />
      )}
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={handleBack} disabled={currentStep === 0} />
        {currentStep < 4 ? (
          <Button title="Next" onPress={handleNext} />
        ) : (
          <Button title="Submit" onPress={handleSubmit} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ServiceForm;
