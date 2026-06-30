import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card, Quality } from '../types';
import FlipCard from '../components/FlipCard';

interface Props {
  cards: Card[];
  onRate: (cardId: string, quality: Quality) => void;
  onDone: () => void;
}

export default function StudyScreen({ cards, onRate, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (index >= cards.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.doneView}>
          <Text style={styles.doneTitle}>All done!</Text>
          <Text style={styles.doneSub}>You reviewed all {cards.length} due cards.</Text>
          <Pressable style={styles.doneBtn} onPress={onDone}>
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const current = cards[index];

  const handleRate = (quality: Quality) => {
    onRate(current.id, quality);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onDone}>
          <Text style={styles.backLink}>← Back</Text>
        </Pressable>
        <Text style={styles.progress}>
          {index + 1} / {cards.length}
        </Text>
      </View>

      <View style={styles.cardArea}>
        {/* key forces a fresh component (and animation) for each card */}
        <FlipCard
          key={current.id}
          front={current.front}
          back={current.back}
          onFlip={setRevealed}
        />
        {!revealed && (
          <Text style={styles.tapHint}>Tap card to reveal</Text>
        )}
      </View>

      {revealed && (
        <View style={styles.ratingArea}>
          <Text style={styles.ratingPrompt}>How well did you recall it?</Text>
          <View style={styles.ratingRow}>
            <Pressable
              style={[styles.ratingBtn, { backgroundColor: '#EF4444' }]}
              onPress={() => handleRate(0)}
            >
              <Text style={styles.ratingBtnText}>Again</Text>
            </Pressable>
            <Pressable
              style={[styles.ratingBtn, { backgroundColor: '#F59E0B' }]}
              onPress={() => handleRate(2)}
            >
              <Text style={styles.ratingBtnText}>Hard</Text>
            </Pressable>
            <Pressable
              style={[styles.ratingBtn, { backgroundColor: '#10B981' }]}
              onPress={() => handleRate(4)}
            >
              <Text style={styles.ratingBtnText}>Good</Text>
            </Pressable>
            <Pressable
              style={[styles.ratingBtn, { backgroundColor: '#5B8DEF' }]}
              onPress={() => handleRate(5)}
            >
              <Text style={styles.ratingBtnText}>Easy</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backLink: {
    fontSize: 16,
    color: '#5B8DEF',
    fontWeight: '500',
  },
  progress: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapHint: {
    marginTop: 20,
    fontSize: 14,
    color: '#9CA3AF',
  },
  ratingArea: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 16,
  },
  ratingPrompt: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  ratingBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  doneView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  doneTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  doneSub: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  doneBtn: {
    marginTop: 28,
    backgroundColor: '#5B8DEF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
