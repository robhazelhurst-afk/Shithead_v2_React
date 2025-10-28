# Shithead 2 - Technical Implementation Plan

## 🏗️ Approach: Pure JavaScript Port

### Why Pure JavaScript?
1. **No Dependencies**: Runs in any browser, zero setup
2. **Fast Performance**: Direct DOM manipulation
3. **Easy Deployment**: Single HTML file if needed
4. **Future Android Port**: Can use WebView or React Native
5. **Full Control**: Custom animations without framework overhead

### Architecture Decision
✅ **Port Python logic to JavaScript**
- JavaScript classes mirror Python classes
- Proven game logic preserved exactly
- Web-native from the start

---

## 📁 Project Structure

```
C:\Claude\shithead_2\
│
├── index.html                 # Main entry point
│
├── css/
│   ├── reset.css             # Browser normalization
│   ├── variables.css         # CSS custom properties
│   ├── layout.css            # Page structure
│   ├── cards.css             # Card styling
│   ├── animations.css        # All animations
│   └── responsive.css        # Media queries
│
├── js/
│   ├── main.js               # App initialization
│   ├── game/
│   │   ├── Card.js           # Card class
│   │   ├── Deck.js           # Deck class
│   │   ├── Player.js         # Player class
│   │   ├── AIPlayer.js       # AI logic
│   │   ├── GameState.js      # Game state manager
│   │   └── Rules.js          # Rule validation
│   ├── ui/
│   │   ├── Renderer.js       # DOM manipulation
│   │   ├── CardRenderer.js   # Card creation/updates
│   │   ├── StatusBar.js      # Status messages
│   │   └── Controls.js       # Button handlers
│   ├── animation/
│   │   ├── Animator.js       # Core animation engine
│   │   ├── CardAnimations.js # Card-specific animations
│   │   └── Effects.js        # Special effects (burn, etc)
│   └── utils/
│       ├── EventBus.js       # Event system
│       └── Storage.js        # LocalStorage wrapper
│
├── assets/
│   └── sounds/               # Optional audio files
│
├── docs/
│   ├── PROJECT_SPEC.md       # Design specification
│   ├── IMPLEMENTATION.md     # This file
│   ├── REVIEW_SUMMARY.md     # Quick overview
│   └── README.md             # User documentation
│
└── README.md                 # Project root readme
```

---

## 🔄 Development Phases

### PHASE 1: Foundation (Day 1-2)
**Goal**: Get a playable game with zero animations

#### 1.1 HTML Structure
- Basic page layout
- Container divs for all game areas
- Status bar, player areas, center pile
- Control buttons

#### 1.2 Core Game Classes (JavaScript port)
- Card class with rank, suit, display properties
- Deck class with shuffle and draw methods
- Player class with hand, face-up, face-down management
- AIPlayer class with difficulty-based decision making
- GameState class with all rule logic

#### 1.3 Basic Renderer
- Card element creation
- Simple rendering of all game areas
- Click event handlers
- Basic game loop

**Deliverable**: Playable game, no animations, basic styling

---

### PHASE 2: Modern Styling (Day 3)
**Goal**: Make it look stunning (still no animations)

#### 2.1 CSS Variables
- Color palette
- Spacing constants
- Typography scale
- Shadow definitions

#### 2.2 Card Styling
- White card faces with shadows
- Proper suit colors (red/black)
- Corner pips
- Card back design

#### 2.3 Layout Design
- Gradient background
- Green table surface
- Proper card spacing
- Responsive breakpoints

**Deliverable**: Beautiful static game

---

### PHASE 3: Core Animations (Day 4-5)
**Goal**: Smooth, React-like animations for main actions

#### 3.1 Animation Engine
- Custom Animator class
- Promise-based animation methods
- Sequence, parallel, stagger utilities
- Easing function library

#### 3.2 Card Animations
- Play card (slide to discard)
- Draw card (zoom from deck)
- Pickup pile (cascade effect)
- Card hover effects
- Card selection

#### 3.3 CSS Transitions
- Hover states
- Active states
- Transform animations

