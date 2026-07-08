import { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { useCards } from '../../CardsContext';
import { Lesson } from '../../types';

interface Props {
    lesson: Lesson;
}

const StatsRow = ({ lesson }: Props): JSX.Element => {
    const { getCards, getDueCards } = useCards();
    const dueCount = getDueCards(lesson.id).length;
    const cards = getCards(lesson.id);

    return (
        <Card style={styles.statsRow} mode="elevated">
            <Card.Content style={styles.content}>
                <View style={styles.statBox}>
                    <Text variant="displaySmall" style={styles.statNumber}>
                        {cards.length}
                    </Text>
                    <Text variant="labelMedium" style={styles.statLabel}>
                        Total
                    </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Text
                        variant="displaySmall"
                        style={[styles.statNumber, dueCount > 0 && styles.dueHighlight]}
                    >
                        {dueCount}
                    </Text>
                    <Text variant="labelMedium" style={styles.statLabel}>
                        Due today
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

export default StatsRow;

const styles = StyleSheet.create({
    statsRow: {
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 14,
    },
    content: {
        flexDirection: 'row',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
    },
    statNumber: {
        fontWeight: '700',
        color: '#1A1A2E',
    },
    statLabel: {
        color: '#6B7280',
        marginTop: 2,
    },
    dueHighlight: {
        color: '#5B8DEF',
    },
});
