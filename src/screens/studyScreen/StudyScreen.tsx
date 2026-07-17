import { JSX, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCards } from '../../CardsContext';
import { Card, Quality, StudyCard } from '../../types';
import { AppTheme, getQualityColor, useAppTheme } from '../../themes';
import DoneScreen from './DoneScreen';
import FlipCard from './FlipCard';
import Header from './Header';
import { applyReview, shuffleCards, toCard } from './sm2';
import { useSettings } from '../../settings/SettingsContext';

interface Props {
    onDone: () => void;
}

const StudyScreen = ({ onDone }: Props): JSX.Element => {
    const { settings } = useSettings();
    const { lessons, studyCards, persist } = useCards();
    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

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
        const newLessons = lessons.map(lesson => {
            const doneByLesson = doneCards.filter(c => c.lessonId === lesson.id);
            if (doneByLesson.length === 0) return lesson;

            const doneById = new Map(doneByLesson.map(c => [c.id, c]));
            return {
                ...lesson,
                cards: lesson.cards.map(c => doneById.get(c.id) ?? c),
            };
        });
        persist(newLessons);
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
    const solution = settings.inverted ? current.front : current.back;
    const question = settings.inverted ? current.back : current.front;
    const solutionComment = settings.inverted ? current.frontComment : current.backComment;
    const questionComment = settings.inverted ? current.backComment : current.frontComment;

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
            ? getQualityColor(theme, current.quality, true)
            : theme.colors.errorContainer
        : undefined;

    return (
        <SafeAreaView style={styles.container}>
            <Header index={index} total={currentCards.length} onAbort={onDone} />
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

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
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
            minHeight: 40,
        },
        checkBtn: {
            minHeight: 54,
            borderRadius: 4,
            alignSelf: 'stretch',
            justifyContent: 'center',
        },
    });
