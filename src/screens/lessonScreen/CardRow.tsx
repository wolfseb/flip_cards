import { StyleSheet, View } from 'react-native';
import { Avatar, Button, IconButton, Card as PaperCard, Text } from 'react-native-paper';

import { Card } from '../../types';

const LEVEL_COLORS = ['#9E9E9E', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'];
const LEVEL_NAMES = ['New', 'Learning 1', 'Learning 2', 'Expert 1', 'Expert 2'];

interface Props {
    item: Card;
    onEditCard: (id: string) => void;
    onDeleteCard: (id: string) => void;
}

const CardRow = ({ item, onEditCard, onDeleteCard }: Props) => {
    return (
        <PaperCard style={styles.cardRow} mode="elevated">
            <PaperCard.Content style={styles.content}>
                <View style={styles.levelBadge}>
                    <Avatar.Text
                        size={32}
                        label={`L${item.level}`}
                        labelStyle={styles.levelBadgeText}
                        style={{ backgroundColor: LEVEL_COLORS[item.level - 1] }}
                    />
                    <Text style={styles.levelBadgeName}>{LEVEL_NAMES[item.level - 1]}</Text>
                </View>

                <View style={styles.cardTexts}>
                    <Text style={styles.cardFront} numberOfLines={1}>
                        {item.front}
                    </Text>
                    <Text style={styles.cardBack} numberOfLines={1}>
                        {item.back}
                    </Text>
                </View>

                <View style={styles.rowActions}>
                    <IconButton icon={'pencil'} onPress={() => onEditCard(item.id)} />
                    <IconButton
                        icon={'delete'}
                        iconColor={'#EF4444'}
                        onPress={() => onDeleteCard(item.id)}
                    />
                </View>
            </PaperCard.Content>
        </PaperCard>
    );
};

export default CardRow;

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
    cardTexts: {
        flex: 1,
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
    },
});
