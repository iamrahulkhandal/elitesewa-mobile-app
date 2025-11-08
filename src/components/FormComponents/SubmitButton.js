import React from 'react';
import { TouchableOpacity,View, Text, StyleSheet } from 'react-native';

const SubmitButton = ({ onSubmit }) => {
  return (
     <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={onSubmit}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubmitButton;
