import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Screen } from './src/types';
import { CardsContextProvider, useCards } from './src/CardsContext';
import HomeScreen from './src/screens/homeScreen/HomeScreen';
import StudyScreen from './src/screens/studyScreen/StudyScreen';
import EditScreen from './src/screens/EditScreen';
import LessonScreen from './src/screens/lessonScreen/LessonScreen';
import { SettingsContextProvider, useSettings } from './src/settings/SettingsContext';
import { darkTheme, lightTheme } from './src/themes';

SplashScreen.preventAutoHideAsync();

const AppContent = (): JSX.Element => {
    const { settings } = useSettings();
    const { lessons } = useCards();
    const [screen, setScreen] = useState<Screen>({ name: 'home' });
    const [origin, setOrigin] = useState<Screen | undefined>();

    const lessonId =
        screen.name === 'lesson' || screen.name === 'edit' ? screen.lessonId : undefined;
    const lesson = useMemo(
        () => (lessonId ? lessons.find(l => l.id === lessonId) : undefined),
        [lessons, lessonId],
    );

    const lessonNotfound = lessonId && !lesson;

    useEffect(() => {
        if (lessonNotfound) {
            setScreen({ name: 'home' });
        }
    }, [lessonNotfound]);

    const onStudy = () => {
        setOrigin(screen);
        setScreen({ name: 'study' });
    };
    const onDone = () => {
        setScreen(origin ?? { name: 'home' });
        setOrigin(undefined);
    };

    let content;
    if (screen.name === 'study') {
        content = <StudyScreen onDone={onDone} />;
    } else if (screen.name === 'edit' && lesson) {
        content = (
            <EditScreen
                screen={screen}
                lesson={lesson}
                card={lesson.cards.find(c => c.id === screen.cardId)}
                onReturn={() => setScreen({ name: 'lesson', lessonId: screen.lessonId })}
            />
        );
    } else if (screen.name === 'lesson' && lesson) {
        content = (
            <LessonScreen
                screen={screen}
                lesson={lesson}
                onStudy={onStudy}
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
                onStudy={onStudy}
                onEditLesson={(id: string) => setScreen({ name: 'lesson', lessonId: id })}
            />
        );
    }

    return (
        <SafeAreaProvider>
            <PaperProvider theme={settings.dark ? darkTheme : lightTheme}>{content}</PaperProvider>
        </SafeAreaProvider>
    );
};

const App = (): JSX.Element | null => {
    const [fontsLoaded] = useFonts({
        MaterialDesignIcons: require('@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SettingsContextProvider>
            <CardsContextProvider>
                <AppContent />
            </CardsContextProvider>
        </SettingsContextProvider>
    );
};

export default App;
