import React, { useEffect } from 'react';

const Background = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translate(0, 0) rotate(0deg); }
        50% { transform: translate(20px, 20px) rotate(180deg); }
        100% { transform: translate(0, 0) rotate(360deg); }
      }
      @keyframes pulse {
        0% { opacity: 0.4; }
        50% { opacity: 0.6; }
        100% { opacity: 0.4; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#3b1d6c,transparent)]" />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0) 70%)',
              animation: `float ${Math.random() * 10 + 10}s infinite linear, pulse 3s infinite ease-in-out`,
              opacity: 0.5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Background;
