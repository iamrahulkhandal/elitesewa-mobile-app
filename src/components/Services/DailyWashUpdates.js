import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';

// Shows the date-wise daily wash photos for a booking. Customers can leave one
// comment per day; executives (and others) see the photos and any comment.
const DailyWashUpdates = ({ paymentResponseId }) => {
  const role = useSelector((state) => state.auth.role);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState({}); // logId -> comment text being edited
  const [savingId, setSavingId] = useState(null);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dailywash/${paymentResponseId}`);
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching daily wash logs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (paymentResponseId) fetchLogs();
    }, [paymentResponseId])
  );

  const formatDate = (value) =>
    new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const saveComment = async (logId) => {
    const comment = (drafts[logId] ?? '').trim();
    if (!comment) {
      Alert.alert('Empty comment', 'Please write something before saving.');
      return;
    }
    setSavingId(logId);
    try {
      await axios.put(`${API_URL}/api/dailywash/${logId}/comment`, {
        customerComment: comment,
      });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[logId];
        return next;
      });
      fetchLogs();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save comment.');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <ActivityIndicator color="#09b5e1" style={{ marginVertical: 16 }} />;
  }

  if (logs.length === 0) {
    return <Text style={styles.empty}>No daily wash updates yet.</Text>;
  }

  return (
    <View>
      {logs.map((log) => {
        const isEditing = drafts[log._id] !== undefined;
        return (
          <View key={log._id} style={styles.dayBlock}>
            <Text style={styles.dayDate}>{formatDate(log.date)}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
              {log.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: `${API_URL}/${img}` }}
                  style={styles.photo}
                />
              ))}
            </ScrollView>

            {/* Existing comment */}
            {log.customerComment ? (
              <View style={styles.commentBox}>
                <Text style={styles.commentLabel}>Your comment:</Text>
                <Text style={styles.commentText}>{log.customerComment}</Text>
              </View>
            ) : null}

            {/* Customers can add/edit a comment for the day */}
            {role === 'customer' && (
              <View>
                {isEditing || !log.customerComment ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Add a comment for this day..."
                      value={drafts[log._id] ?? ''}
                      onChangeText={(text) =>
                        setDrafts((prev) => ({ ...prev, [log._id]: text }))
                      }
                      multiline
                    />
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={() => saveComment(log._id)}
                      disabled={savingId === log._id}
                    >
                      {savingId === log._id ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.saveBtnText}>Save</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => setDrafts((prev) => ({ ...prev, [log._id]: log.customerComment }))}
                  >
                    <Text style={styles.editLink}>Edit comment</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    color: '#888',
    fontSize: 14,
    paddingVertical: 8,
  },
  dayBlock: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eef1f3',
    paddingBottom: 14,
  },
  dayDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  photoRow: {
    flexDirection: 'row',
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  commentBox: {
    marginTop: 10,
    backgroundColor: '#f5faff',
    borderRadius: 8,
    padding: 10,
  },
  commentLabel: {
    fontSize: 12,
    color: '#09b5e1',
    fontWeight: '700',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#444',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    minHeight: 42,
    color: '#333',
  },
  saveBtn: {
    backgroundColor: '#09b5e1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editLink: {
    color: '#09b5e1',
    fontWeight: '600',
    marginTop: 8,
  },
});

export default DailyWashUpdates;
