import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image, View, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PulsingLogoProps {
  size?: number;
  delay?: number;
  opacity?: number;
}

const GLOW_COLORS = {
  border: ['rgba(255, 124, 171, 1)', 'rgba(63, 100, 199, 1)', 'rgba(240, 115, 46, 1)'],
  glow1: ['#f82fc6', '#5a4ff9', '#ff923e'],
  glow2: ['rgba(255, 89, 213, 1)', 'rgba(63, 89, 255, 1)', 'rgba(255, 164, 0, 1)'],
};

const LOGO_URI = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/mayksiynf9mps3sykzxn4';

export default function PulsingLogo({ size = 200, delay = 0, opacity = 0.15 }: PulsingLogoProps) {
  const scaleAnim = useRef(new Animated.Value(0.98)).current;
  const opacityAnim = useRef(new Animated.Value(opacity)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const glowOpacity1 = useRef(new Animated.Value(0.1)).current;
  const glowOpacity2 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 3000,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: opacity * 0.7,
            duration: 3000,
            delay,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: opacity,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const glowPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowOpacity1, {
            toValue: 0.14,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity2, {
            toValue: 0.7,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowOpacity1, {
            toValue: 0.1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity2, {
            toValue: 0.5,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseAnimation.start();
    rotationAnimation.start();
    glowPulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotationAnimation.stop();
      glowPulseAnimation.stop();
    };
  }, [delay, scaleAnim, opacityAnim, rotationAnim, opacity, glowOpacity1, glowOpacity2]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowSize = size * 1.25;
  const borderWidth = 4;

  return (
    <View style={[styles.wrapper, { width: glowSize, height: glowSize }]}>
      {/* Outer glow layer 1 - large soft glow */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: 70,
            opacity: glowOpacity1,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <LinearGradient
          colors={GLOW_COLORS.glow1 as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientGlow,
            {
              borderRadius: 70,
              ...Platform.select({
                ios: {
                  shadowColor: GLOW_COLORS.glow1[0],
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 15,
                },
                android: {
                  elevation: 15,
                },
              }),
            },
          ]}
        />
      </Animated.View>

      {/* Outer glow layer 2 - smaller intense glow */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 1.15,
            height: size * 1.15,
            borderRadius: 65,
            opacity: glowOpacity2,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <LinearGradient
          colors={GLOW_COLORS.glow2 as [string, string, ...string[]]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.gradientGlow,
            {
              borderRadius: 65,
              ...Platform.select({
                ios: {
                  shadowColor: GLOW_COLORS.glow2[1],
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 5,
                },
                android: {
                  elevation: 8,
                },
              }),
            },
          ]}
        />
      </Animated.View>

      {/* Animated border ring */}
      <Animated.View
        style={[
          styles.borderRing,
          {
            width: size * 1.08,
            height: size * 1.08,
            borderRadius: 60,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <LinearGradient
          colors={GLOW_COLORS.border as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.borderGradient,
            {
              borderRadius: 60,
              padding: borderWidth,
            },
          ]}
        >
          <View style={[styles.borderInner, { borderRadius: 56 }]} />
        </LinearGradient>
      </Animated.View>

      {/* Main logo */}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientGlow: {
    width: '100%',
    height: '100%',
  },
  borderRing: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderInner: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(21, 21, 21, 1)',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
