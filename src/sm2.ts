import { Quality } from './components/rating.types';
import { Card, PracticeCard } from './types';

export const applyReview = (card: Card, quality: Quality): Card => {
    let { repetitions, easeFactor, interval } = card;

    if (quality >= 3) {
        // Correct response: advance interval
        if (repetitions === 0) interval = 1;
        else if (repetitions === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetitions += 1;
    } else {
        // Incorrect: reset to beginning
        repetitions = 0;
        interval = 1;
    }

    // EF update formula from SM-2
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    const next = new Date();
    next.setDate(next.getDate() + interval);

    return {
        ...card,
        repetitions,
        easeFactor,
        interval,
        nextReview: next.toISOString(),
        level: Math.min(repetitions + 1, 5),
    };
};

export const isDue = (card: Card): boolean => {
    return new Date(card.nextReview) <= new Date();
};

export const getDueCards = (cards: Card[]): PracticeCard[] => {
    return cards
        .filter(isDue)
        .map(card => ({
            ...card,
            guesses: 0,
            done: false,
        }))
        .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
};

export const shuffleCards = (cards: PracticeCard[]): PracticeCard[] => {
    let order = cards.slice();
    for (let i = order.length; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
};
