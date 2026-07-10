import AsyncStorage from '@react-native-async-storage/async-storage';

import { Lesson, Settings } from './types';

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

const SETTINGS_KEY = 'flipcards_settings';
export const SETTINGS_DEFAULT = { dark: false, language: 'en', inverted: false } as const;

export const loadSettings = async (): Promise<Settings> => {
    try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        return raw ? (JSON.parse(raw) as Settings) : SETTINGS_DEFAULT;
    } catch {
        return SETTINGS_DEFAULT;
    }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
