import FontAwesomeFreeSolid from '@react-native-vector-icons/fontawesome-free-solid';
import { JSX, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Chip, Searchbar } from 'react-native-paper';

import { useCards } from '../../CardsContext';
import { SORT_MAP, SortKey } from '../../sort';

export const SortButtonRow = (): JSX.Element => {
    const { sortState, sortBy, searchTerm, setSearchTerm } = useCards();

    const sortChevron = useCallback(
        (sortKey: SortKey) =>
            sortState.key === sortKey
                ? () => (
                      <FontAwesomeFreeSolid
                          name={sortState.asc ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color={'#888'}
                      />
                  )
                : undefined,
        [sortState.key, sortState.asc],
    );

    return (
        <Card style={styles.sortBtnRow} mode="elevated">
            <Card.Content style={styles.content}>
                {(Object.keys(SORT_MAP) as SortKey[]).map(sortKey => (
                    <Chip
                        key={sortKey}
                        selected={sortState.key === sortKey}
                        onPress={() => sortBy(sortKey)}
                        icon={sortChevron(sortKey)}
                    >
                        {SORT_MAP[sortKey]}
                    </Chip>
                ))}
            </Card.Content>
            <Card.Content style={styles.content}>
                <Searchbar
                    placeholder="Search cards…"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    style={styles.searchbar}
                    icon={({ size, color }) => (
                        <FontAwesomeFreeSolid name="magnifying-glass" size={size} color={color} />
                    )}
                    clearIcon={({ size, color }) => (
                        <FontAwesomeFreeSolid name="xmark" size={size} color={color} />
                    )}
                />
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    sortBtnRow: {
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 14,
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    searchbar: {
        flexBasis: '100%',
        elevation: 0,
        marginTop: 12,
    },
});
