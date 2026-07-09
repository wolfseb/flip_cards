import { JSX, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCards } from '../../CardsContext';
import { Lesson, Screen } from '../../types';
import StatsRow from './StatsRow';
import { SortButtonRow } from './SortButtonRow';
import CardRow from './CardRow';
import EditLessonModal from '../homeScreen/EditLessonModal';

interface Props {
    screen: Screen;
    currentLesson: Lesson;
    onStudy: () => void;
    onAddCard: () => void;
    onEditCard: (cardId: string) => void;
    onReturn: () => void;
}

const LessonScreen = ({
    screen,
    currentLesson,
    onStudy,
    onAddCard,
    onEditCard,
    onReturn,
}: Props): JSX.Element => {
    const { getSorted, persistLesson } = useCards();
    const insets = useSafeAreaInsets();

    const [isEditingName, setIsEditingName] = useState(false);
    const editName = () => setIsEditingName(true);
    const endEditingName = () => setIsEditingName(false);

    const handleAddCard = () => onAddCard();
    const onDeleteCard = (id: string): void => {
        const message = 'This card will be permanently removed.';
        const onPersist = () =>
            persistLesson({
                ...currentLesson,
                cards: currentLesson.cards.filter(c => c.id !== id),
            });

        if (Platform.OS === 'web') {
            if (window.confirm(`Delete card\n\n${message}`)) {
                onPersist();
            }
            return;
        }

        Alert.alert('Delete card', message, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: onPersist,
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={onReturn} />
                <Appbar.Content title={currentLesson.name} />
                <Appbar.Action icon={'pencil'} onPress={editName} />
            </Appbar.Header>

            <StatsRow lesson={currentLesson} />
            {/* <Button mode="contained" onPress={showStudyModal}>
                Study all
            </Button>
            <Button mode="contained" onPress={showStudyModal}>
                Study due
            </Button> */}
            <SortButtonRow />

            {currentLesson.cards.length === 0 ? (
                <View style={styles.empty}>
                    <Text variant="titleMedium" style={styles.emptyTitle}>
                        No cards yet
                    </Text>
                    <Text variant="bodyMedium" style={styles.emptyHint}>
                        Tap "+" to create your first card.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={getSorted(currentLesson.id)}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <CardRow
                            item={item}
                            onEditCard={id => onEditCard(id)}
                            onDeleteCard={onDeleteCard}
                        />
                    )}
                />
            )}

            <FAB
                icon="plus"
                style={{
                    position: 'absolute',
                    bottom: insets.bottom,
                    right: insets.right,
                    margin: 16,
                }}
                onPress={handleAddCard}
            />
            <EditLessonModal
                isVisible={isEditingName}
                hideModal={endEditingName}
                lesson={currentLesson}
            />
        </SafeAreaView>
    );
};

export default LessonScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    addBtn: {},
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
