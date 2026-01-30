import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function RolePage() {
  const router = useRouter();

  const handleSelect = useCallback(async (role: string) => {
    try {
      // Haptic feedback for better UX
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Store role in AsyncStorage
      await AsyncStorage.setItem('role', role);
      
      // Navigate to signup
      router.push('/auth/signup');
    } catch (error) {
      console.error('Error selecting role:', error);
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Consumer - Upper Half */}
      <TouchableOpacity
        style={styles.halfContainer}
        onPress={() => handleSelect('consumer')}
        activeOpacity={0.9}
      >
        <Image
          source={require('@/assets/icons/religious.png')} // Update path as needed
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.7)', 'rgba(29, 78, 216, 0.7)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.textContainer}>
          <Text style={styles.roleText}>Consumer</Text>
        </View>
      </TouchableOpacity>

      {/* Business - Lower Half */}
      <TouchableOpacity
        style={styles.halfContainer}
        onPress={() => handleSelect('business')}
        activeOpacity={0.9}
      >
        <Image
          source={require('@/assets/icons/shopping.png')} // Update path as needed
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(34, 197, 94, 0.7)', 'rgba(21, 128, 61, 0.7)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.textContainer}>
          <Text style={styles.roleText}>Business</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  halfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.4,
  },
  textContainer: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
});