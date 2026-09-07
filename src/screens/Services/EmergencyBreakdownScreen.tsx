import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const emergencyServices = [
    {
        id: '1',
        category: 'Towing Service',
        image: 'https://images.unsplash.com/photo-1571069215150-4b583b7d2e06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDl8fHRvd2luZyUyMHNlcnZpY2V8ZW58MHx8fHwxNjkxNTYxMDA0&ixlib=rb-4.0.3&q=80&w=400',
        description: '24/7 towing services for your vehicle in case of breakdown.',
    },
    {
        id: '2',
        category: 'Flat Tire Assistance',
        image: 'https://images.unsplash.com/photo-1557970482-5ac2ab11805a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDh8fHRpcmUlMjBzZXJ2aWNlfGVufDB8fHx8MTY5MTU2MTA5Mg&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Help with flat tires, including repair or replacement.',
    },
    {
        id: '3',
        category: 'Battery Jump Start',
        image: 'https://images.unsplash.com/photo-1583212970499-0bc1f0bc8bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGJhdHRlcnklMjBqdW1wJTIwc3RhcnR8ZW58MHx8fHwxNjkxNTYxMTEw&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Quick jump-start service for dead batteries.',
    },
    {
        id: '4',
        category: 'Fuel Delivery',
        image: 'https://images.unsplash.com/photo-1598131964658-abc2eac42529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDl8fGZ1ZWwlMjBkZXZlbHlwYW5vJTIwc2VydmljZXxlbnwwfHx8fDE2OTE1NjExMTI&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Delivery of fuel in case you run out on the road.',
    },
    {
        id: '5',
        category: 'Lockout Service',
        image: 'https://images.unsplash.com/photo-1511707172430-8d8813d8bba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDR8fGxvY2tvdXQlMjBzZXJ2aWNlfGVufDB8fHx8MTY5MTU2MTExNw&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Assistance with vehicle lockout situations.',
    },
];

const EmergencyBreakdownScreen = () => {
    const renderEmergencyServiceItem = ({ item }) => (
        <View style={styles.serviceCard}>
            <Image source={{ uri: item.image }} style={styles.serviceImage} />
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceCategory}>{item.category}</Text>
                <Text style={styles.serviceDescription}>{item.description}</Text>
                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Call for Service</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Emergency Breakdown Services</Text>
            <Text style={styles.subtitle}>We're here to help you 24/7.</Text>

            <FlatList
                data={emergencyServices}
                renderItem={renderEmergencyServiceItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.serviceList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        flex: 1,
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

export default EmergencyBreakdownScreen;
