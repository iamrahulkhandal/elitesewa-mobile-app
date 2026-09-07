// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        user: null,
        role: null,
        isProfileComplete: false, // Added field to track profile completion
    },
    reducers: {
        login: (state, action) => {
            state.userId = action.payload.userId;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.isProfileComplete = action.payload.isProfileComplete || false; // Set based on payload or default to false
        },
        logout: (state) => {
            state.userId = null;
            state.user = null;
            state.role = null;
            state.isProfileComplete = false;
        },
        setUser: (state, action) => {
            state.userId = action.payload.userId;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.isProfileComplete = action.payload.isProfileComplete || false;
        },
        setProfileCompleted: (state, action) => {
            // console.log('mmmmmmm',state, action);
            
            state.isProfileComplete = action.payload || false;
        },
    },
});

// Async function to load auth data
export const loadAuthData = () => async (dispatch) => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData);
            dispatch(setUser(parsedData));
        }
    } catch (error) {
        console.error('Failed to load auth data:', error);
    }
};

// Async function to save user data to AsyncStorage
const saveUserData = async (userData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
        console.error('Failed to save auth data:', error);
    }
};

// Redux action for login that also saves data to AsyncStorage
export const loginAndPersist = (user) => async (dispatch) => {
    dispatch(login(user));
    await saveUserData(user); // Save user data
};

// Redux action for logout that also removes data from AsyncStorage
export const logoutAndClear = () => async (dispatch) => {
    dispatch(logout());
    await AsyncStorage.removeItem('userData'); // Clear user data
};

// Action to update profile completion status
export const setProfileCompletionStatus = (status) => async (dispatch) => {
    dispatch(setProfileCompleted(status));
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
        const parsedData = JSON.parse(userData);
        parsedData.isProfileComplete = status;
        await saveUserData(parsedData); // Update profile status in AsyncStorage
    }
};

export const { login, logout, setUser, setProfileCompleted } = authSlice.actions;
export default authSlice.reducer;
