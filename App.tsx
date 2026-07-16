import { JSX, useCallback, useEffect, useState } from 'react';
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

    const goHome = useCallback(() => setScreen({ name: 'home' }), []);
    const goStudy = useCallback(() => setScreen({ name: 'study' }), []);
    const goEditLesson = useCallback(
        (lessonId: string) => setScreen({ name: 'lesson', lessonId }),
        [],
    );

    const goReturnToLesson = useCallback(() => {
        if (lessonId) setScreen({ name: 'lesson', lessonId });
    }, [lessonId]);
    const goAddCard = useCallback(() => {
        if (lessonId) setScreen({ name: 'edit', lessonId });
    }, [lessonId]);
    const goEditCard = useCallback(
        (cardId: string) => {
            if (lessonId) setScreen({ name: 'edit', lessonId, cardId });
        },
        [lessonId],
    );

    let content;
    if (screen.name === 'study') {
        content = <StudyScreen onDone={goHome} />;
    } else if (screen.name === 'edit' && lesson) {
        content = (
            <EditScreen
                screen={screen}
                lesson={lesson}
                card={getCards(screen.lessonId).find(c => c.id === screen.cardId)}
                onReturn={goReturnToLesson}
            />
        );
    } else if (screen.name === 'lesson' && lesson) {
        content = (
            <LessonScreen
                screen={screen}
                currentLesson={lesson}
                onStudy={goStudy}
                onAddCard={goAddCard}
                onEditCard={goEditCard}
                onReturn={goHome}
            />
        );
    } else {
        content = <HomeScreen onStudy={goStudy} onEditLesson={goEditLesson} />;
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
