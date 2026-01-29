import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { heroImages } from '../../constants/Data';
import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {heroImages.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.overlay} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.content}>
        <Text style={styles.title}>Discover West Bengal</Text>
        <Text style={styles.subtitle}>
          Journey through centuries of rich heritage, vibrant festivals, and magnificent temples.
        </Text>
        <Link href="/discover" asChild>
            <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Plan Your Journey</Text>
            <Feather name="arrow-right" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.pagination}>
        {heroImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.6,
    position: 'relative',
  },
  slide: {
    width,
    height: height * 0.6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 300,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  icon: {
    marginLeft: 4,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: -2,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