**Deliverable**: Smooth card movements, satisfying interactions

---

### PHASE 4: Special Effects (Day 6)
**Goal**: Visual polish for special cards and game events

#### 4.1 Burn Effect
- Card highlight
- Fire emoji animation
- Fade out effect

#### 4.2 Special Card Glows
- Blue glow for 2 (Reset)
- Orange glow for 10 (Burn)
- Green glow for 7 (Low)

#### 4.3 Turn Indicator
- Pulsing animation around active player
- Status message animations

**Deliverable**: Polished, juicy game feel

---

### PHASE 5: Settings & Polish (Day 7)
**Goal**: Complete feature set

#### 5.1 Settings Modal
- Difficulty selection
- Optional rules toggles
- Modal open/close animations

#### 5.2 Statistics Display
- LocalStorage persistence
- Stats modal
- Leaderboard display

#### 5.3 Final Polish
- Sound effects (optional)
- Code cleanup
- Performance optimization
- Bug fixes

**Deliverable**: Feature-complete game

---

## 💻 Code Examples

### Card Class
```javascript
// js/game/Card.js
export class Card {
  constructor(rank, suit) {
    this.rank = rank;    // 2-14 (11=J, 12=Q, 13=K, 14=A)
    this.suit = suit;    // 'hearts', 'diamonds', 'spades', 'clubs'
    this.faceUp = true;
    this.id = `${rank}-${suit}-${Date.now()}`;
  }
  
  get displayName() {
    const rankStr = {11: 'J', 12: 'Q', 13: 'K', 14: 'A'}[this.rank] || this.rank;
    const suitSymbol = {
      'hearts': '♥',
      'diamonds': '♦',
      'spades': '♠',
      'clubs': '♣'
    }[this.suit];
    return `${rankStr}${suitSymbol}`;
  }
  
  get color() {
    return ['hearts', 'diamonds'].includes(this.suit) ? 'red' : 'black';
  }
  
  isSpecial() {
    return [2, 7, 10, 14].includes(this.rank);
  }
}
```

### Animator Class
```javascript
// js/animation/Animator.js
export class Animator {
  animate(element, keyframes, options = {}) {
    const animation = element.animate(keyframes, {
      duration: options.duration || 250,
      easing: options.easing || 'ease-out',
      fill: 'forwards'
    });
    return animation.finished;
  }
  
  async moveCard(element, from, to, duration = 250) {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    
    await this.animate(element, [
      { transform: 'translate(0, 0)' },
      { transform: `translate(${deltaX}px, ${deltaY}px)` }
    ], { 
      duration, 
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' 
    });
  }
  
  async sequence(animations) {
    for (let anim of animations) {
      await anim();
    }
  }
  
  async parallel(animations) {
    await Promise.all(animations.map(anim => anim()));
  }
  
  async stagger(animations, delay = 50) {
    for (let i = 0; i < animations.length; i++) {
      const animPromise = animations[i]();
      const delayPromise = new Promise(resolve => 
        setTimeout(resolve, delay)
      );
      await Promise.race([animPromise, delayPromise]);
    }
  }
}
```

