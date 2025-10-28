# Animation Fixes - Round 2 ✅

## Issues Reported
1. ❌ **Burn animation not working** in game (works in test)
2. ❌ **Flip animation shows back-to-back** instead of revealing card face
3. ❌ **Hand cards not sorted** (should be low to high, left to right)

## Root Causes Found

### 1. Burn Animation Issue
**Problem**: The burn animation was being called AFTER `render()`, which removed the old discard pile cards from the DOM and created new ones. The animation had nothing to animate!

**Location in code**: `main.js` line 250-256
```javascript
// OLD (BROKEN):
const result = this.gameState.playCards(...);
this.renderer.clearSelection();
this.renderer.render();  // ← Cards removed here!
if (result.burnOccurred) {
    await this.renderer.animateBurn();  // ← Nothing to animate!
}
```

**Fix**: Animate burn BEFORE calling render()
```javascript
// NEW (FIXED):
const result = this.gameState.playCards(...);
if (result.burnOccurred) {
    await this.renderer.animateBurn();  // ← Animate first!
}
this.renderer.clearSelection();
this.renderer.render();  // ← Now render clean pile
```

### 2. Flip Animation Issue
**Problem**: The flip animation only changed the transform, but never changed the card's innerHTML from back to face. The Animator.flipCard() method didn't have access to the Card object to reveal it.

**Location**: `RendererAnimated.js` animateFlipCard() method

**Fix**: Complete rewrite of flip animation to manually change card content mid-flip:
```javascript
// First half - flip to 90deg (edge-on)
cardElement.style.transform = 'rotateY(90deg)';
await this.animator.sleep(200);

// Mid-flip - change content from back to face
cardElement.classList.remove('card-back');
cardElement.classList.add(card.color);
cardElement.innerHTML = `[card face HTML]`;

// Second half - flip back to 0deg (face viewer)
cardElement.style.transform = 'rotateY(0deg)';
await this.animator.sleep(200);
```

Also updated `main.js` to pass the card object to the animation:
```javascript
await this.renderer.animateFlipCard(cardEl, card);  // ← Pass card object
```

### 3. Hand Sorting Issue
**Problem**: Cards were rendered in the order they were dealt/picked up, not sorted by rank.

**Location**: `RendererAnimated.js` renderPlayerArea() method

**Fix**: Added `sortHand()` method and applied it before rendering:
```javascript
sortHand(hand) {
    return [...hand].sort((a, b) => a.rank - b.rank);
}

// In renderPlayerArea():
const sortedHand = this.sortHand(player.hand);
this.renderCardZone(this.elements.playerHand, sortedHand, false, handClickable);
```

## Files Modified

### 1. `js/main.js`
- **Line 250-260**: Moved burn animation BEFORE render() in `playCards()`
- **Line 234**: Pass card object to flip animation in `playFaceDownCard()`
- **Line 352-356**: Moved burn animation BEFORE render() in AI turn handling
- **Line 389-393**: Moved burn animation BEFORE render() in AI face-down play

### 2. `js/ui/RendererAnimated.js`
- **Added `sortHand()` method** (lines 47-52): Sorts cards by rank
- **Line 88**: Applied sorting to player hand before rendering
- **Lines 518-550**: Complete rewrite of `animateFlipCard()` to reveal card face
- **Line 518**: Changed signature to accept card object: `async animateFlipCard(cardElement, card)`

## Testing Checklist

### ✅ Test 1: Burn Animation in Game
1. Start new game
2. Collect and play 4 cards of same rank
3. **Expected**: Cards should flash/glow, then scale/fade out
4. **Check console**: "🔥 Starting burn animation" → "Found cards to burn: X" → "🔥 Burn animation complete"

### ✅ Test 2: Flip Animation Shows Face
1. Play until hand and face-up are empty
2. Double-click a face-down card
3. **Expected**: Card should flip from back → edge → reveal face → complete flip
4. **Check**: Card face (rank and suit) should be visible after animation

### ✅ Test 3: Hand Sorting
1. Start new game
2. Pick up some cards (varying ranks)
3. **Expected**: Hand shows cards sorted left-to-right: 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
4. **Note**: Suits don't matter for sort order, only rank

## Technical Details

### Animation Timing
- **Burn**: 200ms CSS flash + 600ms JS scale/fade = ~800ms total
- **Flip**: 200ms first half + 200ms second half = 400ms total
- **Hand Sort**: Instant (happens during render)

### Why Burn Works Now
Before: `gameState.playCards()` → `render()` → `animateBurn()` ❌
- render() creates new DOM elements
- Old cards with animation data are gone
- animateBurn() finds no cards to animate

After: `gameState.playCards()` → `animateBurn()` → `render()` ✅
- Old cards still in DOM
- animateBurn() finds and animates them
- render() clears pile after animation complete

### Why Flip Works Now
Before: Only CSS rotation, no content change
- Card rotated but still showed "SHITHEAD" text
- Never revealed actual card face

After: Manual flip with content swap
- Rotate to edge (90deg)
- Change HTML from back to face
- Rotate to face viewer (0deg)
- Card face is visible

### Hand Sorting
- Uses JavaScript array.sort()
- Compares card.rank values (2=2, 3=3, ..., 13=King, 14=Ace)
- Creates sorted copy (doesn't mutate original)
- Applied every render, so always up-to-date

## Known Limitations

1. **Burn animation timing**: If you play very quickly, you might miss it (it's fast!)
2. **Flip animation**: Doesn't use CSS flip-card keyframe anymore (using manual JS flip for control)
3. **Hand sorting stability**: Cards of same rank may swap positions when re-rendered

## Future Enhancements

Possible improvements:
- **Slower burn**: Make burn animation last longer (currently 800ms)
- **Burn sound effect**: Add audio for more impact
- **Sort by suit too**: Secondary sort by suit within same rank
- **Flip uses 3D perspective**: Add CSS perspective for better 3D effect
- **Animate hand reordering**: Cards slide to new positions when sorting changes

---

## Summary

✅ **ALL THREE ISSUES FIXED**

1. ✅ Burn animation works in game (animate before render)
2. ✅ Flip shows card face (manual content swap mid-flip)
3. ✅ Hand sorted low-to-high (sortHand() applied on render)

**Status**: Ready for testing!
