import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { loadCards, saveCards } from './storage';
import { Card, StudyCard } from './types';
import { isDue, shuffleCards, toStudyCard } from './screens/studyScreen/sm2';
import { sortCards, SortKey, SortState } from './sort';

interface CardsContextValue {
    cards: Card[];
    sorted: Card[];
    sortState: SortState;
    sortBy: (sortKey: SortKey) => void;
    getDueCards: () => Card[];
    studyCards: StudyCard[];
    queueStudyCards: (cards: Card[]) => void;
    persist: (update: Card[]) => void;
}

const CardsContext = createContext<CardsContextValue>({
    cards: [],
    sorted: [],
    sortState: {},
    sortBy: () => {},
    getDueCards: () => [],
    studyCards: [],
    queueStudyCards: () => {},
    persist: () => {},
});

export const CardsContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
    const [cards, setCards] = useState<Card[]>([]);
    const [sortState, setSortState] = useState<SortState>({});
    const [studyCards, setStudyCards] = useState<StudyCard[]>([]);

    useEffect(() => {
        loadCards().then(loaded => {
            setCards(loaded);
        });
    }, []);

    const persist = (updated: Card[]): void => {
        setCards(updated);
        saveCards(updated);
    };

    const sorted = useMemo(
        () => sortCards(cards, sortState.key, sortState.asc),
        [cards, sortState.key, sortState.asc],
    );

    const getDueCards = (): Card[] => cards.filter(isDue);

    const sortBy = (sortKey: SortKey): void => {
        if (sortKey === sortState.key) {
            setSortState(prev => ({
                key: prev.key,
                asc: !prev.asc,
            }));
        } else {
            setSortState({
                key: sortKey,
                asc: true,
            });
        }
    };

    const queueStudyCards = (cards: Card[]): void => {
        setStudyCards(shuffleCards(cards.map(toStudyCard)));
    };

    return (
        <CardsContext.Provider
            value={{
                cards,
                sorted,
                sortState,
                sortBy,
                getDueCards,
                studyCards,
                queueStudyCards,
                persist,
            }}
        >
            {children}
        </CardsContext.Provider>
    );
};

export const useCards = (): CardsContextValue => {
    const context = useContext(CardsContext);
    if (!context) {
        throw Error('Not within CardContext!');
    }
    return context;
};
