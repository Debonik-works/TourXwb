import { supabase } from '@/utils/supabase/server';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

type PlaceCategory =
  | 'Heritage' | 'Temple' | 'Museum' | 'Nature' | 'Fort' | 'Beach'
  | 'Market' | 'Park' | 'Transport' | 'Wildlife' | 'National Park'
  | 'Village' | 'Town' | 'Viewpoint' | 'Cultural Site' | 'Pilgrimage'
  | 'Archaeological' | 'Hillstation' | 'Engineering' | 'Religious'
  | 'Lake' | 'Shopping';

interface PlaceSpec {
  id: string; name: string; category: PlaceCategory;
  lat: number; lon: number; city?: string;
  description?: string; images?: string[];
  google_map_link?: string;
}
interface HotelSpec {
  id: string; name: string; lat: number; lon: number; rating?: number;
}

const ICON_MAP: Record<PlaceCategory, any> = {
  Heritage: require('@/assets/icons/heritage.png'),
  Temple: require('@/assets/icons/temple.png'),
  Museum: require('@/assets/icons/museum.png'),
  Nature: require('@/assets/icons/nature.png'),
  Fort: require('@/assets/icons/fort.png'),
  Beach: require('@/assets/icons/beach.png'),
  Market: require('@/assets/icons/market.png'),
  Park: require('@/assets/icons/park.png'),
  Transport: require('@/assets/icons/transport.png'),
  Wildlife: require('@/assets/icons/wildlife.png'),
  'National Park': require('@/assets/icons/national-park.png'),
  Village: require('@/assets/icons/village.png'),
  Town: require('@/assets/icons/town.png'),
  Viewpoint: require('@/assets/icons/viewpoint.png'),
  'Cultural Site': require('@/assets/icons/cultural-site.png'),
  Pilgrimage: require('@/assets/icons/pilgrimage.png'),
  Archaeological: require('@/assets/icons/a.png'),
  Hillstation: require('@/assets/icons/mountain.png'),
  Engineering: require('@/assets/icons/engineering.png'),
  Religious: require('@/assets/icons/religious.png'),
  Lake: require('@/assets/icons/lake.png'),
  Shopping: require('@/assets/icons/shopping.png'),
};

const HOTEL_ICON = require('@/assets/icons/hotel.png');

