import React from 'react';
import type { Vehicle } from '../../types/models';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Offered on a fresh checkout when the customer has booked before: pick a
// previously used vehicle to autofill the form, or start with a blank form.
type SavedDetailsModalProps = { visible: boolean; vehicles: Vehicle[]; onSelect: (...args: any[]) => void; onNew: (...args: any[]) => void };

const SavedDetailsModal = ({ visible, vehicles, onSelect, onNew }: SavedDetailsModalProps) => {
  const renderVehicle = ({ item }: { item: any }) => {
    const vehicle = item.vehicleDetails || {};
    const owner = item.ownerDetails || {};
    const subtitle = [vehicle.manufacturer, vehicle.model, vehicle.fuelType]
      .filter(Boolean)
      .join(' • ');

    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
        <Icon name="car" size={22} color="#09b5e1" style={styles.cardIcon} />
        <View style={styles.cardBody}>
          <Text style={styles.vehicleNumber}>{vehicle.number}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {owner.ownerName ? <Text style={styles.owner}>{owner.ownerName}</Text> : null}
        </View>
        <Icon name="angle-right" size={22} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onNew}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Use saved details?</Text>
          <Text style={styles.description}>
            You've booked with these details before. Pick one to fill the form, or start fresh.
          </Text>
          <FlatList
            data={vehicles}
            renderItem={renderVehicle}
            keyExtractor={(item) => item._id}
            style={styles.list}
          />
          <TouchableOpacity style={styles.newButton} onPress={onNew}>
            <Text style={styles.newButtonText}>Enter New Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '75%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 14,
  },
  list: {
    flexGrow: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  vehicleNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 2,
  },
  owner: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  newButton: {
    marginTop: 6,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#09b5e1',
  },
  newButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default SavedDetailsModal;
