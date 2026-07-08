import AsyncStorage from '@react-native-async-storage/async-storage';

import { Lesson } from './types';

const KEY = 'flipcards_data';

export const loadData = async (): Promise<Lesson[]> => {
    try {
        const raw = await AsyncStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as Lesson[]) : [];
    } catch {
        return [];
    }
};

export const saveData = async (lessons: Lesson[]): Promise<void> => {
    await AsyncStorage.setItem(KEY, JSON.stringify(lessons));
};
