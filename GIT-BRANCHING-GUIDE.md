# Git Branching Guide for React Migration

## Current Situation
- You have committed the vanilla JS version to `main` branch
- React version is in `C:\Claude\shithead_2\react-version\` folder
- You want to create a `react` branch for the React version

---

## Option 1: React Version in Subfolder (Recommended)

Keep both versions in the same repo, React in a subfolder.

### Steps:
```bash
cd C:\Claude\shithead_2

# Create and switch to react branch
git checkout -b react

# The react-version folder is already there
# Add it to git
git add react-version/
git commit -m "Add React version in react-version subfolder"

# Push to remote (if you have one)
git push -u origin react
```

### Pros:
- Both versions coexist
- Easy to compare
- Can cherry-pick changes between versions

### Cons:
- Larger repo size
- Two codebases to maintain

---

## Option 2: Replace with React Version

Replace the entire codebase with React on the react branch.

### Steps:
```bash
cd C:\Claude\shithead_2

# Create and switch to react branch
git checkout -b react

# Remove old files (keep game logic)
rm -rf css/ js/ui/
mv js/game/ temp-game/

# Move React files to root
mv react-version/* .
mv react-version/.gitignore .
rmdir react-version

# Restore game logic if needed (they're the same)
rm -rf src/game/
mv temp-game/ src/game/

# Add everything
git add .
git commit -m "Migrate to React + Vite + Framer Motion + Tailwind"

# Push to remote
git push -u origin react
```

### Pros:
- Clean React-only branch
- No duplication
- Clearer structure

### Cons:
- Vanilla JS version only on main branch
- More work to compare versions

---

## Option 3: Separate Repos (Advanced)

Create completely separate repositories.

### Steps:
```bash
# Keep current repo for vanilla JS
cd C:\Claude\shithead_2

# Create new repo for React version
cd ..
mkdir shithead-react-repo
cd shithead-react-repo
git init

# Copy React files
cp -r ../shithead_2/react-version/* .
cp ../shithead_2/react-version/.gitignore .

# Initial commit
git add .
git commit -m "Initial commit: React version of Shithead card game"

# Add remote and push (if you want)
# git remote add origin YOUR_REPO_URL
# git push -u origin main
```

### Pros:
- Completely separate
- Independent versioning
- No confusion

### Cons:
- Two repos to manage
- Harder to share changes

---

## My Recommendation: Option 1

**Keep both in same repo with React in subfolder**

### Why?
1. Easy to switch between versions
2. Can reference vanilla JS version
3. Gradual migration possible
4. Both versions maintained

### Quick Commands:
```bash
cd C:\Claude\shithead_2

# Create react branch
git checkout -b react

# Add React version
git add react-version/
git commit -m "Add React version with Vite, Framer Motion, and Tailwind CSS"

# Switch back to main (vanilla JS)
git checkout main

# Switch to react branch
git checkout react

# Merge changes from main into react (if needed)
git merge main
```

---

## After Branching

### To Work on Vanilla JS:
```bash
git checkout main
# Edit files
git add .
git commit -m "Your changes"
git push
```

### To Work on React:
```bash
git checkout react
cd react-version  # if using Option 1
npm install
npm run dev
# Make changes
git add .
git commit -m "Your changes"
git push
```

---

## Testing Your Setup

After creating the react branch:

```bash
# Check current branch
git branch

# Should show:
#   main
# * react

# Check files are there
ls react-version/  # (if Option 1)

# Try running React version
cd react-version
npm install
npm run dev
```

---

## Git Workflow Going Forward

### Adding Features to React Version:
```bash
git checkout react
cd react-version
# Make changes
git add .
git commit -m "Add feature: card deal animation"
git push
```

### Keeping Branches in Sync:
```bash
# If you fix a bug in game logic on main
git checkout main
# Fix bug in js/game/
git add js/game/
git commit -m "Fix: card comparison bug"

# Apply same fix to react branch
git checkout react
# Copy fix to react-version/src/game/ or cherry-pick
git add react-version/src/game/
git commit -m "Fix: card comparison bug (from main)"
```

---

## Quick Reference

```bash
# See all branches
git branch

# Create new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# See current branch
git branch --show-current

# Compare branches
git diff main react

# Merge main into react
git checkout react
git merge main

# Delete branch (careful!)
git branch -d branch-name
```

---

## What's Next?

1. Choose your option (I recommend Option 1)
2. Run the commands
3. Verify with `git branch`
4. Test the React version works
5. Start developing!

---

**Need help? Just ask!** I can walk you through any of these options step by step.
