// components/profile.tsx
import { useRouter } from 'expo-router';
import {
  Award,
  Bell,
  Bookmark,
  BookOpen,
  Calendar,
  Camera,
  ChevronRight,
  Compass,
  CreditCard,
  Gift,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Package,
  Settings as SettingsIcon,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  TrendingUp,
  User,
  X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

type MenuItem = {
  label: string;
  route: string;
  icon: any;
  badge?: string | number;
  description?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

// Static user data
const STATIC_USER = {
  isLoggedIn: false, // Toggle to true for logged-in experience
  name: 'Guest',
  email: 'Sign in to unlock all features',
  initials: 'G',
  memberSince: '2025',
  points: 0,
  savedItems: 0,
  totalOrders: 0,
  role: 'guest' as 'guest' | 'consumer' | 'business',
};

// Enhanced menu with advanced routing patterns
const guestMenuSections: MenuSection[] = [
  {
    title: 'Explore West Bengal',
    items: [
      { label: 'All Destinations', route: '/destinations', icon: Map, description: 'Browse all locations' },
      { label: 'Heritage Sites', route: '/heritage', icon: Compass, description: 'UNESCO & cultural sites' },
      { label: 'Tourist Attractions', route: '/attractions', icon: Camera, description: 'Popular landmarks' },
      { label: 'Virtual Tours', route: '/tours/virtual', icon: Globe, description: '360° experiences' },
      { label: 'Events Calendar', route: '/events', icon: Calendar, description: 'Festivals & celebrations' },
      { label: 'Travel Guides', route: '/guides', icon: BookOpen, description: 'Expert recommendations' },
    ],
  },
  {
    title: 'Plan Your Trip',
    items: [
      { label: 'Create Itinerary', route: '/itinerary/create', icon: TrendingUp, description: 'Plan your journey' },
      { label: 'Popular Routes', route: '/routes/popular', icon: MapPin, description: 'Trending paths' },
      { label: 'Travel Tips', route: '/tips', icon: Info, description: 'Local insights' },
      { label: 'Transportation', route: '/transport', icon: Package, description: 'Getting around' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Travel Stories', route: '/stories', icon: BookOpen, description: 'User experiences' },
      { label: 'Photo Gallery', route: '/gallery', icon: Camera, description: 'Community photos' },
      { label: 'Reviews & Ratings', route: '/reviews', icon: Star, description: 'User feedback' },
      { label: 'Forum', route: '/forum', icon: MessageCircle, description: 'Join discussions' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'About WB Tour', route: '/about', icon: Info, description: 'Our mission' },
      { label: 'Help Center', route: '/help', icon: HelpCircle, description: 'FAQs & support' },
      { label: 'Contact Us', route: '/contact', icon: Mail, description: 'Get in touch' },
      { label: 'Privacy Policy', route: '/privacy', icon: Shield, description: 'Your data' },
    ],
  },
];

const loggedInMenuSections: MenuSection[] = [
  {
    title: 'My Profile',
    items: [
      { label: 'Account Settings', route: '/profile/settings', icon: User, description: 'Personal info' },
      { label: 'Saved Places', route: '/profile/saved', icon: Bookmark, badge: 24 },
      { label: 'My Itineraries', route: '/profile/itineraries', icon: Map, badge: 3 },
      { label: 'Travel History', route: '/profile/history', icon: Calendar },
    ],
  },
  {
    title: 'Bookings & Orders',
    items: [
      { label: 'My Bookings', route: '/bookings', icon: ShoppingBag, badge: 2 },
      { label: 'Order History', route: '/orders', icon: Package, badge: 8 },
      { label: 'Track Bookings', route: '/bookings/track', icon: MapPin },
      { label: 'Payment Methods', route: '/profile/payments', icon: CreditCard, badge: 1 },
    ],
  },
  {
    title: 'Rewards & Membership',
    items: [
      { label: 'Loyalty Points', route: '/rewards/points', icon: Award, badge: 1450 },
      { label: 'Member Benefits', route: '/rewards/benefits', icon: Gift, badge: 'VIP' },
      { label: 'Referral Program', route: '/rewards/referral', icon: Share2 },
      { label: 'Special Offers', route: '/rewards/offers', icon: Star, badge: 'NEW' },
    ],
  },
  {
    title: 'Explore',
    items: [
      { label: 'Discover Destinations', route: '/destinations', icon: Compass },
      { label: 'Virtual Tours', route: '/tours/virtual', icon: Globe },
      { label: 'Events Near You', route: '/events/nearby', icon: Calendar },
      { label: 'Community Stories', route: '/stories', icon: BookOpen },
    ],
  },
  {
    title: 'Settings & Support',
    items: [
      { label: 'App Settings', route: '/settings', icon: SettingsIcon },
      { label: 'Notifications', route: '/settings/notifications', icon: Bell },
      { label: 'Privacy & Security', route: '/settings/privacy', icon: Shield },
      { label: 'Help Center', route: '/help', icon: HelpCircle },
    ],
  },
];

export default function Profile() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const menuSections = STATIC_USER.isLoggedIn ? loggedInMenuSections : guestMenuSections;

  const handleNavigate = (route: string) => {
    setDropdownOpen(false);
    router.push(route as any);
  };

  const handleSignIn = () => {
    setDropdownOpen(false);
    router.push('/auth/login' as any);
  };

  const handleSignOut = () => {
    setDropdownOpen(false);
    // Add sign out logic
  };

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <>
      {/* Elegant top-left profile trigger */}
      <Pressable 
        style={styles.iconBtn} 
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <View style={styles.iconBubble}>
          {STATIC_USER.isLoggedIn ? (
            <Text style={styles.initials}>{STATIC_USER.initials}</Text>
          ) : (
            <User size={18} color="#6366F1" strokeWidth={2.5} />
          )}
        </View>
      </Pressable>

      {/* Enhanced dropdown modal with scrollable sections */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setDropdownOpen(false)}
        >
          <Pressable 
            style={styles.dropdownPanel}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dropdownHeader}>
              <Pressable onPress={() => setDropdownOpen(false)} style={styles.closeBtn}>
                <X size={20} color="#6B7280" strokeWidth={2.5} />
              </Pressable>

              <View style={styles.userSection}>
                <View style={styles.dropdownAvatar}>
                  <Text style={styles.dropdownInitials}>{STATIC_USER.initials}</Text>
                </View>
                <View style={styles.dropdownInfo}>
                  <Text style={styles.dropdownName}>{STATIC_USER.name}</Text>
                  <Text style={styles.dropdownEmail}>{STATIC_USER.email}</Text>
                </View>
              </View>

              {!STATIC_USER.isLoggedIn && (
                <Pressable style={styles.signInButton} onPress={handleSignIn}>
                  <Text style={styles.signInText}>Sign In</Text>
                  <ChevronRight size={16} color="#FFF" strokeWidth={2.5} />
                </Pressable>
              )}
            </View>

            <ScrollView 
              style={styles.menuScroll}
              showsVerticalScrollIndicator={false}
            >
              {menuSections.map((section) => (
                <View key={section.title} style={styles.menuSection}>
                  <Pressable 
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(section.title)}
                  >
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.itemCount}>({section.items.length})</Text>
                  </Pressable>

                  {(expandedSection === section.title || expandedSection === null) && (
                    <View style={styles.sectionItems}>
                      {section.items.map((item, idx) => (
                        <Pressable
                          key={idx}
                          style={({ pressed }) => [
                            styles.menuItem,
                            pressed && styles.menuItemPressed,
                          ]}
                          onPress={() => handleNavigate(item.route)}
                        >
                          <View style={styles.menuItemLeft}>
                            <View style={styles.menuIconCircle}>
                              <item.icon size={18} color="#6366F1" strokeWidth={2.5} />
                            </View>
                            <View style={styles.menuItemContent}>
                              <Text style={styles.menuItemLabel}>{item.label}</Text>
                              {item.description && (
                                <Text style={styles.menuItemDesc}>{item.description}</Text>
                              )}
                            </View>
                          </View>
                          <View style={styles.menuItemRight}>
                            {item.badge && (
                              <View style={styles.menuBadge}>
                                <Text style={styles.menuBadgeText}>{item.badge}</Text>
                              </View>
                            )}
                            <ChevronRight size={16} color="#9CA3AF" strokeWidth={2.5} />
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {STATIC_USER.isLoggedIn && (
                <View style={styles.signOutSection}>
                  <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                    <LogOut size={18} color="#EF4444" strokeWidth={2.5} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                  </Pressable>
                </View>
              )}

              <View style={styles.dropdownFooter}>
                <Text style={styles.footerText}>WB Tour v1.0.0</Text>
                <Text style={styles.footerSubtext}>Explore West Bengal</Text>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Icon button
  iconBtn: { 
    padding: 4,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  initials: { 
    fontSize: 14,
    fontWeight: '900', 
    color: '#6366F1',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 60,
    paddingLeft: 16,
    paddingRight: 16,
  },
  dropdownPanel: {
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },

  // Header
  dropdownHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  dropdownAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E7FF',
  },
  dropdownInitials: {
    fontSize: 22,
    fontWeight: '900',
    color: '#6366F1',
  },
  dropdownInfo: {
    flex: 1,
  },
  dropdownName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  dropdownEmail: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Sign in button
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  signInText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },

  // Scrollable menu
  menuScroll: {
    maxHeight: 500,
  },
  menuSection: {
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },

  // Menu items
  sectionItems: {
    paddingTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  menuBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },

  // Sign out
  signOutSection: {
    padding: 20,
    paddingTop: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Footer
  dropdownFooter: {
    padding: 20,
    paddingTop: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  footerSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
