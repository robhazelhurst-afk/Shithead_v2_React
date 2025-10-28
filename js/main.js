// main.js - Main application entry point with animations

import { GameState } from './game/GameState.js';
import { RendererAnimated } from './ui/RendererAnimated.js';

class ShitheadGame {
    constructor() {
        console.log('ShitheadGame constructor called');
        
        try {
            this.gameState = new GameState();
            this.renderer = new RendererAnimated(this.gameState);
            this.timerInterval = null;
            this.swapPhaseComplete = false;
            
            console.log('Renderer created:', this.renderer);
            console.log('Animator:', this.renderer.animator);
            
            // Set up double-click handler
            this.renderer.onCardDoubleClick = (card) => this.handleDoubleClick(card);
            
            this.initializeEventListeners();
            this.showWelcome();
            
            console.log('Game initialized with animations!');
        } catch (error) {
            console.error('Error in constructor:', error);
            alert('Error initializing game: ' + error.message);
        }
    }

    initializeEventListeners() {
        // Game buttons
        document.getElementById('new-game-btn').addEventListener('click', () => {
            console.log('New Game clicked');
            this.startNewGame();
        });

        document.getElementById('play-btn').addEventListener('click', () => {
            if (this.gameState.gamePhase === 'swap') {
                this.finishSwapPhase();
            } else {
                this.playSelectedCards();
            }
        });

        document.getElementById('pickup-btn').addEventListener('click', () => {
            this.pickupPile();
        });

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('close-settings-btn').addEventListener('click', () => {
            this.hideSettings();
        });

        // Game over modal
        document.getElementById('new-game-from-modal-btn').addEventListener('click', () => {
            this.hideGameOver();
            this.startNewGame();
        });

        document.getElementById('close-game-over-btn').addEventListener('click', () => {
            this.hideGameOver();
        });
    }

    showWelcome() {
        this.renderer.showMessage('Welcome to Shithead! Click "New Game" to start', 0);
    }

    async startNewGame() {
        console.log('=== START NEW GAME ===');
        
        try {
            // Get settings
            const difficulty = document.getElementById('difficulty-select').value;
            const optional8 = document.getElementById('optional-8').checked;
            const optional9 = document.getElementById('optional-9').checked;

            // Start new game
            this.gameState.newGame(difficulty, optional8, optional9);

            // AI chooses setup cards automatically
            const aiInitialCards = [
                ...this.gameState.aiPlayer.faceUpCards,
                ...this.gameState.aiPlayer.hand
            ];
            
            const { faceUp, hand } = this.gameState.aiPlayer.chooseSetupCards(aiInitialCards);
            this.gameState.aiPlayer.faceUpCards = faceUp;
            this.gameState.aiPlayer.hand = hand;

            // For human: Move all face-up cards to hand for swap phase
            const player = this.gameState.humanPlayer;
            player.hand.push(...player.faceUpCards);
            player.faceUpCards = [];
            this.swapPhaseComplete = false;

            // Render immediately (no deal animation for now - will add later)
            this.renderer.clearSelection();
            this.renderer.render();
            
            console.log('Swap phase ready - all 6 cards in hand');
        } catch (error) {
            console.error('Error in startNewGame:', error);
            alert('Error starting game: ' + error.message);
        }
    }

    finishSwapPhase() {
        const selected = this.renderer.getSelectedCards();
        const player = this.gameState.humanPlayer;
        
        // Check if exactly 3 cards selected
        if (selected.length !== 3) {
            this.renderer.showMessage('Please select exactly 3 cards to place face-up!', 2000);
            return;
        }
        
        // Check all selected cards are from hand
        const allInHand = selected.every(card => player.hand.some(c => c.id === card.id));
        if (!allInHand) {
            this.renderer.showMessage('Please select cards from your hand!', 2000);
            return;
        }
        
        // Move selected cards to face-up
        for (let card of selected) {
            const index = player.hand.findIndex(c => c.id === card.id);
            if (index > -1) {
                player.hand.splice(index, 1);
                player.faceUpCards.push(card);
            }
        }
        
        console.log('Swap complete - 3 face-up, 3 in hand');
        
        // Start playing phase
        this.gameState.startPlayingPhase();
        this.startTimer();
        
        this.renderer.clearSelection();
        this.renderer.render();

        // If AI starts, make its move
        if (this.gameState.currentPlayer === this.gameState.aiPlayer) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    }

    async handleDoubleClick(card) {
        console.log('Double-clicked card:', card.displayName);
        
        // Check if it's a face-down card
        const player = this.gameState.humanPlayer;
        const isFaceDown = player.faceDownCards.some(c => c.id === card.id);
        
        if (isFaceDown) {
            // Face-down card - blind play
            await this.playFaceDownCard(card);
        } else {
            // Check if it's a valid move for a single card
            if (!this.gameState.canPlayCard(card)) {
                this.renderer.showMessage(`Cannot play ${card.displayName}!`, 2000);
                
                // Shake animation for invalid play
                const cardEl = this.renderer.cardElements.get(card.id);
                if (cardEl) {
                    console.log('Shaking card:', cardEl);
                    await this.renderer.animateInvalidPlay(cardEl);
                }
                return;
            }
            
            // Play the single card immediately
            await this.playCards([card]);
        }
    }

