import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image ,StyleSheet,TouchableOpacity,SafeAreaView,Text, Alert,ScrollView} from 'react-native';
import { createUser, updateUser } from '../apis/UserService';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { launchCamera } from 'react-native-image-picker';
import { ensureCameraPermission } from '../../utils/cameraPermission';
import BackTitleHeader from '../../src/components/Shared/BackTitleHeader';
import { fileUrl } from '../../utils/fileUrl';

export default function UserFormScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

const validateForm = () => {
    let errors = {};

    // Validate name field
    if (!name) {
        errors.name = 'Name is required.';
    }

    // Validate email field
    if (!email) {
        errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email is invalid.';
    }

    // Validate password field
    if (!phone) {
        errors.phone = 'Phone is required.';
    } else if (phone.length < 9) {
        errors.phone = 'Phone must be at least 10 characters.';
    }

    // if (!image) {
    //     errors.image = 'Image is required.';
    // }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
};
  

  function onChange() {
    validateForm();
  }
  const user = route.params?.user;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setImage({ uri: fileUrl(user.image) });
    }
  }, [user]);

  const handleSave = async () => {
   
    validateForm();
    if (isFormValid) {
        const userData = { name, email, phone, image };
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

  const handleImagePick = async () => {
    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) return;

    // Camera only — capture a live photo instead of picking from the gallery.
    launchCamera({ mediaType: 'photo', saveToPhotos: false }, (response) => {
      if (response.assets) {

        setImage(response.assets[0]); 
        // console.log(response+'imagepick')
      }
    });
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
        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}>
          <FeatherIcon
            color="#000"
            name="more-vertical"
            size={24} />
        </TouchableOpacity>
      </View>
    </View>

    <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChange={onChange}
            onChangeText={setName}
        />
        <Text style={styles.error}>{errors.name}</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={onChange}
            onChangeText={setEmail}
        />
        <Text style={styles.error}>{errors.email}</Text>
        <TextInput
            style={styles.input}
            placeholder="phone"
            onChange={onChange}
            value={phone}
            onChangeText={setPhone}
        />
        <Text style={styles.error}>{errors.phone}</Text>
        <Button title="Pick Image" onPress={handleImagePick} />
        {/* <Text style={styles.error}>{errors.image}</Text> */}
        {image && (
        <Image source={{ uri: image.uri }} style={{ width: 100, height: 100 }} />
        )}
        <TouchableOpacity
            style={[styles.button]}
            onPress={handleSave}
        >
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
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
