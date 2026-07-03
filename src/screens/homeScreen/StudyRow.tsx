import Slider from '@react-native-community/slider';
import { JSX, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { useCards } from '../../CardsContext';
import { sortCards } from '../../sort';

const MIN_STUDY_COUNT = 1;
const MAX_STUDY_COUNT = 20;

const clamp = (count: number): number =>
    Math.min(Math.max(count, MIN_STUDY_COUNT), MAX_STUDY_COUNT);

interface Props {
    onStudy: () => void;
}

const StudyRow = ({ onStudy }: Props): JSX.Element => {
    const { cards, getDueCards, queueStudyCards } = useCards();

    const defaultStudyCount = clamp(getDueCards().length);
    const [studyCount, setStudyCount] = useState(defaultStudyCount);

    const updateStudyCount = (count: number): void => {
        setStudyCount(clamp(count));
    };

    const handleStudy = () => {
        queueStudyCards(sortCards(cards, 'nextReview', true).slice(0, studyCount));
        onStudy();
    };

    return (
        <View style={styles.studyCountRow}>
            <Slider
                style={styles.slider}
                minimumValue={MIN_STUDY_COUNT}
                maximumValue={Math.min(MAX_STUDY_COUNT, cards.length)}
                step={1}
                value={studyCount}
                onValueChange={updateStudyCount}
                minimumTrackTintColor="#5B8DEF"
                maximumTrackTintColor="#E5E7EB"
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
            <Button mode="contained" onPress={handleStudy} style={styles.studyBtn}>
                Study
            </Button>
        </View>
    );
};

export default StudyRow;

const styles = StyleSheet.create({
    studyCountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 16,
        gap: 12,
    },
    slider: {
        flex: 1,
    },
    studyCountInput: {
        width: 64,
        textAlign: 'center',
    },
    studyBtn: {
        borderRadius: 12,
        justifyContent: 'center',
    },
});
