// src/store/serviceFormSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    title: '',
    subtitle: '',
    type: '',
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    discount: '',
    duration: '',
    category: '',
    subCategory: '',
    image: '',
    availability: {
      days: [],
      startTime: '',
      endTime: '',
    },
    serviceProvider: {
      name: '',
      experience: '',
      certifications: [],
      contact: { phone: '', email: '' },
    },
    addons: [],
    terms: false,
    cancellationPolicy: '',
  },
  errors: {},
  validationStatus: {},
};

const serviceFormSlice = createSlice({
  name: 'serviceForm',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      const keys = field.split('.');
      let current = state.formData;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      });
      current[keys[keys.length - 1]] = value;
    },
    setError: (state, action) => {
      const { field, error } = action.payload;
      state.errors[field] = error;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.errors = initialState.errors;
      state.validationStatus = initialState.validationStatus;
    },
    setValidationStatus: (state, action) => {
      const { field, isValid } = action.payload;
      state.validationStatus[field] = isValid;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
});

// Export actions
export const { updateField, setError, resetForm, setValidationStatus, setFormData } = serviceFormSlice.actions;

// Default export
export default serviceFormSlice.reducer;
