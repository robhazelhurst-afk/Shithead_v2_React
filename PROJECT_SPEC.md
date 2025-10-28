# Shithead 2 - Project Specification
## Modern Web-Based Card Game with React-Style Animations

---

## 🎯 Project Overview

**Shithead 2** is a complete reimagining of the Shithead card game with a focus on modern, polished UI/UX and smooth animations. While preserving the battle-tested game logic from the original implementation, this version will feature:

- **Modern Web Stack**: HTML5 + CSS3 + Vanilla JavaScript (React-style approach without framework overhead)
- **Stunning Visual Design**: Gradient backgrounds, card shadows, smooth transitions
- **Fluid Animations**: Card movements, flips, burns, pile pickups with easing functions
- **Responsive Layout**: Adapts to different screen sizes
- **Performance**: 60fps animations, optimized rendering

---

## 🎨 Visual Design Philosophy

### Core Aesthetic
- **Modern & Clean**: Card-like UI elements with depth and shadows
- **Vibrant but Professional**: Rich colors without being garish
- **Smooth & Fluid**: Every interaction should feel polished
- **Clear Feedback**: Visual cues for every game state

### Color Palette
```css
Primary Background: Linear gradient (#1e3c72 → #2a5298) - Deep blue
Game Table: Semi-transparent green (#0a5a0a with 90% opacity)
Card Background: Pure white (#ffffff)
Card Shadows: Multi-layer shadows for depth
Accent Colors: 
  - Gold (#FFD700) for selections
  - Crimson (#DC143C) for hearts/diamonds
  - Deep Black (#000000) for spades/clubs
  - Green (#4CAF50) for actions
  - Red (#f44336) for warnings
```

---

## 🎭 Animation Strategy

### Animation Principles
1. **Purposeful**: Every animation serves a game-state purpose
2. **Fast but Visible**: 200-400ms for most transitions (never feel sluggish)
3. **Easing**: Use cubic-bezier for natural motion
4. **Staggered**: Multiple cards animate in sequence, not simultaneously
5. **Feedback**: Hover states, click feedback, state changes all animated

### Key Animations

#### Card Movements
- **Deal Animation**: Cards fly from deck to player positions (300ms each, staggered by 50ms)
- **Play Animation**: Card slides from hand to discard pile (250ms)
- **Draw Animation**: Card zooms from deck to hand (200ms)
- **Pickup Animation**: Cards cascade from discard to hand (150ms each, staggered)

#### Card States
- **Hover**: Lift 10px, add glow (200ms ease-out)
- **Select**: Lift 20px, add gold border (150ms)
- **Flip**: 3D rotation effect for face-down cards (400ms)
- **Disabled**: Fade to 50% opacity (200ms)

#### Special Effects
- **Burn Effect**: 
  1. Cards pulse/glow (200ms)
  2. Fade out with scale down (400ms)
  3. "🔥" emoji appears and fades (500ms total)
- **Four-of-a-Kind Trigger**: Quick flash effect on matching cards
- **Reset (2)**: Brief ripple effect from card
- **Seven Effect**: Blue glow on discard pile

#### UI Animations
- **Status Messages**: Slide in from top, fade out after 3s
- **Button Interactions**: Scale on hover (1.05), depress on click
- **Turn Indicator**: Pulsing glow around active player area

---

## 🎮 Game Layout

### Screen Structure
```
┌─────────────────────────────────────────────────┐
│  STATUS BAR (Game state, turn, messages)        │
├─────────────────────────────────────────────────┤
│                                                  │
│  COMPUTER AREA                                   │
│  [Face-Down] [Face-Up] [...Hand...] (hidden)    │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  CENTER TABLE                                    │
│    [Draw Pile]    [Discard Pile]                │
│                    (12 cards)                    │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  PLAYER AREA                                     │
│  [Face-Down] [Face-Up] [...Hand...]             │
│                                                  │
├─────────────────────────────────────────────────┤
│  CONTROLS [Play] [Pick Up] [New Game]  TIME: 2:34│
└─────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Desktop**: 1200px+ (full layout as above)
- **Tablet**: 768-1199px (compact spacing, smaller cards)
- **Mobile**: <768px (vertical stack, minimal UI)

---

## 🃏 Card Design

### Card Specifications
```css
Dimensions: 80px × 112px (desktop), 60px × 84px (mobile)
Border Radius: 8px
Box Shadow: 
  - Normal: 0 4px 8px rgba(0,0,0,0.3)
  - Hover: 0 8px 16px rgba(0,0,0,0.5)
  - Selected: 0 8px 16px rgba(255,215,0,0.5)
