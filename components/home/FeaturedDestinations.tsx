import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, ChevronRight, Clock, MapPin, Sparkles, Star } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';

interface Destination {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
  duration: string;
  rating: number;
  category: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_SPACING = 16;

const COLORS = {
  primary: '#6366F1',
  primaryLight: '#818CF8',
  accent: '#F59E0B',
  background: '#FAFAF9',
  cardBg: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
};

const FeaturedDestinations = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const destinations: Destination[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Victoria Memorial',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
        description: 'Iconic white marble monument dedicated to Queen Victoria',
        duration: '2-3 hrs',
        rating: 4.8,
        category: 'Heritage',
      },
      {
        id: 2,
        name: 'Howrah Bridge',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1555400082-4b3b94d6d721?w=600&q=80',
        description: 'Famous cantilever bridge over Hooghly River',
        duration: '1 hr',
        rating: 4.6,
        category: 'Architecture',
      },
      {
        id: 3,
        name: 'Dakshineswar Temple',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
        description: 'Sacred Hindu temple of Goddess Kali',
        duration: '2 hrs',
        rating: 4.7,
        category: 'Religious',
      },
      {
        id: 4,
        name: 'Darjeeling Tea Gardens',
        location: 'Darjeeling',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
        description: 'Scenic hill station with tea plantations',
        duration: 'Full Day',
        rating: 4.9,
        category: 'Nature',
      },
    ],
    []
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleDestinationPress = useCallback(
    (destinationId: number) => {
      router.push({
        pathname: '/heritage/[id]',
        params: { id: destinationId.toString() },
      } as any);
    },
    [router]
  );

  const handleViewAllPress = useCallback(() => {
    router.push('/heritage' as any);
  }, [router]);

  const DestinationCard = useCallback(
    ({ item }: { item: Destination }) => {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.cardContainer,
            pressed && styles.cardPressed,
          ]}
          onPress={() => handleDestinationPress(item.id)}
        >
          <View style={styles.card}>
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.image} 
                resizeMode="cover"
              />
              
              <LinearGradient
                colors={[
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.3)',
                  'rgba(0,0,0,0.7)',
                ] as const}
                style={styles.imageGradient}
                locations={[0.3, 0.7, 1]}
              />
              
              <View style={styles.categoryBadge}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight] as const}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Text style={styles.categoryText}>{item.category}</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.ratingBadge}>
                <Star size={13} color={COLORS.accent} fill={COLORS.accent} strokeWidth={2} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.destinationName} numberOfLines={1}>
                {item.name}
              </Text>
              
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <View style={styles.iconCircle}>
                    <MapPin size={13} color={COLORS.primary} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.infoText} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.iconCircle}>
                    <Clock size={13} color={COLORS.accent} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.infoText} numberOfLines={1}>
                    {item.duration}
                  </Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.exploreButton,
                  pressed && styles.explorePressed,
                ]}
                onPress={() => handleDestinationPress(item.id)}
              >
                <Text style={styles.exploreText}>Explore Details</Text>
                <ArrowRight size={15} color={COLORS.primary} strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>
        </Pressable>
      );
    },
    [handleDestinationPress]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: CARD_WIDTH + CARD_SPACING,
      offset: (CARD_WIDTH + CARD_SPACING) * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: Destination) => item.id.toString(), []);

  const renderItem = useCallback(
    ({ item }: { item: Destination }) => <DestinationCard item={item} />,
    [DestinationCard]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Sparkles size={22} color={COLORS.accent} strokeWidth={2} />
            <Text style={styles.title}>Featured Destinations</Text>
          </View>
          <Text style={styles.subtitle}>Curated experiences for you</Text>
        </View>
        
        <Pressable
          style={({ pressed }) => [
            styles.viewAllHeaderButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleViewAllPress}
        >
          <Text style={styles.viewAllHeaderText}>All</Text>
          <ChevronRight size={16} color={COLORS.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={destinations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
        bounces={true}
      />

      <View style={styles.indicatorsContainer}>
        {destinations.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === activeIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      <View style={styles.ctaContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleViewAllPress}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Sparkles size={17} color="#FFF" strokeWidth={2.5} />
            <Text style={styles.ctaText}>Discover All Destinations</Text>
            <ArrowRight size={17} color="#FFF" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: IS_SMALL_DEVICE ? 20 : 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  viewAllHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewAllHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  flatListContent: {
    paddingHorizontal: 20,
    gap: CARD_SPACING,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  imageWrapper: {
    height: CARD_WIDTH * 0.65,
    position: 'relative',
    backgroundColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  contentContainer: {
    padding: 16,
    gap: 10,
  },
  destinationName: {
    fontSize: IS_SMALL_DEVICE ? 18 : 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 6,
    marginTop: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  explorePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  exploreText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  activeIndicator: {
    width: 28,
    backgroundColor: COLORS.primary,
  },
  ctaContainer: {
    paddingHorizontal: 20,
  },
  ctaButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  ctaText: {
    fontSize: IS_SMALL_DEVICE ? 15 : 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});

export default React.memo(FeaturedDestinations);
