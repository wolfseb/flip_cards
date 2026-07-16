import { JSX, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { useSettings } from '../settings/SettingsContext';

const SettingsMenu = (): JSX.Element => {
    const { settings, persistSettings } = useSettings();
    const [isVisible, setIsVisible] = useState(false);

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
                onPress={persistSettings({ ...settings, dark: !settings.dark })}
            />
            <Menu.Item
                title={'Study: ' + (settings.inverted ? 'Back → Front' : 'Front → Back')}
                onPress={persistSettings({ ...settings, inverted: !settings.inverted })}
            />
        </Menu>
    );
};

export default SettingsMenu;

const styles = StyleSheet.create({});
