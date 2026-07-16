import { JSX, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCards } from '../../CardsContext';
import { Lesson, Screen } from '../../types';
import StatsRow from './StatsRow';
import { SortButtonRow } from './SortButtonRow';
import CardRow from './CardRow';
import EditLessonModal from '../homeScreen/EditLessonModal';
import SettingsMenu from '../../settings/SettingsMenu';
import { AppTheme, useAppTheme } from '../../themes';
import { filterCards, sortCards } from '../../sort';

interface Props {
    screen: Screen;
    lesson: Lesson;
    onStudy: () => void;
    onAddCard: () => void;
    onEditCard: (cardId: string) => void;
    onReturn: () => void;
}

const LessonScreen = ({
    screen,
    lesson,
    onStudy,
    onAddCard,
    onEditCard,
    onReturn,
}: Props): JSX.Element => {
    const { searchTerm, sortState } = useCards();
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [isEditingName, setIsEditingName] = useState(false);
    const editName = () => setIsEditingName(true);
    const endEditingName = () => setIsEditingName(false);

    const filteredCards = useMemo(() => {
        return searchTerm ? filterCards(lesson.cards, searchTerm) : lesson.cards;
    }, [lesson.cards, searchTerm]);

    const sortedCards = useMemo(() => {
        return sortCards(filteredCards, sortState.key, sortState.asc);
    }, [filteredCards, sortState]);

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={onReturn} />
                <Appbar.Content title={lesson.name} />
                <Appbar.Action icon={'pencil'} onPress={editName} />
                <SettingsMenu />
            </Appbar.Header>

            <StatsRow lesson={lesson} onStudy={onStudy} />
            <SortButtonRow />

            {lesson.cards.length === 0 ? (
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
                    data={sortedCards}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={item => (
                        <CardRow card={item.item} onEditCard={onEditCard} lesson={lesson} />
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
                onPress={onAddCard}
            />
            <EditLessonModal isVisible={isEditingName} hideModal={endEditingName} lesson={lesson} />
        </SafeAreaView>
    );
};

export default LessonScreen;

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        addBtn: {},
        empty: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
        },
        emptyTitle: {
            color: theme.colors.onSurface,
        },
        emptyHint: {
            color: theme.colors.onSurfaceVariant,
            marginTop: 6,
            textAlign: 'center',
        },
        list: {
            padding: 20,
            paddingBottom: 40,
        },
    });
