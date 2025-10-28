# Animation Testing Checklist

Use this checklist to verify all animations are working correctly after the fix.

## Pre-Test Setup
- [ ] Browser: Chrome, Firefox, or Edge (modern browser)
- [ ] Open Developer Console (F12) to see debug messages
- [ ] Clear browser cache (Ctrl+Shift+Delete) if needed
- [ ] Files saved and server restarted (if using local server)

## Test 1: Standalone Animation Test
**File**: `test-animations.html`

- [ ] Open `test-animations.html` in browser
- [ ] Click "Test Burn 🔥" button
  - [ ] Cards flash/glow white
  - [ ] Cards scale up and fade out
  - [ ] Cards return to normal after animation
- [ ] Click "Test Flip 🔄" button
  - [ ] Card flips from back to face (or vice versa)
  - [ ] 3D rotation effect visible
  - [ ] Card content changes mid-flip
- [ ] Click "Test Shake ⚠️" button
  - [ ] Card shakes left and right
  - [ ] Returns to center
  - [ ] No distortion after shake
- [ ] Pulse animation
  - [ ] Blue glowing border pulses continuously
  - [ ] No console errors

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________

---

## Test 2: Game - Burn Animation
**Trigger**: Play four cards of the same rank

### Setup:
1. [ ] Start new game
2. [ ] Complete swap phase (select 3 cards for face-up)

### Test Steps:
3. [ ] Collect four cards of same rank (play strategically or get lucky)
4. [ ] Select all four cards
5. [ ] Click "Play Selected" button

### Expected Results:
- [ ] Console shows: "🔥 Starting burn animation"
- [ ] Console shows: "Found cards to burn: X" (where X >= 4)
- [ ] Discard pile cards flash/glow
- [ ] Cards scale up and rotate
- [ ] Cards fade out
- [ ] Console shows: "🔥 Burn animation complete"
- [ ] Burn message appears: "🔥 Burn! You get another turn!"
- [ ] Discard pile clears
- [ ] You get another turn

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________

---

## Test 3: Game - Shake Animation  
**Trigger**: Attempt to play an invalid card

### Setup:
1. [ ] Continue from previous game (or start new)
2. [ ] Wait until top discard card is high (e.g., King, Queen)

### Test Steps:
3. [ ] Select a low card (e.g., 3, 4, 5) that can't be played
4. [ ] Click "Play Selected"

### Expected Results:
- [ ] Console shows: "⚠️ Starting shake animation"
- [ ] Selected card shakes horizontally
- [ ] Card returns to original position
- [ ] Console shows: "⚠️ Shake animation complete"
- [ ] Error message appears: "Cannot play [card]!"
- [ ] Card remains in your hand

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________

---

## Test 4: Game - Flip Animation
**Trigger**: Play a face-down card

### Setup:
1. [ ] Play game until hand is empty
2. [ ] Play game until face-up cards are empty
3. [ ] Only face-down cards should remain

### Test Steps:
4. [ ] Double-click a face-down card
5. [ ] Watch the flip animation

### Expected Results:
- [ ] Console shows: "🔄 Starting flip animation"
- [ ] Card rotates 180 degrees (3D flip)
- [ ] Card face is revealed mid-flip
- [ ] Console shows: "🔄 Flip animation complete"
- [ ] If valid: Card plays to discard pile
- [ ] If invalid: Message "Invalid! Picked up X cards" appears
- [ ] Animation is smooth and complete

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________

---

## Test 5: Game - Pulse Animation
**Trigger**: Your turn vs Computer's turn

### Test Steps:
1. [ ] Start new game
2. [ ] Complete swap phase
3. [ ] Observe your player area during your turn
4. [ ] Play cards to switch to computer's turn
5. [ ] Observe your player area during computer's turn
6. [ ] Wait for your turn again

### Expected Results:
- [ ] During YOUR turn: Blue glowing border pulses around your area
- [ ] During COMPUTER turn: Pulse stops on your area
- [ ] Pulse returns when it's your turn again
- [ ] Animation is continuous and smooth
- [ ] No performance issues

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________

---

## Test 6: Game - Celebration Animation
**Trigger**: Win the game

### Setup:
1. [ ] Start new game on Easy difficulty
2. [ ] Complete swap phase
3. [ ] Play strategically to win quickly

### Test Steps:
4. [ ] Play until you have no cards left
5. [ ] Win the game

### Expected Results:
- [ ] Console shows: "Game over! Animating celebration"
- [ ] Console shows: "🎉 Starting celebration animation"
- [ ] Your remaining cards (if any) bounce
- [ ] Console shows: "🎉 Celebration animation complete"
- [ ] Win modal appears
- [ ] No console errors

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________

---

## Test 7: Console Verification
**Check for errors and warnings**

### Open Console (F12) and verify:
- [ ] No red error messages
- [ ] No yellow warning messages
- [ ] Animation debug messages appear (🔥 🔄 ⚠️ 🎉)
- [ ] CSS files loaded successfully (Network tab)
- [ ] JavaScript files loaded successfully (Network tab)
- [ ] No 404 errors for any files

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________

---

## Test 8: Cross-Browser Test
Test in multiple browsers if possible:

### Chrome/Chromium:
- [ ] All animations work
- [ ] No console errors
- [ ] Performance is good

### Firefox:
- [ ] All animations work
- [ ] No console errors
- [ ] Performance is good

### Edge:
- [ ] All animations work
- [ ] No console errors
- [ ] Performance is good

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________

---

## Final Results

| Test | Status | Notes |
|------|--------|-------|
| 1. Standalone Test | ☐ Pass ☐ Fail | |
| 2. Burn Animation | ☐ Pass ☐ Fail | |
| 3. Shake Animation | ☐ Pass ☐ Fail | |
| 4. Flip Animation | ☐ Pass ☐ Fail | |
| 5. Pulse Animation | ☐ Pass ☐ Fail | |
| 6. Celebration | ☐ Pass ☐ Fail | |
| 7. Console Check | ☐ Pass ☐ Fail | |
| 8. Cross-Browser | ☐ Pass ☐ Fail | |

**Overall Result**: ☐ All Pass ☐ Some Fail

---

## If Tests Fail

### Common Issues:

**No animations at all:**
1. Check if CSS files are loading (Network tab in F12)
2. Verify `animationsEnabled` is true: `window.game.renderer.animationsEnabled`
3. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

**Some animations work, others don't:**
1. Check console for specific errors during failed animation
2. Verify that specific CSS class is defined in `animations.css`
3. Check if animation method is being called (console.log should appear)

**Animations are choppy:**
1. Close other browser tabs
2. Check for high CPU usage
3. Try reducing animation duration in `variables.css`

**Console shows errors:**
1. Read the error message carefully
2. Check if it's a file loading issue
3. Verify all file paths are correct
4. Make sure using a web server (not file://)

### Need Help?
- Review `ANIMATION_INVESTIGATION_COMPLETE.md`
- Check `ANIMATION_QUICK_REFERENCE.md`
- Review `ANIMATION_FIX.md` for technical details

---

## Testing Completed By
**Name**: _______________________________________
**Date**: _______________________________________
**Time**: _______________________________________
**Overall Status**: ☐ PASS ☐ FAIL
