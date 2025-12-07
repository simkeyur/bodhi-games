import React, { type ReactNode } from 'react';
import styles from './GameLayout.module.css';
import { Navbar } from './Navbar';

interface GameLayoutProps {
    children: ReactNode;
    currentView: 'home' | 'sequencing' | 'sorting';
    onNavigateHome: () => void;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, currentView, onNavigateHome }) => {
    const [emojis, setEmojis] = React.useState<{ id: number, char: string, left: string, delay: string }[]>([]);

    React.useEffect(() => {
        // Generate random floating emojis for background
        const emojiList = ['🚀', '⭐', '🪐', '👾', '🛸', '🌌', '🌑', '🌠'];
        const newEmojis = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            char: emojiList[Math.floor(Math.random() * emojiList.length)],
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`
        }));
        setEmojis(newEmojis);
    }, []);

    return (
        <div className={styles.gameContainer}>
            {/* Global Background Layer */}
            <div className={styles.backgroundLayer}>
                {emojis.map(e => (
                    <span
                        key={e.id}
                        className={styles.floatingEmoji}
                        style={{ left: e.left, animationDelay: e.delay }}
                    >
                        {e.char}
                    </span>
                ))}
            </div>

            <Navbar currentView={currentView} onNavigateHome={onNavigateHome} />
            {children}
        </div>
    );
};
