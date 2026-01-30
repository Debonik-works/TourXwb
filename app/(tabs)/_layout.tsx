import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Profile from '@/components/profile';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  size?: number;
}) {
  return <FontAwesome size={props.size ?? 28} style={{ marginBottom: -3 }} {...props} />;
}

const TAB_BAR_HEIGHT = 80;
const TAB_BAR_PADDING_BOTTOM = 30;
const INDICATOR_HEIGHT = 6;
const INDICATOR_MIN_WIDTH = 20;
const INDICATOR_MAX_WIDTH = 60;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { width } = useWindowDimensions();

  const tabs = [
    { name: 'index', title: 'TourXwb', icon: 'home', iconSize: 28 },
    { name: 'two', title: 'Map', icon: 'map', iconSize: 20 },
    { name: 'profile', title: 'Profile', icon: 'user', iconSize: 28 },
  ];

  // Get current active tab index
  const currentTabName = segments[segments.length - 1] || 'index';
  const activeIndex = tabs.findIndex((tab) => tab.name === currentTabName);
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const tabWidth = width / tabs.length;

  // Animated values for indicator position and width
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(INDICATOR_MIN_WIDTH);

  // Animate indicator position and width on tab change
  useEffect(() => {
    // Calculate the center position under the active tab's icon
    // Icon is roughly centered horizontally; align indicator centered under icon (approximate center of tab)
    const targetX = tabWidth * safeActiveIndex + tabWidth / 2 - INDICATOR_MIN_WIDTH / 2;

    // Animate width with stretch and shrink effect
    indicatorWidth.value = withTiming(INDICATOR_MAX_WIDTH, { duration: 150 }, () => {
      indicatorWidth.value = withTiming(INDICATOR_MIN_WIDTH, { duration: 300 });
    });

    // Animate horizontal position smoothly
    indicatorX.value = withTiming(targetX, { duration: 450 });
  }, [safeActiveIndex, tabWidth]);

  // Animated style for the underline indicator
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    // Gooey border radius interpolation between stretched and normal
    const borderRadius = interpolate(
      indicatorWidth.value,
      [INDICATOR_MIN_WIDTH, INDICATOR_MAX_WIDTH],
      [INDICATOR_HEIGHT / 2, INDICATOR_HEIGHT / 4],
      Extrapolate.CLAMP,
    );

    return {
      position: 'absolute',
      bottom: TAB_BAR_PADDING_BOTTOM / 2 - INDICATOR_HEIGHT / 2,
      width: indicatorWidth.value,
      height: INDICATOR_HEIGHT,
      borderRadius,
      backgroundColor: Colors[colorScheme ?? 'light'].tint,
      shadowColor: Colors[colorScheme ?? 'light'].tint,
      shadowOpacity: 0.4,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      transform: [{ translateX: indicatorX.value }],
    };
  });

  // Common tab bar styling
  const tabBarStyle = {
    height: TAB_BAR_HEIGHT,
    paddingBottom: TAB_BAR_PADDING_BOTTOM,
    backgroundColor: colorScheme === 'dark' ? '#0f0f0f' : '#fff',
    borderTopWidth: 0.5,
    borderTopColor: colorScheme === 'dark' ? '#333' : '#ddd',
    elevation: 5,
  };

  function CustomTabBar({ state, descriptors, navigation }: any) {
    return (
      <View style={[tabBarStyle, { flexDirection: 'row', position: 'relative' }]}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 10,
                paddingBottom: 6,
              }}
              android_ripple={{ color: Colors[colorScheme ?? 'light'].tint + '33', borderless: true }}
            >
              {typeof options.tabBarIcon === 'function'
                ? options.tabBarIcon({
                    color: isFocused ? Colors[colorScheme ?? 'light'].tint : colorScheme === 'dark' ? '#777' : '#bbb',
                  })
                : null}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  marginTop: 2,
                  color: isFocused ? Colors[colorScheme ?? 'light'].tint : colorScheme === 'dark' ? '#777' : '#bbb',
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
        <Animated.View style={animatedIndicatorStyle} />
      </View>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'TourXwb',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} size={28} />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f9fa',
            height: 120,
          },
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: '700',
            color: colorScheme === 'dark' ? '#fff' : '#000',
            letterSpacing: 3,
          },
          headerLeft: () => (
            <View style={{ paddingLeft: 16, paddingTop: 4 /* Adjust to position */ }}>
              <Profile />
            </View>
          ),
          headerRight: () => (
            <View style={{ paddingRight: 16, paddingTop: 4, alignItems: 'flex-end' }}>
              <Link href="/About" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={24}
                      color={colorScheme === 'dark' ? '#fff' : '#000'}
                      style={{ opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} size={20} />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f9fa',
            height: 120,
          },
          headerLeft: () => (
            <View style={{ paddingLeft: 16, paddingTop: 4 /* Adjust to position */ }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              
              <FontAwesome
                name="arrow-left"
                size={22}
                color={colorScheme === 'dark' ? '#fff' : '#000'}
              />
              <Text
                style={{
                  color: colorScheme === 'dark' ? '#fff' : '#000',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} size={28} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
