import { Pressable, StyleSheet, Text, View } from 'react-native';
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
        <View style={styles.cardRow}>
            <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLORS[item.level - 1] }]}>
                <Text style={styles.levelBadgeText}>L{item.level}</Text>
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
                <Pressable style={styles.editBtn} onPress={() => onEditCard(item.id)}>
                    <Text style={styles.editBtnText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => onDeleteCard(item.id)}>
                    <Text style={styles.deleteBtnText}>✕</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default CardRow;

const styles = StyleSheet.create({
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        boxShadow: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    levelBadge: {
        width: 44,
        height: 44,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    levelBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    levelBadgeName: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 9,
        fontWeight: '500',
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
        gap: 6,
    },
    editBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 7,
        backgroundColor: '#EEF2FF',
    },
    editBtnText: {
        fontSize: 13,
        color: '#5B8DEF',
        fontWeight: '500',
    },
    deleteBtn: {
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 7,
        backgroundColor: '#FEE2E2',
    },
    deleteBtnText: {
        fontSize: 13,
        color: '#EF4444',
        fontWeight: '500',
    },
});
