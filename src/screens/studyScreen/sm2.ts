import { Card, StudyCard } from '../../types';

export const applyReview = (card: StudyCard): StudyCard => {
    let { repetitions, easeFactor, interval, quality } = card;

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
        isDone: true,
    };
};

export const isDue = (card: Card): boolean => {
    return new Date(card.nextReview) <= new Date();
};

export const toStudyCard = (card: Card): StudyCard => ({
    ...card,
    quality: 5,
    isDone: false,
});

export const toCard = (card: StudyCard): Card => {
    const { quality: _quality, isDone: _isDone, ...rest } = card;
    return rest;
};

export const shuffleCards = (cards: StudyCard[]): StudyCard[] => {
    let order = cards.slice();
    for (let i = order.length; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
};
