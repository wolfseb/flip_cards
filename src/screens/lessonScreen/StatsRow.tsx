import { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

import { useCards } from '../../CardsContext';
import { Lesson } from '../../types';

interface Props {
    lesson: Lesson;
    onStudy: () => void;
}

const StatsRow = ({ lesson, onStudy }: Props): JSX.Element => {
    const { getCards, getDueCards, queueStudyCards } = useCards();
    const cards = getCards(lesson.id);
    const dueCards = getDueCards(lesson.id);
    const dueCount = dueCards.length;

    const onStudyAll = () => {
        queueStudyCards(cards);
        onStudy();
    };
    const onStudyDue = () => {
        queueStudyCards(dueCards);
        onStudy();
    };

    return (
        <Card style={styles.statsRow} mode="elevated">
            <Card.Content style={styles.content}>
                <View style={styles.statBox}>
                    <View style={styles.statBoxText}>
                        <Text variant="displaySmall" style={styles.statNumber}>
                            {cards.length}
                        </Text>
                        <Text variant="labelMedium" style={styles.statLabel}>
                            Total
                        </Text>
                    </View>
                    <IconButton icon={'school'} onPress={onStudyAll} />
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <View style={styles.statBoxText}>
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
                    <IconButton icon={'school'} onPress={onStudyDue} iconColor="#5B8DEF" />
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
        justifyContent: 'center',
        flexDirection: 'row',
    },
    statBoxText: {
        flexDirection: 'column',
        justifyContent: 'center',
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