### Game State Class (Core Logic)
```javascript
// js/game/GameState.js
export class GameState {
  constructor() {
    this.deck = new Deck();
    this.discardPile = [];
    this.humanPlayer = new Player('You', false);
    this.aiPlayer = new AIPlayer('Computer', 'Medium');
    this.currentPlayer = null;
    this.gamePhase = 'setup';
    this.sevenEffectActive = false;
    this.nineThreshold = null;
  }
  
  newGame(difficulty = 'Medium', optional8 = false, optional9 = false) {
    this.difficulty = difficulty;
    this.optional8Enabled = optional8;
    this.optional9Enabled = optional9;
    
    this.deck.reset();
    this.discardPile = [];
    this.sevenEffectActive = false;
    this.nineThreshold = null;
    
    this.humanPlayer = new Player('You', false);
    this.aiPlayer = new AIPlayer('Computer', difficulty);
    
    this.dealInitialCards();
    this.gamePhase = 'swap';
  }
  
  dealInitialCards() {
    for (let player of [this.humanPlayer, this.aiPlayer]) {
      player.faceDownCards = this.deck.draw(3);
      player.faceUpCards = this.deck.draw(3);
      player.hand = this.deck.draw(3);
    }
  }
  
  canPlayCard(card, topCard = null) {
    if (!this.discardPile.length && !topCard) return true;
    
    topCard = topCard || this.discardPile[this.discardPile.length - 1];
    
    // Special cards
    if (card.rank === 2 || card.rank === 10) return true;
    
    // Seven effect
    if (this.sevenEffectActive) {
      return card.rank <= 7 || [2, 10].includes(card.rank);
    }
    
    // Nine threshold (optional)
    if (this.nineThreshold) {
      if (this.nineThreshold === 'lower') {
        return card.rank <= 9 || [2, 10].includes(card.rank);
      } else {
        return card.rank >= 9 || [2, 10].includes(card.rank);
      }
    }
    
    // Normal play
    return card.rank >= topCard.rank;
  }
  
  playCards(player, cards) {
    if (!Array.isArray(cards)) cards = [cards];
    
    // Remove from player
    if (cards[0] in player.hand) {
      cards.forEach(c => player.removeFromHand(c));
    } else if (cards[0] in player.faceUpCards) {
      cards.forEach(c => {
        const idx = player.faceUpCards.indexOf(c);
        if (idx > -1) player.faceUpCards.splice(idx, 1);
      });
    } else if (player.faceDownCards.includes(cards[0])) {
      const idx = player.faceDownCards.indexOf(cards[0]);
      if (idx > -1) player.faceDownCards.splice(idx, 1);
    }
    
    // Add to discard
    this.discardPile.push(...cards);
    
    // Draw cards
    if (player.hand.length < 3 && this.deck.cards.length > 0) {
      const toDraw = 3 - player.hand.length;
      player.hand.push(...this.deck.draw(toDraw));
    }
    
    // Handle special effects
    const playedRank = cards[0].rank;
    let burnOccurred = false;
    let extraTurn = false;
    
    if (playedRank !== 7) this.sevenEffectActive = false;
    if (playedRank !== 9) this.nineThreshold = null;
    
    if (playedRank === 2) {
      this.sevenEffectActive = false;
      this.nineThreshold = null;
    } else if (playedRank === 7) {
      this.sevenEffectActive = true;
    } else if (playedRank === 10) {
      this.discardPile = [];
      burnOccurred = true;
      extraTurn = true;
    }
    
    // Four-of-a-kind check
    if (!burnOccurred && this.discardPile.length >= 4) {
      const topRank = this.discardPile[this.discardPile.length - 1].rank;
      const recent = this.discardPile.slice(-4);
      if (recent.every(c => c.rank === topRank)) {
        this.discardPile = [];
        burnOccurred = true;
        extraTurn = true;
      }
    }
    
    return { burnOccurred, extraTurn, playedRank };
  }
  
  pickupPile(player) {
    const cards = [...this.discardPile];
    player.hand.push(...cards);
    player.rememberCards(cards);
    this.discardPile = [];
    this.sevenEffectActive = false;
    this.nineThreshold = null;
    return cards;
  }
  
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.humanPlayer 
      ? this.aiPlayer 
      : this.humanPlayer;
  }
  
  checkGameOver() {
    if (!this.humanPlayer.hasCards()) {
      this.winner = this.humanPlayer;
      this.gamePhase = 'ended';
      return true;
    }
    if (!this.aiPlayer.hasCards()) {
      this.winner = this.aiPlayer;
      this.gamePhase = 'ended';
      return true;
    }
    return false;
  }
}
```

---

## 🎨 CSS Structure

