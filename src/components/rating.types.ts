// SM-2 quality rating: 0 = complete blackout, 5 = perfect recall
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;
export type HandleRate = (quality: Quality) => void;
