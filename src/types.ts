export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export interface Lesson {
    id: string;
    name: string;
    cards: Card[];
}

export interface Card {
    id: string;
    lessonId: string;
    front: string;
    back: string;
    frontComment: string;
    backComment: string;
    // SM-2 fields
    interval: number; // days until next review
    repetitions: number; // consecutive correct answers
    easeFactor: number; // starts at 2.5
    nextReview: string; // ISO date string
    level: number; // 1–5, derived from repetitions
    createdAt: string; // ISO date string
}

export interface StudyCard extends Card {
    quality: Quality;
    isDone: boolean;
}

export type Screen =
    | { name: 'home' }
    | { name: 'study' }
    | { name: 'lesson'; lessonId: string }
    | { name: 'edit'; lessonId: string; cardId?: string };
