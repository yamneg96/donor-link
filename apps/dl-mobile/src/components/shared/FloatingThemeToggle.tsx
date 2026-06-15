import React, { useRef, useState } from 'react';
import { View, PanResponder, Animated, StyleSheet, Dimensions, Platform } from 'react-native';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Sun, Moon } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = 56;
const PADDING = 16;

export const FloatingThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  // Ref for the position to persist between renders
  const pan = useRef(new Animated.ValueXY({ 
    x: width - BUTTON_SIZE - PADDING, 
    y: PADDING + (Platform.OS === 'ios' ? 44 : 20) // Initial position top-right
  })).current;

  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value
        });
        pan.setValue({ x: 0, y: 0 });
        setIsDragging(true);
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        pan.flattenOffset();
        setIsDragging(false);

        // SNAP TO EDGES (Optional but nice)
        let finalX = (pan.x as any)._value;
        let finalY = (pan.y as any)._value;

        // Keep within bounds
        finalX = Math.max(PADDING, Math.min(width - BUTTON_SIZE - PADDING, finalX));
        finalY = Math.max(PADDING, Math.min(height - BUTTON_SIZE - PADDING, finalY));

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          friction: 5,
        }).start();
        
        // If it was a tap (little movement), toggle theme
        if (Math.abs(gestureState.dx) < 15 && Math.abs(gestureState.dy) < 15) {
          console.log('[ThemeToggle] Tap detected. Toggling theme. Current:', colorScheme);
          toggleColorScheme();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: isDragging ? 1.1 : 1 }
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center bg-primary shadow-lg border border-white/20"
        style={{ elevation: 5 }}
      >
        {colorScheme === 'dark' ? (
          <Sun size={24} color="white" />
        ) : (
          <Moon size={24} color="white" />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
});
