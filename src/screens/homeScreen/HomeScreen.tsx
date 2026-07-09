import { JSX, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import { Appbar, Button, FAB, Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCards } from '../../CardsContext';
import LessonRow from './LessonRow';
import StudyModal from './StudyModal';
import EditLessonModal from './EditLessonModal';

interface Props {
    onStudy: () => void;
    onEditLesson: (id: string) => void;
}

const HomeScreen = ({ onStudy, onEditLesson }: Props): JSX.Element => {
    const { lessons, persist } = useCards();
    const insets = useSafeAreaInsets();

    const [isStudyModalVisible, setIsStudyModalVisible] = useState(false);
    const showStudyModal = () => setIsStudyModalVisible(true);
    const hideStudyModal = () => setIsStudyModalVisible(false);

    const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
    const showLessonModal = () => setIsLessonModalVisible(true);
    const hideLessonModal = () => setIsLessonModalVisible(false);

    const onDeleteLesson = (id: string): void => {
        const message = 'This card will be permanently removed.';
        const onPersist = () => persist(lessons.filter(l => l.id !== id));

        if (Platform.OS === 'web') {
            if (window.confirm(`Delete card\n\n${message}`)) {
                onPersist();
            }
            return;
        }

        Alert.alert('Delete card', message, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: onPersist,
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.Content title={'FlipCards'} />
            </Appbar.Header>

            <Button mode="contained" onPress={showStudyModal} style={styles.studyBtn}>
                Study
            </Button>

            {lessons.length === 0 ? (
                <View style={styles.empty}>
                    <Text variant="titleMedium" style={styles.emptyTitle}>
                        No lessons yet
                    </Text>
                    <Text variant="bodyMedium" style={styles.emptyHint}>
                        Tap "+ Add" to create your first lesson.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={lessons}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <LessonRow
                            item={item}
                            onEditLesson={onEditLesson}
                            onDeleteLesson={onDeleteLesson}
                        />
                    )}
                />
            )}
            {lessons.length > 0 && (
                <StudyModal
                    visible={isStudyModalVisible}
                    hideModal={hideStudyModal}
                    onStudy={onStudy}
                />
            )}
            <FAB
                icon="plus"
                style={{
                    position: 'absolute',
                    bottom: insets.bottom,
                    right: insets.right,
                    margin: 16,
                }}
                onPress={showLessonModal}
            />
            <EditLessonModal isVisible={isLessonModalVisible} hideModal={hideLessonModal} />
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    studyBtn: {
        marginTop: 16,
        marginHorizontal: 16,
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyTitle: {
        color: '#374151',
    },
    emptyHint: {
        color: '#9CA3AF',
        marginTop: 6,
        textAlign: 'center',
    },
    list: {
        padding: 20,
        paddingBottom: 40,
    },
});
