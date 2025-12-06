import React from 'react';
import { motion } from 'framer-motion';
import styles from './SequencingStyles.module.css';
import { type Command, type Direction } from '../hooks/useSequencingGame';

// Icons using unicode or simple SVGs for now
const Icons = {
    up: '⬆️',
    down: '⬇️',
    left: '⬅️',
    right: '➡️',
    star: '⭐'
};

interface GridBoardProps {
    size: number;
    robotPos: { x: number, y: number };
    ghostPos?: { x: number, y: number };
    goalPos: { x: number, y: number };
}

export const GridBoard: React.FC<GridBoardProps> = ({ size, robotPos, ghostPos, goalPos }) => {
    const cells = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const isRobot = robotPos.x === x && robotPos.y === y;
            const isGhost = ghostPos && ghostPos.x === x && ghostPos.y === y && !isRobot;
            const isGoal = goalPos.x === x && goalPos.y === y;

            cells.push(
                <div key={`${x}-${y}`} className={styles.cell}>
                    {isGoal && !isRobot && <div className={styles.goal}>{Icons.star}</div>}

                    {/* Ghost Robot (Preview) */}
                    {isGhost && (
                        <div style={{ opacity: 0.3, transform: 'scale(0.8)', filter: 'grayscale(100%)' }} className={styles.robot} />
                    )}

                    {isRobot && (
                        <motion.div
                            layoutId="robot"
                            className={styles.robot}
                            initial={false}
                            animate={{ x: 0, y: 0 }} // Managed by grid position, but motion helps transition
                        />
                    )}
                </div>
            );
        }
    }

    return (
        <div
            className={styles.gridBoard}
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
            {cells}
        </div>
    );
};

interface CommandPaletteProps {
    onAdd: (cmd: Command) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onAdd }) => {
    return (
        <div className={styles.palette}>
            {(['up', 'down', 'left', 'right'] as Direction[]).map(dir => (
                <button
                    key={dir}
                    className={styles.commandBtn}
                    onClick={() => onAdd(dir)}
                >
                    {Icons[dir]}
                </button>
            ))}
        </div>
    );
};

interface SequenceListProps {
    sequence: Command[];
    onRemove: (index: number) => void;
    activeIndex: number;
}

export const SequenceList: React.FC<SequenceListProps> = ({ sequence, onRemove, activeIndex }) => {
    return (
        <div className={styles.sequenceList}>
            {sequence.length === 0 && <span style={{ opacity: 0.5, padding: '0 1rem' }}>Tap arrows to build path...</span>}
            {sequence.map((cmd, i) => (
                <motion.div
                    key={i}
                    layout
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`${styles.sequenceItem} ${i === activeIndex ? styles.active : ''}`}
                    onClick={() => onRemove(i)}
                >
                    {Icons[cmd]}
                </motion.div>
            ))}
        </div>
    );
};
