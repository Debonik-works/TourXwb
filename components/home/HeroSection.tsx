import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';

interface HeroSectionProps {
  heroImages: ImageSourcePropType[];
  currentImageIndex: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.65;

const HeroSection: React.FC<HeroSectionProps> = ({ 
  heroImages, 
  currentImageIndex 
}) => {
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1.1)).current;
  const imageTransition = useRef(new Animated.Value(0)).current;

  // Entry animation
  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  // Image transition animation
  useEffect(() => {
    imageTransition.setValue(0);
    Animated.timing(imageTransition, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentImageIndex]);

  return (
    <View style={styles.container}>
      {/* Hero Image with Ken Burns effect */}
      <Animated.View 
        style={[
          styles.imageContainer,
          {
            opacity: imageTransition,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={heroImages[currentImageIndex]}
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        {/* Subtle Gradient Overlay */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.2)',
          ] as const}
          style={styles.gradientOverlay}
          locations={[0, 1]}
        />
      </Animated.View>

      {/* Pagination Indicators */}
      <View style={styles.indicatorsContainer}>
        {heroImages.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              index === currentImageIndex && styles.activeIndicator,
              {
                opacity: index === currentImageIndex ? 1 : 0.4,
                transform: [
                  { 
                    scaleX: index === currentImageIndex ? 1.5 : 1 
                  }
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    position: 'relative',
    backgroundColor: '#000',
  },
  
  // Image Container
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // Indicators
  indicatorsContainer: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'center',
  },
  indicator: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },
  activeIndicator: {
    backgroundColor: '#FFF',
  },
});

export default React.memo(HeroSection);
