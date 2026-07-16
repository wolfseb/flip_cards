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
import { sortCards, SortKey, SortState } from './sort';
import { loadData, saveData } from './storage';
import { Card, Lesson, StudyCard } from './types';

interface CardsContextValue {
    lessons: Lesson[];
    getCards: (lessonId: string) => Card[];
    getSorted: (lessonId: string) => Card[];
    sortState: SortState;
    sortBy: (sortKey: SortKey, asc: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    getDueCards: (lessonId: string) => Card[];
    getAllDueCards: () => Card[];
    studyCards: StudyCard[];
    queueStudyCards: (cards: Card[]) => void;
    isInverted: boolean;
    setIsInverted: (val: boolean) => void;
    persist: (update: Lesson[]) => void;
    persistLesson: (update: Lesson) => void;
}

const CardsContext = createContext<CardsContextValue>({
    lessons: [],
    getCards: () => [],
    getSorted: () => [],
    sortState: { key: 'front', asc: true },
    sortBy: () => {},
    searchTerm: '',
    setSearchTerm: () => {},
    getDueCards: () => [],
    getAllDueCards: () => [],
    studyCards: [],
    queueStudyCards: () => {},
    isInverted: false,
    setIsInverted: () => {},
    persist: () => {},
    persistLesson: () => {},
});

export const CardsContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [sortState, setSortState] = useState<SortState>({ key: 'front', asc: true });
    const [searchTerm, setSearchTerm] = useState('');
    const [studyCards, setStudyCards] = useState<StudyCard[]>([]);
    const [isInverted, setIsInverted] = useState(false);

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

    const getCards = useCallback(
        (lessonId: string) => lessons.find(l => l.id === lessonId)?.cards ?? [],
        [lessons],
    );

    const getSorted = useCallback(
        (lessonId: string) => {
            const term = searchTerm.trim().toLowerCase();
            const filtered = term
                ? getCards(lessonId).filter(
                      c =>
                          c.front.toLowerCase().includes(term) ||
                          c.back.toLowerCase().includes(term),
                  )
                : getCards(lessonId);
            return sortCards(filtered, sortState.key, sortState.asc);
        },
        [getCards, sortState.key, sortState.asc, searchTerm],
    );

    const getAllDueCards = useCallback(
        (): Card[] => lessons.flatMap(l => l.cards).filter(isDue),
        [lessons],
    );
    const getDueCards = useCallback(
        (lessonId: string): Card[] => getCards(lessonId).filter(isDue) ?? [],
        [getCards],
    );

    const sortBy = useCallback((sortKey: SortKey, asc: boolean): void => {
        setSortState({
            key: sortKey,
            asc: asc,
        });
    }, []);

    const queueStudyCards = useCallback((cards: Card[]): void => {
        setStudyCards(shuffleCards(cards.map(toStudyCard)));
    }, []);

    const value = useMemo<CardsContextValue>(
        () => ({
            lessons,
            getCards,
            getSorted,
            sortState,
            sortBy,
            searchTerm,
            setSearchTerm,
            getDueCards,
            getAllDueCards,
            studyCards,
            queueStudyCards,
            isInverted,
            setIsInverted,
            persist,
            persistLesson,
        }),
        [
            lessons,
            getCards,
            getSorted,
            sortState,
            sortBy,
            searchTerm,
            getDueCards,
            getAllDueCards,
            studyCards,
            queueStudyCards,
            isInverted,
            persist,
            persistLesson,
        ],
    );

    return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
};

export const useCards = (): CardsContextValue => {
    const context = useContext(CardsContext);
    if (!context) {
        throw Error('Not within CardContext!');
    }
    return context;
};
