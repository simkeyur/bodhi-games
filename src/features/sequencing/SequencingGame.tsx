import React from 'react';
import { GridBoard, CommandPalette, SequenceList } from './components/GameComponents';
import { useSequencingGame } from './hooks/useSequencingGame';
import styles from './components/SequencingStyles.module.css';

interface SequencingGameProps {
    onBack: () => void;
}

export const SequencingGame: React.FC<SequencingGameProps> = ({ onBack }) => {
    const {
        gameState,
        addCommand,
        removeCommand,
        runSequence,
        resetGame,
        clearSequence
    } = useSequencingGame();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            padding: '1rem',
            alignItems: 'center',
            gap: '1rem',
            color: 'white'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px' }}>
                <button onClick={onBack} style={{ background: 'none', fontSize: '2rem' }}>🔙</button>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Level 1</div>
                <div style={{ width: '50px' }}></div> {/* Spacer */}
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GridBoard
                    size={gameState.gridSize}
                    robotPos={gameState.robotPos}
                    goalPos={gameState.goalPos}
                />
            </div>

            {gameState.isWon && (
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
                    <p style={{ fontSize: '1.5rem' }}>Great job programming!</p>
                    <button
                        onClick={clearSequence}
                        className={styles.playBtn}
                        style={{ marginTop: '1rem' }}
                    >
                        Play Again
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
        </div>
    );
};
