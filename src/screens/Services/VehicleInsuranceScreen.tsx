import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

const insurancePlans = [
    {
        id: '1',
        provider: 'Provider A',
        plan: 'Comprehensive Coverage',
        image: 'https://images.unsplash.com/photo-1517281053033-6b37f1c73b6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHZlaGljbGUlMjBpbnN1cmFuY2V8ZW58MHx8fHwxNjkxNTYxMzMw&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Covers all damages to your vehicle in case of an accident, theft, or fire.',
        premium: '$1,200 per year',
    },
    {
        id: '2',
        provider: 'Provider B',
        plan: 'Third Party Liability',
        image: 'https://images.unsplash.com/photo-1556742400-7f6f7f6d14e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHZlaGljbGUlMjBpbnN1cmFuY2V8ZW58MHx8fHwxNjkxNTYxMzUw&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Covers damages to third parties in case of an accident.',
        premium: '$800 per year',
    },
    {
        id: '3',
        provider: 'Provider C',
        plan: 'Collision Coverage',
        image: 'https://images.unsplash.com/photo-1574169208500-28dbd01b2c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDM4fHxyZWNvZ2Vyb3klMjBjb2xsaXNpb258ZW58MHx8fHwxNjkxNTYxMzkw&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Covers damages to your vehicle due to a collision with another vehicle or object.',
        premium: '$1,000 per year',
    },
    {
        id: '4',
        provider: 'Provider D',
        plan: 'Personal Injury Protection',
        image: 'https://images.unsplash.com/photo-1606378321317-5a51a9be342c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHZlaGljbGUlMjBpbnN1cmFuY2V8ZW58MHx8fHwxNjkxNTYxMzYw&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Covers medical expenses for you and your passengers in case of an accident.',
        premium: '$900 per year',
    },
    {
        id: '5',
        provider: 'Provider E',
        plan: 'Gap Insurance',
        image: 'https://images.unsplash.com/photo-1515846671942-d2bff09be255?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDk4fHxyZWNvZ2VyeSUyMGdhcCUyMGluc3VyYW5jZXxlbnwwfHx8fDE2OTE1NjE0MDU&ixlib=rb-4.0.3&q=80&w=400',
        description: 'Covers the difference between your car’s value and what you owe on it in case of theft or total loss.',
        premium: '$300 per year',
    },
];

const VehicleInsuranceScreen = () => {
    const renderInsurancePlanItem = ({ item }: { item: any }) => (
        <View style={styles.planCard}>
            <Image source={{ uri: item.image }} style={styles.planImage} />
            <View style={styles.planInfo}>
                <Text style={styles.providerName}>{item.provider}</Text>
                <Text style={styles.planTitle}>{item.plan}</Text>
                <Text style={styles.planDescription}>{item.description}</Text>
                <Text style={styles.planPremium}>{item.premium}</Text>
                <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>Contact for More Info</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vehicle Insurance Plans</Text>
            <Text style={styles.subtitle}>Explore various plans to protect your vehicle.</Text>

            <FlatList
                data={insurancePlans}
                renderItem={renderInsurancePlanItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.planList}
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
    planList: {
        paddingBottom: 20,
    },
    planCard: {
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
    planImage: {
        width: 100,
        height: 100,
    },
    planInfo: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    providerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    planTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    planDescription: {
        fontSize: 14,
        color: '#777',
        marginVertical: 5,
    },
    planPremium: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: 'bold',
    },
    contactButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default VehicleInsuranceScreen;
