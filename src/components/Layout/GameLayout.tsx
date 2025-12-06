import React, { type ReactNode } from 'react';
import styles from './GameLayout.module.css';

interface GameLayoutProps {
    children: ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.landscapeHint}>
                Please rotate your device 🔄
            </div>
            <main className={styles.gameContent}>
                {children}
            </main>
        </div>
    );
};
