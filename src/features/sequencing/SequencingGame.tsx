import React from 'react';
import { GridBoard, CommandPalette, SequenceList } from './components/GameComponents';
import { useSequencingGame } from './hooks/useSequencingGame';
import styles from './components/SequencingStyles.module.css';
import { useGameScore } from '../../hooks/useGameScore';

interface SequencingGameProps {
    onBack: () => void;
}

import { generateLevel } from '../../services/geminiService';

export const SequencingGame: React.FC<SequencingGameProps> = () => {
    const {
        gameState,
        ghostPos,
        addCommand,
        removeCommand,
        runSequence,
        resetGame,
        clearSequence,
        loadLevel
    } = useSequencingGame();

    const { saveScore } = useGameScore('sequencing_lvl1');
    const [level, setLevel] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [aiMessage, setAiMessage] = React.useState<string>("");

    React.useEffect(() => {
        if (gameState.isWon) {
            saveScore(100);
        }
    }, [gameState.isWon, saveScore]);

    const handleNextLevel = async () => {
        setIsLoading(true);
        setAiMessage("🤖 Dreaming up a new challenge...");

        try {
            const nextLevel = level + 1;
            const config = await generateLevel(nextLevel);

            loadLevel({
                gridSize: config.gridSize,
                robotPos: config.robotPos,
                goalPos: config.goalPos
            });

            setLevel(nextLevel);
            setAiMessage(config.message || "Good luck!");
        } catch (e) {
            console.error(e);
            setAiMessage("AI hiccup! Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            padding: '1rem',
            paddingTop: 'calc(80px + env(safe-area-inset-top))', /* Account for Navbar */
            alignItems: 'center',
            gap: '1rem',
            color: 'white'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }}>
                {/* Level Indicator */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    background: 'rgba(255,255,255,0.1)',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#ffd700'
                }}>
                    LEVEL {level}
                </div>

                <GridBoard
                    size={gameState.gridSize}
                    robotPos={gameState.robotPos}
                    ghostPos={ghostPos}
                    goalPos={gameState.goalPos}
                />
            </div>

            {/* AI Loading State */}
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.85)',
                    padding: '2rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    zIndex: 100,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>🤖</div>
                    <p style={{ marginTop: '1rem', color: '#00d2ff' }}>{aiMessage}</p>
                </div>
            )}

            {gameState.isWon && !isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.9)',
                    padding: '2rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    zIndex: 100,
                    border: '4px solid gold'
                }}>
                    <h2 style={{ fontSize: '3rem', color: 'gold' }}>YOU WON! 🌟</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{aiMessage || "Great job programming!"}</p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            onClick={clearSequence}
                            className={styles.playBtn}
                            style={{ background: '#444' }}
                        >
                            Replay
                        </button>
                        <button
                            onClick={handleNextLevel}
                            className={styles.playBtn}
                            style={{
                                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                color: 'black',
                                fontWeight: 'bold',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
                            }}
                        >
                            Next Level ⏩
                        </button>
                    </div>
                </div>
            )}

            <div style={{
                width: '100%',
                maxWidth: '800px',
                background: 'rgba(255,255,255,0.05)',
                padding: '1rem',
                borderRadius: '20px'
            }}>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <SequenceList
                        sequence={gameState.sequence}
                        onRemove={removeCommand}
                        activeIndex={gameState.currentStepIndex}
                    />
                    <div className={styles.controls}>
                        {!gameState.isPlaying ? (
                            <button className={styles.playBtn} onClick={runSequence} disabled={gameState.sequence.length === 0}>
                                GO ▶
                            </button>
                        ) : (
                            <button className={styles.resetBtn} onClick={resetGame}>
                                ⏹
                            </button>
                        )}
                    </div>
                </div>

                <CommandPalette onAdd={addCommand} />
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};
