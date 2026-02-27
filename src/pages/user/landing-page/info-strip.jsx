import React, { useState } from 'react';

const AnimatedBannerTailwind = () => {
  const [isPaused, setIsPaused] = useState(false);

  const text = "More Features are coming soon! ✨ ";

  return (
    <div className="max-w-lg w-full mx-auto flex justify-center">
      <div className="w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 py-3 px-6 rounded-b-lg">
        <div 
          className={`flex whitespace-nowrap ${
            isPaused ? 'animate-pause' : ''
          }`}
          style={{
            animation: 'scrollLeftToRight 15s linear infinite'
          }}
        >
          {[...Array(6)].map((_, index) => (
            <span 
              key={index}
              className="text-white text-sm font-normal tracking-wide mx-4"
            >
              {text}
            </span>
          ))}
        </div>

        <style jsx>{`
          @keyframes scrollLeftToRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
          .animate-pause {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AnimatedBannerTailwind;