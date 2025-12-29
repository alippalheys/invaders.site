import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image, View } from 'react-native';
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

  useEffect(() => {
    const animation = Animated.loop(
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
    animation.start();
    return () => animation.stop();
  }, [delay, scaleAnim, opacityAnim, glowAnim, opacity]);

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
