export interface Card {
    id: string;
    front: string;
    back: string;
    // SM-2 fields
    interval: number; // days until next review
    repetitions: number; // consecutive correct answers
    easeFactor: number; // starts at 2.5
    nextReview: string; // ISO date string
    level: number; // 1–5, derived from repetitions
    createdAt: string; // ISO date string
}

export interface PracticeCard extends Card {
    guesses: number;
    done: boolean;
}

export type Screen = { name: 'home' } | { name: 'study' } | { name: 'edit'; cardId?: string };
