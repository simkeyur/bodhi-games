import { useState } from 'react';
import { GameLayout } from './components/Layout/GameLayout';
import { SequencingGame } from './features/sequencing/SequencingGame';
import { SortingGame } from './features/sorting/SortingGame';
import robotImg from './assets/images/robot.png';

type View = 'home' | 'sequencing' | 'sorting';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

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
          margin: '0 auto'
        }}>
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