const INITIAL_REGION: Region = {
  latitude: 22.5726,
  longitude: 88.3639,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function WBMapPremium() {
  const mapRef = useRef<MapView>(null);
  const [places, setPlaces] = useState<PlaceSpec[]>([]);
  const [hotels, setHotels] = useState<HotelSpec[]>([]);
  const [activePlace, setActivePlace] = useState<PlaceSpec | null>(null);
  const [distanceSetting, setDistanceSetting] = useState<number>(2);
  const [tourMode, setTourMode] = useState<boolean>(true);
  const [tourPaused, setTourPaused] = useState<boolean>(false);
  const visitedRef = useRef<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const tourTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Memoized hotel filter
  const hotelsNearby = useMemo(() => {
    if (!activePlace) return [];
    return hotels.filter(
      h => haversine(activePlace.lat, activePlace.lon, h.lat, h.lon) <= distanceSetting
    );
  }, [activePlace, hotels, distanceSetting]);

  // ✅ Fetch data - batched queries & fast state commit
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [placesRes, hotelsRes] = await Promise.all([
          supabase.from('places').select('*'),
          supabase.from('hotels').select('*')
        ]);

        if (placesRes.data) setPlaces(placesRes.data);
        if (hotelsRes.data) setHotels(hotelsRes.data);

        // Start from first place as base
        const first = placesRes.data?.[0];
        if (first) {
          setActivePlace(first);
          visitedRef.current.add(first.id);
        }
      } catch (err) {
        Alert.alert('Error', 'Unable to load map data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Acquire location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, []);

  // ✅ Animated fly-to transitions
  useEffect(() => {
    if (!activePlace || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: activePlace.lat,
        longitude: activePlace.lon,
        latitudeDelta: 0.6,
        longitudeDelta: 0.6,
      },
      900
    );
  }, [activePlace]);

  // ✅ Smooth tour guide logic
  useEffect(() => {
    if (!tourMode || tourPaused || !activePlace) return;

    const playTour = () => {
      const unvisited = places.filter(p => !visitedRef.current.has(p.id));
      if (!unvisited.length) return;
      const nearest = unvisited.reduce((a, b) => {
        const da = haversine(activePlace.lat, activePlace.lon, a.lat, a.lon);
        const db = haversine(activePlace.lat, activePlace.lon, b.lat, b.lon);
        return db < da ? b : a;
      });
      setActivePlace(nearest);
      visitedRef.current.add(nearest.id);
      tourTimeoutRef.current = setTimeout(playTour, 7000) as unknown as NodeJS.Timeout;
    };

    tourTimeoutRef.current = setTimeout(playTour, 7000) as unknown as NodeJS.Timeout;
    return () => {
      if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    };
  }, [tourMode, tourPaused, activePlace]);

  const handleHotelPress = (h: HotelSpec) =>
    Linking.openURL(`https://maps.google.com/?q=${h.lat},${h.lon}`);

  const handleMapLink = useCallback(() => {
    if (!activePlace?.google_map_link) return;
    Linking.openURL(activePlace.google_map_link);
  }, [activePlace]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Text entering={FadeIn.duration(800)} style={styles.loadingText}>
          Preparing your travel experience...
        </Animated.Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsCompass
        pitchEnabled
        rotateEnabled
        loadingEnabled
      >
        {places.map(p => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lon }}
            tracksViewChanges={false}
            onPress={() => setActivePlace(p)}
          >
            <Image
              source={ICON_MAP[p.category] || ICON_MAP.Heritage}
              style={[
                styles.marker,
                activePlace?.id === p.id && styles.activeMarker,
              ]}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {activePlace && hotelsNearby.map(h => (
          <Marker
            key={h.id}
            coordinate={{ latitude: h.lat, longitude: h.lon }}
            tracksViewChanges={false}
            onPress={() => handleHotelPress(h)}
          >
            <Image source={HOTEL_ICON} style={styles.hotelMarker} />
          </Marker>
        ))}
      </MapView>

      {/* Floating Glass Controls */}
      <BlurView intensity={Platform.OS === 'ios' ? 50 : 40} tint="dark" style={styles.glassPanel}>
        <View style={styles.controlRow}>
          <Text style={styles.label}>Radius:</Text>
          {[0.5, 1, 2, 5].map(km => (
            <TouchableOpacity
              key={km}
              style={[
                styles.chip,
                distanceSetting === km && styles.chipActive,
              ]}
              onPress={() => setDistanceSetting(km)}
            >
              <Text
                style={[
                  styles.chipText,
                  distanceSetting === km && styles.chipTextActive,
                ]}
              >
                {km} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.controlRow}>
          <Text style={styles.label}>Tour:</Text>
          <TouchableOpacity
            style={[styles.toggle, tourMode && styles.toggleOn]}
            onPress={() => setTourMode(!tourMode)}
          >
            <Text style={styles.toggleText}>{tourMode ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
          {tourMode && (
            <TouchableOpacity
              onPress={() => setTourPaused(!tourPaused)}
              style={styles.playPause}
            >
              <Text style={styles.playText}>{tourPaused ? '▶️' : '⏸️'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>

      {/* Detail Drawer */}
      {activePlace && (
        <Animated.View
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
          style={styles.drawer}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <TouchableOpacity
              style={styles.drawerClose}
              onPress={() => setActivePlace(null)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.placeTitle}>{activePlace.name}</Text>
            <Text style={styles.placeSubtitle}>
              {activePlace.city} · {activePlace.category}
            </Text>

            {activePlace.images?.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {activePlace.images.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={styles.placeImage}
                  />
                ))}
              </ScrollView>
            ) : null}

            <Text style={styles.desc}>{activePlace.description}</Text>

            <TouchableOpacity style={styles.mapBtn} onPress={handleMapLink}>
              <Text style={styles.mapBtnText}>Open in Google Maps</Text>
            </TouchableOpacity>

            <Text style={styles.hotelsTitle}>
              Hotels in {distanceSetting} km ({hotelsNearby.length})
            </Text>
            {!hotelsNearby.length ? (
              <Text style={styles.noHotels}>No hotels nearby</Text>
            ) : (
              hotelsNearby.map(h => (
                <TouchableOpacity
                  key={h.id}
                  style={styles.hotelItem}
                  onPress={() => handleHotelPress(h)}
                >
                  <Text style={styles.hotelName}>{h.name}</Text>
                  {h.rating && <Text style={styles.hotelRating}>{h.rating}★</Text>}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

// ✅ Premium Style System
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  map: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  loadingText: { color: '#fff', fontSize: 17, fontWeight: '600' },

  // Map markers
  marker: { width: 32, height: 32 },
  activeMarker: { width: 42, height: 42 },
  hotelMarker: { width: 26, height: 26 },

  // Floating glass control panel
  glassPanel: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 16,
    width: width * 0.9,
  },
  controlRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { color: '#aaa', fontSize: 13, marginRight: 10 },
  chip: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  chipActive: { backgroundColor: '#4ac' },
  chipText: { color: '#ccc', fontSize: 12 },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  toggle: { backgroundColor: '#333', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  toggleOn: { backgroundColor: '#4ac' },
  toggleText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  playPause: { marginLeft: 8 },
  playText: { color: '#fff', fontSize: 16 },

  // Drawer UI
  drawer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#0a0a0aee',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  drawerClose: { position: 'absolute', top: 10, right: 10 },
  closeText: { color: '#f55', fontWeight: 'bold' },
  placeTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 18 },
  placeSubtitle: { color: '#888', fontSize: 13 },
  placeImage: {
    width: 280,
    height: 160,
    marginRight: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  desc: { color: '#ccc', fontSize: 14, lineHeight: 20, marginTop: 8 },
  mapBtn: {
    backgroundColor: '#334',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  mapBtnText: { color: '#4ac', fontWeight: '600' },
  hotelsTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 10,
  },
  noHotels: { color: '#777', fontStyle: 'italic', fontSize: 13 },
  hotelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
  },
  hotelName: { color: '#fff', fontSize: 14 },
  hotelRating: { color: '#ffa500', fontSize: 12, fontWeight: '700' },
});
