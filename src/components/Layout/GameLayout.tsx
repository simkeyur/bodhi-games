import React, { type ReactNode } from 'react';
import styles from './GameLayout.module.css';

interface GameLayoutProps {
    children: ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
    // Rotation check removed as per user request
    return (
        <div className={styles.gameContainer}>
            {children}
            <div className={styles.scanlines} />
        </div>
    );
};
