import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './GameLayout.module.css';

interface NavbarProps {
    currentView: 'home' | 'sequencing' | 'sorting';
    onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigateHome }) => {
    const { user, logout } = useAuth();

    // Check if guest mode
    const isGuest = !user && localStorage.getItem('guestMode') === 'true';
    const displayName = user?.displayName?.split(' ')[0] || (isGuest ? 'Guest' : null);

    return (
        <nav className={styles.navbar}>
            {/* Left: Home Button */}
            <div className={styles.navLeft}>
                {currentView !== 'home' && (
                    <button onClick={onNavigateHome} className={styles.navButton} aria-label="Go Home">
                        🏠
                    </button>
                )}
            </div>

            {/* Center: Title */}
            <div className={styles.navCenter}>
                <span className={styles.navTitle}>Bodhi Games</span>
            </div>

            {/* Right: User Info */}
            <div className={styles.navRight}>
                {(user || isGuest) && (
                    <div className={styles.profileBadge}>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>👾</div>
                        )}
                        <span className={styles.navName}>{displayName}</span>
                        {user && (
                            <button onClick={() => logout()} className={styles.logoutBtn} aria-label="Sign Out">
                                ↩️
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};
