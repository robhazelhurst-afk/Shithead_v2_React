# Animation Quick Reference

## How to Trigger Animations in Game

### 🔥 Burn Animation
**When**: Playing 4 cards of the same rank
**How to trigger**:
1. Collect 4 cards of same rank (e.g., four 5s)
2. Select all 4 and click "Play Selected"
3. OR double-click each one if only card of that rank
4. Watch the pile flash and disappear!

### 🔄 Flip Animation  
**When**: Playing a face-down card
**How to trigger**:
1. Play until your hand AND face-up cards are empty
2. You'll be left with only face-down cards
3. Double-click any face-down card
4. Watch it flip to reveal what it is!
5. If valid, it plays; if invalid, you pick up pile

### ⚠️ Shake Animation
**When**: Attempting an invalid card play
**How to trigger**:
1. During your turn, try to play an invalid card
2. For example, play a 3 when top card is a King
3. The card will shake to show it's invalid
4. Message will appear saying "Cannot play [card]!"

### 💫 Pulse Animation
**When**: It's your turn (always active)
**How to see**:
1. During gameplay, watch your player area
2. The border glows/pulses when it's your turn
3. Stops pulsing when it's computer's turn
4. Automatically reactivates on your next turn

### 🎉 Celebration Animation
**When**: You win the game!
**How to trigger**:
1. Play all your cards before the computer
2. Last card gets rid of itself
3. Win screen appears
4. Your remaining card area bounces!

## Animation Timing Reference

| Animation | Duration | Can Skip? | Blocks Input? |
|-----------|----------|-----------|---------------|
| Burn 🔥 | ~500ms | No | Yes |
| Flip 🔄 | ~400ms | No | Yes |
| Shake ⚠️ | ~300ms | No | Yes |
| Pulse 💫 | Continuous | N/A | No |
| Celebrate 🎉 | ~600ms | No | No |

## Console Messages

Watch the browser console (F12) for these debug messages:

```
🔥 Starting burn animation
Found cards to burn: 4
🔥 Burn animation complete

🔄 Starting flip animation
🔄 Flip animation complete

⚠️ Starting shake animation
⚠️ Shake animation complete

🎉 Starting celebration animation
🎉 Celebration animation complete
```

## If Animations Don't Work

### Checklist:
- [ ] Is `index.html` open? (not direct file access)
- [ ] Are CSS files loading? (check Network tab, F12)
- [ ] Is JavaScript console showing errors? (F12)
- [ ] Did you play enough cards to trigger animation?
- [ ] Is `animationsEnabled` set to true?

### Quick Debug:
1. Open browser console (F12)
2. Type: `window.game.renderer.animationsEnabled`
3. Should show: `true`
4. If false, type: `window.game.renderer.animationsEnabled = true`

### Test Animations Standalone:
Open `test-animations.html` to test each animation individually without playing the game.

## Technical Details

### CSS Classes:
- `.burning` - Added during burn effect
- `.flipping` - Added during flip effect
- `.shake` - Added during shake effect
- `.active` - Always on current player area

### Animation Files:
- **CSS**: `css/animations.css` - Keyframe definitions
- **JS**: `js/ui/Animator.js` - Animation engine
- **JS**: `js/ui/RendererAnimated.js` - Animation triggers
- **Config**: `css/variables.css` - Timing & easing

### Customization:
Want faster animations? Edit `css/variables.css`:
```css
--anim-fast: 150ms;    /* Make it 100ms */
--anim-normal: 250ms;  /* Make it 150ms */
--anim-slow: 400ms;    /* Make it 250ms */
```

Want different easing? Edit `css/variables.css`:
```css
--ease-out: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

**Need help?** Check `ANIMATION_INVESTIGATION_COMPLETE.md` for full details!