    async playSelectedCards() {
        const selectedCards = this.renderer.getSelectedCards();

        if (selectedCards.length === 0) {
            this.renderer.showMessage('No cards selected!', 2000);
            return;
        }

        const player = this.gameState.humanPlayer;
        
        // Check if any selected cards are face-down
        const hasFaceDown = selectedCards.some(card => 
            player.faceDownCards.some(c => c.id === card.id)
        );
        
        if (hasFaceDown) {
            // Can only play one face-down card at a time
            if (selectedCards.length > 1) {
                this.renderer.showMessage('Can only play one face-down card at a time!', 2000);
                return;
            }
            
            await this.playFaceDownCard(selectedCards[0]);
            return;
        }

        // Validate all cards can be played
        for (let card of selectedCards) {
            if (!this.gameState.canPlayCard(card)) {
                this.renderer.showMessage(`Cannot play ${card.displayName}!`, 2000);
                return;
            }
        }

        // Play the cards
        await this.playCards(selectedCards);
    }

    async playFaceDownCard(card) {
        const player = this.gameState.humanPlayer;
        
        // Get card element reference BEFORE any state changes
        const cardEl = this.renderer.cardElements.get(card.id);
        
        // Flip animation - show the card face during flip
        if (cardEl) {
            console.log('Flipping card:', cardEl);
            // Pass the card object so the animation can reveal it midway through flip
            await this.renderer.animateFlipCard(cardEl, card);
        }
        
        // Check if card can be played
        const canPlay = this.gameState.canPlayCard(card);
        
        if (canPlay) {
            // Success - play the card
            console.log('Face-down card CAN be played:', card.displayName);
            this.renderer.showMessage(`Revealed ${card.displayName} - Valid play!`, 2000);
            await this.playCards([card]);
        } else {
            // Failure - pick up pile + the face-down card
            console.log('Face-down card CANNOT be played:', card.displayName);
            
            // Remove face-down card from player
            const index = player.faceDownCards.findIndex(c => c.id === card.id);
            if (index > -1) {
                player.faceDownCards.splice(index, 1);
            }
            
            // Add face-down card to hand
            player.hand.push(card);
            
            // Pick up the entire discard pile
            const pileCards = this.gameState.pickupPile(player);
            
            this.renderer.showMessage(`Revealed ${card.displayName} - Invalid! Picked up ${pileCards.length + 1} cards`, 3000);
            this.renderer.clearSelection();
            
            // Switch to opponent
            this.gameState.switchPlayer();
            this.renderer.render();
            
            setTimeout(() => this.aiTurn(), 1500);
        }
    }

    async playCards(cards) {
        console.log('Playing cards with animation:', cards.map(c => c.displayName));
        
        // Play the cards in game state
        const result = this.gameState.playCards(this.gameState.humanPlayer, cards);

        // Animate burn if occurred - BEFORE render which clears the pile!
        if (result.burnOccurred) {
            this.renderer.showMessage('🔥 Burn! You get another turn!', 2000);
            console.log('Animating burn BEFORE render!');
            await this.renderer.animateBurn();
        }

        // Now render after animation completes
        this.renderer.clearSelection();
        this.renderer.render();

        // Check game over
        if (this.gameState.checkGameOver()) {
            console.log('Game over! Animating celebration');
            await this.renderer.animateCelebration();
            this.endGame();
            return;
        }

        // If extra turn (burn), don't switch player
        if (!result.extraTurn) {
            this.gameState.switchPlayer();
            this.renderer.render();

            // AI turn
            if (this.gameState.currentPlayer === this.gameState.aiPlayer) {
                setTimeout(() => this.aiTurn(), 1000);
            }
        }
    }

    async pickupPile() {
        const cards = this.gameState.pickupPile(this.gameState.humanPlayer);

        this.renderer.showMessage(`Picked up ${cards.length} cards`, 2000);
        this.renderer.clearSelection();

        // Switch to AI
        this.gameState.switchPlayer();
        this.renderer.render();

        setTimeout(() => this.aiTurn(), 1000);
    }

