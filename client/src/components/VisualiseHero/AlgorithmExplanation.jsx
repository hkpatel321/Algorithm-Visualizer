import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AlgorithmExplanation.css';

function formatStep(step) {
  if (typeof step !== 'string') {
    // Handle object data
    if (typeof step === 'object') {
      step = JSON.stringify(step, null, 2);
    } else {
      step = String(step);
    }
  }

  // Convert markdown-like syntax to HTML
  let html = step
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // italic
    .replace(/`([^`]+)`/g, '<code>$1</code>') // inline code
    .replace(/\n/g, '<br/>');
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="algo-block">$1</pre>');
  // Bullets
  html = html.replace(/^\s*[-•] (.*)$/gm, '<li>$1</li>');
  // Numbered steps
  html = html.replace(/^\s*\d+\. (.*)$/gm, '<li>$1</li>');
  // Wrap lists
  if (/<li>/.test(html)) {
    html = '<ul>' + html + '</ul>';
  }
  return html;
}

const AlgorithmExplanation = ({ steps, loading, error, onClose, show, theme }) => {
  const [formattedSteps, setFormattedSteps] = useState([]);

  useEffect(() => {
    // Process steps when they change
    if (Array.isArray(steps)) {
      const processed = steps.map(step => {
        if (typeof step === 'object') {
          return JSON.stringify(step, null, 2);
        }
        return step;
      });
      setFormattedSteps(processed);
    }
  }, [steps]);

  if (!show) return null;
  return (
    <div className={`algo-explanation-panel ${theme}`}> 
      <div className="algo-explanation-header">
        <span className="font-bold">Algorithm Explanation</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      {loading && <div>Generating explanation...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="algo-explanation-body">
        {formattedSteps.map((step, idx) => (
          <div key={idx} className="algo-step">
            {typeof step === 'object' ? (
              <pre className="algo-block">{JSON.stringify(step, null, 2)}</pre>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formatStep(step) }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

AlgorithmExplanation.propTypes = {
  steps: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onClose: PropTypes.func,
  show: PropTypes.bool,
  theme: PropTypes.string
};

export default AlgorithmExplanation;
