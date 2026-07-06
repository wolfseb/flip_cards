import { JSX, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCards } from '../CardsContext';
import { Card, Screen } from '../types';

interface Props {
    screen: Screen;
    card?: Card; // undefined = new card
    onReturn: () => void;
}

const EditScreen = ({ screen, card, onReturn }: Props): JSX.Element => {
    const { cards, persist } = useCards();

    const [front, setFront] = useState(card?.front ?? '');
    const [back, setBack] = useState(card?.back ?? '');
    const [frontComment, setFrontComment] = useState(card?.frontComment ?? '');
    const [backComment, setBackComment] = useState(card?.backComment ?? '');

    const canSave = front.trim().length > 0 && back.trim().length > 0;

    const onSave = (front: string, frontComment: string, back: string, backComment: string) => {
        if (screen.name !== 'edit') return;

        if (screen.cardId) {
            persist(
                cards.map(c =>
                    c.id === screen.cardId ? { ...c, front, frontComment, back, backComment } : c,
                ),
            );
        } else {
            const now = new Date().toISOString();
            const newCard: Card = {
                id: Date.now().toString(),
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
            persist([...cards, newCard]);
        }
        onReturn();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button mode="text" onPress={onReturn} textColor="#6B7280">
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
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontWeight: '600',
        color: '#1A1A2E',
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
