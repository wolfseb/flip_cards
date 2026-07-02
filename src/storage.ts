import AsyncStorage from '@react-native-async-storage/async-storage';

import { Card } from './types';

const KEY = 'flipcards_data';

export const loadCards = async (): Promise<Card[]> => {
    try {
        const raw = await AsyncStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as Card[]) : [];
    } catch {
        return [];
    }
};

export const saveCards = async (cards: Card[]): Promise<void> => {
    await AsyncStorage.setItem(KEY, JSON.stringify(cards));
};
