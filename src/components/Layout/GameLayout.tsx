import React, { type ReactNode } from 'react';
import styles from './GameLayout.module.css';
import { Navbar } from './Navbar';

interface GameLayoutProps {
    children: ReactNode;
    currentView: 'home' | 'sequencing' | 'sorting';
    onNavigateHome: () => void;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, currentView, onNavigateHome }) => {
    return (
        <div className={styles.gameContainer}>
            <Navbar currentView={currentView} onNavigateHome={onNavigateHome} />
            {children}
            <div className={styles.scanlines} />
        </div>
    );
};
