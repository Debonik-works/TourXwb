// app/auth/signup.tsx
import { supabase } from "@/utils/supabase/server";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check role on mount
  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      const role = await AsyncStorage.getItem("role");
      if (!role) {
        router.replace("/auth/role");
      }
    } catch (error) {
      console.error("Error checking role:", error);
    }
  };

  // Optimized form update handler
  const updateFormData = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle signup with proper error handling
  const handleSignup = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const role = await AsyncStorage.getItem("role");
      if (!role) {
        Alert.alert("Select Role", "Please choose your role before signing up.");
        router.replace("/auth/role");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { 
          data: { role },
          emailRedirectTo: 'your-app://auth/callback'
        },
      });

      if (error) throw error;

      // Create user profile if signup successful
      if (data?.user?.id) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: formData.fullName || formData.email.split('@')[0], // Fallback to username
          email: formData.email,
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          console.warn("Profile creation warning:", profileError.message);
        }
      }

      Alert.alert(
        "Confirm Email", 
        "Please check your email to confirm your account.",
        [{ text: "OK", onPress: () => router.push("/auth/confirmEmail") }]
      );
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const navigateToLogin = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Background Gradient */}
        <View style={styles.gradientLayer}>
          <View style={styles.blobPink} />
          <View style={styles.blobIndigo} />
        </View>

        <View style={styles.card}>
          <Image 
            source={require("@/assets/icons/flight.png")} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Create Account ✨</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <User size={20} color="#6b7280" style={styles.icon} />
            <TextInput
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              style={styles.input}
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              autoComplete="name"
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Mail size={20} color="#6b7280" style={styles.icon} />
            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#9ca3af"
              autoComplete="email"
              autoCorrect={false}
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Lock size={20} color="#6b7280" style={styles.icon} />
            <TextInput
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#9ca3af"
              autoComplete="password"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            <Pressable 
              onPress={togglePasswordVisibility} 
              style={styles.eyeButton}
              disabled={loading}
            >
              {showPassword ? 
                <EyeOff color="#6b7280" size={20} /> : 
                <Eye color="#6b7280" size={20} />
              }
            </Pressable>
          </View>

          {/* Sign Up Button */}
          <Pressable
            onPress={handleSignup}
            style={({ pressed }) => [
              styles.button, 
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled
            ]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>

          {/* Footer Links */}
          <View style={styles.footer}>
            <Pressable onPress={navigateToLogin} disabled={loading}>
              <Text style={styles.link}>Already have an account?</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/auth/role")} disabled={loading}>
              <Text style={styles.link}>Change Role</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  gradientLayer: { 
    ...StyleSheet.absoluteFillObject, 
    overflow: "hidden" 
  },
  blobPink: {
    position: "absolute", 
    top: -120, 
    left: -120, 
    width: 260, 
    height: 260, 
    backgroundColor: "rgba(244,114,182,0.3)",
    borderRadius: 130, 
    transform: [{ scale: 2 }], 
    opacity: 0.6,
  },
  blobIndigo: {
    position: "absolute", 
    bottom: -120, 
    right: -120, 
    width: 260, 
    height: 260, 
    backgroundColor: "rgba(129,140,248,0.3)",
    borderRadius: 130, 
    transform: [{ scale: 2 }], 
    opacity: 0.6,
  },
  card: { 
    width: "90%", 
    maxWidth: 400, 
    backgroundColor: "rgba(255,255,255,0.9)", 
    borderRadius: 24, 
    padding: 24, 
    shadowColor: "#000", 
    shadowOpacity: 0.15, 
    shadowOffset: { width: 0, height: 6 }, 
    shadowRadius: 10, 
    elevation: 5 
  },
  logo: { 
    width: 64, 
    height: 64, 
    borderRadius: 12, 
    alignSelf: "center", 
    marginBottom: 16 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "700", 
    textAlign: "center", 
    color: "#111827" 
  },
  subtitle: { 
    fontSize: 14, 
    textAlign: "center", 
    color: "#6b7280", 
    marginBottom: 20 
  },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#d1d5db", 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    marginBottom: 14 
  },
  icon: { 
    marginRight: 6 
  },
  input: { 
    flex: 1, 
    paddingVertical: 10, 
    color: "#111827",
    fontSize: 16,
  },
  eyeButton: { 
    paddingHorizontal: 4 
  },
  button: { 
    marginTop: 12, 
    backgroundColor: "#6366f1", 
    borderRadius: 10, 
    paddingVertical: 12, 
    alignItems: "center", 
    shadowColor: "#6366f1", 
    shadowOpacity: 0.6, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowRadius: 6,
    elevation: 3,
  },
  buttonPressed: { 
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16 
  },
  footer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 16 
  },
  link: { 
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "500",
  },
});