### Variables
```css
/* css/variables.css */
:root {
  /* Colors */
  --bg-gradient-start: #1e3c72;
  --bg-gradient-end: #2a5298;
  --table-green: rgba(10, 90, 10, 0.9);
  --card-white: #ffffff;
  --card-red: #DC143C;
  --card-black: #000000;
  --gold-accent: #FFD700;
  --green-action: #4CAF50;
  --red-warning: #f44336;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.5);
  --shadow-gold: 0 8px 16px rgba(255,215,0,0.5);
  
  /* Spacing */
  --card-width: 80px;
  --card-height: 112px;
  --card-gap: 10px;
  --border-radius: 8px;
  --spacing-sm: 10px;
  --spacing-md: 20px;
  --spacing-lg: 30px;
  
  /* Animation */
  --anim-fast: 150ms;
  --anim-normal: 250ms;
  --anim-slow: 400ms;
  --ease-out: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
}

@media (max-width: 768px) {
  :root {
    --card-width: 60px;
    --card-height: 84px;
    --card-gap: 8px;
  }
}
```

### Card Styles
```css
/* css/cards.css */
.card {
  width: var(--card-width);
  height: var(--card-height);
  background: var(--card-white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: transform var(--anim-fast) var(--ease-out),
              box-shadow var(--anim-fast) var(--ease-out);
}

.card:hover:not(.disabled) {
  transform: translateY(-10px);
  box-shadow: var(--shadow-lg);
}

.card.selected {
  transform: translateY(-20px);
  border: 3px solid var(--gold-accent);
  box-shadow: var(--shadow-gold);
}

.card.red {
  color: var(--card-red);
}

.card.black {
  color: var(--card-black);
}

.card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-rank {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
}

.card-suit {
  font-size: 32px;
  line-height: 1;
}

.card-back {
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Special card glows */
.card[data-rank="2"] {
  box-shadow: var(--shadow-md), 0 0 20px rgba(0, 100, 255, 0.3);
}

.card[data-rank="10"] {
  box-shadow: var(--shadow-md), 0 0 20px rgba(255, 100, 0, 0.3);
}

.card[data-rank="7"].active {
  box-shadow: var(--shadow-md), 0 0 20px rgba(0, 255, 0, 0.4);
}
```

### Animations
```css
/* css/animations.css */
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  50% { box-shadow: 0 0 0 20px rgba(76, 175, 80, 0); }
}

@keyframes burn-flash {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.5) drop-shadow(0 0 20px #ff6600); }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.player-area.active {
  animation: pulse 2s infinite;
}

.card.burning {
  animation: burn-flash 200ms ease-in-out;
}

.status-message {
  animation: slide-in 300ms var(--ease-out);
}
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] All card combinations playable
- [ ] Special cards work correctly (2, 7, 10, Ace)
- [ ] Four-of-a-kind burn triggers
- [ ] Face-down cards playable when appropriate
- [ ] AI makes reasonable decisions at all difficulty levels
- [ ] Animations smooth at 60fps
- [ ] Responsive on different screen sizes
- [ ] Statistics persist across sessions
- [ ] Settings save correctly
- [ ] No console errors
- [ ] Memory leaks checked

---

## 🚀 Deployment

### Option 1: Single File
- Inline all CSS/JS into index.html
- Easy to share, zero dependencies

### Option 2: GitHub Pages
- Push to repository
- Enable GitHub Pages
- Instant hosting

### Option 3: Progressive Web App
- Add manifest.json
- Add service worker
- Offline play capability

---

## 📊 Performance Targets

- **First Paint**: <500ms
- **Interactive**: <1s
- **Animation Frame Rate**: 60fps constant
- **Memory**: <50MB total
- **Bundle Size**: <100KB (uncompressed)

---

## 🎯 Success Metrics

### Technical
- ✅ Zero bugs in game logic
- ✅ All animations complete under 400ms
- ✅ 60fps maintained during all animations
- ✅ Works on Chrome, Firefox, Safari, Edge

### User Experience
- ✅ Every interaction feels instant
- ✅ Animations enhance, don't distract
- ✅ Clear what to do at every game state
- ✅ Fun to play repeatedly

---

**Status**: Ready to begin implementation
**Next Step**: Create HTML skeleton and start Phase 1

All code examples are ready to be implemented as-is!
