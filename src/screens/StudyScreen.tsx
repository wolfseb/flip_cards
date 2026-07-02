import { JSX, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FlipCard from '../components/FlipCard';
import { HandleRate, Quality } from '../components/rating.types';
import RatingButton from '../components/RatingButton';
import { Card } from '../types';

interface Props {
    cards: Card[];
    onRate: (cardId: string, quality: Quality) => void;
    onDone: () => void;
}

const DoneScreen = ({ onDone }: { onDone: () => void }): JSX.Element => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.doneView}>
                <Text style={styles.doneTitle}>All done!</Text>
                <Text style={styles.doneSub}>You reviewed all due cards.</Text>
                <Pressable style={styles.doneBtn} onPress={onDone}>
                    <Text style={styles.doneBtnText}>Back to Home</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const StudyScreen = ({ cards, onRate, onDone }: Props): JSX.Element => {
    const [index, setIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [answer, setAnswer] = useState('');

    if (index >= cards.length) {
        return <DoneScreen onDone={onDone} />;
    }

    const current = cards[index];

    const handleRate: HandleRate = (quality: Quality) => {
        onRate(current.id, quality);
        setRevealed(false);
        setAnswer('');
        setIndex(i => i + 1);
    };

    const onCheck = (): void => {};

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={onDone}>
                    <Text style={styles.backLink}>← Back</Text>
                </Pressable>
                <Text style={styles.progress}>
                    {index + 1} / {cards.length}
                </Text>
            </View>

            <View style={styles.cardArea}>
                <FlipCard
                    key={current.id}
                    front={current.front}
                    back={current.back}
                    onFlip={setRevealed}
                />
                <View style={styles.textInputArea}>
                    <TextInput
                        style={styles.answerInput}
                        value={answer}
                        onChangeText={setAnswer}
                        placeholder="Type your answer…"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                    />
                    <Pressable onPress={onCheck}>Enter</Pressable>
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
    cardArea: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
    ratingArea: {
        paddingHorizontal: 20,
        paddingBottom: 36,
        paddingTop: 16,
    },
    ratingPrompt: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 12,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 8,
    },
    doneView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    doneTitle: {
        fontSize: 30,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    doneSub: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    doneBtn: {
        marginTop: 28,
        backgroundColor: '#5B8DEF',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 12,
    },
    doneBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
