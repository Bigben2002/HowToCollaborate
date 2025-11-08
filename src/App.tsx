import { useState } from "react";
import { MainMenu } from "./components/MainMenu";
import { KioskSimulator } from "./components/KioskSimulator";
import { HelpDialog } from "./components/HelpDialog";
import { LearningHistory } from "./components/LearningHistory";

type AppMode = 'menu' | 'practice' | 'real';

export default function App() {
  const [mode, setMode] = useState<AppMode>('menu');
  const [helpOpen, setHelpOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleSelectMode = (selectedMode: 'practice' | 'real') => {
    setMode(selectedMode);
  };

  const handleExit = () => {
    setMode('menu');
  };

  const handleOpenHelp = () => {
    setHelpOpen(true);
  };

  const handleOpenHistory = () => {
    setHistoryOpen(true);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {mode === 'menu' && (
        <MainMenu 
          onSelectMode={handleSelectMode}
          onOpenHelp={handleOpenHelp}
          onOpenHistory={handleOpenHistory}
        />
      )}
      {mode === 'practice' && (
        <KioskSimulator 
          isPracticeMode={true}
          onExit={handleExit}
        />
      )}
      {mode === 'real' && (
        <KioskSimulator 
          isPracticeMode={false}
          onExit={handleExit}
        />
      )}
      <HelpDialog 
        open={helpOpen}
        onOpenChange={setHelpOpen}
      />
      <LearningHistory
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </div>
  );
}