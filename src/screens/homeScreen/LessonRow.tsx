import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card as PaperCard, Text } from 'react-native-paper';

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
                        size={44}
                        label={`L${minLevel}`}
                        labelStyle={styles.levelBadgeText}
                        style={{ backgroundColor: LEVEL_COLORS[minLevel - 1] }}
                    />
                    <Text style={styles.levelBadgeName}>{LEVEL_NAMES[minLevel - 1]}</Text>
                </View>

                <Text style={styles.cardFront} numberOfLines={1}>
                    {item.name}
                </Text>

                {item.cards && item.cards.length > 0 && (
                    <Text style={styles.cardFront} numberOfLines={1}>
                        {dueCards / item.cards.length + ' due'}
                    </Text>
                )}

                <View style={styles.rowActions}>
                    <Button compact mode="contained-tonal" onPress={() => onEditLesson(item.id)}>
                        Edit
                    </Button>
                    <Button
                        compact
                        mode="contained-tonal"
                        textColor="#EF4444"
                        onPress={() => onDeleteLesson(item.id)}
                    >
                        ✕
                    </Button>
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
    },
    levelBadge: {
        alignItems: 'center',
        marginRight: 12,
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
    cardFront: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    cardBack: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    rowActions: {
        flexDirection: 'row',
        gap: 6,
    },
});
