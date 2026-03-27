import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface PulsingOrbProps {
  size?: number;
  color?: string;
  delay?: number;
}

export default function PulsingOrb({ size = 200, color = Colors.primary, delay = 0 }: PulsingOrbProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 3000,
            delay,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.1,
            duration: 3000,
            delay,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 3000,
            useNativeDriver: false,
          }),
        ]),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
  },
});
