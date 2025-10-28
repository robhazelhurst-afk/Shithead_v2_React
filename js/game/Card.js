// Card.js - Card class representing a playing card

export class Card {
    static SUITS = {
        HEARTS: 'hearts',
        DIAMONDS: 'diamonds',
        SPADES: 'spades',
        CLUBS: 'clubs'
    };

    static SUIT_SYMBOLS = {
        hearts: '♥',
        diamonds: '♦',
        spades: '♠',
        clubs: '♣'
    };

    static SUIT_PRIORITY = {
        hearts: 0,
        diamonds: 1,
        spades: 2,
        clubs: 3
    };

    static RANK_NAMES = {
        11: 'J',
        12: 'Q',
        13: 'K',
        14: 'A'
    };

    constructor(rank, suit) {
        this.rank = rank;  // 2-14 (11=J, 12=Q, 13=K, 14=A)
        this.suit = suit;  // 'hearts', 'diamonds', 'spades', 'clubs'
        this.faceUp = true;
        this.id = `${rank}-${suit}-${Date.now()}-${Math.random()}`;
    }

    get displayRank() {
        return Card.RANK_NAMES[this.rank] || String(this.rank);
    }

    get displaySuit() {
        return Card.SUIT_SYMBOLS[this.suit];
    }

    get displayName() {
        return `${this.displayRank}${this.displaySuit}`;
    }

    get color() {
        return [Card.SUITS.HEARTS, Card.SUITS.DIAMONDS].includes(this.suit) ? 'red' : 'black';
    }

    isSpecial() {
        return [2, 7, 10, 14].includes(this.rank);
    }

    compareTo(other) {
        if (this.rank !== other.rank) {
            return this.rank - other.rank;
        }
        return Card.SUIT_PRIORITY[this.suit] - Card.SUIT_PRIORITY[other.suit];
    }

    toString() {
        return this.displayName;
    }

    // Create a deep copy of this card
    clone() {
        const copy = new Card(this.rank, this.suit);
        copy.faceUp = this.faceUp;
        return copy;
    }
}
