// src/components/SplashAnimation.tsx
import React, { useEffect, useState } from 'react';

const SplashAnimation: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start the fade-out effect after a delay (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 4000); // Adjust the duration as needed

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.animation-container');

    // Remove the element from the DOM after the fade-out transition
    const handleTransitionEnd = () => {
      if (container) {
        container.remove();
      }
    };

    if (container) {
      container.addEventListener('transitionend', handleTransitionEnd);

      // Cleanup event listener on component unmount
      return () => {
        container.removeEventListener('transitionend', handleTransitionEnd);
      };
    }
  }, [fadeOut]);

  return (
    <div className={`animation-container ${fadeOut ? 'fade-out' : ''}`}>
      <img src="/icons/gif/game_over_anim_black_reverse.gif" alt="Loading" className="logo" />
      <style>{`
        .animation-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          background-color: black; // background-color: white;
          position: absolute;
          top: 0;
          left: 0;
          transition: opacity 1s ease;
          z-index: 3000;
        }
        .animation-container.fade-out {
          opacity: 0;
        }
        .logo {
          width: 250px; /* Adjust size as needed */
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default SplashAnimation;
