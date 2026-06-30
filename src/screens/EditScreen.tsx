import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Card } from '../types';

interface Props {
  card?: Card; // undefined = new card
  onSave: (front: string, back: string) => void;
  onCancel: () => void;
}

export default function EditScreen({ card, onSave, onCancel }: Props) {
  const [front, setFront] = useState(card?.front ?? '');
  const [back, setBack] = useState(card?.back ?? '');

  const canSave = front.trim().length > 0 && back.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>{card ? 'Edit Card' : 'New Card'}</Text>
        <Pressable onPress={() => canSave && onSave(front.trim(), back.trim())} disabled={!canSave}>
          <Text style={[styles.saveText, !canSave && styles.saveDisabled]}>Save</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Front</Text>
          <TextInput
            style={styles.input}
            value={front}
            onChangeText={setFront}
            placeholder="Enter front side text…"
            placeholderTextColor="#9CA3AF"
            multiline
            autoFocus
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Back</Text>
          <TextInput
            style={styles.input}
            value={back}
            onChangeText={setBack}
            placeholder="Enter back side text…"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
        </View>
      </KeyboardAvoidingView>
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
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  saveText: {
    fontSize: 16,
    color: '#5B8DEF',
    fontWeight: '600',
  },
  saveDisabled: {
    color: '#D1D5DB',
  },
  body: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  field: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#1A1A2E',
    minHeight: 100,
    lineHeight: 24,
  },
});
