import React, { useState, useEffect } from 'react';
import { generateEmojiEquator, type EmojiEquatorConfig } from '../../services/geminiService';
import styles from './components/EmojiEquator.module.css';

interface EmojiEquatorGameProps {
    onBack: () => void;
}

export const EmojiEquatorGame: React.FC<EmojiEquatorGameProps> = ({ onBack }) => {
    const [config, setConfig] = useState<EmojiEquatorConfig | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isWon, setIsWon] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadGame = async () => {
        setIsLoading(true);
        setSelectedAnswer(null);
        setIsWon(false);
        try {
            const data = await generateEmojiEquator();
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

    const handleAnswer = (val: number) => {
        if (isWon || !config) return;

        setSelectedAnswer(val);

        if (val === config.correctAnswer) {
            setIsWon(true);
        } else {
            // Shake effect or sound could go here
            setTimeout(() => setSelectedAnswer(null), 800);
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

            {isLoading ? (
                <div style={{ fontSize: '2rem', marginTop: '20%' }}>🧮 Calculator working...</div>
            ) : config ? (
                <>
                    <div className={styles.board}>
                        {config.equations.map((eq, i) => (
                            <div key={i} className={styles.equation}>
                                {eq}
                            </div>
                        ))}
                        <div className={`${styles.equation} ${styles.question}`}>
                            {config.question}
                        </div>
                    </div>

                    <div className={styles.optionsGrid}>
                        {config.options.map((opt, i) => {
                            let btnStyle = styles.optionBtn;
                            if (selectedAnswer === opt) {
                                btnStyle += opt === config.correctAnswer ? ` ${styles.correct}` : ` ${styles.incorrect}`;
                            } else if (isWon && opt === config.correctAnswer) {
                                btnStyle += ` ${styles.correct}`;
                            }

                            return (
                                <button
                                    key={i}
                                    className={btnStyle}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={isWon}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    {isWon && (
                        <div className={styles.explanation}>
                            <h3>🎉 Incredible!</h3>
                            <p>{config.explanation}</p>
                            <button className={styles.nextBtn} onClick={loadGame}>
                                Next Puzzle ➡️
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div>Error loading puzzle.</div>
            )}
        </div>
    );
};
