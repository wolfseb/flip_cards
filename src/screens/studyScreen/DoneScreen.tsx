import { Pressable, StyleSheet, Text, View } from 'react-native';
import { JSX } from 'react/jsx-runtime';

const DoneScreen = ({ onDone }: { onDone: () => void }): JSX.Element => {
    return (
        <View style={styles.doneView}>
            <Text style={styles.doneTitle}>All done!</Text>
            <Text style={styles.doneSub}>You reviewed all due cards.</Text>
            <Pressable style={styles.doneBtn} onPress={onDone}>
                <Text style={styles.doneBtnText}>Back to Home</Text>
            </Pressable>
        </View>
    );
};

export default DoneScreen;

const styles = StyleSheet.create({
    doneView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    doneTitle: {
        fontSize: 30,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    doneSub: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    doneBtn: {
        marginTop: 28,
        backgroundColor: '#5B8DEF',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 12,
    },
    doneBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
