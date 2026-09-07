import React from 'react';
import { View, StyleSheet, Image, Linking, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Button, Text, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants/appConfig';

type LandingPageProps = {
  /**
   * Absent when this is reached as a navigator route rather than rendered by
   * App: React Navigation supplies only navigation and route props.
   */
  onRoleSelect?: (role: string) => void;
};

const LandingPage = ({ onRoleSelect }: LandingPageProps) => {
  const handleRoleSelection = async (role: string) => {
    try {
      await AsyncStorage.setItem('userRole', role);  
      onRoleSelect?.(role);
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
      <View style={styles.termsContainer}>
        <Text style={styles.slug}>
          By continuing, you agree to our{' '}
        </Text>
        <TouchableOpacity onPress={() => {
          Linking.openURL(APP_CONFIG.TERMS_OF_SERVICE_URL).catch(err => {
            Alert.alert('Error', 'Unable to open Terms of Service. Please visit: ' + APP_CONFIG.TERMS_OF_SERVICE_URL);
          });
        }}>
          <Text style={styles.termsLink}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={styles.slug}> and </Text>
        <TouchableOpacity onPress={() => {
          Linking.openURL(APP_CONFIG.PRIVACY_POLICY_URL).catch(err => {
            Alert.alert('Error', 'Unable to open Privacy Policy. Please visit: ' + APP_CONFIG.PRIVACY_POLICY_URL);
          });
        }}>
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
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
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  slug:{
    fontSize: 12,
    color:'gray',
    textAlign: 'center',
  },
  termsLink: {
    fontSize: 12,
    color: '#09b5e1',
    textDecorationLine: 'underline',
    fontWeight: '600',
  }
});

export default LandingPage;
