import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';

interface StatCardProps {
  value: string;
  label: string;
  delay?: number;
}

export default function StatCard({ value, label, delay = 0 }: StatCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0.1)).current;
  const borderGlowAnim = useRef(new Animated.Value(0)).current;
  const valueGlowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        useNativeDriver: false,
        tension: 60,
        friction: 8,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.55,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.1,
          duration: 1400,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(borderGlowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(borderGlowAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(valueGlowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(valueGlowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [delay, fadeAnim, scaleAnim, glowAnim, borderGlowAnim, valueGlowAnim]);

  const borderColor = borderGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primaryGlow],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowAnim,
            shadowOpacity: glowAnim,
          },
        ]}
      />
      <Animated.View style={[styles.card, { borderColor }]}>
        <View style={styles.innerGlowTop} />
        <View style={styles.cornerGlow} />
        <Animated.Text 
          style={[
            styles.value,
            {
              textShadowColor: Colors.primary,
              textShadowRadius: valueGlowAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: [10, 20],
              }),
            }
          ]}
        >
          {value}
        </Animated.Text>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginHorizontal: 6,
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
    shadowRadius: 25,
    elevation: 10,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 100,
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
    top: -30,
    right: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accentSoft,
  },
  value: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.primary,
    marginBottom: 4,
    textShadowOffset: { width: 0, height: 0 },
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
});
