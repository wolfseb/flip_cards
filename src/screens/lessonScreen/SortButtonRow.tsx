import { JSX, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Button, Menu, Searchbar, IconButton } from 'react-native-paper';

import { useCards } from '../../CardsContext';
import { SORT_MAP, SortKey } from '../../sort';

export const SortButtonRow = (): JSX.Element => {
    const { sortState, sortBy, searchTerm, setSearchTerm } = useCards();

    const [isVisible, setIsVisible] = useState(false);
    const showMenu = () => setIsVisible(true);
    const hideMenu = () => setIsVisible(false);

    useEffect(() => {
        sortBy('front', true);
    }, []);

    return (
        <Card style={styles.sortCard} mode="elevated">
            <View style={styles.sortBtnRow}>
                <Menu
                    visible={isVisible}
                    onDismiss={hideMenu}
                    anchor={
                        <Button
                            mode={'text'}
                            icon={'sort'}
                            onPress={showMenu}
                            contentStyle={styles.dropdownContent}
                            style={styles.dropdownAnchor}
                        >
                            {SORT_MAP[sortState.key]}
                        </Button>
                    }
                    style={styles.menu}
                >
                    {(Object.keys(SORT_MAP) as SortKey[]).map(sortKey => (
                        <Menu.Item
                            key={sortKey}
                            title={SORT_MAP[sortKey]}
                            onPress={() => {
                                sortBy(sortKey, true);
                                hideMenu();
                            }}
                        />
                    ))}
                </Menu>
                <IconButton
                    icon={sortState.asc ? 'chevron-up' : 'chevron-down'}
                    onPress={() => sortBy(sortState.key, !sortState.asc)}
                />
            </View>
            <Card.Content style={styles.content}>
                <Searchbar
                    placeholder="Search cards…"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    style={styles.searchbar}
                    icon="magnify"
                    clearIcon="close"
                />
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    sortCard: {
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 14,
    },
    sortBtnRow: {
        marginLeft: 8,
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    searchbar: {
        flexBasis: '100%',
        elevation: 0,
        marginTop: 0,
    },
    sortButtonLabel: {
        color: '#000',
        fontSize: 16,
    },
    dropdownAnchor: {
        borderRadius: 12,
        justifyContent: 'center',
    },
    dropdownContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    menu: {
        alignItems: 'flex-start',
        marginTop: 8,
        width: '100%',
        maxWidth: 180,
    },
});
