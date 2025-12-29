import React, { useRef, useEffect } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface TouchableCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  glowing?: boolean;
}

export default function TouchableCard({ children, style, onPress, glowing = false }: TouchableCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.1)).current;
  const borderGlowAnim = useRef(new Animated.Value(0)).current;
  const pressGlowAnim = useRef(new Animated.Value(0)).current;
  const innerGlowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: glowing ? 0.65 : 0.4,
          duration: 1600,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: glowing ? 0.25 : 0.1,
          duration: 1600,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(borderGlowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(borderGlowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(innerGlowAnim, {
          toValue: 0.6,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(innerGlowAnim, {
          toValue: 0.3,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowing, glowAnim, borderGlowAnim, innerGlowAnim]);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: false,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(pressGlowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(pressGlowAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const borderColor = borderGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, glowing ? Colors.primaryGlow : Colors.borderLight],
  });

  const combinedGlow = Animated.add(glowAnim, Animated.multiply(pressGlowAnim, 0.4));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.glowWrapper}>
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: combinedGlow,
              shadowOpacity: combinedGlow,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              borderColor,
            },
            style,
          ]}
        >
          <Animated.View style={[styles.innerGlowTop, { opacity: innerGlowAnim }]} />
          <Animated.View style={[styles.cornerGlow, { opacity: innerGlowAnim }]} />
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glowWrapper: {
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 26,
    backgroundColor: 'transparent',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 35,
    elevation: 15,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  innerGlowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  cornerGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentSoft,
  },
});
