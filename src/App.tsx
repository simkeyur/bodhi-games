import { useState } from 'react';
import { GameLayout } from './components/Layout/GameLayout';
import { SequencingGame } from './features/sequencing/SequencingGame';
import { LandingPage } from './components/LandingPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'sequencing'>('home');

  return (
    <GameLayout currentView={currentView} onNavigateHome={() => setCurrentView('home')}>
      {currentView === 'home' && (
        <LandingPage onNavigate={setCurrentView} />
      )}

      {currentView === 'sequencing' && (
        <SequencingGame onBack={() => setCurrentView('home')} />
      )}
    </GameLayout>
  );
}

export default App;
