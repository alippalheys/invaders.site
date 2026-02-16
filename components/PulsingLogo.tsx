import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image, View, Easing } from 'react-native';
import Colors from '@/constants/colors';

interface PulsingLogoProps {
  size?: number;
  delay?: number;
  opacity?: number;
}

const LOGO_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/mayksiynf9mps3sykzxn4';

export default function PulsingLogo({ size = 200, delay = 0, opacity = 0.15 }: PulsingLogoProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(opacity)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowLineOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 4500,
            delay,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: opacity * 0.2,
            duration: 4500,
            delay,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 4500,
            delay,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 4500,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: opacity,
            duration: 4500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.2,
            duration: 4500,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );

    const glowPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowLineOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(glowLineOpacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    rotateAnimation.start();
    glowPulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      glowPulseAnimation.stop();
    };
  }, [delay, scaleAnim, opacityAnim, glowAnim, opacity, rotateAnim, glowLineOpacity]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ringSize = size * 1.15;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: size * 0.6,
            opacity: glowAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      
      {/* Moving glow line effect */}
      <Animated.View
        style={[
          styles.movingGlowContainer,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.glowLine,
            {
              opacity: glowLineOpacity,
              width: 60,
              height: 4,
              top: -2,
              left: (ringSize / 2) - 30,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.glowLineTail,
            {
              opacity: Animated.multiply(glowLineOpacity, 0.5),
              width: 40,
              height: 3,
              top: -1.5,
              left: (ringSize / 2) - 50,
            },
          ]}
        />
      </Animated.View>

      {/* Outer ring */}
      <View
        style={[
          styles.outerRing,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          source={{ uri: LOGO_URI }}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  movingGlowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowLine: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  glowLineTail: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 1.5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  outerRing: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    tintColor: Colors.primary,
  },
});
