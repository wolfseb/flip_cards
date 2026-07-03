import { JSX } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCards } from '../../CardsContext';
import CardRow from './CardRow';
import { SortButtonRow } from './SortButtonRow';
import StatsRow from './StatsRow';
import StudyRow from './StudyRow';

interface Props {
    onStudy: () => void;
    onAddCard: () => void;
    onEditCard: (id: string) => void;
}

const HomeScreen = ({ onStudy, onAddCard, onEditCard }: Props): JSX.Element => {
    const { cards, sorted, getDueCards, queueStudyCards, persist } = useCards();
    const dueCount = getDueCards().length;

    const onDeleteCard = (id: string) => {
        Alert.alert('Delete card', 'This card will be permanently removed.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => persist(cards.filter(c => c.id !== id)),
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>
                    FlipCards
                </Text>
                <Button mode="contained" onPress={onAddCard} compact>
                    + Add
                </Button>
            </View>

            <StatsRow />
            <StudyRow onStudy={onStudy} />
            <SortButtonRow />

            {cards.length === 0 ? (
                <View style={styles.empty}>
                    <Text variant="titleMedium" style={styles.emptyTitle}>
                        No cards yet
                    </Text>
                    <Text variant="bodyMedium" style={styles.emptyHint}>
                        Tap "+ Add" to create your first card.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={sorted}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <CardRow item={item} onEditCard={onEditCard} onDeleteCard={onDeleteCard} />
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default HomeScreen;

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
        fontWeight: '700',
        color: '#1A1A2E',
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        color: '#374151',
    },
    emptyHint: {
        color: '#9CA3AF',
        marginTop: 6,
        textAlign: 'center',
    },
    list: {
        padding: 20,
        paddingBottom: 40,
    },
});
