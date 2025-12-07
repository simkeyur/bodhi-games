import React from 'react';
import { motion } from 'framer-motion';
import styles from './SequencingStyles.module.css';
import { type Command, type Direction } from '../hooks/useSequencingGame';

// Icons using unicode or simple SVGs for now
// SVG Icons for consistent rendering across devices
const Icons = {
    up: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
        </svg>
    ),
    down: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M19 12l-7 7-7-7" />
        </svg>
    ),
    left: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
        </svg>
    ),
    right: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
        </svg>
    ),
    star: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="gold" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
};

interface GridBoardProps {
    size: number;
    robotPos: { x: number, y: number };
    ghostPos?: { x: number, y: number };
    goalPos: { x: number, y: number };
    obstacles?: { x: number, y: number }[];
}

export const GridBoard: React.FC<GridBoardProps> = ({ size, robotPos, ghostPos, goalPos, obstacles = [] }) => {
    const cells = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const isRobot = robotPos.x === x && robotPos.y === y;
            const isGhost = ghostPos && ghostPos.x === x && ghostPos.y === y && !isRobot;
            const isGoal = goalPos.x === x && goalPos.y === y;
            const isObstacle = obstacles.some(o => o.x === x && o.y === y);

            cells.push(
                <div key={`${x}-${y}`} className={styles.cell}>
                    {isObstacle && <div className={styles.obstacle}>🪨</div>}
                    {isGoal && !isRobot && !isObstacle && <div className={styles.goal}>{Icons.star}</div>}

                    {/* Ghost Robot (Preview) */}
                    {isGhost && !isObstacle && (
                        <div style={{ opacity: 0.3, transform: 'scale(0.8)', filter: 'grayscale(100%)' }} className={styles.robot} />
                    )}

                    {isRobot && (
                        <motion.div
                            layoutId="robot"
                            className={styles.robot}
                            initial={false}
                            animate={{ x: 0, y: 0 }}
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
