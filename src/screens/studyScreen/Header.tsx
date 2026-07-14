import { JSX } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { AppTheme, useAppTheme } from '../../themes';

interface Props {
    index: number;
    total: number;
    onAbort: () => void;
}

const Header = ({ onAbort, index, total }: Props): JSX.Element => {
    const theme = useAppTheme();
    const styles = createStyles(theme);

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
            <Chip onPress={handleAbort} icon="arrow-left" style={styles.abortBtn}>
                Abort Lesson
            </Chip>
            <Text variant="bodyMedium" style={styles.progress}>
                {index + 1} / {total}
            </Text>
        </View>
    );
};

export default Header;

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
        },
        abortBtn: {
            backgroundColor: theme.colors.primaryContainer,
        },
        progress: {
            color: theme.colors.onSurfaceVariant,
            fontWeight: '500',
        },
    });
