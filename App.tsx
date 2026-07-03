import { JSX, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { Card, Screen, StudyCard } from './src/types';
import { CardsContextProvider, useCards } from './src/CardsContext';
import HomeScreen from './src/screens/homeScreen/HomeScreen';
import StudyScreen from './src/screens/studyScreen/StudyScreen';
import EditScreen from './src/screens/EditScreen';
import { shuffleCards, toStudyCard } from './src/screens/studyScreen/sm2';

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#5B8DEF',
        background: '#F5F6FA',
    },
};

const AppContent = (): JSX.Element => {
    const { cards } = useCards();
    const [screen, setScreen] = useState<Screen>({ name: 'home' });

    let content;
    if (screen.name === 'study') {
        content = <StudyScreen onDone={() => setScreen({ name: 'home' })} />;
    } else if (screen.name === 'edit') {
        content = (
            <EditScreen
                screen={screen}
                card={cards.find(c => c.id === screen.cardId)}
                onReturn={() => setScreen({ name: 'home' })}
            />
        );
    } else {
        content = (
            <HomeScreen
                onStudy={() => setScreen({ name: 'study' })}
                onAddCard={() => setScreen({ name: 'edit' })}
                onEditCard={id => setScreen({ name: 'edit', cardId: id })}
            />
        );
    }

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>{content}</PaperProvider>
        </SafeAreaProvider>
    );
};

const App = (): JSX.Element => {
    return (
        <CardsContextProvider>
            <AppContent />
        </CardsContextProvider>
    );
};

export default App;
