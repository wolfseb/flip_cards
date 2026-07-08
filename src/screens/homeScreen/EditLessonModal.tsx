import { JSX, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Text, TextInput } from 'react-native-paper';
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
        <Modal
            visible={isVisible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContent}
        >
            <Text variant="titleMedium" style={styles.title}>
                {lesson ? 'Rename Lesson' : 'New Lesson'}
            </Text>
            <TextInput
                mode="outlined"
                label="Lesson name"
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                autoFocus
            />
            <View style={styles.buttonRow}>
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
            </View>
        </Modal>
    );
};

export default EditLessonModal;

const styles = StyleSheet.create({
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
