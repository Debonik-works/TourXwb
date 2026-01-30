import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Camera,
  Heart,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users,
  Zap
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageSourcePropType,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// Custom components
import CulturalHighlights from '@/components/home/CulturalHighlights';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import HeroSection from '@/components/home/HeroSection';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const heroImages: ImageSourcePropType[] = useMemo(() => [
    require('@/assets/images/kolkata.jpg'),
    require('@/assets/images/pexels-ishan-das-354419826-18892441.jpg'),
    require('@/assets/images/nature-landscape-with-starry-clear-sky_23-2151683193.jpg'),
    require('@/assets/images/132159-1080x2160-samsung-hd-himalayas-wallpaper-image.jpg'),
  ], []);

  // Categories - Nike style
  const categories = useMemo(() => [
    { id: 'all', label: 'All', icon: Zap },
    { id: 'heritage', label: 'Heritage', icon: Star },
    { id: 'culture', label: 'Culture', icon: Heart },
    { id: 'nature', label: 'Nature', icon: MapPin },
  ], []);

  // Stats with gradients
  const stats = useMemo(() => [
    { 
      icon: MapPin, 
      label: 'Destinations', 
      value: '50+', 
      gradient: ['#FF6B6B', '#FF8E53'] as const 
    },
    { 
      icon: Camera, 
      label: 'Experiences', 
      value: '200+', 
      gradient: ['#4FACFE', '#00F2FE'] as const 
    },
    { 
      icon: Heart, 
      label: 'Events', 
      value: '100+', 
      gradient: ['#FA709A', '#FEE140'] as const 
    },
    { 
      icon: Users, 
      label: 'Travelers', 
      value: '10K+', 
      gradient: ['#A8EDEA', '#FED6E3'] as const 
    },
  ], []);

  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Handlers
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}` as any);
    }
  }, [searchQuery, router]);

  const handleExplore = useCallback(() => {
    router.push('/heritage' as any);
  }, [router]);

  const handlePlanWithAI = useCallback(() => {
    router.push('/PlanTrip' as any);
  }, [router]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // Hero - updated with Plan with AI button
  const renderHero = useCallback(() => (
    <Animated.View 
      style={[
        styles.heroContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}
    >
      <HeroSection 
        heroImages={heroImages} 
        currentImageIndex={currentImageIndex}
      />
      
      {/* Overlay content */}
      <View style={styles.heroOverlay}>
        <View style={styles.heroContent}>
          <Text style={styles.heroLabel}>DISCOVER BENGAL</Text>
          <Text style={styles.heroTitle}>Where Heritage{'\n'}Meets Adventure</Text>
          <Text style={styles.heroSubtitle}>
            Explore 300+ years of rich culture and breathtaking landscapes
          </Text>
          
          <Pressable 
            style={({ pressed }) => [
              styles.heroCTA,
              pressed && styles.pressed,
            ]}
            onPress={handlePlanWithAI}
          >
            <Sparkles size={18} color="#000" strokeWidth={2.5} />
            <Text style={styles.heroCTAText}>Plan with AI</Text>
            <ArrowRight size={18} color="#000" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  ), [heroImages, currentImageIndex, fadeAnim, scaleAnim, handlePlanWithAI]);

  // Search bar
  const renderSearch = useCallback(() => (
    <View style={styles.searchWrapper}>
      <View style={styles.searchBar}>
        <Search size={20} color="#8D8D8D" strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor="#8D8D8D"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
    </View>
  ), [searchQuery, handleSearch]);

  // Category pills
  const renderCategories = useCallback(() => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
      style={styles.categoriesScroll}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const Icon = cat.icon;
        return (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [
              styles.categoryPill,
              isActive && styles.categoryPillActive,
              pressed && styles.pressed,
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Icon 
              size={16} 
              color={isActive ? '#FFF' : '#111'} 
              strokeWidth={2.5}
            />
            <Text style={[
              styles.categoryText,
              isActive && styles.categoryTextActive,
            ]}>
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  ), [categories, activeCategory]);

  // Stats
  const renderStats = useCallback(() => (
    <View style={styles.statsSection}>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Animated.View
              key={stat.label}
              style={[
                styles.statCard,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  }],
                },
              ]}
            >
              <LinearGradient
                colors={stat.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statIconWrapper}
              >
                <Icon size={24} color="#FFF" strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  ), [stats, fadeAnim]);

  // CTA Section - updated with AI emphasis
  const renderCTA = useCallback(() => (
    <View style={styles.ctaSection}>
      <LinearGradient
        colors={['#111', '#1a1a1a'] as const}
        style={styles.ctaCard}
      >
        <View style={styles.ctaContent}>
          <View style={styles.ctaLabelContainer}>
            <Sparkles size={14} color="#FFF" strokeWidth={2} />
            <Text style={styles.ctaLabel}>AI-POWERED PLANNING</Text>
          </View>
          <Text style={styles.ctaTitle}>
            Let AI Craft Your{'\n'}Perfect Journey
          </Text>
          
          <View style={styles.ctaButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.ctaPrimary,
                pressed && styles.pressed,
              ]}
              onPress={handlePlanWithAI}
            >
              <Sparkles size={18} color="#111" strokeWidth={2.5} />
              <Text style={styles.ctaPrimaryText}>Plan with AI</Text>
            </Pressable>
            
            <Pressable
              style={({ pressed }) => [
                styles.ctaSecondary,
                pressed && styles.pressed,
              ]}
              onPress={handleExplore}
            >
              <Text style={styles.ctaSecondaryText}>Browse Manually</Text>
              <ArrowRight size={18} color="#FFF" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
        
        {/* Decorative element */}
        <View style={styles.ctaDecoration}>
          <Sparkles size={140} color="rgba(255,255,255,0.05)" strokeWidth={1} />
        </View>
      </LinearGradient>
    </View>
  ), [handlePlanWithAI, handleExplore]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={true}
      >
        {renderHero()}
        
        {renderSearch()}
        
        {renderCategories()}
        
        {renderStats()}
        
        <CulturalHighlights />
        
        <FeaturedDestinations />
        
        {renderCTA()}
        
        <View style={styles.footer} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  
  // Hero Section
  heroContainer: {
    height: SCREEN_HEIGHT * 0.65,
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  heroContent: {
    paddingHorizontal: 20,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#FFF',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: IS_SMALL_DEVICE ? 36 : 44,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: IS_SMALL_DEVICE ? 40 : 48,
    marginBottom: 12,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
    lineHeight: 22,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignSelf: 'flex-start',
    gap: 8,
  },
  heroCTAText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.3,
  },
  
  // Search
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },
  
  // Categories
  categoriesScroll: {
    marginBottom: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    gap: 8,
  },
  categoryPillActive: {
    backgroundColor: '#111',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    letterSpacing: 0.3,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  
  // Stats
  statsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'flex-start',
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8D8D8D',
    letterSpacing: 0.2,
  },
  
  // CTA Section
  ctaSection: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  ctaCard: {
    borderRadius: 24,
    padding: 32,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 320,
  },
  ctaContent: {
    zIndex: 1,
  },
  ctaLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  ctaLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#FFF',
  },
  ctaTitle: {
    fontSize: IS_SMALL_DEVICE ? 32 : 40,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: IS_SMALL_DEVICE ? 36 : 44,
    marginBottom: 32,
    letterSpacing: -1,
  },
  ctaButtons: {
    gap: 12,
  },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 10,
  },
  ctaPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.3,
  },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 8,
  },
  ctaSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  ctaDecoration: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    opacity: 1,
  },
  
  // Interaction states
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  
  footer: {
    height: 32,
  },
});
