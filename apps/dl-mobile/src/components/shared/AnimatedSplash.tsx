import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withDelay, 
  withSequence,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Text } from '../ui/text';
import { Droplet } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export const AnimatedSplash = () => {
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const logoTranslateY = useSharedValue(20);
  const ringRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const loaderOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo sequence
    logoOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    logoTranslateY.value = withDelay(100, withTiming(0, { duration: 800 }));
    logoScale.value = withDelay(100, withTiming(1, { duration: 800 }));

    // Title sequence
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    titleTranslateY.value = withDelay(400, withTiming(0, { duration: 800 }));

    // Subtitle sequence
    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 800 }));
    subtitleTranslateY.value = withDelay(700, withTiming(0, { duration: 800 }));

    // Ring rotation
    ringRotation.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );

    // Glow pulse influence (not direct filter, but we use scale/opacity)
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Loader sequence
    loaderOpacity.value = withDelay(1000, withTiming(0.8, { duration: 800 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: logoTranslateY.value },
      { scale: logoScale.value * pulseScale.value }
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    opacity: loaderOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background Gradient equivalent */}
      <View style={styles.background} />
      <View style={styles.overlay} />

      <View style={styles.content}>
        {/* Logo Emblem */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logoCircle}>
            <Droplet size={64} color="white" fill="white" />
          </View>
          {/* Decorative Ring */}
          <Animated.View style={[styles.orbitRing, ringStyle]} />
        </Animated.View>

        {/* Brand Text */}
        <View style={styles.textContainer}>
          <Animated.View style={titleStyle}>
            <Text 
              variant="h1" 
              className="text-white text-4xl font-bold tracking-tight shadow-md"
            >
              DonorLink Ethiopia
            </Text>
          </Animated.View>
          <Animated.View style={subtitleStyle}>
            <Text 
              variant="lead" 
              className="text-white/80 mt-2 tracking-wide font-light"
            >
              Connecting Life
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Loading Area */}
      <Animated.View style={[styles.footer, loaderStyle]}>
        <Animated.View style={[styles.loader, ringStyle]} />
        <Text 
          variant="small" 
          className="text-white/60 mt-4 uppercase tracking-[4px]"
        >
          Initializing Secure Connection
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#93000b', // Base primary color
    zIndex: 9999,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#93000b',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)', // Simulated mix-blend-multiply overlay
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    // Shadow is handled via pulse animation in styles if needed
  },
  orbitRing: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 64,
  },
  textContainer: {
    alignItems: 'center',
  },
  footer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  loader: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'white',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    // We could animate this but native indicator or simple view spin is easier
  },
});
