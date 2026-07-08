import { JSX, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCards } from '../../CardsContext';
import { Card, Quality, StudyCard } from '../../types';
import DoneScreen from './DoneScreen';
import FlipCard from './FlipCard';
import Header from './Header';
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
    const { lessons, studyCards, isInverted, persist } = useCards();

    const [currentCards, setCurrentCards] = useState<StudyCard[]>(studyCards);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const getDoneCards = (): Card[] => currentCards.filter(c => c.isDone).map(toCard);
    const getRestCards = (): StudyCard[] => currentCards.filter(c => !c.isDone);

    useEffect(() => {
        if (currentCards.length === 0 || index < currentCards.length) return;

        const doneCards = getDoneCards();
        lessons.map(lesson => {
            const doneByLesson = doneCards.filter(c => c.lessonId === lesson.id);
            if (doneByLesson.length === 0) return lesson;

            const doneById = new Map(doneByLesson.map(c => [c.id, c]));
            return {
                ...lesson,
                cards: lesson.cards.map(c => doneById.get(c.id) ?? c),
            };
        });
        persist(lessons);
        setCurrentCards(shuffleCards(getRestCards()));
        setIndex(0);
    }, [index, currentCards]);

    if (currentCards.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <DoneScreen onDone={onDone} />
            </SafeAreaView>
        );
    }

    if (index >= currentCards.length) {
        return <SafeAreaView style={styles.container} />;
    }

    const current = currentCards[index];
    const solution = isInverted ? current.front : current.back;
    const question = isInverted ? current.back : current.front;
    const solutionComment = isInverted ? current.frontComment : current.backComment;
    const questionComment = isInverted ? current.backComment : current.frontComment;

    const handleNext = (): void => {
        setAnswer('');
        setChecked(false);
        setIsCorrect(false);
        setIndex(i => i + 1);
    };

    const onCheck = (): void => {
        if (checked) return;

        const correct = solution.trim() === answer.trim();
        const updated: StudyCard = correct
            ? applyReview(current)
            : { ...current, quality: Math.max(current.quality - 1, 0) as Quality };

        setCurrentCards(prev => prev.map(c => (c.id === current.id ? updated : c)));
        setIsCorrect(correct);
        setChecked(true);
    };

    const tintColor = checked
        ? isCorrect
            ? CORRECT_QUALITY_COLORS[current.quality]
            : INCORRECT_COLOR
        : undefined;

    return (
        <SafeAreaView style={styles.container}>
            <Header index={index} total={currentCards.length} handleDone={onDone} />
            <View style={styles.studyArea}>
                <FlipCard
                    key={current.id}
                    front={question}
                    back={solution}
                    frontComment={questionComment}
                    backComment={solutionComment}
                    flipped={checked}
                    tintColor={tintColor}
                    flippable={checked}
                />
                <TextInput
                    mode="outlined"
                    style={styles.answerInput}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="Type your answer…"
                    multiline
                    textAlignVertical="top"
                    editable={!checked}
                />
                <Button
                    mode="contained"
                    onPress={checked ? handleNext : onCheck}
                    style={styles.checkBtn}
                >
                    {checked ? 'Next' : 'Enter'}
                </Button>
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
    studyArea: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 16,
    },
    answerInput: {
        alignSelf: 'stretch',
        paddingTop: 8,
        minHeight: 80,
    },
    checkBtn: {
        minHeight: 64,
        borderRadius: 4,
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
});
