import { JSX, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, Dialog, TextInput } from 'react-native-paper';
import { useCards } from '../../CardsContext';
import { Lesson } from '../../types';

interface Props {
    lesson?: Lesson;
    isVisible: boolean;
    hideModal: () => void;
    onSave?: (name: string) => void;
}

const EditLessonModal = ({ lesson, isVisible, hideModal, onSave }: Props): JSX.Element => {
    const { lessons, persist, persistLesson } = useCards();
    const [name, setName] = useState(lesson?.name ?? '');

    const handleSave = (): void => {
        const trimmed = name.trim();
        if (!trimmed) {
            return;
        }
        if (lesson) {
            persistLesson({ ...lesson, name: trimmed });
        } else {
            const newLesson: Lesson = {
                id: Date.now().toString(),
                name,
                cards: [],
            };
            persist([...lessons, newLesson]);
        }
        onSave?.(trimmed);
        hideModal();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none"
        >
            <Dialog visible={isVisible} onDismiss={hideModal} style={styles.dialog}>
                <Dialog.Title>{lesson ? 'Rename Lesson' : 'New Lesson'}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        mode="outlined"
                        label="Lesson name"
                        style={styles.nameInput}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button mode="outlined" onPress={hideModal} style={styles.btn}>
                        Cancel
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        disabled={!name.trim()}
                        style={styles.btn}
                    >
                        Save
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </KeyboardAvoidingView>
    );
};

export default EditLessonModal;

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: '#fff',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 20,
        maxWidth: 420,
        alignSelf: 'center',
        width: '100%',
        gap: 20,
    },
    title: {
        color: '#1A1A2E',
    },
    nameInput: {
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 8,
    },
    btn: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
    },
});
