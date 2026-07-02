import { JSX } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCards } from '../../CardsContext';

const StatsRow = (): JSX.Element => {
    const { cards, getDueCards } = useCards();
    const dueCount = getDueCards().length;

    return (
        <View style={styles.statsRow}>
            <View style={styles.statBox}>
                <Text style={styles.statNumber}>{cards.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
                <Text style={[styles.statNumber, dueCount > 0 && styles.dueHighlight]}>
                    {dueCount}
                </Text>
                <Text style={styles.statLabel}>Due today</Text>
            </View>
        </View>
    );
};

export default StatsRow;

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 14,
        paddingVertical: 16,
        boxShadow: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
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
        fontSize: 30,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    statLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    dueHighlight: {
        color: '#5B8DEF',
    },
});
