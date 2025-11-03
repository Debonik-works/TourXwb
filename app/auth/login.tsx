// app/auth/login.tsx
import { supabase } from "@/utils/supabase/server";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native"; // npm install lucide-react-native react-native-svg
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.gradientLayer}>
        <View style={styles.blobPink} />
        <View style={styles.blobIndigo} />
      </View>

      <View style={styles.card}>
        <Image source={require("@/assets/icons/flight.png")} style={styles.logo} />
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#6b7280" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#6b7280" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            {showPassword ? <EyeOff color="#6b7280" size={20} /> : <Eye color="#6b7280" size={20} />}
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </Pressable>

        <View style={styles.footer}>
          <Pressable><Text style={styles.link}>Forgot Password?</Text></Pressable>
          <Pressable onPress={() => router.push("/auth/role")}>
            <Text style={styles.link}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  gradientLayer: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  blobPink: {
    position: "absolute", top: -120, left: -120, width: 260, height: 260, backgroundColor: "rgba(244,114,182,0.3)",
    borderRadius: 130, transform: [{ scale: 2 }], opacity: 0.6,
  },
  blobIndigo: {
    position: "absolute", bottom: -120, right: -120, width: 260, height: 260, backgroundColor: "rgba(129,140,248,0.3)",
    borderRadius: 130, transform: [{ scale: 2 }], opacity: 0.6,
  },
  card: { width: "90%", maxWidth: 400, backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 5 },
  logo: { width: 64, height: 64, borderRadius: 12, alignSelf: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", color: "#111827" },
  subtitle: { fontSize: 14, textAlign: "center", color: "#6b7280", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10, paddingHorizontal: 10, marginBottom: 14 },
  icon: { marginRight: 6 },
  input: { flex: 1, paddingVertical: 10, color: "#111827" },
  eyeButton: { paddingHorizontal: 4 },
  button: { marginTop: 12, backgroundColor: "#6366f1", borderRadius: 10, paddingVertical: 12, alignItems: "center", shadowColor: "#6366f1", shadowOpacity: 0.6, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  link: { color: "#6366f1" },
});
