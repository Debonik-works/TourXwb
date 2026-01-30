import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { stats } from '../../constants/Data';

const { width } = Dimensions.get('window');

const getIconName = (name: string): any => {
    switch(name) {
        case 'map-pin': return 'map-pin';
        case 'camera': return 'camera';
        case 'heart': return 'heart';
        case 'users': return 'users';
        default: return 'activity';
    }
}

export default function StatsSection() {
  return (
    <View style={styles.section}>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.iconWrapper}>
                <Feather name={getIconName(stat.icon)} size={24} color="white" />
            </View>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  item: {
    width: width / 2 - 20, // 2 items per row
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4f46e5', // indigo-600
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  }
});
