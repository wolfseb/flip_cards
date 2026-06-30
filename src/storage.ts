import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from './types';

const KEY = 'flipcards_data';

export async function loadCards(): Promise<Card[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Card[]) : [];
  } catch {
    return [];
  }
}

export async function saveCards(cards: Card[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(cards));
}
