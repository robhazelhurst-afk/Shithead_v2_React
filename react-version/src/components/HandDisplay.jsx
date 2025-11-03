// HandDisplay.jsx - Smart 4-row hand display with hover space reservation

import Card from './Card';

const HandDisplay = ({ 
  cards, 
  selectedCards = [], 
  isClickable = false, 
  onCardClick, 
  onCardDoubleClick,
  isFaceDown = false 
}) => {
  // Sort cards by rank (value)
  const sortedCards = [...cards].sort((a, b) => {
    if (isFaceDown) return 0; // Don't sort face-down cards
    return a.rank - b.rank;
  });

  // Calculate layout: distribute cards across 4 rows
  const calculateLayout = () => {
    const totalCards = sortedCards.length;
    const maxRows = 4;
    
    if (totalCards === 0) return { rows: [], cardsPerRow: 0, overlapPx: 0 };
    
    // Calculate cards per row (distribute evenly)
    const cardsPerRow = Math.ceil(totalCards / maxRows);
    
    // Calculate overlap needed
    // Card width is 96px (w-24)
    // Available width after left margin: 600 - 48 = 552px
    let overlapPx = 0;
    if (cardsPerRow > 4) {
      const cardWidth = 96;
      const availableWidth = 552; // 600px column - 48px margin
      
      if (cardsPerRow === 5) {
        const totalNeeded = cardWidth * cardsPerRow;
        const totalAvailable = availableWidth;
        overlapPx = (totalNeeded - totalAvailable) / (cardsPerRow - 1);
      } else {
        const totalNeeded = cardWidth * cardsPerRow;
        const totalAvailable = availableWidth;
        overlapPx = (totalNeeded - totalAvailable) / (cardsPerRow - 1);
      }
      
      // Ensure minimum card visibility (at least 30px of each card visible)
      const maxOverlap = cardWidth - 30;
      overlapPx = Math.min(overlapPx, maxOverlap);
    }
    
    // Distribute cards into rows
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      const startIdx = i * cardsPerRow;
      const endIdx = Math.min(startIdx + cardsPerRow, totalCards);
      
      if (startIdx < totalCards) {
        rows.push(sortedCards.slice(startIdx, endIdx));
      }
    }
    
    return { rows, cardsPerRow, overlapPx: Math.max(0, overlapPx) };
  };

  const { rows, cardsPerRow, overlapPx } = calculateLayout();

  if (sortedCards.length === 0) {
    return (
      <div className="text-white text-center py-8 opacity-50">
        <p className="text-sm">No cards</p>
      </div>
    );
  }

  return (
    // Added pt-3 (12px padding) at top to prevent cropping when cards hover/pop up
    <div className="flex flex-col gap-2 w-full pt-3" style={{ marginLeft: '48px' }}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center">
          {row.map((card, cardIdx) => (
            <div
              key={isFaceDown ? `facedown-${rowIdx}-${cardIdx}` : card.id}
              style={{
                marginLeft: cardIdx > 0 ? `-${overlapPx}px` : '0',
                marginRight: cardIdx < row.length - 1 ? '0' : '0',
                zIndex: cardIdx,
              }}
            >
              <Card
                card={isFaceDown ? null : card}
                isFaceDown={isFaceDown}
                isSelected={!isFaceDown && selectedCards.some(c => c.id === card.id)}
                isClickable={isClickable}
                onClick={onCardClick}
                onDoubleClick={onCardDoubleClick}
                disableAnimation={true}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HandDisplay;
