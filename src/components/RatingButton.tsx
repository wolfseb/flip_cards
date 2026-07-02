import { JSX } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { HandleRate, Quality } from './rating.types';

const QualityProps: Record<Quality, { text: string; color: string }> = {
    0: { text: 'Again', color: '#EF4444' },
    1: { text: 'Very Hard', color: '#EF6434' },
    2: { text: 'Hard', color: '#F59E0B' },
    3: { text: 'Ok', color: '#F5DE02' },
    4: { text: 'Good', color: '#10B981' },
    5: { text: 'Easy', color: '#5B8DEF' },
};

const RatingButton = ({
    quality,
    handleRate,
}: {
    quality: Quality;
    handleRate: HandleRate;
}): JSX.Element => {
    return (
        <Pressable
            style={[styles.ratingBtn, { backgroundColor: QualityProps[quality].color }]}
            onPress={() => handleRate(quality)}
        >
            <Text style={styles.ratingBtnText}>{QualityProps[quality].text}</Text>
        </Pressable>
    );
};

export default RatingButton;

const styles = StyleSheet.create({
    ratingBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 10,
        alignItems: 'center',
    },
    ratingBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
