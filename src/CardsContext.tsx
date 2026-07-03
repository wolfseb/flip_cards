import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { isDue, shuffleCards, toStudyCard } from './screens/studyScreen/sm2';
import { sortCards, SortKey, SortState } from './sort';
import { loadCards, saveCards } from './storage';
import { Card, StudyCard } from './types';

interface CardsContextValue {
    cards: Card[];
    sorted: Card[];
    sortState: SortState;
    sortBy: (sortKey: SortKey) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
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
    searchTerm: '',
    setSearchTerm: () => {},
    getDueCards: () => [],
    studyCards: [],
    queueStudyCards: () => {},
    persist: () => {},
});

export const CardsContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
    const [cards, setCards] = useState<Card[]>([]);
    const [sortState, setSortState] = useState<SortState>({});
    const [searchTerm, setSearchTerm] = useState('');
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

    const sorted = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const filtered = term
            ? cards.filter(
                  c => c.front.toLowerCase().includes(term) || c.back.toLowerCase().includes(term),
              )
            : cards;
        return sortCards(filtered, sortState.key, sortState.asc);
    }, [cards, sortState.key, sortState.asc, searchTerm]);

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
                searchTerm,
                setSearchTerm,
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
