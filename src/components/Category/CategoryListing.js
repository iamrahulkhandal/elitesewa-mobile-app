import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CategoryListing = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      // console.log('Fetched categories:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchChildCategories = async (parentId) => {
    try {
      const response = await axios.get(`${API_URL}/api/categories/parent/${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching child categories:', error);
      return [];
    }
  };

  const toggleExpand = async (category) => {
    category.expanded = !category.expanded; // Toggle expanded state

    // If expanding, fetch child categories
    if (category.expanded) {
      const children = await fetchChildCategories(category._id);
      category.children = children; // Add children to the category
    }
    
    setCategories([...categories]); // Trigger re-render
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setModalVisible(true);
  };

  const handleEdit = async () => {
    if (!selectedCategory) return;

    try {
      await axios.put(`${API_URL}/api/categories/${selectedCategory._id}`, {
        name: categoryName,
        parentId: selectedCategory.parentId,
      });
      setModalVisible(false);
      fetchCategories(); // Refresh category list
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (id) => {
    const childCategories = await fetchChildCategories(id);
    if (childCategories.length > 0) {
      alert("Cannot delete this category because it has existing child categories.");
      return;
    }
  
    try {
      await axios.delete(`${API_URL}/api/categories/${id}`);
      fetchCategories(); // Refresh category list
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const renderCategoryItem = (category) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <TouchableOpacity onPress={() => toggleExpand(category)}>
          <Icon name={category.expanded ? "expand-less" : "expand-more"} size={24} />
        </TouchableOpacity>
        <Text style={styles.categoryName}>{category.name}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Edit" onPress={() => openEditModal(category)} />
          <Button title="Delete" onPress={() => handleDelete(category._id)} color="red" />
        </View>
      </View>
      {category.expanded && category.children ? (
        <FlatList
          data={category.children}
          renderItem={({ item }) => renderCategoryItem(item)} // Recursive call
          keyExtractor={item => item._id}
          style={styles.childList}
        />
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Management</Text>
      <FlatList
        data={categories.filter(cat => cat.parentId === null)} // Top-level categories
        renderItem={({ item }) => renderCategoryItem(item)}
        keyExtractor={item => item._id}
      />
      
      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Category Name"
            value={categoryName}
            onChangeText={setCategoryName}
          />
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleEdit} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 18,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  childList: {
    paddingLeft: 20,
  },
});

export default CategoryListing;
