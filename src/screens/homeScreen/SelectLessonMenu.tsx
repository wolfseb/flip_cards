import { JSX, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { Lesson } from '../../types';

interface Props {
    lessons: Lesson[];
    selectedLesson: Lesson | undefined;
    setSelectedLesson: (lesson: Lesson) => void;
}

const SelectLessonMenu = ({ lessons, selectedLesson, setSelectedLesson }: Props): JSX.Element => {
    const [isVisible, setIsVisible] = useState(false);
    const showMenu = () => setIsVisible(true);
    const hideMenu = () => setIsVisible(false);

    return (
        <View>
            <Text style={styles.dropdownLabel}>Lesson</Text>
            <Menu
                visible={isVisible}
                onDismiss={hideMenu}
                anchor={
                    <Button
                        mode="outlined"
                        onPress={showMenu}
                        icon="menu-down"
                        contentStyle={styles.dropdownContent}
                        style={styles.dropdownAnchor}
                    >
                        {selectedLesson?.name ?? 'Select lesson'}
                    </Button>
                }
                style={styles.menu}
            >
                {lessons.map(lesson => (
                    <Menu.Item
                        key={lesson.id}
                        title={lesson.name}
                        onPress={() => {
                            setSelectedLesson(lesson);
                            hideMenu();
                        }}
                    />
                ))}
            </Menu>
        </View>
    );
};

export default SelectLessonMenu;

const styles = StyleSheet.create({
    dropdownLabel: {
        marginBottom: 4,
        color: '#6B7280',
    },
    dropdownAnchor: {
        borderRadius: 12,
        justifyContent: 'center',
    },
    dropdownContent: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    menu: {
        alignItems: 'flex-end',
        width: '100%',
        maxWidth: 372,
    },
});
