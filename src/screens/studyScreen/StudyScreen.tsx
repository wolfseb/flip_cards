import { JSX, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FlipCard from './FlipCard';
import { StudyCard, Quality, Card } from '../../types';
import DoneScreen from './DoneScreen';
import { useCards } from '../../CardsContext';
import { applyReview, shuffleCards, toCard } from './sm2';

const INCORRECT_COLOR = '#EF444433';

const CORRECT_QUALITY_COLORS: Record<Quality, string> = {
    0: '#EF643433',
    1: '#F59E0B33',
    2: '#F5DE0233',
    3: '#10B98133',
    4: '#5B8DEF33',
    5: '#5B8DEF33',
};

interface Props {
    onDone: () => void;
}

const StudyScreen = ({ onDone }: Props): JSX.Element => {
    const { cards, studyCards, persist } = useCards();

    const [currentCards, setCurrentCards] = useState<StudyCard[]>(studyCards);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const getDoneCards = (): Card[] => currentCards.filter(c => c.isDone).map(toCard);
    const getRestCards = (): StudyCard[] => currentCards.filter(c => !c.isDone);

    if (currentCards.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <DoneScreen onDone={onDone} />
            </SafeAreaView>
        );
    }

    if (index >= currentCards.length) {
        const doneById = new Map(getDoneCards().map(c => [c.id, c]));
        persist(cards.map(c => doneById.get(c.id) ?? c));

        setCurrentCards(shuffleCards(getRestCards()));
        setIndex(0);
    }

    const current = currentCards[index];

    const handleNext = (): void => {
        setAnswer('');
        setChecked(false);
        setIsCorrect(false);
        setIndex(i => i + 1);
    };

    const onCheck = (): void => {
        if (checked) return;

        const correct = current.back.trim() === answer.trim();
        const updated: StudyCard = correct
            ? applyReview(current)
            : { ...current, quality: Math.max(current.quality - 1, 0) as Quality };

        setCurrentCards(prev => prev.map(c => (c.id === current.id ? updated : c)));
        setIsCorrect(correct);
        setChecked(true);
    };

    const handleDone = (): void => {
        const doneById = new Map(getDoneCards().map(c => [c.id, c]));
        persist(cards.map(c => doneById.get(c.id) ?? c));
        onDone();
    };

    const tintColor = checked
        ? isCorrect
            ? CORRECT_QUALITY_COLORS[current.quality]
            : INCORRECT_COLOR
        : undefined;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={handleDone}>
                    <Text style={styles.backLink}>← Back</Text>
                </Pressable>
                <Text style={styles.progress}>
                    {index + 1} / {currentCards.length}
                </Text>
            </View>

            <View style={styles.studyArea}>
                <View style={styles.cardRow}>
                    <FlipCard
                        key={current.id}
                        front={current.front}
                        back={current.back}
                        flipped={checked}
                        tintColor={tintColor}
                    />
                    {checked && (
                        <Pressable style={styles.nextBtn} onPress={handleNext}>
                            <Text style={styles.nextBtnText}>Next →</Text>
                        </Pressable>
                    )}
                </View>
                <View style={styles.textInputArea}>
                    <TextInput
                        style={styles.answerInput}
                        value={answer}
                        onChangeText={setAnswer}
                        placeholder="Type your answer…"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        editable={!checked}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Enter') {
                                onCheck();
                            }
                        }}
                    />
                    <Pressable
                        style={[styles.checkBtn, checked && styles.checkBtnDisabled]}
                        onPress={onCheck}
                        disabled={checked}
                    >
                        <Text style={styles.checkBtnText}>Enter</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default StudyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backLink: {
        fontSize: 16,
        color: '#5B8DEF',
        fontWeight: '500',
    },
    progress: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
    studyArea: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    nextBtn: {
        backgroundColor: '#5B8DEF',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
    },
    nextBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    textInputArea: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerInput: {
        width: 400,
        marginTop: 16,
        minHeight: 80,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1A1A2E',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    checkBtn: {
        marginTop: 16,
        marginLeft: 12,
        minHeight: 80,
        backgroundColor: '#5B8DEF',
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBtnDisabled: {
        backgroundColor: '#A9BEEA',
    },
    checkBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});
