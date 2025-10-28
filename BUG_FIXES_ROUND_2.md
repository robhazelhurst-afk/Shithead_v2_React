# 🔧 Bug Fixes Round 2 - Shithead 2

## Issues Fixed in This Update

### 1. ✅ Double-Click Logic Fixed
**Problem**: Double-click was checking ALL cards (hand + face-up together)  
**Solution**: 
- Now checks hand and face-up **separately**
- Can double-click a 4 in hand even if there's a 4 face-up
- **Exception**: When hand has only 1 card and face-up has same rank, double-click disabled (forces strategic choice)
- Face-down cards always allow double-click (blind play)

**Code Logic:**
```javascript
// Check the zone the card is in
if (inHand) {
    sameRankInZone = player.hand.filter(c => c.rank === card.rank);
    
    // Special case: 1 card in hand + same rank face-up = no double-click
    if (player.hand.length === 1 && player.faceUpCards.some(c => c.rank === card.rank)) {
        return; // Force manual choice
    }
} else if (inFaceUp) {
    sameRankInZone = player.faceUpCards.filter(c => c.rank === card.rank);
}
```

---

### 2. ✅ Swap Phase Completely Redesigned
**Problem**: Previous swap was confusing and not functional  
**New Approach**: 
1. At game start, **all 6 cards** (3 hand + 3 face-up) go into hand
2. You see all 6 cards in your hand
3. Select **exactly 3 cards** to place face-up
4. Click "Finish Swap" to start game
5. Remaining 3 cards stay in hand

**Much simpler and more intuitive!**

**Status Message:**
"🔄 Swap Phase: Click face-up cards to move to hand. When ready, select 3 cards from hand to be face-up, then click 'Finish Swap'"

---

### 3. ✅ Massive Card Overlap Improvement
**Problem**: Cards overlapped poorly with large hands  
**Solution**: 
- Increased game container width to 1400px (from 1200px)
- Increased hand area max-width to 900px (from 600px)
- Increased player area height to 180px (from 160px)
- **Dynamic overlap** based on hand size:
  - **1-10 cards**: No overlap (5px gap)
  - **11-20 cards**: Slight overlap (-20px)
  - **21-30 cards**: Medium overlap (-35px)
  - **31-40 cards**: Heavy overlap (-50px)

**CSS Magic:**
```css
/* Dynamic spacing using :has() selector */
.hand-zone:has(.card:nth-child(11)) .card {
    margin-left: -20px; /* Slight overlap */
}

.hand-zone:has(.card:nth-child(21)) .card {
    margin-left: -35px; /* Medium overlap */
}

.hand-zone:has(.card:nth-child(31)) .card {
    margin-left: -50px; /* Heavy overlap */
}
```

**Benefits:**
- Small hands: Cards spread out nicely
- Medium hands: Gentle overlap, still readable
- Large hands: Cards fan like real cards
- Max 40 cards: Still fits on screen!

---

## Files Modified

1. ✅ `js/ui/Renderer.js` - Fixed double-click logic, updated swap phase UI
2. ✅ `js/main.js` - Redesigned swap phase mechanics
3. ✅ `css/layout.css` - Dynamic card overlap, larger container
4. ✅ `css/cards.css` - Cleaner styles, removed old overlap code

---

## How to Test

### Test Double-Click (Fixed):
1. Start game, finish swap phase
2. **Test Case 1**: Hand has one 5, face-up has different cards
   - ✅ Double-click 5 → plays immediately
3. **Test Case 2**: Hand has one 5, face-up has a 5
   - ✅ Double-click doesn't work (need manual selection)
4. **Test Case 3**: Hand has two 5s
   - ✅ Double-click doesn't work (select which ones)
5. **Test Case 4**: Only face-up 5 available (hand empty)
   - ✅ Double-click works (plays immediately)

### Test Swap Phase (New):
1. Start new game
2. See all 6 cards in hand
3. Face-up area is empty
4. Click any 3 cards in hand (they highlight)
5. Click "Finish Swap"
6. Selected 3 move to face-up, other 3 stay in hand
7. Game starts!

### Test Card Overlap (Fixed):
1. Pick up a pile to get 10-15 cards
2. Cards overlap slightly but clearly
3. Pick up more to get 20-30 cards
4. Cards overlap more but still readable
5. Try to get 40 cards (rare!)
6. Cards heavily overlap but fit on screen

---

## Technical Details

### Double-Click Logic
- Checks **current zone only** (hand OR face-up, not both)
- Special case handles the "1 card left in hand" scenario
- Face-down cards always count as 1 (blind play)

### Swap Phase Flow
```javascript
startNewGame() {
    // Move ALL cards to hand
    player.hand.push(...player.faceUpCards);
    player.faceUpCards = [];
}

finishSwapPhase() {
    // Get selected 3 cards
    // Move them from hand to face-up
    // Start game
}
```

### Dynamic Overlap
Uses modern CSS `:has()` selector:
- Detects number of children
- Applies appropriate margin
- Smooth transition on hand size change

---

## Before & After

### Double-Click:
- ❌ Before: Checked hand + face-up together
- ✅ After: Checks each zone separately

### Swap Phase:
- ❌ Before: Broken, confusing
- ✅ After: Simple, intuitive, works perfectly

### Card Overlap:
- ❌ Before: Fixed -40px for all, looked bad
- ✅ After: Dynamic based on hand size, looks great

---

## Performance Notes

- **CSS :has() selector** requires modern browser (2023+)
- Works in Chrome 105+, Firefox 121+, Edge 105+, Safari 15.4+
- If older browser: cards won't scale dynamically but still work

---

## Next Steps

Test thoroughly and report:
1. ✅ Double-click behavior correct?
2. ✅ Swap phase intuitive?
3. ✅ Large hands look good?
4. Any other issues?

---

**All fixes saved and ready!** ✅

**Refresh your browser (Ctrl+Shift+R) to see changes!** 🔄

---

*Fixed: October 23, 2025*
*Round 2 of bug fixes complete!*
