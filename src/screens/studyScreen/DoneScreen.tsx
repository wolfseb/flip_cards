import { JSX } from 'react/jsx-runtime';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AppTheme, useAppTheme } from '../../themes';

const DoneScreen = ({ onDone }: { onDone: () => void }): JSX.Element => {
    const theme = useAppTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.doneView}>
            <Text variant="headlineMedium" style={styles.doneTitle}>
                All done!
            </Text>
            <Text variant="bodyLarge" style={styles.doneSub}>
                You reviewed all due cards.
            </Text>
            <Button mode="contained" onPress={onDone} style={styles.doneBtn}>
                Back to Home
            </Button>
        </View>
    );
};

export default DoneScreen;

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
        doneView: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
        },
        doneTitle: {
            fontWeight: '700',
            color: theme.colors.onSurface,
        },
        doneSub: {
            color: theme.colors.onSurfaceVariant,
            marginTop: 8,
            textAlign: 'center',
        },
        doneBtn: {
            marginTop: 28,
            borderRadius: 12,
        },
    });
