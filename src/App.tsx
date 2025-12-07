import { useState } from 'react';
import { GameLayout } from './components/Layout/GameLayout';
import { SequencingGame } from './features/sequencing/SequencingGame';
import { MysteryMatchGame } from './features/mystery-match/MysteryMatchGame';
import { OddOneOutGame } from './features/odd-one-out/OddOneOutGame';
import { LandingPage } from './components/LandingPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'sequencing' | 'mystery-match' | 'odd-one-out'>('home');

  return (
    <GameLayout currentView={currentView} onNavigateHome={() => setCurrentView('home')}>
      {currentView === 'home' && (
        <LandingPage onNavigate={setCurrentView} />
      )}

      {currentView === 'sequencing' && (
        <SequencingGame onBack={() => setCurrentView('home')} />
      )}

      {currentView === 'mystery-match' && (
        <MysteryMatchGame onBack={() => setCurrentView('home')} />
      )}

      {currentView === 'odd-one-out' && (
        <OddOneOutGame onBack={() => setCurrentView('home')} />
      )}
    </GameLayout>
  );
}

export default App;
