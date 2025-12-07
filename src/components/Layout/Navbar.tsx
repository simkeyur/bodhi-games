import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './GameLayout.module.css';
import { LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
    currentView: 'home' | 'sequencing' | 'mystery-match' | 'odd-one-out';
    onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigateHome }) => {
    const { user, logout, signInWithGoogle } = useAuth();
    const [showLogout, setShowLogout] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Check if guest mode
    const isGuest = !user && localStorage.getItem('guestMode') === 'true';
    const displayName = user?.displayName?.split(' ')[0] || (isGuest ? 'Guest' : null);

    const handleProfileClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent bubbling issues
        e.stopPropagation();

        console.log("Profile clicked. isGuest:", isGuest);

        if (isGuest) {
            setShowLoginModal(true);
        } else {
            // Toggle logout button visibility
            setShowLogout(!showLogout);
        }
    };

    return (
        <>
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
                        <div className={styles.profileWrapper}>
                            <div
                                className={`${styles.profileBadge} ${isGuest ? styles.clickableGuest : ''}`}
                                onClick={handleProfileClick}
                                role="button"
                                tabIndex={0}
                            >
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className={styles.avatar} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {isGuest ? '👾' : <UserIcon size={20} color="white" />}
                                    </div>
                                )}
                                <span className={styles.navName}>{displayName}</span>
                            </div>

                            {/* Logout Action */}
                            {user && showLogout && (
                                <button
                                    onClick={() => logout()}
                                    className={styles.logoutBtnNew}
                                    aria-label="Sign Out"
                                    title="Sign Out"
                                >
                                    <LogOut size={20} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Custom Login Modal */}
            {showLoginModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Ready to Sign In? 🔐</h2>
                        <p>Sign in with Google to save your high scores and progress!</p>

                        <div className={styles.modalButtons}>
                            <button
                                className={`${styles.modalBtn} ${styles.btnSecondary}`}
                                onClick={() => setShowLoginModal(false)}
                            >
                                Stay Guest
                            </button>
                            <button
                                className={`${styles.modalBtn} ${styles.btnPrimary}`}
                                onClick={() => {
                                    setShowLoginModal(false);
                                    signInWithGoogle();
                                }}
                            >
                                Sign In with Google
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
