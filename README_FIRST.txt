# ⚠️ READ THIS FIRST!

## The Game Won't Work by Opening index.html Directly!

You saw the **CORS error** because modern browsers block ES6 modules from `file://` URLs.

---

## ✅ How to Run the Game

### Quick Start (3 Steps):
1. **Double-click**: `START_SERVER.bat`
2. **Open browser to**: `http://localhost:8000`
3. **Click**: "New Game" and play!

---

### What START_SERVER.bat Does:
- Automatically detects if you have Python or Node.js
- Starts a local web server on port 8000
- Lets the game work properly in your browser

---

### If START_SERVER.bat Doesn't Work:

**Install Python** (recommended):
- Download: https://www.python.org/downloads/
- Install it
- Run START_SERVER.bat again

**OR Install Node.js**:
- Download: https://nodejs.org/
- Install it  
- Run START_SERVER.bat again

---

### Manual Commands:

**With Python**:
```
cd C:\Claude\shithead_2
python -m http.server 8000
```

**With Node.js**:
```
cd C:\Claude\shithead_2
npx http-server -p 8000
```

Then open: `http://localhost:8000`

---

## 📚 More Help

- **QUICK_START.md** - Detailed instructions
- **WELCOME_BACK.md** - Full game overview
- **PHASE_1_COMPLETE.md** - Technical details

---

## 🎮 TL;DR

1. Run `START_SERVER.bat`
2. Go to `http://localhost:8000`
3. Play!

That's it! 🚀
