import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Card, PracticeCard, Screen } from './src/types';
import { loadCards, saveCards } from './src/storage';
import { applyReview, getDueCards, shuffleCards } from './src/sm2';
import HomeScreen from './src/screens/HomeScreen';
import StudyScreen from './src/screens/StudyScreen';
import EditScreen from './src/screens/EditScreen';
import { Quality } from './src/components/rating.types';

export default function App() {
    const [cards, setCards] = useState<Card[]>([]);
    const [screen, setScreen] = useState<Screen>({ name: 'home' });
    const [studyQueue, setStudyQueue] = useState<PracticeCard[]>([]);

    useEffect(() => {
        loadCards().then(setCards);
    }, []);

    const persist = (updated: Card[]) => {
        setCards(updated);
        saveCards(updated);
    };

    const handleStudy = () => {
        setStudyQueue(shuffleCards(getDueCards(cards)));
        setScreen({ name: 'study' });
    };

    const handleRate = (cardId: string, quality: Quality) => {
        persist(cards.map(c => (c.id === cardId ? applyReview(c, quality) : c)));
    };

    const handleSave = (front: string, back: string) => {
        if (screen.name !== 'edit') return;

        if (screen.cardId) {
            persist(cards.map(c => (c.id === screen.cardId ? { ...c, front, back } : c)));
        } else {
            const now = new Date().toISOString();
            const newCard: Card = {
                id: Date.now().toString(),
                front,
                back,
                interval: 0,
                repetitions: 0,
                easeFactor: 2.5,
                nextReview: now,
                level: 1,
                createdAt: now,
            };
            persist([...cards, newCard]);
        }
        setScreen({ name: 'home' });
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete card', 'This card will be permanently removed.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => persist(cards.filter(c => c.id !== id)),
            },
        ]);
    };

    let content;
    if (screen.name === 'study') {
        content = (
            <StudyScreen
                cards={studyQueue}
                onRate={handleRate}
                onDone={() => setScreen({ name: 'home' })}
            />
        );
    } else if (screen.name === 'edit') {
        content = (
            <EditScreen
                card={cards.find(c => c.id === screen.cardId)}
                onSave={handleSave}
                onCancel={() => setScreen({ name: 'home' })}
            />
        );
    } else {
        content = (
            <HomeScreen
                cards={cards}
                onStudy={handleStudy}
                onAddCard={() => setScreen({ name: 'edit' })}
                onEditCard={id => setScreen({ name: 'edit', cardId: id })}
                onDeleteCard={handleDelete}
            />
        );
    }

    return <SafeAreaProvider>{content}</SafeAreaProvider>;
}
