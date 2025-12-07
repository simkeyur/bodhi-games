import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import styles from './components/SortingStyles.module.css';
import { useSortingGame, type GameItem } from './hooks/useSortingGame';
import { useGameScore } from '../../hooks/useGameScore';

// Props
interface SortingGameProps {
    onBack: () => void;
}

interface DraggableItemProps {
    item: GameItem;
    onDrop: (itemId: string, x: number, y: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onDrop }) => {
    const controls = useDragControls();

    return (
        <motion.div
            drag
            dragControls={controls}
            dragMomentum={false}
            // Start at the conveyor position
            initial={{ x: 0, y: 0 }}
            // We drive horizontal movement via parent, but Framer Motion handles the drag offset
            style={{
                left: `${item.x}%`,
                position: 'absolute'
            }}
            className={`${styles.item} ${item.type === 'red' ? styles.itemRed : styles.itemBlue}`}
            onDragEnd={(_, info) => {
                // Check drop zones based on screen coordinates
                onDrop(item.id, info.point.x, info.point.y);
            }}
        >
            {item.type === 'red' ? '🟥' : '🔵'}
        </motion.div>
    );
};

export const SortingGame: React.FC<SortingGameProps> = () => {
    const { gameState, startGame, verifySort } = useSortingGame();
    const { saveScore } = useGameScore('sorting');
    // Bins refs to calculate collision
    const redBinRef = React.useRef<HTMLDivElement>(null);
    const blueBinRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        startGame();
    }, [startGame]);

    const handleDrop = (itemId: string, x: number, y: number) => {
        // Simple collision detection
        const checkCollision = (ref: React.RefObject<HTMLDivElement>) => {
            if (!ref.current) return false;
            const rect = ref.current.getBoundingClientRect();
            return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
        };

        if (checkCollision(redBinRef as React.RefObject<HTMLDivElement>)) {
            verifySort(itemId, 'red');
        } else if (checkCollision(blueBinRef as React.RefObject<HTMLDivElement>)) {
            verifySort(itemId, 'blue');
        }
    };

    // Game Over side effects
    React.useEffect(() => {
        if (gameState.gameOver) {
            saveScore(gameState.score);
        }
    }, [gameState.gameOver, gameState.score, saveScore]);

    return (
        <div className={styles.sortingGame}>
            {/* HUD */}
            <div className={styles.hud}>
                <div>⭐ {gameState.score}</div>
                <div>❤️ {gameState.lives}</div>
            </div>

            {/* Conveyor Belt */}
            <div className={styles.conveyorContainer}>
                <div className={styles.conveyorTrack} />
                {gameState.items.map((item: GameItem) => (
                    <DraggableItem
                        key={item.id}
                        item={item}
                        onDrop={handleDrop}
                    />
                ))}
            </div>

            {/* Bins */}
            <div className={styles.binsContainer}>
                <div ref={redBinRef} className={`${styles.bin} ${styles.binRed}`}>
                    <div className={styles.binLabel} style={{ color: 'var(--color-primary)' }}>RED</div>
                    <div style={{ fontSize: '2rem' }}>🟥</div>
                </div>

                <div ref={blueBinRef} className={`${styles.bin} ${styles.binBlue}`}>
                    <div className={styles.binLabel} style={{ color: 'var(--color-secondary)' }}>BLUE</div>
                    <div style={{ fontSize: '2rem' }}>🔵</div>
                </div>
            </div>

            {/* Game Over Layer */}
            {gameState.gameOver && (
                <div className={styles.gameOver}>
                    <h2 style={{ fontSize: '3rem', color: 'white' }}>GAME OVER</h2>
                    <p style={{ fontSize: '1.5rem', color: 'white' }}>Score: {gameState.score}</p>
                    <button
                        onClick={startGame}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.5rem',
                            borderRadius: '50px',
                            background: 'var(--color-success)',
                            color: 'black',
                            marginTop: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Try Again 🔄
                    </button>
                </div>
            )}
        </div>
    );
};
