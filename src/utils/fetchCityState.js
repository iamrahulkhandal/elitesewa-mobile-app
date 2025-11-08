import axios from 'axios';

export const fetchCityState = async (pincode) => {
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    if (response.data[0].Status === 'Success') {
      const { District, State } = response.data[0].PostOffice[0];
      return { city: District, state: State };
    }
    throw new Error('Invalid Pincode');
  } catch (error) {
    console.error('Error fetching city and state:', error);
    return { city: '', state: '' }; // Return empty strings if there's an error
  }
};
