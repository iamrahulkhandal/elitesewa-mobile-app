import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Appbar, Button, Text, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LandingPage = ({ onRoleSelect }) => {
  const handleRoleSelection = async (role) => {
    try {
      await AsyncStorage.setItem('userRole', role);  
      onRoleSelect(role); 
    } catch (error) {
      console.error('Error storing role:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineLarge" style={styles.cardTitle}>
            Select Your Role
          </Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            onPress={() => handleRoleSelection('customer')}
            style={styles.button_customer}
          >
            Customer
          </Button>
          <Button
            mode="contained"
            onPress={() => handleRoleSelection('executive')}
            style={styles.button_executive}
          >
            Executive
          </Button>
        </Card.Actions>
      </Card>
      <Text variant="headlineLarge" style={styles.slug}>
      By continuing, you agree to our Terms of Service
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width:320,
    height:110,
    borderRadius: 20,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor:'#fff',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight:'800',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardActions: {
    display:'flex',
    justifyContent: 'space-around',
  },
  button_customer: {
    flex: 1,
    backgroundColor:'#09b5e1',
    marginHorizontal: 10,
  },
  button_executive: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor:'green',
  },
  slug:{
    fontSize: 12,
    marginTop: 6,
    color:'gray',
    textAlign: 'center',
  }
});

export default LandingPage;
