import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Music, Palette, Theater } from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const CulturalHighlights = () => {
  const { width: screenWidth } = useWindowDimensions();

  const culturalAspects = [
    {
      icon: Music,
      title: 'Classical Music',
      description: 'Rich tradition of Rabindra Sangeet and classical ragas',
      colors: ['#3B82F6', '#8B5CF6'] as [string, string],
    },
    {
      icon: Palette,
      title: 'Traditional Arts',
      description: 'Exquisite handicrafts, terracotta work, and paintings',
      colors: ['#10B981', '#14B8A6'] as [string, string],
    },
    {
      icon: Theater,
      title: 'Bengali Theater',
      description: 'Vibrant theater scene and cultural performances',
      colors: ['#EF4444', '#EC4899'] as [string, string],
    },
    {
      icon: Camera,
      title: 'Film Heritage',
      description: 'Birthplace of legendary filmmakers and cinema',
      colors: ['#F59E0B', '#F97316'] as [string, string],
    },
  ];

  const renderCulturalCard = useCallback(
    (aspect: typeof culturalAspects[0], index: number) => (
      <Animated.View
        key={aspect.title}
        entering={FadeInDown.delay(index * 100).springify()}
        style={styles.culturalCard}
      >
        <View style={styles.iconContainer}>
          <LinearGradient colors={aspect.colors} style={styles.iconGradient}>
            <aspect.icon size={32} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={styles.cardTitle}>{aspect.title}</Text>
        <Text style={styles.cardDescription}>{aspect.description}</Text>
      </Animated.View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <Text style={styles.mainTitle}>
          Cultural <Text style={styles.accentText}>Heritage</Text>
        </Text>
        <Text style={styles.subtitle}>
          West Bengal's cultural tapestry is woven with centuries of artistic
          excellence, literary brilliance, and creative expression.
        </Text>
      </Animated.View>

      {/* Cultural Grid */}
      <View style={styles.gridContainer}>{culturalAspects.map(renderCulturalCard)}</View>

      {/* Tagore Legacy Section with Liquid Glass */}
      <Animated.View entering={FadeIn.delay(400).springify()} style={styles.tagoreWrapper}>
        <BlurView
          intensity={90}
          tint="light"
          style={styles.tagoreGlass}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.tagoreContent}>
            <View style={styles.tagoreTextContainer}>
              <Text style={styles.tagoreTitle}>Tagore's Legacy</Text>
              <Text style={styles.tagoreDescription}>
                West Bengal is the birthplace of Rabindranath Tagore, the Nobel
                Prize-winning poet, whose influence on Bengali culture, music,
                and literature continues to inspire generations.
              </Text>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>2000+</Text>
                  <Text style={styles.statLabel}>Songs Composed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1913</Text>
                  <Text style={styles.statLabel}>Nobel Prize</Text>
                </View>
              </View>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80',
                }}
                style={styles.tagoreImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  accentText: {
    color: '#FB923C',
  },
  subtitle: {
    fontSize: 18,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 400,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  culturalCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
  },
  iconContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  tagoreWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginTop: 16,
  },
  tagoreGlass: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tagoreContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagoreTextContainer: {
    flex: 1,
    minWidth: 300,
    marginBottom: 16,
  },
  tagoreTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FB923C',
    marginBottom: 16,
  },
  tagoreDescription: {
    fontSize: 16,
    color: '#E5E7EB',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FB923C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  imageContainer: {
    flex: 1,
    minWidth: 200,
    alignItems: 'center',
  },
  tagoreImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    maxWidth: 300,
  },
});

export default React.memo(CulturalHighlights);
