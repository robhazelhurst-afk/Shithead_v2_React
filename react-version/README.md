# Shithead 2 - React Version 🃏⚛️

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Go to: **http://localhost:5173**

---

## What's New in React Version?

### Technology
- ⚛️ React 18 with hooks
- ⚡ Vite for fast dev experience
- 🎬 Framer Motion for animations  
- 🎨 Tailwind CSS for styling

### Features
- ✅ All game logic preserved
- ✅ Smooth hover animations
- ✅ Card selection feedback
- ✅ Special card glows
- ✅ Turn indicators
- ✅ Modern gradient design

---

## Commands

```bash
# Development
npm run dev          # Start dev server (hot reload)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

---

## Project Structure

```
src/
├── components/
│   └── Card.jsx           # Animated card component
├── game/                  # Game logic (unchanged!)
│   ├── Card.js
│   ├── Deck.js
│   ├── Player.js
│   ├── AIPlayer.js
│   └── GameState.js
├── hooks/
│   └── useGame.js         # Game state management hook
├── App.jsx                # Main game component
├── main.jsx               # Entry point
└── index.css              # Tailwind styles
```

---

## Key Differences from Vanilla JS Version

### Before (Vanilla JS)
- Manual DOM manipulation
- CSS transitions
- Event listeners everywhere
- Global state

### After (React)
- Component-based architecture
- Framer Motion animations
- React event handlers
- Hooks for state management

---

## Next Steps

See the comprehensive documentation in `/mnt/user-data/outputs/`:
- `START-HERE.md` - Quick entry
- `SUMMARY.md` - Complete overview
- `QUICK-START.md` - Detailed setup
- `NEXT-STEPS.md` - Feature roadmap

---

## Game Logic

**All game logic is 100% preserved!**

The files in `src/game/` are identical to your original vanilla JS version.  
Only the UI layer has been rebuilt with React.

---

**Ready to play? Run `npm run dev`!** 🚀
