import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TextStyle, View } from 'react-native';
import Colors from '@/constants/colors';

interface GlowingTextProps {
  children: string;
  style?: TextStyle;
  glowColor?: string;
  animate?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export default function GlowingText({ 
  children, 
  style, 
  glowColor = Colors.primary, 
  animate = true,
  intensity = 'high'
}: GlowingTextProps) {
  const pulseAnim = useRef(new Animated.Value(0.7)).current;
  const glowIntensity = useRef(new Animated.Value(0.5)).current;

  const getIntensityValues = () => {
    switch (intensity) {
      case 'low': return { min: 0.3, max: 0.6, radius: 15 };
      case 'medium': return { min: 0.5, max: 0.85, radius: 25 };
      case 'high': return { min: 0.7, max: 1, radius: 35 };
    }
  };

  const intensityValues = getIntensityValues();

  useEffect(() => {
    if (animate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowIntensity, {
            toValue: intensityValues.max,
            duration: 1800,
            useNativeDriver: false,
          }),
          Animated.timing(glowIntensity, {
            toValue: intensityValues.min,
            duration: 1800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [animate, pulseAnim, glowIntensity, intensityValues.max, intensityValues.min]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.glowLayer,
          {
            opacity: glowIntensity,
            shadowColor: glowColor,
            shadowRadius: intensityValues.radius,
          }
        ]}
      >
        <Text style={[styles.glowText, { color: 'transparent' }, style]}>
          {children}
        </Text>
      </Animated.View>
      <Animated.View style={{ opacity: animate ? pulseAnim.interpolate({
        inputRange: [0.7, 1],
        outputRange: [0.9, 1],
      }) : 1 }}>
        <Text style={[styles.mainText, { textShadowColor: glowColor }, style]}>
          {children}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  glowLayer: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
  },
  glowText: {
    color: 'transparent',
  },
  mainText: {
    color: Colors.textPrimary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
