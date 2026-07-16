import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Avatar, IconButton, Card as PaperCard, Text } from 'react-native-paper';

import { Card, Lesson } from '../../types';
import { useCards } from '../../CardsContext';
import { AppTheme, getLevelColor, useAppTheme } from '../../themes';
import { memo, useMemo } from 'react';

const LEVEL_NAMES = ['New', 'Learning 1', 'Learning 2', 'Expert 1', 'Expert 2'];

interface Props {
    card: Card;
    lesson: Lesson;
    onEditCard: (id: string) => void;
}

const CardRow = ({ card, lesson, onEditCard }: Props) => {
    const { persistLesson } = useCards();
    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const onDeleteCard = (id: string): void => {
        const message = 'This card will be permanently removed.';
        const onPersist = () =>
            persistLesson({
                ...lesson,
                cards: lesson.cards.filter(c => c.id !== id),
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
        <PaperCard style={styles.cardRow} mode="elevated">
            <PaperCard.Content style={styles.content}>
                <View style={styles.levelBadge}>
                    <Avatar.Text
                        size={32}
                        label={`L${card.level}`}
                        labelStyle={styles.levelBadgeText}
                        style={{ backgroundColor: getLevelColor(theme, card.level) }}
                    />
                    <Text style={styles.levelBadgeName}>{LEVEL_NAMES[card.level - 1]}</Text>
                </View>

                <View style={styles.cardTexts}>
                    <Text style={styles.cardFront} numberOfLines={1}>
                        {card.front}
                    </Text>
                    <Text style={styles.cardBack} numberOfLines={1}>
                        {card.back}
                    </Text>
                </View>

                <View style={styles.rowActions}>
                    <IconButton icon={'pencil'} onPress={() => onEditCard(card.id)} />
                    <IconButton
                        icon={'delete'}
                        iconColor={theme.colors.error}
                        onPress={() => onDeleteCard(card.id)}
                    />
                </View>
            </PaperCard.Content>
        </PaperCard>
    );
};

export default memo(CardRow);

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
            marginRight: 12,
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
        cardTexts: {
            flex: 1,
        },
        cardFront: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.onSurface,
        },
        cardBack: {
            fontSize: 13,
            color: theme.colors.onSurfaceVariant,
            marginTop: 2,
        },
        rowActions: {
            flexDirection: 'row',
        },
    });
