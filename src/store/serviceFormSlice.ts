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
      days: [] as string[],
      startTime: '',
      endTime: '',
    },
    serviceProvider: {
      name: '',
      experience: '',
      certifications: [] as string[],
      contact: { phone: '', email: '' },
    },
    addons: [] as any[],
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
      let current: any = state.formData;

      keys.forEach((key: any, index: number) => {
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
      (state.errors as Record<string, any>)[field] = error;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.errors = initialState.errors;
      state.validationStatus = initialState.validationStatus;
    },
    setValidationStatus: (state, action) => {
      const { field, isValid } = action.payload;
      (state.validationStatus as Record<string, any>)[field] = isValid;
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
