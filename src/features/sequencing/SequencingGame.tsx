import React, { useEffect } from 'react';
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
    const [level, setLevel] = React.useState(() => {
        const saved = localStorage.getItem('robot_game_level');
        return saved ? parseInt(saved, 10) : 1;
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [aiMessage, setAiMessage] = React.useState<string>("");

    React.useEffect(() => {
        if (gameState.isWon) {
            saveScore(100);
        }
    }, [gameState.isWon, saveScore]);

    React.useEffect(() => {
        localStorage.setItem('robot_game_level', level.toString());
    }, [level]);

    useEffect(() => {
        // Load initial level if > 1
        if (level > 1) {
            changeLevel(level);
        }
    }, []); // Run once on mount

    const changeLevel = async (newLevel: number) => {
        if (newLevel < 1) return;

        setIsLoading(true);
        setAiMessage(newLevel > level ? "🤖 Dreaming up a new challenge..." : "⏪ Rewinding time...");

        try {
            const config = await generateLevel(newLevel);

            loadLevel({
                gridSize: config.gridSize,
                robotPos: config.robotPos,
                goalPos: config.goalPos,
                obstacles: config.obstacles,
                isAiGenerated: config.isAiGenerated
            });

            setLevel(newLevel);
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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#ffd700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        {level > 1 && (
                            <button
                                onClick={() => changeLevel(level - 1)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    padding: '0 5px'
                                }}
                                title="Previous Level"
                            >
                                ◀
                            </button>
                        )}
                        LEVEL {level}
                        {gameState.isAiGenerated !== undefined && (
                            <div style={{
                                background: gameState.isAiGenerated ? 'rgba(100, 200, 255, 0.2)' : 'rgba(255, 100, 100, 0.2)',
                                padding: '2px 10px',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                color: gameState.isAiGenerated ? '#00d2ff' : '#ffaaaa',
                                border: `1px solid ${gameState.isAiGenerated ? 'rgba(0, 210, 255, 0.3)' : 'rgba(255, 170, 170, 0.3)'}`
                            }}>
                                {gameState.isAiGenerated ? '✨ AI Generated' : '🛠️ Manual Level'}
                            </div>
                        )}
                    </div>

                    <GridBoard
                        size={gameState.gridSize}
                        robotPos={gameState.robotPos}
                        ghostPos={level <= 2 ? ghostPos : undefined}
                        goalPos={gameState.goalPos}
                        obstacles={gameState.obstacles}
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
                                onClick={() => changeLevel(level + 1)}
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

                {gameState.isFailed && !isLoading && (
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
                        border: '4px solid #ff0055'
                    }}>
                        <h2 style={{ fontSize: '3rem', color: '#ff0055' }}>CRASH! 💥</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Watch out for space rocks!</p>

                        <button
                            onClick={clearSequence}
                            className={styles.playBtn}
                            style={{ background: '#ff0055', boxShadow: '0 0 15px rgba(255, 0, 85, 0.5)' }}
                        >
                            Try Again ↩️
                        </button>
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
        </div>
    );
};
