import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const repairServices = [
    {
        id: '1',
        category: 'Engine Repair',
        image: 'https://images.unsplash.com/photo-1560674710-3d52730b5a9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGVuZ2luZXxlbnwwfHx8fDE2OTE1NjExNzE&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Expert engine repairs to keep your vehicle running smoothly.',
    },
    {
        id: '2',
        category: 'Transmission Repair',
        image: 'https://images.unsplash.com/photo-1587315719441-22b05885d394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHRyYW5zbWlzc2lvbiUyMHJlcGFpcnxlbnwwfHx8fDE2OTE1NjExODg&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Reliable transmission repairs for all types of vehicles.',
    },
    {
        id: '3',
        category: 'Brake Repair',
        image: 'https://images.unsplash.com/photo-1610546855153-1a1b378e7f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fGJyYWtlJTIwcmVwYWlyfGVufDB8fHx8MTY5MTU2MTIxOQ&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Comprehensive brake repair services to ensure your safety.',
    },
    {
        id: '4',
        category: 'Electrical System Repair',
        image: 'https://images.unsplash.com/photo-1606811284161-1d912fd48c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fGVsZWN0cmljYWwlMjBzeXN0ZW18ZW58MHx8fHwxNjkxNTYxMjI5&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Diagnosis and repair of electrical systems in your vehicle.',
    },
    {
        id: '5',
        category: 'Suspension Repair',
        image: 'https://images.unsplash.com/photo-1568671841790-7b88c3fdb21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHN1c3BlbnNpb258ZW58MHx8fHwxNjkxNTYxMjQy&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Professional suspension repairs to improve handling and comfort.',
    },
];

const GeneralRepairServicesScreen = () => {
    const renderRepairServiceItem = ({ item }: { item: any }) => (
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>General Repair Services</Text>
            <Text style={styles.subtitle}>Choose from a variety of repair services for your vehicle.</Text>

            <FlatList
                data={repairServices}
                renderItem={renderRepairServiceItem}
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

export default GeneralRepairServicesScreen;
