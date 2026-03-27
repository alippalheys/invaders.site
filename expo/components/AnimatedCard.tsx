import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, View } from 'react-native';
import Colors from '@/constants/colors';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
  glowing?: boolean;
}

export default function AnimatedCard({ children, delay = 0, style, glowing = false }: AnimatedCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const glowAnim = useRef(new Animated.Value(0.1)).current;
  const borderGlowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        delay,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay,
        useNativeDriver: false,
        tension: 50,
        friction: 8,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: glowing ? 0.7 : 0.4,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: glowing ? 0.3 : 0.1,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(borderGlowAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: false,
        }),
        Animated.timing(borderGlowAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();
  }, [delay, glowing, fadeAnim, slideAnim, glowAnim, borderGlowAnim, shimmerAnim]);

  const borderColor = borderGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, glowing ? Colors.primaryGlow : Colors.borderLight],
  });

  return (
    <View style={styles.glowWrapper}>
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowAnim,
            shadowOpacity: glowAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            borderColor,
          },
          style,
        ]}
      >
        <View style={styles.innerGlow} />
        {children}
      </Animated.View>
    </View>
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
    borderRadius: 22,
    backgroundColor: 'transparent',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    elevation: 12,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
});
