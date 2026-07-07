import Slider from '@react-native-community/slider';
import { JSX, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Switch, Text, TextInput } from 'react-native-paper';
import { useCards } from '../../CardsContext';

const MIN_STUDY_COUNT = 1;
const MAX_STUDY_COUNT = 20;

const clamp = (count: number): number =>
    Math.min(Math.max(count, MIN_STUDY_COUNT), MAX_STUDY_COUNT);

interface Props {
    visible: boolean;
    hideModal: () => void;
    handleStudy: () => void;
}

const StudyModal = ({ visible, hideModal, handleStudy }: Props): JSX.Element => {
    const { cards, getDueCards, isInverted, setIsInverted, queueStudyCards } = useCards();

    const defaultStudyCount = clamp(getDueCards().length);
    const [studyCount, setStudyCount] = useState(defaultStudyCount);

    const updateStudyCount = (count: number): void => {
        setStudyCount(clamp(count));
    };

    return (
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContent}>
            <View style={styles.studySettingsArea}>
                <View style={styles.sliderRow}>
                    <Slider
                        style={styles.slider}
                        minimumValue={MIN_STUDY_COUNT}
                        maximumValue={Math.min(MAX_STUDY_COUNT, cards.length)}
                        step={1}
                        value={studyCount}
                        onValueChange={updateStudyCount}
                        minimumTrackTintColor="#5B8DEF"
                        maximumTrackTintColor="#E5E7EB"
                        thumbSize={20}
                        thumbTintColor="#5B8DEF"
                    />
                    <TextInput
                        mode="outlined"
                        dense
                        style={styles.studyCountInput}
                        keyboardType="number-pad"
                        value={studyCount.toString()}
                        onChangeText={c => setStudyCount(Number(c))}
                        onEndEditing={() => updateStudyCount(Number(studyCount) || MIN_STUDY_COUNT)}
                    />
                </View>
                <View style={styles.switchRow}>
                    <Switch value={isInverted} onValueChange={() => setIsInverted(!isInverted)} />
                    <Text style={styles.switchLabel}>Inverted (answer is front side)</Text>
                </View>
                <View style={styles.buttonRow}>
                    <Button mode="outlined" onPress={hideModal} style={styles.cancelBtn}>
                        Cancel
                    </Button>
                    <Button mode="contained" onPress={handleStudy} style={styles.studyBtn}>
                        Start
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

export default StudyModal;

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 20,
        maxWidth: 420,
        alignSelf: 'center',
        width: '100%',
    },
    studyArea: {
        marginTop: 16,
        marginHorizontal: 20,
    },
    studySettingsArea: {
        gap: 20,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    slider: {
        flex: 1,
    },
    studyCountInput: {
        width: 64,
        height: 40,
        textAlign: 'center',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    switchLabel: {
        flexShrink: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cancelBtn: {
        borderRadius: 12,
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    studyBtn: {
        borderRadius: 12,
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
});
