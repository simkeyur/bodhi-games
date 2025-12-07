import React, { useState, useEffect } from 'react';
import { generateMysteryMatch, type MysteryMatchConfig } from '../../services/geminiService';
import styles from './components/MysteryMatch.module.css';

interface MysteryMatchGameProps {
    onBack: () => void;
}

interface Card {
    uniqueId: string; // Formatting utility for keys
    pairId: string; // To check match
    content: string; // Emoji or Text
    isFlipped: boolean;
    isMatched: boolean;
    type: 'emoji' | 'text';
}

export const MysteryMatchGame: React.FC<MysteryMatchGameProps> = ({ onBack }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isProcessing, setIsProcessing] = useState(false); // Validating match
    const [isWon, setIsWon] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState("Loading...");

    // Sound effects placeholders (can integrate proper audio later)
    const playFlip = () => { };
    const playMatch = () => { };
    const playWin = () => { };

    const loadGame = async () => {
        setIsLoading(true);
        setIsWon(false);
        setFlippedIndices([]);

        try {
            const config = await generateMysteryMatch();
            setTheme(config.theme);

            // Generate card pairs
            const newCards: Card[] = [];
            config.pairs.forEach(pair => {
                // Item 1
                newCards.push({
                    uniqueId: `${pair.id}-1`,
                    pairId: pair.id,
                    content: pair.item1,
                    isFlipped: false,
                    isMatched: false,
                    type: isEmoji(pair.item1) ? 'emoji' : 'text'
                });
                // Item 2
                newCards.push({
                    uniqueId: `${pair.id}-2`,
                    pairId: pair.id,
                    content: pair.item2,
                    isFlipped: false,
                    isMatched: false,
                    type: isEmoji(pair.item2) ? 'emoji' : 'text'
                });
            });

            // Shuffle
            setCards(newCards.sort(() => Math.random() - 0.5));

        } catch (e) {
            console.error(e);
            setTheme("Error");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to check if content is likely emoji (for font sizing)
    const isEmoji = (str: string) => /\p{Emoji}/u.test(str) && str.length < 5;

    useEffect(() => {
        loadGame();
    }, []);

    const handleCardClick = (index: number) => {
        // Prevent clicking if busy, already flipped, or matched
        if (isProcessing || cards[index].isFlipped || cards[index].isMatched) return;

        playFlip();

        // Flip card
        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            checkForMatch(newFlipped[0], newFlipped[1]);
        }
    };

    const checkForMatch = (idx1: number, idx2: number) => {
        setIsProcessing(true);
        const card1 = cards[idx1];
        const card2 = cards[idx2];

        if (card1.pairId === card2.pairId) {
            // Match!
            playMatch();
            setTimeout(() => {
                setCards(prev => prev.map((c, i) =>
                    i === idx1 || i === idx2 ? { ...c, isMatched: true } : c
                ));
                setFlippedIndices([]);
                setIsProcessing(false);
                checkWin();
            }, 500);
        } else {
            // No Match - Flip back
            setTimeout(() => {
                setCards(prev => prev.map((c, i) =>
                    i === idx1 || i === idx2 ? { ...c, isFlipped: false } : c
                ));
                setFlippedIndices([]);
                setIsProcessing(false);
            }, 1000); // 1s delay to see mismatched cards
        }
    };

    const checkWin = () => {
        // Use timeout to allow state update to process
        setTimeout(() => {
            setCards(currentCards => {
                const allMatched = currentCards.every(c => c.isMatched);
                if (allMatched) {
                    playWin();
                    setIsWon(true);
                }
                return currentCards;
            });
        }, 100);
    };

    return (
        <div className={styles.container}>
            {/* Header / Theme */}
            <div className={styles.themeBadge}>
                <span>🎨</span> Theme: {theme}
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {cards.map((card, index) => (
                    <div
                        key={card.uniqueId}
                        className={`${styles.card} ${card.isFlipped ? styles.cardFlipped : ''} ${card.isMatched ? styles.cardMatched : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        {/* Front Face (Question Mark) */}
                        <div className={`${styles.cardFace} ${styles.cardFront}`}>
                            ❓
                        </div>

                        {/* Back Face (Content) */}
                        <div className={`${styles.cardFace} ${styles.cardBack} ${card.type === 'emoji' ? styles.isImage : ''}`}>
                            {card.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Win Overlay */}
            {isWon && (
                <div className={styles.winOverlay}>
                    <h2 style={{ fontSize: '3rem', color: 'gold', margin: 0 }}>MATCHED! 🌟</h2>
                    <p style={{ color: '#white', marginBottom: '2rem' }}>You found all the pairs!</p>
                    <button className={styles.playBtn} onClick={loadGame}>
                        Play Again 🔄
                    </button>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '20px',
                    borderRadius: '15px',
                    color: '#00d2ff'
                }}>
                    Generating {theme !== "Loading..." ? theme : "new"} puzzle... 🪄
                </div>
            )}

            {/* Back Button (Floating or Integrated) */}
            <button
                onClick={onBack}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20
                }}
            >
                ⬅️
            </button>
        </div>
    );
};
