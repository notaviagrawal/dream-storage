import { motion } from 'framer-motion';
import './TextInput.css';

const TextInput = ({ prompt, setPrompt }) => {
  return (
    <div className="text-input">
      <motion.textarea
        className="text-area glass"
        placeholder="describe your dream world..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      {prompt && (
        <motion.button
          className="clear-text-btn"
          onClick={() => setPrompt('')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          clear
        </motion.button>
      )}
    </div>
  );
};

export default TextInput;
