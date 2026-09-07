import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { ensureCameraPermission } from '../../utils/cameraPermission';
import { API_URL } from '@env';

const MAX_PHOTOS = 5;

const DailyWashUpload = ({ route, navigation }) => {
  const { item_id } = route.params;
  const executiveId = useAppSelector((state) => state.auth.userId);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const formatDate = (d) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleCapture = async () => {
    if (images.length >= MAX_PHOTOS) {
      Alert.alert('Limit reached', `You can upload up to ${MAX_PHOTOS} photos per day.`);
      return;
    }

    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) return;

    // Camera only — the executive must capture live photos on site.
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) return;
    setImages((prev) => [...prev, result.assets[0].uri]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (images.length < 1) {
      Alert.alert('No photos', 'Please capture at least one photo.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('payment_id', item_id);
    formData.append('date', date.toISOString());
    if (executiveId) formData.append('executiveId', executiveId);

    images.forEach((uri, index) => {
      formData.append('images', {
        uri,
        type: 'image/jpeg',
        name: `daily-${index}.jpg`,
      });
    });

    try {
      await axios.post(`${API_URL}/api/dailywash`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Daily photos uploaded successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload photos. Please try again.';
      Alert.alert('Upload failed', message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Daily Wash Update</Text>
      <Text style={styles.subtitle}>Capture up to {MAX_PHOTOS} photos for the selected day.</Text>

      {/* Date selector */}
      <Text style={styles.label}>Service Date</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Icon name="calendar-outline" size={20} color="#09b5e1" />
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showPicker}
        mode="date"
        maximumDate={new Date()}
        date={date}
        onConfirm={(selected) => {
          setShowPicker(false);
          setDate(selected);
        }}
        onCancel={() => setShowPicker(false)}
      />

      {/* Photo grid */}
      <Text style={styles.label}>Photos ({images.length}/{MAX_PHOTOS})</Text>
      <View style={styles.grid}>
        {images.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.thumbWrapper}>
            <Image source={{ uri }} style={styles.thumb} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(index)}>
              <Icon name="close-circle" size={22} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < MAX_PHOTOS && (
          <TouchableOpacity style={styles.addBtn} onPress={handleCapture}>
            <Icon name="camera" size={28} color="#09b5e1" />
            <Text style={styles.addBtnText}>Capture</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadBtnText}>Upload Photos</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  thumbWrapper: {
    position: 'relative',
  },
  thumb: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 11,
  },
  addBtn: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#09b5e1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 12,
    color: '#09b5e1',
    marginTop: 4,
  },
  uploadBtn: {
    backgroundColor: '#09b5e1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  uploadBtnDisabled: {
    opacity: 0.6,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DailyWashUpload;
