import React from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import CulturalHighlights from '@/components/home/CulturalHighlights';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar - Overlay on Hero or separate? Let's keep it separate for now or over the hero if possible */}
      {/* For simplicity in RN, I'll put it below header or inside a SafeAreaView if needed.
          But here I'll just render sections.
      */}

      <HeroSection />

      <View style={styles.searchSection}>
         <Text style={styles.searchTitle}>Find Your Perfect Experience</Text>
         <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
                placeholder="Discover places, hotels, events..."
                placeholderTextColor="#999"
                style={styles.input}
            />
         </View>
      </View>

      <StatsSection />

      <FeaturedDestinations />

      <CulturalHighlights />

      <View style={styles.footer}>
          <Text style={styles.footerText}>Ready to Explore West Bengal?</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchSection: {
      padding: 20,
      backgroundColor: '#f9fafb',
      alignItems: 'center',
  },
  searchTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
  },
  searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 30,
      paddingHorizontal: 16,
      paddingVertical: 12,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  searchIcon: {
      marginRight: 10,
  },
  input: {
      flex: 1,
      fontSize: 16,
      color: '#333',
  },
  footer: {
      padding: 40,
      backgroundColor: '#4f46e5',
      alignItems: 'center',
  },
  footerText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
  },
});
