import { Card } from './types';

export const SORT_MAP = {
    front: 'Front',
    back: 'Back',
    nextReview: 'Next Review Date',
    level: 'Level',
    createdAt: 'Created At',
} as const;

export type SortKey = keyof typeof SORT_MAP;

export type SortState = {
    key?: SortKey;
    asc?: boolean;
};

export const sortLabel = (sortKey: SortKey): string => SORT_MAP[sortKey];

const comparators: Record<SortKey, (a: Card, b: Card) => number> = {
    front: (a, b) => a.front.localeCompare(b.front),
    back: (a, b) => a.back.localeCompare(b.back),
    nextReview: (a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime(),
    level: (a, b) => a.level - b.level,
    createdAt: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
};

export const sortCards = (
    cards: Card[],
    key: SortKey | undefined,
    asc: boolean | undefined,
): Card[] => {
    if (key === undefined || asc === undefined) {
        return cards;
    }
    const cmp = comparators[key];
    return [...cards].sort((a, b) => (asc ? cmp(a, b) : cmp(b, a)));
};
