import React, { useEffect, useState } from 'react';
import styles from './LandingPage.module.css';
import { useAuth } from '../contexts/AuthContext';
import robotImg from '../assets/images/robot.png';

interface LandingPageProps {
    onNavigate: (view: 'sequencing' | 'sorting') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const { user, signInWithGoogle, enableGuestMode } = useAuth();
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

    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setInstallPrompt(null);
        });
    };

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

            {/* User Badge removed - Moved to Navbar */}

            {/* Main Content */}
            <div className={styles.content}>
                <h1 className={styles.heroTitle}>Bodhi Games</h1>
                <img src={robotImg} alt="Robot Friend" className={styles.heroImage} />

                {/* PWA Install Button */}
                {installPrompt && (
                    <button
                        onClick={handleInstallClick}
                        style={{
                            marginBottom: '1rem',
                            background: '#ff0055',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}
                    >
                        📲 Install App
                    </button>
                )}

                {!user && localStorage.getItem('guestMode') !== 'true' ? (
                    <div className={styles.gateContainer}>
                        <h2 style={{ marginBottom: '1rem' }}>Parents, unlock the fun! 🔐</h2>
                        <button className={styles.authButton} onClick={signInWithGoogle}>
                            <span style={{ fontSize: '1.5rem' }}>G</span> Sign In with Google
                        </button>
                        <button
                            onClick={enableGuestMode}
                            style={{
                                marginTop: '1rem',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'rgba(255,255,255,0.7)',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            Explore as Guest 🚀
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
