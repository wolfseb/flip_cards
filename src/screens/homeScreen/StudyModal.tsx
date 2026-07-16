import Slider from '@react-native-community/slider';
import { JSX, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Modal, Switch, Text, TextInput } from 'react-native-paper';
import { useCards } from '../../CardsContext';
import SelectLessonMenu from './SelectLessonMenu';
import { Lesson } from '../../types';
import { sortCards } from '../../sort';
import { useSettings } from '../../settings/SettingsContext';
import { AppTheme, useAppTheme } from '../../themes';
import { isDue } from '../studyScreen/sm2';

const MIN_STUDY_COUNT = 1;
const MAX_STUDY_COUNT = 40;

const clamp = (count: number): number =>
    Math.min(Math.max(count, MIN_STUDY_COUNT), MAX_STUDY_COUNT);

interface Props {
    visible: boolean;
    hideModal: () => void;
    onStudy: () => void;
}

const StudyModal = ({ visible, hideModal, onStudy }: Props): JSX.Element => {
    const { settings, persistSettings } = useSettings();
    const { lessons, queueStudyCards } = useCards();
    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>(undefined);

    const [studyCount, setStudyCount] = useState(1);
    const updateStudyCount = (count: number): void => {
        setStudyCount(clamp(count));
    };
    const onSelectLesson = (lesson: Lesson): void => {
        setSelectedLesson(lesson);
        updateStudyCount(lesson.cards.filter(isDue).length);
    };

    useEffect(() => {
        if (lessons.length === 0) return;
        onSelectLesson(lessons[0]);
    }, []);

    const handleStudy = (): void => {
        if (!selectedLesson) return;

        const cardsToStudy = sortCards(selectedLesson.cards, 'nextReview', true).slice(
            0,
            studyCount,
        );
        queueStudyCards(cardsToStudy);
        onStudy();
    };

    return (
        <Dialog visible={visible} onDismiss={hideModal}>
            <Dialog.Title>Study</Dialog.Title>
            <Dialog.Content>
                <SelectLessonMenu
                    lessons={lessons}
                    selectedLesson={selectedLesson}
                    setSelectedLesson={onSelectLesson}
                />
                <View style={styles.sliderRow}>
                    <Slider
                        style={styles.slider}
                        minimumValue={MIN_STUDY_COUNT}
                        maximumValue={Math.min(
                            MAX_STUDY_COUNT,
                            selectedLesson?.cards?.length ?? MIN_STUDY_COUNT,
                        )}
                        step={1}
                        value={studyCount}
                        onValueChange={updateStudyCount}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.secondary}
                        thumbSize={20}
                        thumbTintColor={theme.colors.primary}
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
                    <Text>Cards</Text>
                </View>
                <View style={styles.switchRow}>
                    <Switch
                        value={settings.inverted}
                        onValueChange={persistSettings({
                            ...settings,
                            inverted: !settings.inverted,
                        })}
                    />
                    <Text style={styles.switchLabel}>Inverted (answer is front side)</Text>
                </View>
            </Dialog.Content>
            <Dialog.Actions style={styles.btnRow}>
                <Button mode="outlined" onPress={hideModal} style={styles.cancelBtn}>
                    Cancel
                </Button>
                <Button mode="contained" onPress={handleStudy} style={styles.studyBtn}>
                    Start
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};

export default StudyModal;

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
        modalContent: {
            backgroundColor: theme.colors.elevation.level3,
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
            gap: 4,
            marginTop: 8,
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
            marginTop: 8,
        },
        switchLabel: {
            flexShrink: 1,
        },
        btnRow: {
            flexDirection: 'row',
            alignItems: 'stretch',
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
