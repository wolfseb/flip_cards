import { JSX, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { loadSettings, saveSettings } from '../storage';
import { Settings } from '../types';

const SettingsMenu = (): JSX.Element => {
    const [isVisible, setIsVisible] = useState(false);

    const [settings, setSettings] = useState<Settings>({
        dark: false,
        language: 'en',
        inverted: false,
    });

    useEffect(() => {
        loadSettings().then(loaded => {
            setSettings(loaded);
        });
    }, []);

    const changeSettings = (updated: Settings) => (): void => {
        saveSettings(updated).then(() => setSettings(updated));
    };

    return (
        <Menu
            visible={isVisible}
            onDismiss={() => setIsVisible(false)}
            anchor={<Appbar.Action icon={'dots-vertical'} onPress={() => setIsVisible(true)} />}
        >
            <Menu.Item title={'Language: ' + settings.language} onPress={() => {}} />
            <Menu.Item
                title={'Theme'}
                trailingIcon={settings.dark ? 'weather-night' : 'weather-sunny'}
                onPress={changeSettings({ ...settings, dark: !settings.dark })}
            />
            <Menu.Item
                title={'Study: ' + (settings.inverted ? 'Back? → Front' : 'Front? → Back')}
                onPress={changeSettings({ ...settings, inverted: !settings.inverted })}
            />
        </Menu>
    );
};

export default SettingsMenu;

const styles = StyleSheet.create({});
