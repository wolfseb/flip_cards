import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, Card as PaperCard, Text } from 'react-native-paper';

import { Lesson } from '../../types';
import { memo, useMemo } from 'react';
import { AppTheme, getLevelColor, useAppTheme } from '../../themes';
import { isDue } from '../studyScreen/sm2';

const LEVEL_NAMES = ['New', 'Learning 1', 'Learning 2', 'Expert 1', 'Expert 2'];

interface Props {
    lesson: Lesson;
    onEditLesson: (id: string) => void;
    onDeleteLesson: (id: string) => void;
}

const LessonRow = ({ lesson, onEditLesson, onDeleteLesson }: Props) => {
    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const dueCards = useMemo(() => lesson.cards.filter(isDue).length, []);

    const minLevel = useMemo(
        () =>
            lesson.cards
                ? lesson.cards.length > 0
                    ? Math.min(...lesson.cards.map(c => c.level))
                    : 0
                : 0,
        [lesson.cards],
    );

    return (
        <PaperCard style={styles.cardRow} mode="elevated" onPress={() => onEditLesson(lesson.id)}>
            <PaperCard.Content style={styles.content}>
                <View style={styles.levelBadge}>
                    <Avatar.Text
                        size={32}
                        label={`L${minLevel}`}
                        labelStyle={styles.levelBadgeText}
                        style={{ backgroundColor: getLevelColor(theme, minLevel) }}
                    />
                    <Text style={styles.levelBadgeName}>{LEVEL_NAMES[minLevel - 1]}</Text>
                </View>

                <Text style={styles.text} numberOfLines={1}>
                    {lesson.name}
                </Text>

                {lesson.cards && lesson.cards.length > 0 && (
                    <Text style={styles.text} numberOfLines={1}>
                        {dueCards + '/' + lesson.cards.length + ' due'}
                    </Text>
                )}

                <View style={styles.rowActions}>
                    <IconButton
                        icon={'delete'}
                        onPress={() => onDeleteLesson(lesson.id)}
                        iconColor={theme.colors.error}
                    />
                </View>
            </PaperCard.Content>
        </PaperCard>
    );
};

export default memo(LessonRow);

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
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
            color: theme.colors.onSurfaceVariant,
            fontSize: 9,
            fontWeight: '500',
            marginTop: 2,
        },
        text: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.onSurface,
            marginRight: 12,
        },
        rowActions: {
            flexDirection: 'row',
            marginLeft: 8,
        },
    });
