import { JSX, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { Screen } from './src/types';
import { CardsContextProvider, useCards } from './src/CardsContext';
import HomeScreen from './src/screens/homeScreen/HomeScreen';
import StudyScreen from './src/screens/studyScreen/StudyScreen';
import EditScreen from './src/screens/EditScreen';
import LessonScreen from './src/screens/lessonScreen/LessonScreen';
import { SettingsContextProvider, useSettings } from './src/settings/SettingsContext';
import { darkTheme, lightTheme } from './src/themes';

const AppContent = (): JSX.Element => {
    const { lessons, getCards } = useCards();
    const { settings } = useSettings();
    const [screen, setScreen] = useState<Screen>({ name: 'home' });

    const lessonId =
        screen.name === 'lesson' || screen.name === 'edit' ? screen.lessonId : undefined;
    const lesson = lessonId ? lessons.find(l => l.id === lessonId) : undefined;
    const isMissingLesson = lessonId !== undefined && !lesson;

    useEffect(() => {
        if (isMissingLesson) setScreen({ name: 'home' });
    }, [isMissingLesson]);

    let content;
    if (screen.name === 'study') {
        content = <StudyScreen onDone={() => setScreen({ name: 'home' })} />;
    } else if (screen.name === 'edit' && lesson) {
        content = (
            <EditScreen
                screen={screen}
                lesson={lesson}
                card={getCards(screen.lessonId).find(c => c.id === screen.cardId)}
                onReturn={() => setScreen({ name: 'lesson', lessonId: screen.lessonId })}
            />
        );
    } else if (screen.name === 'lesson' && lesson) {
        content = (
            <LessonScreen
                screen={screen}
                currentLesson={lesson}
                onStudy={() => setScreen({ name: 'study' })}
                onAddCard={() => setScreen({ name: 'edit', lessonId: screen.lessonId })}
                onEditCard={(cardId: string) =>
                    setScreen({ name: 'edit', lessonId: screen.lessonId, cardId })
                }
                onReturn={() => setScreen({ name: 'home' })}
            />
        );
    } else {
        content = (
            <HomeScreen
                onStudy={() => setScreen({ name: 'study' })}
                onEditLesson={id => setScreen({ name: 'lesson', lessonId: id })}
            />
        );
    }

    return (
        <SafeAreaProvider>
            <PaperProvider theme={settings.dark ? darkTheme : lightTheme}>{content}</PaperProvider>
        </SafeAreaProvider>
    );
};

const App = (): JSX.Element => {
    return (
        <SettingsContextProvider>
            <CardsContextProvider>
                <AppContent />
            </CardsContextProvider>
        </SettingsContextProvider>
    );
};

export default App;
