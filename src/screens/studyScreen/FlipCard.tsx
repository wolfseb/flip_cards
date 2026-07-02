import React, { JSX, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

interface Props {
    front: string;
    back: string;
    flipped?: boolean;
    onFlip?: (flipped: boolean) => void;
    tintColor?: string;
}

const CardFace = ({
    anim,
    isFront = false,
    tintColor,
    children,
}: {
    anim: Animated.Value;
    isFront?: boolean;
    tintColor?: string;
    children: React.JSX.Element;
}): JSX.Element => {
    const rotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: isFront ? ['0deg', '180deg'] : ['180deg', '360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.face,
                isFront ? styles.front : styles.back,
                tintColor ? { backgroundColor: tintColor } : null,
                { transform: [{ perspective: 1000 }, { rotateY: rotate }] },
            ]}
        >
            <Text style={styles.sideLabel}>{isFront ? 'Front' : 'Back'}</Text>
            <Text style={styles.cardText}>{children}</Text>
            <Text style={styles.bottomLabel}>Tap card to flip</Text>
        </Animated.View>
    );
};

const FlipCard = ({ front, back, flipped: forceFlipped, onFlip, tintColor }: Props): JSX.Element => {
    const [flipped, setFlipped] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;

    const flip = (next: boolean): void => {
        Animated.spring(anim, {
            toValue: next ? 1 : 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();
        setFlipped(next);
        onFlip?.(next);
    };

    useEffect(() => {
        if (forceFlipped && !flipped) {
            flip(true);
        }
    }, [forceFlipped]);

    return (
        <Pressable style={styles.container} onPress={() => flip(!flipped)}>
            <CardFace anim={anim} isFront tintColor={tintColor}>
                <div>{front}</div>
            </CardFace>
            <CardFace anim={anim} tintColor={tintColor}>
                <div>{back}</div>
            </CardFace>
        </Pressable>
    );
};

export default FlipCard;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 240,
        maxWidth: 400,
    },
    face: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backfaceVisibility: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    front: {
        backgroundColor: '#ffffff',
    },
    back: {
        backgroundColor: '#f0f4ff',
    },
    sideLabel: {
        position: 'absolute',
        top: 14,
        left: 18,
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bottomLabel: {
        position: 'absolute',
        bottom: 14,
        fontSize: 11,
        textAlign: 'center',
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardText: {
        fontSize: 22,
        fontWeight: '500',
        color: '#1A1A2E',
        textAlign: 'center',
        lineHeight: 32,
    },
});
