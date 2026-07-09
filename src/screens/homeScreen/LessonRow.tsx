import { StyleSheet, View } from 'react-native';
import { Avatar, Button, IconButton, Card as PaperCard, Text } from 'react-native-paper';

import { Lesson } from '../../types';
import { useMemo } from 'react';
import { useCards } from '../../CardsContext';

const LEVEL_COLORS = ['#9E9E9E', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'];
const LEVEL_NAMES = ['New', 'Learning 1', 'Learning 2', 'Expert 1', 'Expert 2'];

interface Props {
    item: Lesson;
    onEditLesson: (id: string) => void;
    onDeleteLesson: (id: string) => void;
}

const LessonRow = ({ item, onEditLesson, onDeleteLesson }: Props) => {
    const { getDueCards } = useCards();
    const dueCards = getDueCards(item.id).length;

    const minLevel = useMemo(
        () =>
            item.cards
                ? item.cards.length > 0
                    ? Math.min(...item.cards.map(c => c.level))
                    : 0
                : 0,
        [item.cards],
    );

    return (
        <PaperCard style={styles.cardRow} mode="elevated">
            <PaperCard.Content style={styles.content}>
                <View style={styles.levelBadge}>
                    <Avatar.Text
                        size={32}
                        label={`L${minLevel}`}
                        labelStyle={styles.levelBadgeText}
                        style={{ backgroundColor: LEVEL_COLORS[minLevel - 1] }}
                    />
                    <Text style={styles.levelBadgeName}>{LEVEL_NAMES[minLevel - 1]}</Text>
                </View>

                <Text style={styles.text} numberOfLines={1}>
                    {item.name}
                </Text>

                {item.cards && item.cards.length > 0 && (
                    <Text style={styles.text} numberOfLines={1}>
                        {dueCards + '/' + item.cards.length + ' due'}
                    </Text>
                )}

                <View style={styles.rowActions}>
                    <IconButton icon={'pencil'} onPress={() => onEditLesson(item.id)} />
                    <IconButton
                        icon={'delete'}
                        onPress={() => onDeleteLesson(item.id)}
                        iconColor="#EF4444"
                    />
                </View>
            </PaperCard.Content>
        </PaperCard>
    );
};

export default LessonRow;

const styles = StyleSheet.create({
    cardRow: {
        marginBottom: 8,
        borderRadius: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    levelBadge: {
        alignItems: 'center',
    },
    levelBadgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    levelBadgeName: {
        color: '#6B7280',
        fontSize: 9,
        fontWeight: '500',
        marginTop: 2,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    rowActions: {
        flexDirection: 'row',
        marginLeft: 8,
    },
});
