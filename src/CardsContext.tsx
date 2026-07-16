import {
    createContext,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { isDue, shuffleCards, toStudyCard } from './screens/studyScreen/sm2';
import { SortState } from './sort';
import { loadData, saveData } from './storage';
import { Card, Lesson, StudyCard } from './types';

interface CardsContextValue {
    lessons: Lesson[];
    sortState: SortState;
    setSortState: React.Dispatch<React.SetStateAction<SortState>>;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    allCards: Card[];
    allDueCards: Card[];
    studyCards: StudyCard[];
    queueStudyCards: (cards: Card[]) => void;
    persist: (update: Lesson[]) => void;
    persistLesson: (update: Lesson) => void;
}

const CardsContext = createContext<CardsContextValue>({
    lessons: [],
    sortState: { key: 'front', asc: true },
    setSortState: () => {},
    searchTerm: '',
    setSearchTerm: () => {},
    allCards: [],
    allDueCards: [],
    studyCards: [],
    queueStudyCards: () => {},
    persist: () => {},
    persistLesson: () => {},
});

export const CardsContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [sortState, setSortState] = useState<SortState>({ key: 'front', asc: true });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [studyCards, setStudyCards] = useState<StudyCard[]>([]);

    useEffect(() => {
        loadData().then(loaded => {
            setLessons(loaded);
        });
    }, []);

    const persist = useCallback((updated: Lesson[]): void => {
        setLessons(updated);
        saveData(updated);
    }, []);

    const persistLesson = useCallback(
        (updated: Lesson): void => {
            persist(lessons.map(l => (l.id === updated.id ? updated : l)));
        },
        [lessons, persist],
    );

    const allCards = useMemo(() => lessons.flatMap(l => l.cards), [lessons]);
    const allDueCards = useMemo(() => allCards.filter(isDue), [allCards]);

    const queueStudyCards = (cards: Card[]): void => {
        setStudyCards(shuffleCards(cards.map(toStudyCard)));
    };

    return (
        <CardsContext.Provider
            value={{
                lessons,
                sortState,
                setSortState,
                searchTerm,
                setSearchTerm,
                allCards,
                allDueCards,
                studyCards,
                queueStudyCards,
                persist,
                persistLesson,
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
