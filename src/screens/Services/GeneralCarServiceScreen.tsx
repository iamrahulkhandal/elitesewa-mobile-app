import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const services = [
    {
        id: '1',
        category: 'Engine Check',
        image: 'https://images.unsplash.com/photo-1586768251623-f6fd13c78b10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fGVuZ2luZSUyMGNoZWNrJTIwY2FyfGVufDB8fHx8MTY5MTU2MDg5MQ&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Comprehensive engine diagnostics and repairs.',
    },
    {
        id: '2',
        category: 'Oil Change',
        image: 'https://images.unsplash.com/photo-1586777727711-8e2d1c4b4c1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDI3fHxvb2wlMjBjaGFuZ3V8ZW58MHx8fHwxNjkxNTYwODk3&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Regular oil changes to keep your engine running smoothly.',
    },
    {
        id: '3',
        category: 'Tire Service',
        image: 'https://images.unsplash.com/photo-1603634505256-cb378db2c35d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE2fHx0aXJlJTIwc2VydmljZXxlbnwwfHx8fDE2OTE1NjA4OTg&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Tire rotation, balancing, and replacement services.',
    },
    {
        id: '4',
        category: 'Brake Service',
        image: 'https://images.unsplash.com/photo-1569739020802-2151b3d42170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE5fHxiYWtlJTIwc2VydmljZXxlbnwwfHx8fDE2OTE1NjA5MDg&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Brake inspections, repairs, and replacements.',
    },
    {
        id: '5',
        category: 'Battery Service',
        image: 'https://images.unsplash.com/photo-1583229065363-8c67bda4ba68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDI0fHxjYXIlMjBjb25zdWx0aW5nJTIwc2VydmljZXxlbnwwfHx8fDE2OTE1NjA5MTg&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Battery testing, replacement, and maintenance.',
    },
];

const GeneralCarServiceScreen = () => {
    const renderServiceItem = ({ item }) => (
        <View style={styles.serviceCard}>
            <Image source={{ uri: item.image }} style={styles.serviceImage} />
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceCategory}>{item.category}</Text>
                <Text style={styles.serviceDescription}>{item.description}</Text>
                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Service</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.title}>Car Services</Text>
            <Text style={styles.subtitle}>
                Choose from a variety of services to keep your car in top condition.
            </Text>
        </View>
    );

    return (
        <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.serviceList}
        />
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
    },
    serviceList: {
        paddingBottom: 20,
    },
    serviceCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
        flexDirection: 'row',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    serviceImage: {
        width: 100,
        height: 100,
    },
    serviceInfo: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    serviceCategory: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    serviceDescription: {
        fontSize: 14,
        color: '#777',
        marginVertical: 5,
    },
    bookButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default GeneralCarServiceScreen;
