import React, { useState, useEffect } from 'react';
import { generateOddOneOut, type OddOneOutConfig } from '../../services/geminiService';
import styles from './components/OddOneOut.module.css';

interface OddOneOutGameProps {
    onBack: () => void;
}

export const OddOneOutGame: React.FC<OddOneOutGameProps> = ({ onBack }) => {
    const [config, setConfig] = useState<OddOneOutConfig | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isWon, setIsWon] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadGame = async () => {
        setIsLoading(true);
        setSelectedId(null);
        setIsWon(false);
        try {
            const data = await generateOddOneOut();
            // Shuffle items so outlier isn't always last
            data.items = data.items.sort(() => Math.random() - 0.5);
            setConfig(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadGame();
    }, []);

    const handleSelect = (id: string, isOutlier: boolean) => {
        if (isWon) return; // Game over

        setSelectedId(id);

        if (isOutlier) {
            // Correct!
            setIsWon(true);
        } else {
            // Incorrect - reset selection after brief shake
            setTimeout(() => {
                setSelectedId(null);
            }, 600);
        }
    };

    return (
        <div className={styles.container}>
            {/* Back Button */}
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

            <h1 className={styles.title}>Which one is different?</h1>

            {isLoading && <div>🤔 Thinking up a puzzle...</div>}

            {!isLoading && config && (
                <>
                    <div className={styles.grid}>
                        {config.items.map(item => {
                            const isSelected = selectedId === item.id;
                            // Visual state: 
                            // If game won, highlight correct answer.
                            // If current selection is wrong, highlight red.
                            let statusClass = '';
                            if (isWon && item.isOutlier) statusClass = styles.correct;
                            if (isSelected && !item.isOutlier) statusClass = styles.incorrect;

                            return (
                                <div
                                    key={item.id}
                                    className={`${styles.optionCard} ${statusClass}`}
                                    onClick={() => handleSelect(item.id, item.isOutlier)}
                                >
                                    {item.content}
                                </div>
                            );
                        })}
                    </div>

                    {isWon && (
                        <div className={styles.feedbackOverlay}>
                            <p className={styles.feedbackText}>
                                ✅ <strong>Correct!</strong> <br />
                                {config.explanation}
                            </p>
                            <button className={styles.playBtn} onClick={loadGame}>
                                Next Puzzle ➡️
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
