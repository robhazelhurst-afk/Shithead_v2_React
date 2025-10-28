// GameState.js - Core game state and rules management

import { Deck } from './Deck.js';
import { Player } from './Player.js';
import { AIPlayer } from './AIPlayer.js';

export class GameState {
    static PHASES = {
        SETUP: 'setup',
        SWAP: 'swap',
        PLAYING: 'playing',
        ENDED: 'ended'
    };

    constructor() {
        this.deck = new Deck();
        this.discardPile = [];
        this.humanPlayer = new Player('You', false);
        this.aiPlayer = null;
        this.currentPlayer = null;
        this.gamePhase = GameState.PHASES.SETUP;
        this.sevenEffectActive = false;
        this.nineThreshold = null;  // 'higher' or 'lower'
        this.gameStartTime = null;
        this.winner = null;
        
        // Settings
        this.difficulty = 'Medium';
        this.optional8Enabled = false;
        this.optional9Enabled = false;
        
        // Stats
        this.burnsAchieved = 0;
        this.pilesPickedUp = 0;
    }

    newGame(difficulty = 'Medium', optional8 = false, optional9 = false) {
        this.difficulty = difficulty;
        this.optional8Enabled = optional8;
        this.optional9Enabled = optional9;
        
        this.deck.reset();
        this.discardPile = [];
        this.sevenEffectActive = false;
        this.nineThreshold = null;
        this.gameStartTime = null;
        this.winner = null;
        this.burnsAchieved = 0;
        this.pilesPickedUp = 0;
        
        // Create players
        this.humanPlayer = new Player('You', false);
        this.aiPlayer = new AIPlayer('Computer', difficulty);
        
        // Deal cards
        this.dealInitialCards();
        
        this.gamePhase = GameState.PHASES.SWAP;
        this.currentPlayer = null;
    }

    dealInitialCards() {
        // Each player gets 3 face-down, 3 face-up, 3 in hand
        for (let player of [this.humanPlayer, this.aiPlayer]) {
            player.faceDownCards = this.deck.draw(3);
            player.faceUpCards = this.deck.draw(3);
            player.hand = this.deck.draw(3);
        }
    }

    startPlayingPhase() {
        this.gamePhase = GameState.PHASES.PLAYING;
        this.gameStartTime = Date.now();
        
        // Determine starting player (lowest card)
        this.currentPlayer = this.determineStartingPlayer();
    }

    determineStartingPlayer() {
        const allCards = [];
        
        // Collect all visible cards from both players
        for (let player of [this.humanPlayer, this.aiPlayer]) {
            for (let card of [...player.hand, ...player.faceUpCards]) {
                allCards.push({ card, player });
            }
        }
        
        if (allCards.length === 0) {
            return this.humanPlayer;
        }
        
        // Sort by card value (lowest first, suit priority for ties)
        allCards.sort((a, b) => a.card.compareTo(b.card));
        
        return allCards[0].player;
    }

    canPlayCard(card, topCard = null) {
        if (this.discardPile.length === 0 && !topCard) {
            return true;  // Empty pile, any card can be played
        }
        
        topCard = topCard || this.discardPile[this.discardPile.length - 1];
        
        // Special cards that can be played on anything
        if (card.rank === 2 || card.rank === 10) {
            return true;
        }
        
        // Seven effect: must play 7 or lower (or special cards)
        if (this.sevenEffectActive) {
            return card.rank <= 7 || [2, 10].includes(card.rank);
        }
        
        // Nine threshold effect (optional rule)
        if (this.nineThreshold) {
            if (this.nineThreshold === 'lower') {
                return card.rank <= 9 || [2, 10].includes(card.rank);
            } else {
                return card.rank >= 9 || [2, 10].includes(card.rank);
            }
        }
        
        // Normal play: must be equal or higher
        return card.rank >= topCard.rank;
    }

