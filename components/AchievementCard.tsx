import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trophy, Medal, Award } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface AchievementCardProps {
  title: string;
  year: string;
  type: 'champion' | 'runner-up' | 'semifinal';
  delay?: number;
}

export default function AchievementCard({ title, year, type, delay = 0 }: AchievementCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.1)).current;
  const borderGlowAnim = useRef(new Animated.Value(0)).current;
  const iconGlowAnim = useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
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
          toValue: type === 'champion' ? 0.8 : type === 'runner-up' ? 0.6 : 0.5,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.15,
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
        Animated.timing(iconGlowAnim, {
          toValue: 0.9,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(iconGlowAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [delay, fadeAnim, slideAnim, glowAnim, borderGlowAnim, iconGlowAnim, type]);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: false,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 100,
      friction: 10,
    }).start();
  };

  const getIcon = () => {
    switch (type) {
      case 'champion':
        return <Trophy size={28} color={Colors.gold} />;
      case 'runner-up':
        return <Medal size={28} color={Colors.silver} />;
      default:
        return <Award size={28} color={Colors.primary} />;
    }
  };

  const getGlowColor = () => {
    switch (type) {
      case 'champion':
        return Colors.gold;
      case 'runner-up':
        return Colors.silver;
      default:
        return Colors.primary;
    }
  };

  const baseBorderColor = () => {
    switch (type) {
      case 'champion':
        return 'rgba(245, 158, 11, 0.4)';
      case 'runner-up':
        return 'rgba(156, 163, 175, 0.4)';
      default:
        return Colors.border;
    }
  };

  const animatedBorderColor = borderGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [baseBorderColor(), type === 'semifinal' ? Colors.primaryGlow : getGlowColor()],
  });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={styles.glowWrapper}>
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim,
              shadowColor: getGlowColor(),
              shadowOpacity: glowAnim,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.card,
            {
              borderColor: animatedBorderColor,
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.innerGlowTop} />
          <Animated.View 
            style={[
              styles.iconContainer, 
              { 
                shadowColor: getGlowColor(),
                shadowOpacity: iconGlowAnim,
              }
            ]}
          >
            {getIcon()}
          </Animated.View>
          <View style={styles.content}>
            <Text style={styles.year}>{year}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={[styles.glow, { backgroundColor: getGlowColor() }]} />
          <View style={[styles.glowBottom, { backgroundColor: getGlowColor() }]} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glowWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
    elevation: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
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
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flex: 1,
  },
  year: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600' as const,
  },
  glow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.1,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.05,
  },
});