```

### Card Face
- **Rank**: Large centered (28px font, bold)
- **Suit Symbol**: Unicode symbols (32px): ♥ ♦ ♠ ♣
- **Corner Pips**: Small rank+suit in top-left
- **Back Design**: Red gradient with subtle pattern

### Special Card Indicators
- **2 (Reset)**: Subtle blue glow
- **7 (Low)**: Green tint when active
- **10 (Burn)**: Orange/red glow
- **Ace**: Purple/gold accent

---

## 🎲 Game Logic Integration

### Preserved from Original
✅ Use existing `shithead_game.py` as reference (it's perfect)
✅ All game rules correctly implemented
✅ AI difficulty levels (Easy/Medium/Hard)
✅ Special card effects (2, 7, 10, Ace)
✅ Optional rules (8, 9)
✅ Four-of-a-kind burn detection
✅ Face-down card mechanics
✅ Statistics tracking

### JavaScript Implementation
Port the Python game logic to JavaScript:
1. Card, Deck, Player, AIPlayer, GameState classes
2. All rule validation logic
3. AI decision making algorithms
4. Statistics management
5. Settings persistence (localStorage)

---

## 🔧 Technical Implementation

### File Structure
```
C:\Claude\shithead_2\
├── index.html          # Main game page
├── css/
│   ├── main.css        # Core styles
│   ├── cards.css       # Card-specific styles
│   └── animations.css  # Animation definitions
├── js/
│   ├── game.js         # Game state management
│   ├── renderer.js     # DOM manipulation & rendering
│   ├── animations.js   # Animation controllers
│   ├── ai.js           # AI logic (ported)
│   └── utils.js        # Helper functions
├── assets/
│   ├── cards/          # Card images (if not using CSS)
│   └── sounds/         # Optional sound effects
└── docs/
    ├── PROJECT_SPEC.md       # This file
    ├── IMPLEMENTATION.md     # Technical details
    └── README.md             # User documentation
```

### Core Technologies
- **HTML5**: Semantic structure, canvas for effects
- **CSS3**: 
  - Flexbox/Grid for layout
  - Transitions & Animations
  - Custom properties (CSS variables)
  - 3D transforms for card flips
- **JavaScript (ES6+)**:
  - Classes for game objects
  - Async/await for animations
  - Event delegation for performance
  - State management pattern
  - No frameworks (pure JS for performance)

### Animation Library
Create custom animation engine:
```javascript
class Animator {
  animate(element, from, to, duration, easing) {
    // RequestAnimationFrame-based animation
    // Returns promise for chaining
  }
  
  sequence(animations) {
    // Run animations in sequence
  }
  
  parallel(animations) {
    // Run animations simultaneously
  }
  
