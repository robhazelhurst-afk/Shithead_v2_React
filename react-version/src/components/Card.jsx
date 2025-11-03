// Card.jsx - Animated card component with double-click debugging

import { motion } from 'framer-motion';

const Card = ({ card, isSelected, isFaceDown, isClickable, onClick, onDoubleClick, style, disableAnimation }) => {
  const getSpecialGlow = () => {
    if (!card || isFaceDown) return '';
    
    switch (card.rank) {
      case 2:
        return 'shadow-[0_0_15px_rgba(59,130,246,0.6)]'; // Blue glow
      case 7:
        return 'shadow-[0_0_15px_rgba(34,197,94,0.6)]'; // Green glow
      case 10:
        return 'shadow-[0_0_15px_rgba(249,115,22,0.6)]'; // Orange glow
      case 14:
        return 'shadow-[0_0_15px_rgba(168,85,247,0.6)]'; // Purple glow
      default:
        return '';
    }
  };

  const handleClick = (e) => {
    console.log('🖱️ Card CLICK detected on:', card?.displayName || 'face-down');
    if (isClickable && onClick) {
      onClick(card, e);
    }
  };

  const handleDoubleClick = (e) => {
    console.log('🖱️🖱️ Card DOUBLE-CLICK detected on:', card?.displayName || 'face-down', 'isClickable:', isClickable, 'hasHandler:', !!onDoubleClick);
    if (isClickable && onDoubleClick) {
      e.preventDefault();
      e.stopPropagation();
      onDoubleClick(card, e);
    }
  };

  return (
    <motion.div
      className={`
        relative w-24 h-36 rounded-lg select-none overflow-hidden
        ${isSelected ? 'ring-4 ring-yellow-400 -translate-y-4' : ''}
        ${isClickable ? 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : ''}
        ${getSpecialGlow()}
        shadow-lg transition-all duration-200
      `}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      initial={disableAnimation ? false : { opacity: 0, scale: 0.8 }}
      animate={disableAnimation ? false : { opacity: 1, scale: 1 }}
      exit={disableAnimation ? false : { opacity: 0, scale: 0.8 }}
      layout={!disableAnimation}
    >
      {isFaceDown ? (
        // Card Back - Waddingtons No.1 style
        <div className="w-full h-full bg-red-700 relative">
          {/* White border frame */}
          <div className="absolute inset-3 border-2 border-white rounded">
            {/* Inner pattern area */}
            <div className="absolute inset-2 bg-red-600 rounded overflow-hidden">
              {/* Diagonal crosshatch pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
                <defs>
                  <pattern id="crosshatch" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="10" y2="10" stroke="white" strokeWidth="1"/>
                    <line x1="10" y1="0" x2="0" y2="10" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#crosshatch)"/>
              </svg>
              
              {/* Center circle ornament */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-white rounded-full opacity-60"></div>
                <div className="absolute w-8 h-8 border-2 border-white rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      ) : card ? (
        // Card Face - Clean white background with proper alignment
        <div className="w-full h-full bg-white relative">
          {/* Top-left corner */}
          <div className={`absolute top-1 left-1.5 text-left font-bold leading-none ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            <div className="text-lg">{card.displayRank}</div>
            <div className="text-2xl -mt-0.5">{card.displaySuit}</div>
          </div>

          {/* Center suit symbol */}
          <div className={`absolute inset-0 flex items-center justify-center text-7xl ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            {card.displaySuit}
          </div>

          {/* Bottom-right corner (rotated) */}
          <div className={`absolute bottom-1 right-1.5 text-right font-bold leading-none transform rotate-180 ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            <div className="text-lg">{card.displayRank}</div>
            <div className="text-2xl -mt-0.5">{card.displaySuit}</div>
          </div>

          {/* Subtle border */}
          <div className="absolute inset-0 border border-gray-200 rounded-lg pointer-events-none"></div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default Card;
