import { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCards } from '../../CardsContext';
import { SORT_MAP, SortKey } from '../../sort';

export const SortButtonRow = (): JSX.Element => {
    const { sortState, sortBy } = useCards();

    const sortIndicator = (sortKey: string): string =>
        sortState.key === sortKey ? (sortState.asc ? '↑ ' : '↓ ') : '';
    return (
        <View style={styles.sortBtnRow}>
            {(Object.keys(SORT_MAP) as SortKey[]).map(sortKey => (
                <Pressable style={styles.sortBtn} onPress={() => sortBy(sortKey)}>
                    <Text style={styles.sortBtnText}>
                        {sortIndicator(sortKey)}
                        {SORT_MAP[sortKey]}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    sortBtnRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 14,
        padding: 16,
        boxShadow: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        gap: 8,
        alignContent: 'space-around',
    },
    sortBtn: {
        backgroundColor: '#ccc',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    sortBtnText: {
        color: '#111',
        fontWeight: '600',
        fontSize: 14,
    },
});
