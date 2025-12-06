import React, { useEffect, useState } from 'react';
import styles from './LandingPage.module.css';
import { useAuth } from '../contexts/AuthContext';
import robotImg from '../assets/images/robot.png';

interface LandingPageProps {
    onNavigate: (view: 'sequencing' | 'sorting') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { user, signInWithGoogle, logout } = useAuth();
    const [emojis, setEmojis] = useState<{ id: number, char: string, left: string, delay: string }[]>([]);

    useEffect(() => {
        // Generate random floating emojis
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
        <div className={styles.landingContainer}>
            {/* Background Layer */}
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

            {/* User Badge */}
            {user && (
                <div className={styles.userBadge}>
                    {user.photoURL && <img src={user.photoURL} alt="User" style={{ width: 30, height: 30, borderRadius: '50%' }} />}
                    <span>{user.displayName?.split(' ')[0]}</span>
                    <button
                        onClick={() => logout()}
                        style={{ background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '20px', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
                    >
                        Sign Out
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className={styles.content}>
                <h1 className={styles.heroTitle}>Bodhi Games</h1>
                <img src={robotImg} alt="Robot Friend" className={styles.heroImage} />

                {!user ? (
                    <div className={styles.gateContainer}>
                        <h2 style={{ marginBottom: '1rem' }}>Parents, unlock the fun! 🔐</h2>
                        <button className={styles.authButton} onClick={signInWithGoogle}>
                            <span style={{ fontSize: '1.5rem' }}>G</span> Sign In with Google
                        </button>
                    </div>
                ) : (
                    <div className={styles.gameMenu}>
                        <div className={styles.gameCard} onClick={() => onNavigate('sequencing')}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
                            <h3>Robot Path</h3>
                            <p>Code the robot to the star!</p>
                        </div>

                        <div className={styles.gameCard} onClick={() => onNavigate('sorting')}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                            <h3>Space Sorter</h3>
                            <p>Sort items by color!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
