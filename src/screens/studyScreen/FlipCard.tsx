import React, { JSX, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const CardFace = ({
    anim,
    isFront = false,
    tintColor,
    showShadow,
    children,
}: {
    anim: Animated.Value;
    isFront?: boolean;
    tintColor?: string;
    showShadow: boolean;
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
                showShadow ? styles.shadow : null,
                tintColor ? { backgroundColor: tintColor } : null,
                { transform: [{ perspective: 1000 }, { rotateY: rotate }] },
            ]}
        >
            <Text style={styles.sideLabel}>{isFront ? 'Front' : 'Back'}</Text>
            {children}
        </Animated.View>
    );
};

interface Props {
    front: string;
    back: string;
    frontComment: string;
    backComment: string;
    flipped?: boolean;
    onFlip?: (flipped: boolean) => void;
    tintColor?: string;
    flippable?: boolean;
}

const FlipCard = ({
    front,
    back,
    frontComment,
    backComment,
    flipped: forceFlipped,
    onFlip,
    tintColor,
    flippable,
}: Props): JSX.Element => {
    const [flipped, setFlipped] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;

    const flip = (next: boolean): void => {
        setIsFlipping(true);
        Animated.spring(anim, {
            toValue: next ? 1 : 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start(() => setIsFlipping(false));
        setFlipped(next);
        onFlip?.(next);
    };

    useEffect(() => {
        if (forceFlipped && !flipped) {
            flip(true);
        }
    }, [forceFlipped]);

    return (
        <Pressable style={styles.container} onPress={flippable ? () => flip(!flipped) : () => {}}>
            <CardFace anim={anim} isFront tintColor={tintColor} showShadow={!isFlipping && false}>
                <>
                    <Text style={styles.cardText}>{front}</Text>
                    <Text style={styles.cardComment}>{frontComment}</Text>
                </>
            </CardFace>
            <CardFace anim={anim} tintColor={tintColor} showShadow={!isFlipping && false}>
                <>
                    <Text style={styles.cardText}>{back}</Text>
                    <Text style={styles.cardComment}>{backComment}</Text>
                </>
            </CardFace>
        </Pressable>
    );
};

export default FlipCard;

const styles = StyleSheet.create({
    container: {
        width: 400,
        maxWidth: '100%',
        height: 180,
    },
    shadow: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
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
    cardText: {
        fontSize: 22,
        fontWeight: '500',
        color: '#1A1A2E',
        textAlign: 'center',
        lineHeight: 32,
    },
    cardComment: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4A4A5E',
        textAlign: 'center',
        lineHeight: 20,
    },
});
