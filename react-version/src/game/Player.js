// Player.js - Player class representing a game player

export class Player {
    constructor(name, isAI = false) {
        this.name = name;
        this.isAI = isAI;
        this.hand = [];
        this.faceUpCards = [];
        this.faceDownCards = [];
        this.memory = [];  // Cards seen from discard pile pickups
    }

    addToHand(cards) {
        if (Array.isArray(cards)) {
            this.hand.push(...cards);
        } else {
            this.hand.push(cards);
        }
    }

    removeFromHand(cards) {
        if (!Array.isArray(cards)) {
            cards = [cards];
        }
        
        for (let card of cards) {
            const index = this.hand.findIndex(c => c.id === card.id);
            if (index > -1) {
                this.hand.splice(index, 1);
            }
        }
    }

    hasCards() {
        return this.hand.length > 0 || 
               this.faceUpCards.length > 0 || 
               this.faceDownCards.length > 0;
    }

    getPlayableCards() {
        if (this.hand.length > 0) {
            return this.hand;
        } else if (this.faceUpCards.length > 0) {
            return this.faceUpCards;
        } else if (this.faceDownCards.length > 0) {
            return [this.faceDownCards[0]];  // Can only play one face-down at a time
        }
        return [];
    }

    rememberCards(cards) {
        this.memory.push(...cards);
    }

    sortHand() {
        this.hand.sort((a, b) => a.compareTo(b));
    }

    get totalCards() {
        return this.hand.length + this.faceUpCards.length + this.faceDownCards.length;
    }

    toString() {
        return `${this.name} (${this.totalCards} cards)`;
    }
}
