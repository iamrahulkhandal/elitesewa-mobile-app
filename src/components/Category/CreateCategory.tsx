import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { API_URL } from '@env';

const CreateCategory = () => {
  const [categories, setCategories] = useState([]); // All categories from API
  const [name, setName] = useState(''); // New category name
  const [dropdownData, setDropdownData] = useState([ 
    { parentId: null, items: [], selectedId: null },
  ]); // Track each dropdown's items and selected category

  useEffect(() => {
    fetchTopLevelCategories();
  }, []);

  const fetchTopLevelCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
      // Filter for top-level categories and initialize dropdown data
      const topLevelCategories = response.data.filter((cat: any) => cat.parentId === null);
      setDropdownData([{ parentId: null, items: formatPickerItems(topLevelCategories), selectedId: null }]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const formatPickerItems = useCallback((categories: any) => {
    return categories.map((category: any) => ({
      label: category.name,
      value: category._id,
    }));
  }, []);

  // Fetch child categories from the API by parentId
  const fetchChildCategories = async (parentId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/categories/parent/${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching child categories:', error);
      return []; // Return an empty array on error
    }
  };

  const handleCategorySelect = useCallback(async (selectedId: any, level: any) => {
    // console.log('Selected ID:', selectedId, 'Level:', level);
  
    setDropdownData(prevData => {
      const updatedDropdownData = [...prevData.slice(0, level + 1)];
      updatedDropdownData[level] = {
        ...updatedDropdownData[level],
        selectedId,
      };
      return updatedDropdownData;
    });
  
    // Fetch child categories based on the selected parent ID
    try {
      const childCategories = await fetchChildCategories(selectedId);
      // console.log('Fetched child categories:', childCategories);
  
      // Check if a new level should be added or updated based on existing parentId
      setDropdownData(prevData => {
        const updatedDropdownData = [...prevData.slice(0, level + 1)];
        const existingLevelIndex = prevData.findIndex(data => data.parentId === selectedId);
  
        if (existingLevelIndex > -1) {
          // Update existing level's items if parentId is already in dropdownData
          updatedDropdownData[existingLevelIndex].items = formatPickerItems(childCategories);
          updatedDropdownData[existingLevelIndex].selectedId = null;
        } else if (childCategories.length > 0) {
          // Add a new level for child categories if it doesn’t exist
          updatedDropdownData.push({
            parentId: selectedId,
            items: formatPickerItems(childCategories),
            selectedId: null,
          });
        }
        return updatedDropdownData;
      });
    } catch (error) {
      console.error('Error fetching child categories:', error);
    }
  }, [fetchChildCategories, formatPickerItems]);
  

// Add a new category with the selected parent
const addCategory = async () => {
  const parentId = dropdownData[dropdownData.length - 1].selectedId; // Use last selected category as parent
  try {
    const response = await axios.post(`${API_URL}/api/categories`, { name, parentId });
    setCategories([...categories, response.data]);
    setName(''); // Reset category name input
    setDropdownData([ 
      { parentId: null, items: [], selectedId: null },
    ]);
    // Re-fetch top-level categories to reset dropdownData
    const topLevelCategories = categories.filter(cat => cat.parentId === null);
    setDropdownData([{ parentId: null, items: formatPickerItems(topLevelCategories), selectedId: null }]);
    
    // console.log("Category added and dropdowns reset");
  } catch (error) {
    console.error('Error adding category:', error);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Categories</Text>
      <TextInput
        style={styles.input}
        placeholder="Category Name"
        value={name}
        onChangeText={setName}
      />

      {/* Dynamically render dropdowns based on the dropdownData */}
      {dropdownData.map((data, index) => (
        <RNPickerSelect
          key={index}
          placeholder={{
            label: `Select ${index === 0 ? 'Category' : 'Subcategory'}...`,
            value: null,
          }}
          onValueChange={value => handleCategorySelect(value, index)}
          items={data.items}
          style={pickerSelectStyles}
        />
      ))}

      <Button title="Add Category" onPress={addCategory} />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 4,
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 4,
  },
});

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default CreateCategory;
