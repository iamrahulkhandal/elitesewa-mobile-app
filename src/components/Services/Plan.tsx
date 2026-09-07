import React from 'react';
import type { PlanSummary } from '../../types/models';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type PlanProps = { plan: PlanSummary; onSelect: (...args: any[]) => void; serviceid: string };

const Plan = ({ plan, onSelect,serviceid}: PlanProps) => {
  const { name, price, duration, keyPoints } = plan;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.price}>
        {plan.billingType === 'monthly' ? `Rs. ${price} / month` : `Starting From @ Rs. ${price}`}
      </Text>
      {plan.billingType === 'monthly' && (
        <Text style={styles.autopayBadge}>Auto-renews monthly · cancel anytime</Text>
      )}
      <Text style={styles.duration}>Plan Duration: {duration} {serviceid === '673f16b97a12ef01b200c940' ? 'Minutes' : 'Days'}</Text>
      {(keyPoints?.length ?? 0) > 0 && (
        <Text style={styles.keyPointsHeading}>Key Points:</Text>
      )}

      {keyPoints?.map((point, index) => (
        <Text key={index} style={styles.keyPoint}>
          • {point}
        </Text>
      ))}

      <TouchableOpacity style={styles.selectButton} onPress={() => onSelect(plan)}>
        <Text style={styles.selectButtonText}>Select Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

type PlanPickProps = { plan: PlanSummary; onSelect: (...args: any[]) => void };

const PlanPick = ({ plan, onSelect }: PlanPickProps) => {
  const { name, price, duration, keyPoints } = plan;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.selectButtonBreak} onPress={() => onSelect(plan)}>
        <Text style={styles.selectButtonText}>Request Driver</Text>
      </TouchableOpacity>
    </View>
  );
};
type PlanBreakProps = { plan: PlanSummary; onSelect: (...args: any[]) => void };

const PlanBreak = ({ plan, onSelect }: PlanBreakProps) => {
  const { name, price, duration, keyPoints } = plan;

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.selectButtonBreak} onPress={() => onSelect(plan)}>
        <Text style={styles.selectButtonText}>Request A CallBack</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  autopayBadge: {
    color: '#09b5e1',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#333',
  },
  duration: {
    fontSize: 16,
    color: '#666',
  },
  keyPointsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  keyPoint: {
    fontSize: 14,
    color: '#555',
  },
  selectButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#F37254',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectButtonPick: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#09b5e1',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectButtonBreak: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#09b5e1',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { Plan, PlanPick,PlanBreak };
