import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image ,StyleSheet,TouchableOpacity,SafeAreaView,Text, Alert,ScrollView} from 'react-native';
import { createUser, updateUser } from '../apis/UserService';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import BackTitleHeader from '../../src/components/Shared/BackTitleHeader';

export default function UserProfilechange({ route, navigation }) {
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

const validateForm = () => {
    let errors = {};

    // if (!image) {
    //     errors.image = 'Image is required.';
    // }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
};
  
  const user = route.params?.user;

  useEffect(() => {
    if (user) {
      setImage({ uri: `http://elitesewa-api.indiasellers.com/${user.image}` });
    }
  }, [user]);

  const handleSave = async () => {
   
    validateForm();
    if (isFormValid) {
        const userData = { image };
        if (user) {
          await updateUser(user._id, userData); 
          navigation.navigate('UserList');
        } else {
          await createUser(userData);
          navigation.navigate('UserList');
        }
    } else {
        // console.log('Form has errors. Please correct them.');
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ noData: true }, (response) => {
      if (response.assets) {

        setImage(response.assets[0]); 
        // console.log(response+'imagepick')
      }
    });
    handleSave();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
    <View style={styles.header}>
      <View style={styles.headerAction}>
        <TouchableOpacity
              onPress={() => {
                 navigation.goBack()
              }}>
          <FeatherIcon
            color="#000"
            name="arrow-left"
            size={24} />
        </TouchableOpacity>
      </View>

      <Text numberOfLines={1} style={styles.headerTitle}>
        Profile
      </Text>

      <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
        {/* <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}>
          <FeatherIcon
            color="#000"
            name="more-vertical"
            size={24} />
        </TouchableOpacity> */}
      </View>
    </View>

    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.container}>
        <Button title="Pick Image" onPress={handleImagePick} />
        {/* <Text style={styles.error}>{errors.image}</Text> */}
        {image && (
        <Image source={{ uri: image.uri }} style={{ width: 100, height: 100 }} />
        )}
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal:10,
    paddingVertical:20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor:"#fff",
    borderColor:"#fff",
    borderWidth:2,
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
  },
    input: {
        height: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: 'green',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 20,
        marginBottom: 12,
    },
});
