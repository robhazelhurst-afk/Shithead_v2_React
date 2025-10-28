// Deck.js - Deck class for managing the card deck

import { Card } from './Card.js';

export class Deck {
    constructor() {
        this.cards = [];
        this.reset();
    }

    reset() {
        this.cards = [];
        const suits = Object.values(Card.SUITS);
        
        for (let suit of suits) {
            for (let rank = 2; rank <= 14; rank++) {  // 2-14 (Ace is 14)
                this.cards.push(new Card(rank, suit));
            }
        }
        
        this.shuffle();
    }

    shuffle() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(count = 1) {
        const drawn = [];
        const actualCount = Math.min(count, this.cards.length);
        
        for (let i = 0; i < actualCount; i++) {
            drawn.push(this.cards.pop());
        }
        
        return drawn;
    }

    isEmpty() {
        return this.cards.length === 0;
    }

    get size() {
        return this.cards.length;
    }

    peek() {
        return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
    }
}
