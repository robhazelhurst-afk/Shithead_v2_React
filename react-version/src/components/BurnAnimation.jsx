// BurnAnimation.jsx - Spectacular 4-of-a-kind burn animation
import { useState, useEffect } from 'react';
import Card from './Card';

const BurnAnimation = ({ cards, onComplete }) => {
  const [stage, setStage] = useState('gathering'); // gathering -> exploding -> fading
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Stage 1: Cards gather to center (1 second)
    const gatherTimer = setTimeout(() => {
      setStage('exploding');
      generateParticles();
    }, 1000);

    // Stage 2: Explosion (1.5 seconds)
    const explodeTimer = setTimeout(() => {
      setStage('fading');
    }, 2500);

    // Stage 3: Fade out and complete (0.5 seconds)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(gatherTimer);
      clearTimeout(explodeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 400 - 200, // -200 to 200
        y: Math.random() * 400 - 200,
        rotation: Math.random() * 360,
        size: Math.random() * 20 + 10,
        color: ['#ff6b6b', '#ffd93d', '#ff8c42', '#f95738', '#ff1744'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.3
      });
    }
    setParticles(newParticles);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Screen flash effect */}
      {stage === 'exploding' && (
        <div 
          className="absolute inset-0 bg-white animate-flash"
          style={{
            animation: 'flash 0.5s ease-out'
          }}
        />
      )}

      {/* Cards gathering and exploding */}
      <div className="relative">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`absolute transition-all duration-1000 ${
              stage === 'gathering' ? 'animate-gather' : ''
            } ${
              stage === 'exploding' ? 'animate-explode-out' : ''
            } ${
              stage === 'fading' ? 'opacity-0' : ''
            }`}
            style={{
              left: stage === 'gathering' 
                ? `${(idx - 1.5) * 120}px` // Start spread out
                : stage === 'exploding'
                ? `${(idx - 1.5) * 300}px` // Explode outward
                : `${(idx - 1.5) * 120}px`,
              top: stage === 'exploding' ? `${(idx % 2 === 0 ? -1 : 1) * 200}px` : '0px',
              transform: stage === 'gathering'
                ? 'scale(1) rotate(0deg)'
                : stage === 'exploding'
                ? `scale(0.5) rotate(${(idx - 1.5) * 45}deg)`
                : 'scale(1)',
              transition: stage === 'gathering' 
                ? 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                : 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              zIndex: 100 + idx
            }}
          >
            <Card card={card} isClickable={false} disableAnimation={true} />
          </div>
        ))}

        {/* Particle explosion */}
        {stage === 'exploding' && particles.map(particle => (
          <div
            key={particle.id}
            className="absolute animate-particle"
            style={{
              left: '50%',
              top: '50%',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: '50%',
              transform: `translate(-50%, -50%)`,
              animation: `particle-burst 1.5s ease-out ${particle.delay}s forwards`,
              '--particle-x': `${particle.x}px`,
              '--particle-y': `${particle.y}px`,
              '--particle-rotation': `${particle.rotation}deg`
            }}
          />
        ))}

        {/* Center glow effect */}
        {stage === 'exploding' && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-50 animate-pulse-fast" />
          </div>
        )}

        {/* Shockwave rings */}
        {stage === 'exploding' && (
          <>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 border-4 border-yellow-400 rounded-full animate-shockwave" 
                   style={{ animationDelay: '0s' }} />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 border-4 border-orange-400 rounded-full animate-shockwave" 
                   style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 border-4 border-red-400 rounded-full animate-shockwave" 
                   style={{ animationDelay: '0.4s' }} />
            </div>
          </>
        )}

        {/* Text announcement */}
        {stage === 'exploding' && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="text-6xl font-bold text-white drop-shadow-2xl animate-bounce-in"
                 style={{
                   textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,140,0,0.6)',
                   animation: 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                 }}>
              🔥 BURN! 🔥
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 0.6; }
          100% { opacity: 0; }
        }

        @keyframes particle-burst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--particle-x)), calc(-50% + var(--particle-y))) 
                       rotate(var(--particle-rotation)) scale(0);
            opacity: 0;
          }
        }

        @keyframes shockwave {
          0% {
            width: 32px;
            height: 32px;
            opacity: 1;
          }
          100% {
            width: 400px;
            height: 400px;
            opacity: 0;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-pulse-fast {
          animation: pulse 0.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default BurnAnimation;
