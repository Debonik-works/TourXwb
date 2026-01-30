import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Award,
  Calendar,
  Camera,
  Globe,
  Heart,
  Mail,
  MapPin,
  Sparkles,
  Users,
  Zap,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_SMALL = SCREEN_WIDTH < 375;

export default function InfoModal() {
  const router = useRouter();

  const sections = [
    {
      title: "About WB Tour",
      desc: "Your gateway to explore West Bengal's vibrant culture and breathtaking destinations through immersive storytelling.",
      icon: Globe,
      gradient: ["#6366F1", "#8B5CF6"] as const,
    },
    {
      title: "Our Mission",
      desc: "Preserve and celebrate West Bengal's extraordinary heritage — connecting communities through technology and authenticity.",
      icon: Heart,
      gradient: ["#EC4899", "#F59E0B"] as const,
    },
    {
      title: "Community Impact",
      desc: "Empowering local artisans and cultural groups while promoting sustainable, authentic tourism experiences.",
      icon: Users,
      gradient: ["#10B981", "#06B6D4"] as const,
    },
    {
      title: "Recognition",
      desc: "Honored by cultural institutions and recognized internationally for promoting Bengal's heritage with innovation.",
      icon: Award,
      gradient: ["#F59E0B", "#EF4444"] as const,
    },
  ];

  const stats = [
    { icon: MapPin, label: "Districts", value: "23", gradient: ["#6366F1", "#8B5CF6"] as const },
    { icon: Calendar, label: "Heritage Sites", value: "200+", gradient: ["#EC4899", "#F59E0B"] as const },
    { icon: Camera, label: "Cultural Events", value: "1000+", gradient: ["#10B981", "#06B6D4"] as const },
    { icon: Users, label: "Visitors", value: "50M+", gradient: ["#F59E0B", "#EF4444"] as const },
  ];

  const links = [
    { 
      title: "Visit Official Website", 
      url: "https://wb-3d-tour.vercel.app",
      icon: Globe,
      color: "#6366F1",
    },
    { 
      title: "Explore Destinations", 
      action: () => router.push("/heritage" as any),
      icon: MapPin,
      color: "#EC4899",
    },
    { 
      title: "Privacy Policy", 
      url: "https://example.com/privacy",
      icon: Zap,
      color: "#10B981",
    },
    { 
      title: "Contact Us", 
      url: "mailto:debonikghosh@gmail.com",
      icon: Mail,
      color: "#F59E0B",
    },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* Clean Hero */}
      <View style={styles.hero}>
        <LinearGradient
          colors={["#111", "#1F2937"] as const}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroIcon}>
            <Sparkles size={28} color="#F59E0B" strokeWidth={2.5} />
          </View>
          
          <Text style={styles.heroTitle}>Information Centre</Text>
          <Text style={styles.heroSubtitle}>
            Discover the story behind West Bengal's digital heritage platform
          </Text>
        </LinearGradient>
      </View>

      {/* Clean Cards */}
      <View style={styles.sectionsWrapper}>
        {sections.map((item, index) => (
          <View key={index} style={styles.card}>
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardIconWrapper}
            >
              <item.icon color="#FFF" size={22} strokeWidth={2.5} />
            </LinearGradient>
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>By The Numbers</Text>
        
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <LinearGradient
                colors={stat.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statIconBg}
              >
                <stat.icon color="#FFF" size={20} strokeWidth={2.5} />
              </LinearGradient>
              
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Links */}
      <View style={styles.linksSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        
        <View style={styles.linksWrapper}>
          {links.map((link, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.linkPressed,
              ]}
              onPress={() => (link.url ? Linking.openURL(link.url) : link.action?.())}
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIconBg, { backgroundColor: `${link.color}15` }]}>
                  <link.icon size={18} color={link.color} strokeWidth={2.5} />
                </View>
                <Text style={styles.linkText}>{link.title}</Text>
              </View>
              
              <ArrowRight size={18} color={link.color} strokeWidth={2.5} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerText}>© {new Date().getFullYear()} WB Tour</Text>
        <Text style={styles.footerSubtext}>Built with ❤️ for Culture & Heritage</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FAFAF9" 
  },
  
  // Hero
  hero: {
    overflow: 'hidden',
  },
  heroGradient: {
    paddingTop: 70,
    paddingBottom: 50,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  heroTitle: { 
    fontSize: IS_SMALL ? 30 : 36, 
    fontWeight: "900", 
    color: "#FFF", 
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  heroSubtitle: { 
    fontSize: 16, 
    color: "#D1D5DB", 
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
    fontWeight: '500',
  },
  
  // Cards
  sectionsWrapper: { 
    paddingHorizontal: 20, 
    paddingTop: 32,
    gap: 14,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardTitle: { 
    fontSize: IS_SMALL ? 17 : 19, 
    fontWeight: "800", 
    color: "#111827",
    letterSpacing: -0.3,
  },
  cardDesc: { 
    fontSize: 14, 
    color: "#6B7280", 
    lineHeight: 20,
    fontWeight: '500',
  },
  
  // Stats
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: IS_SMALL ? 22 : 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: { 
    fontSize: IS_SMALL ? 24 : 28, 
    fontWeight: "900",
    color: '#111827',
    letterSpacing: -0.5,
  },
  statLabel: { 
    fontSize: 13, 
    color: "#6B7280", 
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Links
  linksSection: { 
    paddingHorizontal: 20, 
    paddingBottom: 40,
  },
  linksWrapper: {
    gap: 10,
  },
  linkButton: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  linkPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  linkIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: { 
    fontSize: 15, 
    color: "#111827", 
    fontWeight: "600",
    letterSpacing: 0.1,
    flex: 1,
  },
  
  // Footer
  footer: { 
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 10,
  },
  footerDivider: {
    width: 50,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 6,
  },
  footerText: { 
    color: "#111827", 
    fontSize: 14,
    fontWeight: '600',
  },
  footerSubtext: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: '500',
  },
});
