# 🎮 Quick Start Guide - Shithead 2

## ⚠️ IMPORTANT: You Need a Local Web Server!

The game uses ES6 modules which require a web server. You can't just open the HTML file directly.

---

## 🚀 Three Ways to Run the Game

### Option 1: Use the Batch File (Easiest!)
1. Navigate to: `C:\Claude\shithead_2\`
2. **Double-click**: `START_SERVER.bat`
3. A command window will open and start a server
4. **Open your browser** to: `http://localhost:8000`
5. **Play!**

(Press Ctrl+C in the command window to stop the server when done)

---

### Option 2: Python Command (If you have Python)
1. Open **Command Prompt**
2. Navigate to the game folder:
   ```
   cd C:\Claude\shithead_2
   ```
3. Run:
   ```
   python -m http.server 8000
   ```
4. Open browser to: **http://localhost:8000**

---

### Option 3: Node.js Command (If you have Node.js)
1. Open **Command Prompt**
2. Navigate to the game folder:
   ```
   cd C:\Claude\shithead_2
   ```
3. Run:
   ```
   npx http-server -p 8000
   ```
4. Open browser to: **http://localhost:8000**

---

## 🎯 Once the Server is Running

### Start a New Game
1. The page will load with "Welcome to Shithead!"
2. Click the blue **"New Game"** button
3. Cards are dealt automatically

### Play Your Turn
1. **Click cards in your hand** to select them (gold border appears)
2. **Click "Play Selected"** (green button)
3. **Or click "Pick Up Pile"** (red button) if you can't play

### Win the Game!
- Get rid of all your cards before the computer
- Play through: Hand → Face-up cards → Face-down cards

---

## 🎯 Game Rules Quick Reference

### Basic Rules
- Play cards **equal or higher** than the top card
- After playing, draw cards to keep 3 in hand
- Can't play? **Pick up the entire pile**

### Special Cards
- **2**: Reset (can play on anything)
- **7**: Low (next player must play 7 or lower)
- **10**: Burn pile (play again)
- **Ace**: High (only 2, 10, or Ace)
- **Four-of-a-kind**: Automatic burn!

---

## ⚙️ Settings

Click **"Settings"** to:
- Change AI difficulty (Easy, Medium, Hard)
- Enable optional rule: 8 skips turn
- Enable optional rule: 9 sets threshold

---

## 🐛 Troubleshooting

### "CORS policy" or "ERR_FAILED" Error?
- ❌ **Don't open index.html directly** (file:// URLs don't work)
- ✅ **Use a web server** (see options above)

### Button Not Working?
- Make sure you're using: `http://localhost:8000`
- **NOT**: `file:///C:/Claude/shithead_2/index.html`

### Server Won't Start?
- Install **Python**: https://www.python.org/downloads/
- **OR** install **Node.js**: https://nodejs.org/

### Page Won't Load?
1. Make sure server is running (command window open)
2. Check the URL is: `http://localhost:8000`
3. Try `http://127.0.0.1:8000` instead
4. Try a different port: change `8000` to `8080`

---

## 🎨 Visual Cues

### Colors
- **Gold border**: Selected card
- **Blue glow**: 2 (Reset card)
- **Green glow**: 7 (Low card - when active)
- **Orange glow**: 10 (Burn card)
- **Pulsing border**: Active player's area

---

## 💡 Tips

1. **Save special cards** (2 and 10) for emergencies
2. **Use 7s strategically** to force low cards
3. **Watch the discard pile** for burn opportunities
4. **Try different difficulties**
5. **Pick up early** rather than get stuck

---

## 📱 Mobile Play

Works on mobile too! Just access `http://[your-computer-ip]:8000` from your phone when connected to the same WiFi.

---

## 🎯 Summary

1. **Run**: `START_SERVER.bat` (or use Python/Node command)
2. **Open**: `http://localhost:8000` in your browser
3. **Click**: "New Game"
4. **Play**: Select cards, click Play Selected
5. **Win**: Get rid of all your cards!

---

**The game MUST run on a web server!**
**You cannot open index.html directly!**

This is a browser security feature, not a bug. 😊

---

**Ready to play!** 🎮

Just double-click `START_SERVER.bat` and open `http://localhost:8000`
