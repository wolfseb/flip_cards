import Slider from '@react-native-community/slider';
import { JSX, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, RadioButton, Switch, Text, TextInput } from 'react-native-paper';

import { useCards } from '../../CardsContext';
import { sortCards } from '../../sort';

const MIN_STUDY_COUNT = 1;
const MAX_STUDY_COUNT = 20;

const clamp = (count: number): number =>
    Math.min(Math.max(count, MIN_STUDY_COUNT), MAX_STUDY_COUNT);

interface Props {
    onStudy: () => void;
}

const StudySettings = ({ onStudy }: Props): JSX.Element => {
    const { cards, getDueCards, queueStudyCards, isInverted, setIsInverted } = useCards();

    const defaultStudyCount = clamp(getDueCards().length);
    const [studyCount, setStudyCount] = useState(defaultStudyCount);

    const updateStudyCount = (count: number): void => {
        setStudyCount(clamp(count));
    };

    const handleStudy = () => {
        const cardsToStudy = sortCards(cards, 'nextReview', true).slice(0, studyCount);
        queueStudyCards(cardsToStudy);
        onStudy();
    };

    return (
        <View style={styles.studyArea}>
            <View style={styles.studySettingsArea}>
                <View style={styles.studyCardsSlider}>
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
                </View>
                <View style={styles.studyCardsSlider}>
                    <Switch value={isInverted} onValueChange={() => setIsInverted(!isInverted)} />
                    <Text>Reverse study direction</Text>
                </View>
            </View>
            <Button mode="contained" onPress={handleStudy} style={styles.studyBtn}>
                Study
            </Button>
        </View>
    );
};

export default StudySettings;

const styles = StyleSheet.create({
    studyArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    studySettingsArea: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 16,
        gap: 16,
    },
    studyCardsSlider: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        gap: 12,
    },
    slider: {
        width: 200,
    },
    studyCountInput: {
        width: 64,
        height: 32,
        textAlign: 'center',
    },
    studyBtn: {
        borderRadius: 12,
        justifyContent: 'center',
        flexBasis: 100,
    },
});