    async aiTurn() {
        console.log('=== AI TURN ===');
        
        // Show thinking message
        this.renderer.render();

        // Delay for realism
        await this.delay(800);

        const validPlays = this.gameState.getValidPlays(this.gameState.aiPlayer);
        console.log('AI valid plays:', validPlays.length);

        if (validPlays.length === 0) {
            // Check if AI is playing face-down cards
            const aiPlayer = this.gameState.aiPlayer;
            if (aiPlayer.hand.length === 0 && aiPlayer.faceUpCards.length === 0 && aiPlayer.faceDownCards.length > 0) {
                // AI must play a face-down card (blind)
                const faceDownCard = aiPlayer.faceDownCards[0];
                const canPlay = this.gameState.canPlayCard(faceDownCard);
                
                if (canPlay) {
                    // Success
                    const result = this.gameState.playCards(aiPlayer, [faceDownCard]);
                    this.renderer.showMessage(`Computer revealed ${faceDownCard.displayName} - Valid play!`, 2000);
                    
                    if (result.burnOccurred) {
                        console.log('AI burn! Animating BEFORE render...');
                        await this.renderer.animateBurn();
                    }
                    
                    this.renderer.render();
                    
                    if (this.gameState.checkGameOver()) {
                        setTimeout(() => this.endGame(), 1000);
                        return;
                    }
                    
                    if (result.extraTurn) {
                        setTimeout(() => this.aiTurn(), 1500);
                    } else {
                        this.gameState.switchPlayer();
                        this.renderer.render();
                    }
                    return;
                } else {
                    // Failure - pick up pile + face-down card
                    const index = aiPlayer.faceDownCards.indexOf(faceDownCard);
                    if (index > -1) {
                        aiPlayer.faceDownCards.splice(index, 1);
                    }
                    aiPlayer.hand.push(faceDownCard);
                    
                    const pileCards = this.gameState.pickupPile(aiPlayer);
                    this.renderer.showMessage(`Computer revealed ${faceDownCard.displayName} - Invalid! Picked up ${pileCards.length + 1} cards`, 3000);
                    
                    this.gameState.switchPlayer();
                    this.renderer.render();
                    return;
                }
            }
            
            // AI must pick up pile
            const cards = this.gameState.pickupPile(this.gameState.aiPlayer);
            this.renderer.showMessage(`Computer picked up ${cards.length} cards`, 2000);

            this.gameState.switchPlayer();
            this.renderer.render();
            return;
        }

        // AI chooses cards to play
        const gameStateForAI = this.gameState.getGameStateForAI();
        const cardsToPlay = this.gameState.aiPlayer.choosePlay(gameStateForAI);

        if (!cardsToPlay || cardsToPlay.length === 0) {
            // This shouldn't happen, but handle it
            const cards = this.gameState.pickupPile(this.gameState.aiPlayer);
            this.renderer.showMessage(`Computer picked up ${cards.length} cards`, 2000);

            this.gameState.switchPlayer();
            this.renderer.render();
            return;
        }

        // Play cards
        const result = this.gameState.playCards(this.gameState.aiPlayer, cardsToPlay);

        const cardNames = cardsToPlay.map(c => c.displayName).join(', ');
        this.renderer.showMessage(`Computer played: ${cardNames}`, 2000);

        // Animate burn if occurred - BEFORE render!
        if (result.burnOccurred) {
            console.log('AI burn! Animating BEFORE render...');
            await this.renderer.animateBurn();
        }

        this.renderer.render();

        // Check game over
        if (this.gameState.checkGameOver()) {
            setTimeout(() => this.endGame(), 1000);
            return;
        }

        // If extra turn (burn), AI plays again
        if (result.extraTurn) {
            setTimeout(() => this.aiTurn(), 1500);
        } else {
            // Switch back to player
            this.gameState.switchPlayer();
            this.renderer.render();
        }
    }

    endGame() {
        this.stopTimer();

        const winner = this.gameState.winner;
        const isPlayerWin = winner === this.gameState.humanPlayer;

        // Show game over modal
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        const stats = document.getElementById('game-over-stats');

        title.textContent = isPlayerWin ? '🎉 You Win!' : '😢 You Lose!';
        message.textContent = isPlayerWin 
            ? 'Congratulations! You are not the Shithead!' 
            : 'Better luck next time. You are the Shithead.';

        const gameTime = this.gameState.formatGameTime();
        stats.innerHTML = `
            <p><strong>Game Time:</strong> ${gameTime}</p>
            <p><strong>Burns Achieved:</strong> ${this.gameState.burnsAchieved}</p>
            <p><strong>Piles Picked Up:</strong> ${this.gameState.pilesPickedUp}</p>
            <p><strong>Difficulty:</strong> ${this.gameState.difficulty}</p>
        `;

        modal.classList.remove('hidden');
    }

    showSettings() {
        const modal = document.getElementById('settings-modal');
        modal.classList.remove('hidden');
    }

    hideSettings() {
        const modal = document.getElementById('settings-modal');
        modal.classList.add('hidden');
    }

    saveSettings() {
        // Settings are read on game start, so just close modal
        this.hideSettings();
        this.renderer.showMessage('Settings saved!', 2000);
    }

    hideGameOver() {
        const modal = document.getElementById('game-over-modal');
        modal.classList.add('hidden');
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.renderer.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating game with animations...');
    try {
        window.game = new ShitheadGame();
        console.log('Game created successfully with animations!');
    } catch (error) {
        console.error('Failed to create game:', error);
        alert('Failed to initialize game. Check console for details.');
    }
});
