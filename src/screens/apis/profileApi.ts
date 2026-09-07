import axios from 'axios';
import { API_URL as BASE_URL } from '@env';
const API_URL = `${BASE_URL}/api/`;

export const getItems = async () => {
  return await axios.get(`${API_URL}items`);
};

export const createItem = async (item, image) => {
  const formData = new FormData();
  formData.append('name', item.name);
  formData.append('email', item.email);
  formData.append('phone', item.phone);
  if (image) {
    formData.append('image', {
      uri: image.uri, 
      type: image.type,
      name: image.fileName,
    }); 
  }
  return await axios.post(`${API_URL}items`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateItem = async (id, item, image) => {
  const formData = new FormData();
  formData.append('name', item.name);
  formData.append('email', item.email);
  formData.append('phone', item.phone);
  if (image) {
    formData.append('image', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });
  }
  return await axios.put(`${API_URL}items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteItem = async (id) => {
  return await axios.delete(`${API_URL}items/${id}`);
};
