import { JSX } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

interface Props {
    index: number;
    total: number;
    onAbort: () => void;
}

const Header = ({ onAbort, index, total }: Props): JSX.Element => {
    const handleAbort = () => {
        const message =
            'Are you sure you want to abort the current study session? Your progress will not be saved.';

        if (Platform.OS === 'web') {
            if (window.confirm(`Abort session?\n\n${message}`)) {
                onAbort();
            }
            return;
        }

        Alert.alert('Abort Study Session', message, [
            { text: 'Continue Lesson', style: 'cancel' },
            { text: 'Abort session', style: 'destructive', onPress: onAbort },
        ]);
    };

    return (
        <View style={styles.header}>
            <Chip onPress={handleAbort} icon="arrow-left">
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
