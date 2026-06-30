import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card } from '../types';
import { getDueCards } from '../sm2';

const LEVEL_COLORS = ['#9E9E9E', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'];
const LEVEL_NAMES = ['New', 'Learning 1', 'Learning 2', 'Expert 1', 'Expert 2'];

interface Props {
  cards: Card[];
  onStudy: () => void;
  onAddCard: () => void;
  onEditCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
}

export default function HomeScreen({
  cards,
  onStudy,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: Props) {
  const dueCount = getDueCards(cards).length;
  const sorted = [...cards].sort(
    (a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime(),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FlipCards</Text>
        <Pressable style={styles.addBtn} onPress={onAddCard}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{cards.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, dueCount > 0 && styles.dueHighlight]}>
            {dueCount}
          </Text>
          <Text style={styles.statLabel}>Due today</Text>
        </View>
      </View>

      {dueCount > 0 && (
        <Pressable style={styles.studyBtn} onPress={onStudy}>
          <Text style={styles.studyBtnText}>
            Study {dueCount} due card{dueCount !== 1 ? 's' : ''}
          </Text>
        </Pressable>
      )}

      {cards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No cards yet</Text>
          <Text style={styles.emptyHint}>Tap "+ Add" to create your first card.</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.cardRow}>
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: LEVEL_COLORS[item.level - 1] },
                ]}
              >
                <Text style={styles.levelBadgeText}>L{item.level}</Text>
                <Text style={styles.levelBadgeName}>{LEVEL_NAMES[item.level - 1]}</Text>
              </View>

              <View style={styles.cardTexts}>
                <Text style={styles.cardFront} numberOfLines={1}>
                  {item.front}
                </Text>
                <Text style={styles.cardBack} numberOfLines={1}>
                  {item.back}
                </Text>
              </View>

              <View style={styles.rowActions}>
                <Pressable
                  style={styles.editBtn}
                  onPress={() => onEditCard(item.id)}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => onDeleteCard(item.id)}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  addBtn: {
    backgroundColor: '#5B8DEF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  dueHighlight: {
    color: '#5B8DEF',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  studyBtn: {
    backgroundColor: '#5B8DEF',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  studyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptyHint: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  levelBadgeName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '500',
  },
  cardTexts: {
    flex: 1,
  },
  cardFront: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  cardBack: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    backgroundColor: '#EEF2FF',
  },
  editBtnText: {
    fontSize: 13,
    color: '#5B8DEF',
    fontWeight: '500',
  },
  deleteBtn: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
    backgroundColor: '#FEE2E2',
  },
  deleteBtnText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },
});
