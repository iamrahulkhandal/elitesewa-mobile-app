import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated,Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
const OnDemandCarWash = () => {
    const navigation = useNavigation();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedPrice, setSelectedPackagePrice] = useState(0);
    const [scaleValue] = useState(new Animated.Value(1));

    const serviceDetails = {
        title: 'Full Car Service',
        description: 'This service includes a full check-up of your car, including engine oil replacement, brake inspection, tire rotation, and more.',
        packages: [
            { id: 1, name: 'Platinum wash', price: 299, timing:'30 to 20 MInutes' ,exterior: ['Full Exterior Hand wash', 'Exterior wax protection applied', 'Alloys cleaned','Tire dressing & Rim Cleaning','All glass cleaned (glass cleaner)'] ,interior:['Interior cleaned with degreaser ','Dashboard cleaning ','Dashboard & Doors wax protection applied ','Carpet wiped down (basic)','Interior vacuum','Steering column wiped down','Door sills wiped down']},
            { id: 2, name: 'Gold wash', price: 199,timing:'10 to 20 MInutes' ,exterior: ['Full Exterior Foam wash','Alloys cleaned','Tire dressing & Rim Cleaning','All glass cleaned (glass cleaner)'] ,interior:['Dashboard cleaning ','Dashboard & Doors Cleaning','Carpet Cleaning','Interior vacuum']},
        ],
    };

    const handlePackageSelect = (packageId,packagePrice) => {
        setSelectedPackage(packageId);
        setSelectedPackagePrice(packagePrice);
        Animated.sequence([
            Animated.timing(scaleValue, { toValue: 1.05, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start();
    };

    const handleBooking = () => {
        if (selectedPackage) {
            return (
                navigation.navigate('PaymentScreen', { price: selectedPrice })
            )
        } else {
            alert('Please select a package.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{serviceDetails.title}</Text>
            <Text style={styles.description}>{serviceDetails.description}</Text>

            <View style={styles.packagesContainer}>
                {serviceDetails.packages.map(pkg => (
                    <TouchableOpacity
                        key={pkg.id}
                        style={[styles.packageCard, selectedPackage === pkg.id && styles.selectedPackage]}
                        onPress={() => handlePackageSelect(pkg.id,pkg.price)}
                    >
                        <Animated.View style={{ transform: [{ scale: selectedPackage === pkg.id ? scaleValue : 1 }] }}>
                            <View style={styles.cardtop}>
                            {/* <Image
      style={{width: 50, height: 50}}
      source={{uri: 'https://w7.pngwing.com/pngs/716/565/png-transparent-star-yellow-spring-star-s-angle-triangle-symmetry-thumbnail.png'}}
    /> */}
                            <Text style={styles.packageName}>{pkg.name}</Text>
                            <Text style={styles.packagePrice}>{pkg.price.toFixed(2)}</Text>
                            </View>
                            <Text style={styles.featuresListHeading}>★ Exterior Includes:</Text>
                            <View style={styles.featuresList}>
                                {pkg.exterior.map((feature, index) => (
                                    <View key={index} style={styles.featureItem}>
                                        <Icon name="check" size={20} color="#4CAF50" />
                                        <Text style={styles.packageFeature}>{feature}</Text>
                                    </View>
                                ))}
                            </View>
                            <Text style={styles.featuresListHeading}>★ Exterior Includes:</Text>
                            <View style={styles.featuresList}>
                                {pkg.interior.map((feature, index) => (
                                    <View key={index} style={styles.featureItem}>
                                        <Icon name="check" size={20} color="#4CAF50" />
                                        <Text style={styles.packageFeature}>{feature}</Text>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Price:</Text>
                <Text style={styles.price}>₹ {selectedPrice}</Text>
            </View>
            <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
                <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    description: {
        fontSize: 16,
        color: '#777',
        marginBottom: 25,
        lineHeight: 22,
    },
    cardtop:{
        borderBottomWidth:2,
        marginBottom:20
    },
    packagesContainer: {
        marginBottom: 30,
    },
    packageCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    selectedPackage: {
        borderColor: '#007bff',
        borderWidth: 2,
    },
    packageName: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign:'center',
        color: '#ffc000',
    },
    packagePrice: {
        fontSize: 33,
        borderRadius:50,
        color: '#333',
        marginBottom: 15,
    },
    featuresList: {
        marginTop: 10,
        marginBottom:20,
    },
    featuresListHeading:{
        fontSize: 18,
        fontWeight:'800',
        color: '#555',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        marginBottom: 20,
      },
      priceLabel: {
        fontSize: 18,
        color: '#333',
      },
      price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF9800',
      },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    packageFeature: {
        fontSize: 16,
        marginLeft: 10,
        color: '#555',
    },
    bookButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        marginBottom:60
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default OnDemandCarWash;