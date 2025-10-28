# Shithead 2 🃏

**A modern, beautifully animated web-based card game**

---

## 📖 About

Shithead 2 is a complete reimagining of the classic Shithead card game with a focus on modern design and smooth animations. Built with pure HTML/CSS/JavaScript, it features React-style animations without framework overhead.

## ✨ Key Features

- 🎨 **Stunning Modern UI** - Gradient backgrounds, depth shadows, polished design
- ⚡ **Smooth Animations** - 60fps animations for every interaction
- 🤖 **Smart AI Opponent** - Three difficulty levels (Easy, Medium, Hard)
- 📊 **Statistics Tracking** - Track wins, losses, and fastest times
- 🎮 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚙️ **Customizable Rules** - Toggle optional special cards
- 🎯 **Tested Game Logic** - Reuses proven logic from original implementation

## 🎯 Game Rules

### Objective
Don't be the last player with cards - that player is the "Shithead"

### Setup
- Each player gets 3 face-down cards, 3 face-up cards, and 3 cards in hand
- Remaining cards form the draw pile

### Gameplay
- Play cards equal to or higher than the top discard pile card
- Draw cards to maintain 3 in hand (while draw pile lasts)
- Can't play? Pick up the entire discard pile
- Play through hand → face-up cards → face-down cards (blind)

### Special Cards
- **2**: Reset (can play on anything, next player can play any card)
- **7**: Low card (next player must play 7 or lower)
- **10**: Burn (removes discard pile, play again)
- **Ace**: High card (only Ace, 2, or 10 can be played on it)
- **Four-of-a-kind**: Burn pile automatically

### Optional Rules
- **8**: Skip next player's turn
- **9**: Set threshold (next card must be higher or lower than 9)

## 🗂️ Project Structure

```
shithead_2/
├── PROJECT_SPEC.md       # Complete specification (READ THIS FIRST)
├── IMPLEMENTATION.md     # Technical implementation plan
├── README.md             # This file
│
├── index.html            # Main game (to be created)
│
├── css/
│   ├── variables.css
│   ├── layout.css
│   ├── cards.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── game/             # Game logic classes
│   ├── ui/               # Rendering & DOM
│   ├── animation/        # Animation engine
│   └── utils/            # Helpers
│
└── assets/
    └── sounds/           # Optional sound effects
```

## 🚀 Development Roadmap

### Phase 1: Foundation ✅ (Day 1-2)
- [ ] HTML structure
- [ ] Core game classes (JavaScript port)
- [ ] Basic rendering
- [ ] Playable game (no animations)

### Phase 2: Styling (Day 3)
- [ ] Modern CSS design
- [ ] Card styling
- [ ] Layout polish
- [ ] Responsive breakpoints

### Phase 3: Core Animations (Day 4-5)
- [ ] Animation engine
- [ ] Card play animations
- [ ] Draw/pickup animations
- [ ] Hover effects

### Phase 4: Special Effects (Day 6)
- [ ] Burn effects
- [ ] Special card glows
- [ ] Turn indicators
- [ ] Win/lose screens

### Phase 5: Polish (Day 7)
- [ ] Settings modal
- [ ] Statistics display
- [ ] Leaderboards
- [ ] Final refinements

## 🎨 Design Principles

1. **Modern & Clean** - Card-like UI with depth
2. **Smooth & Fluid** - Every interaction polished
3. **Clear Feedback** - Visual cues for all game states
4. **Performance First** - 60fps animations always
5. **Accessible** - Keyboard navigation, screen reader support

## 🔧 Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Flexbox, Grid, Animations, Custom Properties
- **JavaScript ES6+** - Classes, Async/Await, Modules
- **No Frameworks** - Pure vanilla JS for performance

## 📊 Performance Targets

- First Paint: <500ms
- Interactive: <1s
- Animation Frame Rate: 60fps
- Memory: <50MB
- Bundle Size: <100KB

## 🎯 Next Steps

### For You (Review & Decide)

1. **Read PROJECT_SPEC.md** - Complete vision and design
2. **Review IMPLEMENTATION.md** - Technical approach
3. **Answer key questions:**
   - Pure JavaScript port OR Python bridge?
   - CSS-rendered cards OR card images?
   - Full scope OR focus on core + animations?
   - Timeline preference?

### For Me (When Approved)

1. Create HTML skeleton
2. Port game logic to JavaScript
3. Build rendering system
4. Layer in animations
5. Polish until perfect

## 📝 Credits

- Original game logic from `C:\Claude\shithead` (battle-tested)
- Design inspiration from Microsoft Solitaire
- Built with care and attention to detail

---

**Status**: 📋 Specification Complete - Ready for Review
**Created**: October 23, 2025
**Version**: 1.0

---

## 💬 Feedback

Read the PROJECT_SPEC.md and let me know your thoughts!
What aspects are most important to you?
