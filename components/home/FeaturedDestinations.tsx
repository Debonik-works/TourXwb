import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Place } from '../../constants/Data';
import { fetchPlaces } from '../../services/api';
import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDestinations() {
      const data = await fetchPlaces();
      // Filter for specific categories if needed, or take first few
      const featured = data.slice(0, 4); // Just take 4 for now
      setDestinations(featured);
      setLoading(false);
    }
    loadDestinations();
  }, []);

  if (loading) {
     return (
        <View style={styles.section}>
            <Text>Loading destinations...</Text>
        </View>
     )
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured <Text style={styles.highlight}>Destinations</Text></Text>
        <Text style={styles.subtitle}>
          Explore the most iconic and culturally significant places that define West Bengal's rich heritage.
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {destinations.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image
                source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300' }}
                style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <View style={styles.categoryRow}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text numberOfLines={2} style={styles.cardDescription}>{item.description}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.location}>
                    <Feather name="map-pin" size={14} color="#666" />
                    <Text style={styles.locationText}>{item.city || item.category}</Text>
                </View>
                <Link href="/map" asChild>
                    <TouchableOpacity style={styles.learnMore}>
                        <Text style={styles.learnMoreText}>View on Map</Text>
                        <Feather name="arrow-right" size={14} color="#4f46e5" />
                    </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.viewAllContainer}>
        <Link href="/map" asChild>
            <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Destinations</Text>
            <Feather name="arrow-right" size={16} color="white" />
            </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 40,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  highlight: {
    color: '#4f46e5',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    maxWidth: '90%',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    width: width * 0.75,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#c2410c',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
    marginRight: 4,
  },
  viewAllContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  viewAllButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  viewAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
