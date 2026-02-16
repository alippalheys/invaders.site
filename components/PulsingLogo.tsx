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
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(opacity)).current;
  const glowIntensity = useRef(new Animated.Value(0.4)).current;
  const sweepPosition = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 4500,
            delay,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: opacity * 0.5,
            duration: 4500,
            delay,
            useNativeDriver: false,
          }),
          Animated.timing(glowIntensity, {
            toValue: 0.8,
            duration: 4500,
            delay,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 4500,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: opacity,
            duration: 4500,
            useNativeDriver: false,
          }),
          Animated.timing(glowIntensity, {
            toValue: 0.4,
            duration: 4500,
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    const sweepAnimation = Animated.loop(
      Animated.timing(sweepPosition, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );

    const glowPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.5,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    sweepAnimation.start();
    glowPulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      sweepAnimation.stop();
      glowPulseAnimation.stop();
    };
  }, [delay, scaleAnim, opacityAnim, glowIntensity, opacity, sweepPosition, glowPulse]);

  const sweepTranslateX = sweepPosition.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-size * 0.8, 0, size * 0.8],
  });

  const sweepOpacity = sweepPosition.interpolate({
    inputRange: [0, 0.2, 0.5, 0.8, 1],
    outputRange: [0, 1, 1, 1, 0],
  });

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {/* Outer glow layers - following logo shape */}
      <Animated.View
        style={[
          styles.glowLayer,
          {
            width: size * 1.15,
            height: size * 1.15,
            opacity: Animated.multiply(glowIntensity, 0.3),
          },
        ]}
      >
        <Image
          source={{ uri: LOGO_URI }}
          style={[styles.glowImage, { shadowRadius: 25 }]}
          resizeMode="contain"
          blurRadius={8}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.glowLayer,
          {
            width: size * 1.1,
            height: size * 1.1,
            opacity: Animated.multiply(glowIntensity, 0.5),
          },
        ]}
      >
        <Image
          source={{ uri: LOGO_URI }}
          style={[styles.glowImage, { shadowRadius: 18 }]}
          resizeMode="contain"
          blurRadius={5}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.glowLayer,
          {
            width: size * 1.05,
            height: size * 1.05,
            opacity: Animated.multiply(glowIntensity, 0.7),
          },
        ]}
      >
        <Image
          source={{ uri: LOGO_URI }}
          style={[styles.glowImage, { shadowRadius: 12 }]}
          resizeMode="contain"
          blurRadius={3}
        />
      </Animated.View>

      {/* Moving light sweep effect */}
      <View style={[styles.sweepContainer, { width: size, height: size }]}>
        <Animated.View
          style={[
            styles.sweepLight,
            {
              width: size * 0.3,
              height: size * 1.2,
              opacity: Animated.multiply(sweepOpacity, glowPulse),
              transform: [{ translateX: sweepTranslateX }, { rotate: '15deg' }],
            },
          ]}
        />
      </View>

      {/* Main logo with pulsing glow */}
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
        <Animated.Image
          source={{ uri: LOGO_URI }}
          style={[
            styles.logo,
            {
              shadowOpacity: glowPulse,
            },
          ]}
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
  glowLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowImage: {
    width: '100%',
    height: '100%',
    tintColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
  },
  sweepContainer: {
    position: 'absolute',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweepLight: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    tintColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
  },
});
