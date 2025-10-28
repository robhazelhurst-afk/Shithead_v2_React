// Card.jsx - Animated card component

import { motion } from 'framer-motion';

const Card = ({ card, isSelected, isFaceDown, isClickable, onClick, onDoubleClick, style, disableAnimation }) => {
  const getSpecialGlow = () => {
    if (!card || isFaceDown) return '';
    
    switch (card.rank) {
      case 2:
        return 'shadow-[0_0_10px_rgba(59,130,246,0.5)]'; // Blue glow
      case 7:
        return 'shadow-[0_0_10px_rgba(34,197,94,0.5)]'; // Green glow
      case 10:
        return 'shadow-[0_0_10px_rgba(249,115,22,0.5)]'; // Orange glow
      case 14:
        return 'shadow-[0_0_10px_rgba(168,85,247,0.5)]'; // Purple glow
      default:
        return '';
    }
  };

  const handleClick = (e) => {
    if (isClickable && onClick) {
      onClick(card, e);
    }
  };

  const handleDoubleClick = (e) => {
    if (isClickable && onDoubleClick) {
      e.preventDefault();
      onDoubleClick(card, e);
    }
  };

  return (
    <motion.div
      className={`
        relative w-24 h-36 rounded-lg select-none
        ${isFaceDown ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-white'}
        ${isSelected ? 'ring-4 ring-yellow-400 -translate-y-4' : ''}
        ${isClickable ? 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : 'opacity-60'}
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
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-4xl text-white opacity-50">?</div>
        </div>
      ) : card ? (
        <div className="w-full h-full p-3 flex flex-col">
          {/* Top corner */}
          <div className={`text-left font-bold ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            <div className="text-base leading-tight">{card.displayRank}</div>
            <div className="text-xl leading-tight">{card.displaySuit}</div>
          </div>

          {/* Center */}
          <div className={`flex-1 flex items-center justify-center text-6xl ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            {card.displaySuit}
          </div>

          {/* Bottom corner (rotated) */}
          <div className={`text-right font-bold transform rotate-180 ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            <div className="text-base leading-tight">{card.displayRank}</div>
            <div className="text-xl leading-tight">{card.displaySuit}</div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default Card;
