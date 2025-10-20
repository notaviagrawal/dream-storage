import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ViewerPage.css';

const API_URL = 'http://localhost:8888';

const ViewerPage = ({ prompt, setIsGenerating, onBack }) => {
  const [viewerUrl, setViewerUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const generateWorld = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (isCancelled) return; // Don't update state if component unmounted

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Generation failed');
        }

        const data = await response.json();

        if (!isCancelled) {
          setViewerUrl(data.viewer_url);
          setLoading(false);
          setIsGenerating(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error generating world:', err);
          setError(err.message);
          setLoading(false);
          setIsGenerating(false);
        }
      }
    };

    generateWorld();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isCancelled = true;
    };
  }, [prompt]); // Removed setIsGenerating from dependencies to prevent re-runs

  return (
    <motion.div
      className="viewer-page"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Back button */}
      <motion.button
        className="back-btn glass"
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        back
      </motion.button>

      {/* Viewer canvas */}
      <div className="viewer-container">
        {loading && (
          <motion.div
            className="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="loading-spinner"></div>
            <p className="loading-text">weaving your dream...</p>
            <p className="loading-subtext">this may take 30-90 seconds</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="error-overlay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="error-content glass">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3>generation failed</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={onBack}>
                try again
              </button>
            </div>
          </motion.div>
        )}

        {!loading && !error && viewerUrl && (
          <motion.iframe
            className="viewer-canvas"
            src={viewerUrl}
            title="3D World Viewer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ViewerPage;
