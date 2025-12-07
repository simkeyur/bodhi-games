import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './GameLayout.module.css';

interface NavbarProps {
    currentView: 'home' | 'sequencing' | 'sorting';
    onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigateHome }) => {
    const { user, logout } = useAuth();
    const guestUser = !user && localStorage.getItem('guestMode') === 'true';
    const displayUser = user || (guestUser ? { displayName: 'Guest Explorer', photoURL: null } : null);

    if (currentView === 'home' && !displayUser) return null; // Don't show on home if logged out (Gate handles it)

    return (
        <nav className={styles.navbar}>
            {/* Left: Home Button (only if not on home) */}
            <div className={styles.navLeft}>
                {currentView !== 'home' && (
                    <button onClick={onNavigateHome} className={styles.navButton} aria-label="Go Home">
                        🏠
                    </button>
                )}
            </div>

            {/* Center: Title (Small) */}
            <div className={styles.navCenter}>
                <span className={styles.navTitle}>Bodhi Games</span>
            </div>

            {/* Right: User Profile */}
            <div className={styles.navRight}>
                {displayUser && (
                    <div className={styles.profileBadge}>
                        {displayUser.photoURL ? (
                            <img src={displayUser.photoURL} alt="Profile" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>👾</div>
                        )}
                        <span className={styles.navName}>{displayUser.displayName?.split(' ')[0]}</span>
                        <button onClick={() => logout()} className={styles.logoutBtn}>
                            ↩️
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};
