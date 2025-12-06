import { useState } from 'react';
import { GameLayout } from './components/Layout/GameLayout';
import { SequencingGame } from './features/sequencing/SequencingGame';
import { SortingGame } from './features/sorting/SortingGame';
import robotImg from './assets/images/robot.png';
import { useAuth } from './contexts/AuthContext';

type View = 'home' | 'sequencing' | 'sorting';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <GameLayout>
      {currentView === 'home' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative' // For absolute positioning of auth
        }}>
          {/* Auth Button */}
          <div style={{ position: 'absolute', top: -40, right: 0, zIndex: 10 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '50px' }}>
                {user.photoURL && <img src={user.photoURL} alt="User" style={{ width: 40, height: 40, borderRadius: '50%' }} />}
                <span style={{ color: 'white', fontWeight: 'bold' }}>Hi, {user.displayName?.split(' ')[0]}!</span>
                <button
                  onClick={() => logout()}
                  style={{ background: 'var(--color-accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem' }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                style={{
                  background: 'white',
                  color: 'black',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>G</span> Parent Sign In
              </button>
            )}
          </div>

          <h1 style={{
            fontSize: '4rem',
            color: 'var(--color-text)',
            textShadow: '0 0 10px var(--color-primary)'
          }}>
            Bodhi Games
          </h1>

          <img
            src={robotImg}
            alt="Friendly Robot"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              animation: 'float 3s ease-in-out infinite'
            }}
          />

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setCurrentView('sequencing')}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                color: 'white',
                padding: '1.5rem 3rem',
                borderRadius: 'var(--button-radius)',
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Robot Path 🤖
            </button>

            <button
              onClick={() => setCurrentView('sorting')}
              style={{
                background: 'linear-gradient(135deg, var(--color-secondary), var(--color-success))',
                color: 'white',
                padding: '1.5rem 3rem',
                borderRadius: 'var(--button-radius)',
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Sorter 📦
            </button>
          </div>

          <style>{`
            @keyframes float {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
          `}</style>
        </div>
      )}

      {currentView === 'sequencing' && (
        <SequencingGame onBack={() => setCurrentView('home')} />
      )}

      {currentView === 'sorting' && (
        <SortingGame onBack={() => setCurrentView('home')} />
      )}
    </GameLayout>
  );
}

export default App;
