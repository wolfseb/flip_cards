import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { Settings } from '../types';
import { loadSettings, saveSettings, SETTINGS_DEFAULT } from '../storage';

interface SettingsContextValue {
    settings: Settings;
    persistSettings: (settings: Settings) => () => void;
}

const SettingsContext = createContext<SettingsContextValue>({
    settings: SETTINGS_DEFAULT,
    persistSettings: () => () => {},
});

export const SettingsContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
    const [settings, setSettings] = useState<Settings>(SETTINGS_DEFAULT);

    useEffect(() => {
        loadSettings().then(loaded => {
            setSettings(loaded);
        });
    }, []);

    const persistSettings = (updated: Settings) => (): void => {
        saveSettings(updated).then(() => setSettings(updated));
    };

    return (
        <SettingsContext.Provider value={{ settings, persistSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextValue => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw Error('Not within SettingsContext!');
    }
    return context;
};