  stagger(animations, delay) {
    // Run animations with delay between each
  }
}
```

---

## ✨ Feature Highlights

### Phase 1 - Core Game (Week 1)
- [x] Complete game logic (port from Python)
- [ ] Basic HTML structure
- [ ] Card rendering system
- [ ] Player areas (human & AI)
- [ ] Hand management
- [ ] Basic play/pickup functionality
- [ ] Turn system

### Phase 2 - Visual Polish (Week 2)
- [ ] Modern CSS styling
- [ ] Card hover effects
- [ ] Selection highlighting
- [ ] Status message system
- [ ] Button styling
- [ ] Responsive layout

### Phase 3 - Animations (Week 3)
- [ ] Card deal animation
- [ ] Card play animation
- [ ] Draw card animation
- [ ] Pickup pile animation
- [ ] Card flip animation (face-down)
- [ ] Burn effect
- [ ] Smooth transitions between game states

### Phase 4 - Special Effects (Week 4)
- [ ] Four-of-a-kind burn highlight
- [ ] Special card glows (2, 7, 10)
- [ ] Turn indicator pulse
- [ ] Win/lose screen animation
- [ ] Optional: Particle effects
- [ ] Optional: Sound effects

### Phase 5 - Polish & Settings
- [ ] Settings modal
- [ ] Difficulty selection
- [ ] Optional rules toggles
- [ ] Statistics display
- [ ] Leaderboard view
- [ ] Game timer display
- [ ] Background customization
- [ ] Card style selection

---

## 🎯 Key Interactions

### Card Selection
1. **Hover**: Card lifts slightly, shadow increases
2. **Click**: Card selected (gold border, lifts more)
3. **Click Again**: Card deselected (returns to normal)
4. **Play Button**: Selected cards animate to discard pile

### Game Flow
1. **Deal Phase**: Cards fly to positions with stagger
2. **Swap Phase**: Drag & drop or click-to-swap between hand and face-up
3. **Play Phase**: Select → Play → Draw → Switch turns (all animated)
4. **Face-Down**: Click flips card, then auto-plays or forces pickup
5. **Win**: Victory animation, stats update

### AI Turn
1. Slight delay (500ms) for realism
2. Cards from AI hand fade out
3. Cards appear on discard pile with slide animation
4. AI draws cards with animation
5. Turn switches to player

---

## 📱 Responsive Design

### Desktop (>1200px)
- Full layout with spacious card areas
- Large cards (80×112px)
- Hover effects enabled
- All animations at full speed

### Tablet (768-1199px)
- Compact layout
- Medium cards (70×98px)
- Reduced spacing
- Faster animations (80% duration)

### Mobile (<768px)
- Vertical stack layout
- Small cards (60×84px)
- Tap instead of hover
- Essential animations only
- Simplified status messages

---

## 🎨 Animation Timing Reference

```javascript
const ANIMATION_DURATIONS = {
  CARD_HOVER: 200,
  CARD_SELECT: 150,
  CARD_PLAY: 250,
  CARD_DRAW: 200,
  CARD_FLIP: 400,
  CARD_PICKUP: 150,
  BURN_EFFECT: 600,
  PILE_CLEAR: 300,
  STATUS_MESSAGE: 300,
  BUTTON_HOVER: 150,
  TURN_SWITCH: 400,
  DEAL_CARD: 300,
  STAGGER_DELAY: 50
};

const EASING_FUNCTIONS = {
  EASE_OUT: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  EASE_IN_OUT: 'cubic-bezier(0.42, 0, 0.58, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  EASE_IN: 'cubic-bezier(0.42, 0, 1, 1)'
};
```

---

## 🔊 Optional Enhancements

### Sound Effects (if time permits)
- Card shuffle
- Card flip
- Card play (soft tap)
- Burn effect (whoosh)
- Pickup (cascade sound)
- Win/lose jingles
- Button clicks

### Particle Effects
- Sparkles on four-of-a-kind burn
- Confetti on win
- Smoke puff on card burn

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion option

---

## 🚀 Development Priority

### MUST HAVE (P0)
1. ✅ Working game logic
2. Modern visual design
3. Smooth card play animations
4. Responsive layout
5. Basic AI opponent

### SHOULD HAVE (P1)
1. All special animations (burn, flip, etc.)
2. Settings system
3. Statistics tracking
4. Multiple difficulty levels
5. Turn indicators & feedback

### NICE TO HAVE (P2)
1. Sound effects
2. Particle effects
3. Multiple card styles
4. Background themes
5. Leaderboards

---

## 📝 Success Criteria

The project is complete when:
- ✅ All game rules work perfectly
- ✅ Every user interaction feels smooth and polished
- ✅ Animations enhance, not distract from gameplay
- ✅ Game runs at 60fps on modern browsers
- ✅ Responsive design works on desktop and tablet
- ✅ Code is clean, maintainable, and well-commented
- ✅ Game is actually fun to play!

---

## 🎯 Next Steps

1. **Review this spec** - Your feedback on approach
2. **Technology decision** - Pure JS port confirmed
3. **Start with skeleton** - HTML structure + basic CSS
4. **Implement core rendering** - Get cards on screen
5. **Add game logic** - Make it playable (no animations)
6. **Layer in animations** - One system at a time
7. **Polish and refine** - Iterate until perfect

---

## 💭 Questions Answered

1. **Technology**: Pure JavaScript port ✅
   - Simpler deployment, faster, no dependencies
   - Reuses existing logic patterns, but in JavaScript

2. **Card Style**: CSS-rendered cards ✅
   - Smaller, scalable, customizable
   - Can add custom styles easily

3. **Scope**: Full feature set ✅
   - Core game + all animations
   - Settings, stats, leaderboards

4. **Timeline**: 7 days development

---

**Created**: October 23, 2025
**Version**: 1.0
**Status**: Ready for Implementation
