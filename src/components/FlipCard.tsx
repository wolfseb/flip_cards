import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  front: string;
  back: string;
  onFlip?: (flipped: boolean) => void;
}

export default function FlipCard({ front, back, onFlip }: Props) {
  const [flipped, setFlipped] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const flip = () => {
    const next = !flipped;
    Animated.spring(anim, {
      toValue: next ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setFlipped(next);
    onFlip?.(next);
  };

  const frontRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Pressable style={styles.container} onPress={flip}>
      {/* Front face */}
      <Animated.View
        style={[
          styles.face,
          styles.front,
          { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] },
        ]}
      >
        <Text style={styles.sideLabel}>Front</Text>
        <Text style={styles.cardText}>{front}</Text>
      </Animated.View>

      {/* Back face */}
      <Animated.View
        style={[
          styles.face,
          styles.back,
          { transform: [{ perspective: 1000 }, { rotateY: backRotate }] },
        ]}
      >
        <Text style={styles.sideLabel}>Back</Text>
        <Text style={styles.cardText}>{back}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  front: {
    backgroundColor: '#ffffff',
  },
  back: {
    backgroundColor: '#F0F4FF',
  },
  sideLabel: {
    position: 'absolute',
    top: 14,
    left: 18,
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 32,
  },
});
