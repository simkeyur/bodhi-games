import React from 'react';

interface SortingGameProps {
    onBack: () => void;
}

export const SortingGame: React.FC<SortingGameProps> = ({ onBack }) => {
    return (
        <div style={{ textAlign: 'center', color: 'white' }}>
            <h1>Space Sorter</h1>
            <p>Coming Soon!</p>
            <button
                onClick={onBack}
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1.5rem',
                    borderRadius: '50px',
                    marginTop: '2rem',
                    background: 'var(--color-secondary)',
                    color: 'white'
                }}
            >
                Back Home
            </button>
        </div>
    );
};
