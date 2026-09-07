import axios from 'axios';
import { API_URL as BASE_URL } from '@env';
const API_URL = `${BASE_URL}/user`;
const API_URL2 = `${BASE_URL}/api/images`;

export const getUser = async (phone) => {
  return axios.get(`${API_URL}/${phone}`); 
};
export const getClientList = async () => {
  return axios.get(`${API_URL2}`); 
};
 
// export const createUser = async (user) => {
//   const formData = new FormData();
//   formData.append('name', user.name);
//   formData.append('email', user.email);
//   formData.append('phone', user.phone);
//   if (user.image) {
//     formData.append('image', {
//       uri: user.image.uri,
//       type: user.image.type,
//       name: user.image.fileName,
//     });
//   }
//   return axios.post(API_URL, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

export const updateUser = async (id, user) => {
  const formData = new FormData();
  formData.append('name', user.name);
  formData.append('email', user.email);
  formData.append('phone', user.phone);
  formData.append('verify', user.verify);
  // console.log(user.image)
  if (user.image) {
    formData.append('image', {
      uri: user.image.uri,
      type: user.image.type,
      name: user.image.fileName,
    });
  }

  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}; 

// export const deleteUser = async (id) => {
//   return axios.delete(`${API_URL}/${id}`);
// };