    getValidPlays(player) {
        const playableCards = player.getPlayableCards();
        const valid = [];
        
        if (playableCards.length === 0) {
            return [];
        }
        
        // If playing face-down card, can't choose - just check if it's valid
        if (player.faceDownCards.length > 0 && playableCards[0] === player.faceDownCards[0]) {
            const card = playableCards[0];
            return this.canPlayCard(card) ? [card] : [];
        }
        
        // Find all valid cards
        for (let card of playableCards) {
            if (this.canPlayCard(card)) {
                valid.push(card);
            }
        }
        
        return valid;
    }

    playCards(player, cards) {
        if (!Array.isArray(cards)) {
            cards = [cards];
        }
        
        // Remove cards from player
        const firstCard = cards[0];
        if (player.hand.some(c => c.id === firstCard.id)) {
            player.removeFromHand(cards);
        } else if (player.faceUpCards.some(c => c.id === firstCard.id)) {
            for (let card of cards) {
                const index = player.faceUpCards.findIndex(c => c.id === card.id);
                if (index > -1) {
                    player.faceUpCards.splice(index, 1);
                }
            }
        } else if (player.faceDownCards.some(c => c.id === firstCard.id)) {
            const index = player.faceDownCards.findIndex(c => c.id === firstCard.id);
            if (index > -1) {
                player.faceDownCards.splice(index, 1);
            }
        }
        
        // Add to discard pile
        this.discardPile.push(...cards);
        
        // Draw cards if hand is below 3 and deck has cards
        if (player.hand.length < 3 && !this.deck.isEmpty()) {
            const toDraw = 3 - player.hand.length;
            player.addToHand(this.deck.draw(toDraw));
        }
        
        // Handle special effects
        const playedRank = cards[0].rank;
        let burnOccurred = false;
        let extraTurn = false;
        
        // Reset seven effect unless a 7 was just played
        if (playedRank !== 7) {
            this.sevenEffectActive = false;
        }
        
        // Reset nine threshold unless a 9 was just played
        if (playedRank !== 9) {
            this.nineThreshold = null;
        }
        
        // Apply special effects
        if (playedRank === 2) {
            // Reset pile
            this.sevenEffectActive = false;
            this.nineThreshold = null;
        } else if (playedRank === 7) {
            // Next player must play 7 or lower
            this.sevenEffectActive = true;
        } else if (playedRank === 10) {
            // Burn the pile
            this.discardPile = [];
            burnOccurred = true;
            extraTurn = true;
            this.burnsAchieved++;
        }
        
        // Check for four-of-a-kind burn
        if (!burnOccurred && this.discardPile.length >= 4) {
            const topRank = this.discardPile[this.discardPile.length - 1].rank;
            const recentCards = this.discardPile.slice(-4);
            if (recentCards.every(c => c.rank === topRank)) {
                this.discardPile = [];
                burnOccurred = true;
                extraTurn = true;
                this.burnsAchieved++;
            }
        }
        
        return { burnOccurred, extraTurn, playedRank };
    }

    pickupPile(player) {
        const cards = [...this.discardPile];
        player.addToHand(cards);
        player.rememberCards(cards);
        this.discardPile = [];
        this.sevenEffectActive = false;
        this.nineThreshold = null;
        this.pilesPickedUp++;
        
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
            this.gamePhase = GameState.PHASES.ENDED;
            return true;
        }
        if (!this.aiPlayer.hasCards()) {
            this.winner = this.aiPlayer;
            this.gamePhase = GameState.PHASES.ENDED;
            return true;
        }
        return false;
    }

    getGameTime() {
        if (!this.gameStartTime) {
            return 0;
        }
        return Math.floor((Date.now() - this.gameStartTime) / 1000);
    }

    formatGameTime() {
        const seconds = this.getGameTime();
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Get game state for AI decision making
    getGameStateForAI() {
        return {
            topCard: this.discardPile.length > 0 ? this.discardPile[this.discardPile.length - 1] : null,
            discardPile: this.discardPile,
            validPlays: this.getValidPlays(this.aiPlayer),
            opponentHandSize: this.humanPlayer.hand.length,
            deckSize: this.deck.size,
            sevenEffectActive: this.sevenEffectActive,
            nineThreshold: this.nineThreshold
        };
    }
}
