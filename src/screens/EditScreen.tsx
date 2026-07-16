import { JSX, useMemo, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCards } from '../CardsContext';
import { Card, Lesson, Screen } from '../types';
import { AppTheme, useAppTheme } from '../themes';

interface Props {
    screen: Screen;
    lesson: Lesson;
    card?: Card; // undefined = new card
    onReturn: () => void;
}

const EditScreen = ({ screen, lesson, card, onReturn }: Props): JSX.Element => {
    const { persistLesson } = useCards();
    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [front, setFront] = useState(card?.front ?? '');
    const [back, setBack] = useState(card?.back ?? '');
    const [frontComment, setFrontComment] = useState(card?.frontComment ?? '');
    const [backComment, setBackComment] = useState(card?.backComment ?? '');

    const canSave = front.trim().length > 0 && back.trim().length > 0;

    const onSave = (front: string, frontComment: string, back: string, backComment: string) => {
        if (screen.name !== 'edit') return;

        if (screen.cardId) {
            persistLesson({
                ...lesson,
                cards: lesson.cards.map(c =>
                    c.id === screen.cardId ? { ...c, front, frontComment, back, backComment } : c,
                ),
            });
        } else {
            const now = new Date().toISOString();
            const newCard: Card = {
                id: Date.now().toString(),
                lessonId: lesson.id,
                front,
                back,
                frontComment,
                backComment,
                interval: 0,
                repetitions: 0,
                easeFactor: 2.5,
                nextReview: now,
                level: 1,
                createdAt: now,
            };
            persistLesson({
                ...lesson,
                cards: [...lesson.cards, newCard],
            });
        }
        onReturn();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button mode="text" onPress={onReturn} textColor={theme.colors.onSurfaceVariant}>
                    Cancel
                </Button>
                <Text variant="titleMedium" style={styles.title}>
                    {card ? 'Edit Card' : 'New Card'}
                </Text>
                <Button
                    mode="text"
                    onPress={() =>
                        canSave &&
                        onSave(front.trim(), frontComment.trim(), back.trim(), backComment.trim())
                    }
                    disabled={!canSave}
                >
                    Save
                </Button>
            </View>

            <KeyboardAvoidingView style={styles.body} behavior={'padding'}>
                <ScrollView
                    contentContainerStyle={styles.bodyContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <TextInput
                        mode="outlined"
                        label="Front"
                        style={styles.input}
                        value={front}
                        onChangeText={setFront}
                        placeholder="Enter front side text…"
                        multiline
                        autoFocus
                        textAlignVertical="top"
                    />

                    <TextInput
                        mode="outlined"
                        label="Back"
                        style={styles.input}
                        value={back}
                        onChangeText={setBack}
                        placeholder="Enter back side text…"
                        multiline
                        textAlignVertical="top"
                    />

                    <TextInput
                        mode="outlined"
                        label="Front Comment"
                        style={styles.input}
                        value={frontComment}
                        onChangeText={setFrontComment}
                        placeholder="Enter front side comment…"
                        multiline
                        textAlignVertical="top"
                    />

                    <TextInput
                        mode="outlined"
                        label="Back Comment"
                        style={styles.input}
                        value={backComment}
                        onChangeText={setBackComment}
                        placeholder="Enter back side comment…"
                        multiline
                        textAlignVertical="top"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditScreen;

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.outlineVariant,
        },
        title: {
            fontWeight: '600',
            color: theme.colors.onSurface,
        },
        body: {
            flex: 1,
        },
        bodyContent: {
            padding: 20,
            gap: 14,
        },
        input: {
            minHeight: 100,
        },
    });
