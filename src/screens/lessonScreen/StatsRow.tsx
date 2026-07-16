import { JSX, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

import { useCards } from '../../CardsContext';
import { Lesson } from '../../types';
import { AppTheme, useAppTheme } from '../../themes';
import { isDue } from '../studyScreen/sm2';

interface Props {
    lesson: Lesson;
    onStudy: () => void;
}

const StatsRow = ({ lesson, onStudy }: Props): JSX.Element => {
    const { queueStudyCards } = useCards();
    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const cards = lesson.cards;
    const dueCards = cards.filter(isDue);
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
                    <IconButton
                        icon={'school'}
                        onPress={onStudyDue}
                        iconColor={
                            dueCount > 0 ? theme.colors.primary : theme.colors.onSurfaceVariant
                        }
                        disabled={dueCount === 0}
                    />
                </View>
            </Card.Content>
        </Card>
    );
};

export default StatsRow;

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
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
            backgroundColor: theme.colors.outlineVariant,
        },
        statNumber: {
            fontWeight: '700',
            color: theme.colors.onSurface,
        },
        statLabel: {
            color: theme.colors.onSurfaceVariant,
            marginTop: 2,
        },
        dueHighlight: {
            color: theme.colors.primary,
        },
    });
