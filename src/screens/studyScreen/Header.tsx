import { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

interface Props {
    index: number;
    total: number;
    handleDone: () => void;
}

const Header = ({ handleDone, index, total }: Props): JSX.Element => {
    return (
        <View style={styles.header}>
            <Chip onPress={handleDone} icon="arrow-left">
                Abort Lesson
            </Chip>
            <Text variant="bodyMedium" style={styles.progress}>
                {index + 1} / {total}
            </Text>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    progress: {
        color: '#6B7280',
        fontWeight: '500',
    },
});
