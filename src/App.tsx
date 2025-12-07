import { useState } from 'react';
import { GameLayout } from './components/Layout/GameLayout';
import { SequencingGame } from './features/sequencing/SequencingGame';
import { SortingGame } from './features/sorting/SortingGame';
import { LandingPage } from './components/LandingPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'sequencing' | 'sorting'>('home');

  return (
    <GameLayout currentView={currentView} onNavigateHome={() => setCurrentView('home')}>
      {currentView === 'home' && (
        <LandingPage onNavigate={setCurrentView} />
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
