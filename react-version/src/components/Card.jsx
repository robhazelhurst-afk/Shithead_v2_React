// Card.jsx - Animated card component

import { motion } from 'framer-motion';

const Card = ({ card, isSelected, isFaceDown, isClickable, onClick, style }) => {
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

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick(card);
    }
  };

  return (
    <motion.div
      className={`
        relative w-20 h-28 rounded-lg cursor-pointer select-none
        ${isFaceDown ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-white'}
        ${isSelected ? 'ring-4 ring-yellow-400 -translate-y-4' : ''}
        ${isClickable ? 'hover:-translate-y-2 hover:shadow-2xl' : 'opacity-60'}
        ${getSpecialGlow()}
        shadow-lg transition-all duration-200
      `}
      style={style}
      onClick={handleClick}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
    >
      {isFaceDown ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-4xl text-white opacity-50">?</div>
        </div>
      ) : card ? (
        <div className="w-full h-full p-2 flex flex-col">
          {/* Top corner */}
          <div className={`text-left font-bold ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            <div className="text-sm leading-none">{card.displayRank}</div>
            <div className="text-lg leading-none">{card.displaySuit}</div>
          </div>

          {/* Center */}
          <div className={`flex-1 flex items-center justify-center text-5xl ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            {card.displaySuit}
          </div>

          {/* Bottom corner (rotated) */}
          <div className={`text-right font-bold transform rotate-180 ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
            <div className="text-sm leading-none">{card.displayRank}</div>
            <div className="text-lg leading-none">{card.displaySuit}</div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default Card;
