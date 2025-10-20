import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputPage from './components/InputPage';
import ViewerPage from './components/ViewerPage';
import './styles/globals.css';

function App() {
  const [currentPage, setCurrentPage] = useState('input'); // 'input' or 'viewer'
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentPage('viewer');
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentPage === 'input' ? (
          <InputPage
            key="input"
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        ) : (
          <ViewerPage
            key="viewer"
            prompt={prompt}
            setIsGenerating={setIsGenerating}
            onBack={() => setCurrentPage('input')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
