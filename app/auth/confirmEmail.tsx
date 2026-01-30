// app/auth/confirmEmail.tsx
import { supabase } from '@/utils/supabase/server';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ConfirmEmailScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load user email on focus
  useFocusEffect(
    useCallback(() => {
      loadUserEmail();
    }, [])
  );

  const loadUserEmail = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error('Error loading user email:', error);
    }
  };

  const openGmail = async () => {
    try {
      const gmailUrl = 'googlegmail://'; // Deep link for Gmail app
      const canOpen = await Linking.canOpenURL(gmailUrl);
      
      if (canOpen) {
        await Linking.openURL(gmailUrl);
      } else {
        // Fallback to web Gmail
        await Linking.openURL('https://mail.google.com/mail/u/0/#inbox');
      }
    } catch (error) {
      console.error('Error opening Gmail:', error);
      Alert.alert('Error', 'Could not open Gmail app');
    }
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'No email address found');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) {
        Alert.alert('Resend Failed', error.message);
      } else {
        Alert.alert('Success', 'Confirmation email resent!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  const checkEmailVerification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        Alert.alert('Email Verified', 'Your email has been verified!');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Blobs */}
      <View style={styles.background}>
        <View style={[styles.blob, styles.blobPink]} />
        <View style={[styles.blob, styles.blobIndigo]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/icons/flight.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Confirm Your Email 📩</Text>
          <Text style={styles.subtitle}>
            We've sent a confirmation link to your email address.{'\n'}
            Please check your inbox and click the link to verify your account.
          </Text>

          {/* Email Display */}
          {userEmail && (
            <View style={styles.emailContainer}>
              <Text style={styles.emailLabel}>Sent to:</Text>
              <Text style={styles.emailText}>{userEmail}</Text>
            </View>
          )}

          {/* Open Gmail Button */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={openGmail}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>Open Gmail</Text>
          </Pressable>

          {/* Check Verification Button */}
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={checkEmailVerification}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>I've Verified My Email</Text>
          </Pressable>

          {/* Resend Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendText}>
              Didn't receive the email? Check your spam folder or try resending.
            </Text>
            
            <Pressable
              style={({ pressed }) => [
                styles.resendButton,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleResendEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#6366f1" size="small" />
              ) : (
                <Text style={styles.resendButtonText}>Resend Email</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.4,
  },
  blobPink: {
    top: -120,
    left: -120,
    backgroundColor: 'rgba(244, 114, 182, 0.4)',
  },
  blobIndigo: {
    bottom: -120,
    right: -120,
    backgroundColor: 'rgba(129, 140, 248, 0.4)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  emailContainer: {
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
  },
  emailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  emailText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
  resendSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
    paddingTop: 20,
  },
  resendText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  resendButton: {
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(209, 213, 219, 0.5)',
  },
  resendButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});