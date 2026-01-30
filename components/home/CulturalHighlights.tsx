import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { culturalAspects } from '../../constants/Data';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Map string icon names to Feather icon names
const getIconName = (name: string): any => {
    switch(name) {
        case 'music': return 'music';
        case 'palette': return 'aperture'; // Feather doesn't have palette, using aperture as placeholder
        case 'film': return 'film';
        case 'camera': return 'camera';
        default: return 'star';
    }
}

export default function CulturalHighlights() {
  return (
    <View style={styles.section}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cultural <Text style={styles.highlight}>Heritage</Text></Text>
          <Text style={styles.subtitle}>
            West Bengal's cultural tapestry is woven with centuries of artistic excellence.
          </Text>
        </View>

        <View style={styles.grid}>
          {culturalAspects.map((aspect, index) => (
            <View key={index} style={styles.gridItem}>
              <View style={[styles.iconContainer, { backgroundColor: aspect.color }]}>
                <Feather name={getIconName(aspect.icon)} size={24} color="white" />
              </View>
              <Text style={styles.itemTitle}>{aspect.title}</Text>
              <Text style={styles.itemDescription}>{aspect.description}</Text>
            </View>
          ))}
        </View>

        {/* Tagore Section */}
        <LinearGradient
            colors={['rgba(234, 88, 12, 0.1)', 'rgba(220, 38, 38, 0.1)']}
            style={styles.tagoreSection}
        >
            <Text style={styles.tagoreTitle}>Tagore's Legacy</Text>
            <Text style={styles.tagoreText}>
                West Bengal is the birthplace of Rabindranath Tagore, the Nobel Prize-winning poet.
            </Text>
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>2000+</Text>
                    <Text style={styles.statLabel}>Songs</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>1913</Text>
                    <Text style={styles.statLabel}>Nobel Prize</Text>
                </View>
            </View>
        </LinearGradient>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 40,
    backgroundColor: '#111827', // gray-900
  },
  container: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  highlight: {
    color: '#fb923c', // orange-400
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d5db', // gray-300
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 60) / 2, // 2 columns with gaps
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  itemDescription: {
    fontSize: 13,
    color: '#9ca3af', // gray-400
    textAlign: 'center',
    lineHeight: 18,
  },
  tagoreSection: {
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)', // orange-500/20
  },
  tagoreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fb923c',
    marginBottom: 12,
  },
  tagoreText: {
    fontSize: 15,
    color: '#d1d5db',
    lineHeight: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
      alignItems: 'flex-start'
  },
  statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fb923c',
  },
  statLabel: {
      fontSize: 12,
      color: '#9ca3af',
  }
});
