import { JSX } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StatsRow from './StatsRow';
import StudyRow from './StudyRow';
import { useCards } from '../../CardsContext';
import { SortButtonRow } from './SortButtonRow';
import CardRow from './CardRow';

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
                <Text style={styles.title}>FlipCards</Text>
                <Pressable style={styles.addBtn} onPress={onAddCard}>
                    <Text style={styles.addBtnText}>+ Add</Text>
                </Pressable>
            </View>

            <StatsRow />
            <StudyRow onStudy={onStudy} />
            <SortButtonRow />

            {cards.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyTitle}>No cards yet</Text>
                    <Text style={styles.emptyHint}>Tap "+ Add" to create your first card.</Text>
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
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    addBtn: {
        backgroundColor: '#5B8DEF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    emptyHint: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 6,
        textAlign: 'center',
    },
    list: {
        padding: 20,
        paddingBottom: 40,
    },
});
