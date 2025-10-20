import { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceInput from './VoiceInput';
import TextInput from './TextInput';
import './InputPage.css';

const InputPage = ({ prompt, setPrompt, onGenerate, isGenerating }) => {
  const [inputMode, setInputMode] = useState('voice'); // 'voice' or 'text'

  return (
    <motion.div
      className="input-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="input-container">
        <motion.h1
          className="title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          dream viewer
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          speak or type your vision into existence
        </motion.p>

        {/* Input mode toggle */}
        <motion.div
          className="mode-toggle glass"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            className={`mode-btn ${inputMode === 'voice' ? 'active' : ''}`}
            onClick={() => setInputMode('voice')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            voice
          </button>
          <button
            className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
            text
          </button>
        </motion.div>

        {/* Input component based on mode */}
        <motion.div
          className="input-area"
          key={inputMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {inputMode === 'voice' ? (
            <VoiceInput prompt={prompt} setPrompt={setPrompt} />
          ) : (
            <TextInput prompt={prompt} setPrompt={setPrompt} />
          )}
        </motion.div>

        {/* Generate button - appears when there's text */}
        {prompt && (
          <motion.button
            className="generate-btn glass-strong"
            onClick={onGenerate}
            disabled={isGenerating}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(138, 43, 226, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating ? 'generating...' : 'generate'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default InputPage;
