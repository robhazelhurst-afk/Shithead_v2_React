// AIPlayer.js - AI player with difficulty-based strategies

import { Player } from './Player.js';

export class AIPlayer extends Player {
    static DIFFICULTIES = {
        EASY: 'Easy',
        MEDIUM: 'Medium',
        HARD: 'Hard'
    };

    static MEMORY_LIMITS = {
        Easy: 5,
        Medium: 15,
        Hard: 52
    };

    constructor(name, difficulty = 'Medium') {
        super(name, true);
        this.difficulty = difficulty;
        this.memoryLimit = AIPlayer.MEMORY_LIMITS[difficulty];
    }

    rememberCards(cards) {
        super.rememberCards(cards);
        
        // Keep only recent cards based on memory limit
        if (this.memory.length > this.memoryLimit) {
            this.memory = this.memory.slice(-this.memoryLimit);
        }
    }

    chooseSetupCards(initialCards) {
        // Choose which 3 cards to place face-up from the 6 visible cards
        
        if (this.difficulty === AIPlayer.DIFFICULTIES.EASY) {
            // Random selection
            const shuffled = [...initialCards].sort(() => Math.random() - 0.5);
            return {
                faceUp: shuffled.slice(0, 3),
                hand: shuffled.slice(3)
            };
        }
        
        if (this.difficulty === AIPlayer.DIFFICULTIES.MEDIUM) {
            // Place mid-value cards face-up (5-9), keep high/special in hand
            const sorted = [...initialCards].sort((a, b) => a.compareTo(b));
            const faceUp = [];
            const hand = [];
            
            // Prefer mid-range cards for face-up
            for (let card of sorted) {
                if (faceUp.length < 3 && card.rank >= 5 && card.rank <= 9) {
                    faceUp.push(card);
                } else {
                    hand.push(card);
                }
            }
            
            // Fill remaining face-up slots with lowest cards
            while (faceUp.length < 3 && hand.length > 0) {
                faceUp.push(hand.shift());
            }
            
            return { faceUp, hand };
        }
        
        // Hard: Optimal placement
        const sorted = [...initialCards].sort((a, b) => a.compareTo(b));
        const specialRanks = [2, 7, 10, 14];  // Keep special cards in hand
        const faceUp = [];
        const hand = [];
        
        // First pass: separate special cards
        for (let card of sorted) {
            if (specialRanks.includes(card.rank)) {
                hand.push(card);
            } else {
                faceUp.push(card);
            }
        }
        
        // Take lowest non-special cards for face-up
        while (faceUp.length > 3) {
            hand.push(faceUp.pop());
        }
        
        // If not enough, take from hand
        while (faceUp.length < 3 && hand.length > 0) {
            hand.sort((a, b) => a.compareTo(b));
            faceUp.push(hand.shift());
        }
        
        return { faceUp, hand };
    }

    choosePlay(gameState) {
        const validPlays = gameState.validPlays;
        
        if (!validPlays || validPlays.length === 0) {
            return null;  // Must pick up pile
        }
        
        switch (this.difficulty) {
            case AIPlayer.DIFFICULTIES.EASY:
                return this._easyPlay(validPlays);
            case AIPlayer.DIFFICULTIES.MEDIUM:
                return this._mediumPlay(validPlays, gameState);
            case AIPlayer.DIFFICULTIES.HARD:
                return this._hardPlay(validPlays, gameState);
            default:
                return this._mediumPlay(validPlays, gameState);
        }
    }

    _easyPlay(validPlays) {
        // Play random valid card
        const randomIndex = Math.floor(Math.random() * validPlays.length);
        return [validPlays[randomIndex]];
    }

    _mediumPlay(validPlays, gameState) {
        const { discardPile, opponentHandSize } = gameState;
        
        // Check for four-of-a-kind burn opportunity
        if (discardPile.length > 0) {
            const topRank = discardPile[discardPile.length - 1].rank;
            const matching = validPlays.filter(c => c.rank === topRank);
            const countOnPile = discardPile.filter(c => c.rank === topRank).length;
            
            if (countOnPile === 3 && matching.length > 0) {
                return [matching[0]];  // Complete the burn
            }
        }
        
        // Save 2s and 10s for emergencies
        const specialCards = validPlays.filter(c => [2, 10].includes(c.rank));
        const regularCards = validPlays.filter(c => ![2, 10].includes(c.rank));
        
        if (regularCards.length > 0) {
            // Play lowest valid card
            regularCards.sort((a, b) => a.compareTo(b));
            return [regularCards[0]];
        }
        
        // Must play special card
        return [validPlays[0]];
    }

    _hardPlay(validPlays, gameState) {
        const { discardPile, opponentHandSize } = gameState;
        
        // Priority 1: Complete four-of-a-kind burn
        if (discardPile.length > 0) {
            const topRank = discardPile[discardPile.length - 1].rank;
            const matching = validPlays.filter(c => c.rank === topRank);
            const countOnPile = discardPile.filter(c => c.rank === topRank).length;
            
            if (countOnPile === 3 && matching.length > 0) {
                return [matching[0]];
            }
        }
        
        // Priority 2: Set up four-of-a-kind burn
        const rankCounts = {};
        for (let card of validPlays) {
            rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
        }
        
        for (let [rank, count] of Object.entries(rankCounts)) {
            if (count >= 4) {
                // Play all four at once
                return validPlays.filter(c => c.rank === parseInt(rank)).slice(0, 4);
            }
            if (count >= 2 && discardPile.length > 0) {
                // Check if 2 already on pile
                const pileCount = discardPile.filter(c => c.rank === parseInt(rank)).length;
                if (pileCount >= 2) {
                    return validPlays.filter(c => c.rank === parseInt(rank)).slice(0, 2);
                }
            }
        }
        
        // Priority 3: Use 7s strategically when opponent has large hand
        if (opponentHandSize > 5) {
            const sevens = validPlays.filter(c => c.rank === 7);
            if (sevens.length > 0) {
                return [sevens[0]];
            }
        }
        
        // Priority 4: Conserve special cards (2, 10) unless necessary
        const specialCards = validPlays.filter(c => [2, 10].includes(c.rank));
        const regularCards = validPlays.filter(c => ![2, 10].includes(c.rank));
        
        if (regularCards.length > 0) {
            // Play lowest regular card
            regularCards.sort((a, b) => a.compareTo(b));
            return [regularCards[0]];
        }
        
        // Priority 5: Use special cards strategically
        if (discardPile.length > 10) {
            // Large pile, use 10 to burn it
            const tens = specialCards.filter(c => c.rank === 10);
            if (tens.length > 0) {
                return [tens[0]];
            }
        }
        
        // Default: play lowest card
        validPlays.sort((a, b) => a.compareTo(b));
        return [validPlays[0]];
    }
}
