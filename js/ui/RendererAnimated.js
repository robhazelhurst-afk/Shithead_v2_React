// RendererAnimated.js - DOM manipulation with animation support

import { Animator } from './Animator.js';

export class RendererAnimated {
    constructor(gameState) {
        this.gameState = gameState;
        this.animator = new Animator();
        this.cardElements = new Map();  // card.id -> HTMLElement
        this.selectedCards = new Set();  // Set of card IDs
        this.onCardDoubleClick = null; // Callback for double-click
        this.animationsEnabled = true; // Toggle for animations
        
        // Cache DOM elements
        this.elements = {
            statusMessage: document.getElementById('status-message'),
            gameTimer: document.getElementById('game-timer'),
            computerFaceDown: document.getElementById('computer-face-down'),
            computerFaceUp: document.getElementById('computer-face-up'),
            computerHand: document.getElementById('computer-hand'),
            playerFaceDown: document.getElementById('player-face-down'),
            playerFaceUp: document.getElementById('player-face-up'),
            playerHand: document.getElementById('player-hand'),
            drawPileCards: document.getElementById('draw-pile-cards'),
            drawPileCount: document.getElementById('draw-pile-count'),
            discardPileCards: document.getElementById('discard-pile-cards'),
            discardPileCount: document.getElementById('discard-pile-count'),
            playerArea: document.getElementById('player-area'),
            computerArea: document.getElementById('computer-area'),
            playBtn: document.getElementById('play-btn'),
            pickupBtn: document.getElementById('pickup-btn')
        };
    }

    render() {
        this.renderPlayerArea(this.gameState.humanPlayer, 'player');
        this.renderPlayerArea(this.gameState.aiPlayer, 'computer');
        this.renderDrawPile();
        this.renderDiscardPile();
        this.renderStatus();
        this.updateButtons();
        this.updateTimer();
    }

    /**
     * Sort hand cards by rank (low to high)
     */
    sortHand(hand) {
        return [...hand].sort((a, b) => {
            // Compare by rank value
            return a.rank - b.rank;
        });
    }

    renderPlayerArea(player, areaType) {
        const prefix = areaType === 'player' ? 'player' : 'computer';
        const isHuman = areaType === 'player';
        
        // Determine if cards are clickable based on game phase
        const isSwapPhase = this.gameState.gamePhase === 'swap';
        const isPlayingPhase = this.gameState.gamePhase === 'playing';
        
        // Render face-down cards
        const faceDownClickable = isHuman && isPlayingPhase && this.isPlayerTurn() && 
                                   player.hand.length === 0 && player.faceUpCards.length === 0;
        this.renderCardZone(
            this.elements[`${prefix}FaceDown`],
            player.faceDownCards,
            true,  // Always face down
            faceDownClickable  // Clickable only when it's time to play them
        );
        
        // Render face-up cards
        const faceUpClickable = isHuman && (
            (isSwapPhase) ||  // Can swap during swap phase
            (isPlayingPhase && this.isPlayerTurn() && player.hand.length === 0)  // Can play when hand empty
        );
        this.renderCardZone(
            this.elements[`${prefix}FaceUp`],
            player.faceUpCards,
            false,  // Face up
            faceUpClickable
        );
        
        // Render hand
        if (isHuman) {
            const handClickable = (isSwapPhase) || (isPlayingPhase && this.isPlayerTurn());
            // Sort hand by rank before rendering
            const sortedHand = this.sortHand(player.hand);
            this.renderCardZone(
                this.elements.playerHand,
                sortedHand,
                false,  // Face up
                handClickable
            );
        } else {
            // AI hand - show card backs
            this.renderCardZone(
                this.elements.computerHand,
                player.hand,
                true,  // Face down
                false
            );
        }
        
        // Update active indicator
        const area = this.elements[`${prefix}Area`];
        if (this.gameState.currentPlayer === player) {
            area.classList.add('active');
        } else {
            area.classList.remove('active');
        }
    }

    renderCardZone(container, cards, faceDown = false, clickable = false) {
        container.innerHTML = '';
        
        if (cards.length === 0) {
            // Show empty slot placeholder
            const empty = document.createElement('div');
            empty.className = 'empty-slot';
            empty.textContent = '---';
            container.appendChild(empty);
            return;
        }
        
        for (let card of cards) {
            const cardEl = this.createCardElement(card, faceDown, clickable);
            container.appendChild(cardEl);
        }
    }

    createCardElement(card, faceDown = false, clickable = true) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.dataset.cardId = card.id;
        cardEl.dataset.rank = card.rank;
        cardEl.dataset.suit = card.suit;
        
        if (faceDown) {
            cardEl.classList.add('card-back');
            cardEl.innerHTML = `
                <div class="card-content">
                    SHITHEAD
                </div>
            `;
        } else {
            cardEl.classList.add(card.color);
            cardEl.innerHTML = `
                <div class="card-content">
                    <div class="card-corner top-left">
                        ${card.displayRank}${card.displaySuit}
                    </div>
                    <div class="card-rank">${card.displayRank}</div>
                    <div class="card-suit">${card.displaySuit}</div>
                    <div class="card-corner bottom-right">
                        ${card.displayRank}${card.displaySuit}
                    </div>
                </div>
            `;
        }
        
        if (!clickable) {
            cardEl.classList.add('disabled');
        } else {
            cardEl.addEventListener('click', () => this.onCardClick(card));
            cardEl.addEventListener('dblclick', () => this.onCardDblClick(card));
        }
        
        // Check if card is selected
        if (this.selectedCards.has(card.id)) {
            cardEl.classList.add('selected');
        }
        
        this.cardElements.set(card.id, cardEl);
        
        return cardEl;
    }

    renderDrawPile() {
        const container = this.elements.drawPileCards;
        container.innerHTML = '';
        
        if (!this.gameState.deck.isEmpty()) {
            const cardEl = document.createElement('div');
            cardEl.className = 'card card-back';
            cardEl.innerHTML = `
                <div class="card-content">
                    SHITHEAD
                </div>
            `;
            container.appendChild(cardEl);
        }
        
        this.elements.drawPileCount.textContent = this.gameState.deck.size;
    }

    renderDiscardPile() {
        const container = this.elements.discardPileCards;
        container.innerHTML = '';
        
        if (this.gameState.discardPile.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-slot';
            empty.textContent = 'Empty';
            container.appendChild(empty);
        } else {
            // Show top 3 cards stacked
            const cardsToShow = this.gameState.discardPile.slice(-3);
            cardsToShow.forEach((card, index) => {
                const cardEl = this.createCardElement(card, false, false);
                cardEl.classList.add('stacked');
                cardEl.style.zIndex = index;
                container.appendChild(cardEl);
            });
        }
        
        this.elements.discardPileCount.textContent = this.gameState.discardPile.length;
    }

    renderStatus() {
        let message = '';
        
        if (this.gameState.gamePhase === 'setup') {
            message = 'Setting up game...';
        } else if (this.gameState.gamePhase === 'swap') {
            message = '🔄 Swap Phase: Select 3 cards from hand to be face-up, then click "Finish Swap"';
        } else if (this.gameState.gamePhase === 'ended') {
            const winner = this.gameState.winner;
            if (winner === this.gameState.humanPlayer) {
                message = '🎉 You win! You are not the Shithead!';
            } else {
                message = '😢 You lose! You are the Shithead!';
            }
        } else {
            // Playing phase
            const current = this.gameState.currentPlayer;
            if (current === this.gameState.humanPlayer) {
                const validPlays = this.gameState.getValidPlays(current);
                if (validPlays.length === 0) {
                    message = '❌ No valid plays - Pick up the pile';
                } else if (this.selectedCards.size > 0) {
                    message = `✓ ${this.selectedCards.size} card(s) selected - Click Play (or double-click single card)`;
                } else {
                    message = '🎯 Your turn - Select cards to play (or double-click single card)';
                }
            } else {
                message = '🤖 Computer is thinking...';
            }
            
            // Add special effect messages
            if (this.gameState.sevenEffectActive) {
                message += ' | 7️⃣ Must play 7 or lower!';
            }
        }
        
        this.elements.statusMessage.textContent = message;
    }

    updateTimer() {
        this.elements.gameTimer.textContent = `Time: ${this.gameState.formatGameTime()}`;
    }

    updateButtons() {
        const isPlayerTurn = this.isPlayerTurn();
        const validPlays = isPlayerTurn ? this.gameState.getValidPlays(this.gameState.humanPlayer) : [];
        const isSwapPhase = this.gameState.gamePhase === 'swap';
        
        // Play button - change text for swap phase
        if (isSwapPhase) {
            this.elements.playBtn.textContent = 'Finish Swap';
            this.elements.playBtn.disabled = false;
        } else {
            this.elements.playBtn.textContent = 'Play Selected';
            this.elements.playBtn.disabled = !isPlayerTurn || this.selectedCards.size === 0;
        }
        
        // Pickup button
        this.elements.pickupBtn.disabled = !isPlayerTurn || validPlays.length > 0 || isSwapPhase;
    }

    onCardClick(card) {
        // Toggle selection
        if (this.selectedCards.has(card.id)) {
            this.selectedCards.delete(card.id);
        } else {
            this.selectedCards.add(card.id);
        }
        
        this.render();
    }

    onCardDblClick(card) {
        if (this.gameState.gamePhase === 'swap') {
            return; // No double-click in swap phase
        }
        
        if (!this.isPlayerTurn()) {
            return;
        }
        
        const player = this.gameState.humanPlayer;
        
        // Determine which zone the card is in
        const inHand = player.hand.some(c => c.id === card.id);
        const inFaceUp = player.faceUpCards.some(c => c.id === card.id);
        const inFaceDown = player.faceDownCards.some(c => c.id === card.id);
        
        let cardsInZone = [];
        let sameRankInZone = [];
        
        if (inHand) {
            cardsInZone = player.hand;
            sameRankInZone = player.hand.filter(c => c.rank === card.rank);
            
            // Special case: if hand has 1 card and face-up has same rank, don't allow double-click
            if (player.hand.length === 1 && player.faceUpCards.some(c => c.rank === card.rank)) {
                return; // Don't allow double-click
            }
        } else if (inFaceUp) {
            cardsInZone = player.faceUpCards;
            sameRankInZone = player.faceUpCards.filter(c => c.rank === card.rank);
        } else if (inFaceDown) {
            // Face-down cards are always single blind plays
            sameRankInZone = [card];
        }
        
        // Only allow double-click if this is the only card of this rank in this zone
        if (sameRankInZone.length === 1 && this.onCardDoubleClick) {
            this.onCardDoubleClick(card);
        }
    }

    getSelectedCards() {
        const cards = [];
        const player = this.gameState.humanPlayer;
        const allCards = [...player.hand, ...player.faceUpCards, ...player.faceDownCards];
        
        for (let cardId of this.selectedCards) {
            const card = allCards.find(c => c.id === cardId);
            if (card) {
                cards.push(card);
            }
        }
        
        return cards;
    }

    clearSelection() {
        this.selectedCards.clear();
    }

    isPlayerTurn() {
        return this.gameState.gamePhase === 'playing' &&
               this.gameState.currentPlayer === this.gameState.humanPlayer;
    }

    showMessage(message, duration = 3000) {
        this.elements.statusMessage.textContent = message;
        
        if (duration > 0) {
            setTimeout(() => {
                this.renderStatus();
            }, duration);
        }
    }

    // ==================== ANIMATION METHODS ====================

    /**
     * Animate dealing cards to both players
     */
    async animateDeal() {
        if (!this.animationsEnabled) {
            this.render();
            return;
        }

        const deckPos = this.animator.getPosition(this.elements.drawPileCards);
        
        // Deal to both players with stagger
        const allDeals = [];
        
        // Human player - face-down, face-up, hand
        for (let i = 0; i < 3; i++) {
            allDeals.push({ player: 'player', zone: 'faceDown', index: i, delay: i * 100 });
        }
        for (let i = 0; i < 3; i++) {
            allDeals.push({ player: 'player', zone: 'faceUp', index: i, delay: (i + 3) * 100 });
        }
        for (let i = 0; i < 3; i++) {
            allDeals.push({ player: 'player', zone: 'hand', index: i, delay: (i + 6) * 100 });
        }
        
        // AI player
        for (let i = 0; i < 3; i++) {
            allDeals.push({ player: 'computer', zone: 'faceDown', index: i, delay: (i + 9) * 100 });
        }
        for (let i = 0; i < 3; i++) {
            allDeals.push({ player: 'computer', zone: 'faceUp', index: i, delay: (i + 12) * 100 });
        }
        for (let i = 0; i < 3; i++) {
            allDeals.push({ player: 'computer', zone: 'hand', index: i, delay: (i + 15) * 100 });
        }
        
        // Execute all deals
        for (let deal of allDeals) {
            const container = this.elements[`${deal.player}${deal.zone.charAt(0).toUpperCase() + deal.zone.slice(1)}`];
            // For now, just render normally - we'll add proper animation in next iteration
            await this.animator.sleep(deal.delay);
        }
        
        // Final render
        this.render();
    }

    /**
     * Animate playing cards to discard pile
     */
    async animatePlayCards(cards) {
        if (!this.animationsEnabled || cards.length === 0) {
            return;
        }

        // Get positions
        const discardPos = this.animator.getPosition(this.elements.discardPileCards);
        
        // Animate each card
        const animations = cards.map((card, index) => {
            const cardEl = this.cardElements.get(card.id);
            if (!cardEl) return Promise.resolve();
            
            const fromPos = this.animator.getPosition(cardEl);
            
            return this.animator.playCard(cardEl, fromPos, discardPos);
        });
        
        await Promise.all(animations);
    }

    /**
     * Animate picking up pile
     */
    async animatePickupPile(cards, targetZone) {
        if (!this.animationsEnabled || cards.length === 0) {
            return;
        }

        const discardPos = this.animator.getPosition(this.elements.discardPileCards);
        const targetPos = this.animator.getPosition(this.elements[targetZone]);
        
        // Cascade animation
        for (let i = 0; i < Math.min(cards.length, 10); i++) {
            // Only animate first 10 cards for performance
            await this.animator.sleep(50);
        }
    }

    /**
     * Animate burn effect - SPECTACULAR VERSION!
     */
    async animateBurn() {
        if (!this.animationsEnabled) {
            return;
        }

        console.log('🔥🔥🔥 Starting SPECTACULAR burn animation');
        const discardCards = this.elements.discardPileCards.querySelectorAll('.card');
        console.log('Found cards to burn:', discardCards.length);
        
        if (discardCards.length === 0) {
            console.log('⚠️ No cards found to burn!');
            return;
        }
        
        // Phase 1: Flash effect (pulsing orange/red glow) - 2 iterations
        discardCards.forEach(card => {
            card.classList.add('burning');
        });
        
        // Wait for flashing (600ms × 2 iterations = 1200ms)
        await this.animator.sleep(1200);
        
        // Phase 2: Scale, spin, and fade out
        discardCards.forEach(card => {
            card.classList.remove('burning');
            card.classList.add('burn-scale');
        });
        
        // Wait for scale/spin/fade (1000ms)
        await this.animator.sleep(1000);
        
        // Clean up
        discardCards.forEach(card => {
            card.classList.remove('burn-scale');
        });
        
        console.log('🔥🔥🔥 SPECTACULAR burn animation complete!');
    }

    /**
     * Animate card flip (face-down to face-up) with card reveal
     */
    async animateFlipCard(cardElement, card) {
        if (!this.animationsEnabled) {
            return;
        }

        console.log('🔄 Starting flip animation for card:', card.displayName);
        
        // First half of flip - card rotates away
        cardElement.style.transition = 'transform 200ms ease-in-out';
        cardElement.style.transform = 'rotateY(90deg)';
        
        await this.animator.sleep(200);
        
        // Mid-flip: change from back to face
        cardElement.classList.remove('card-back');
        cardElement.classList.add(card.color);
        cardElement.innerHTML = `
            <div class="card-content">
                <div class="card-corner top-left">
                    ${card.displayRank}${card.displaySuit}
                </div>
                <div class="card-rank">${card.displayRank}</div>
                <div class="card-suit">${card.displaySuit}</div>
                <div class="card-corner bottom-right">
                    ${card.displayRank}${card.displaySuit}
                </div>
            </div>
        `;
        
        // Second half of flip - card rotates back to face viewer
        cardElement.style.transform = 'rotateY(0deg)';
        
        await this.animator.sleep(200);
        
        // Clean up
        cardElement.style.transition = '';
        cardElement.style.transform = '';
        
        console.log('🔄 Flip animation complete');
    }

    /**
     * Shake animation for invalid play
     */
    async animateInvalidPlay(cardElement) {
        if (!this.animationsEnabled) {
            return;
        }

        console.log('⚠️ Starting shake animation');
        
        // Add shake class to trigger CSS animation
        cardElement.classList.add('shake');
        
        // Wait for CSS animation (300ms from animations.css)
        await this.animator.sleep(300);
        
        // Clean up
        cardElement.classList.remove('shake');
        console.log('⚠️ Shake animation complete');
    }

    /**
     * Celebration animation
     */
    async animateCelebration() {
        if (!this.animationsEnabled) {
            return;
        }

        console.log('🎉 Starting celebration animation');
        
        // Pulse all player cards
        const playerCards = this.elements.playerHand.querySelectorAll('.card');
        const promises = [];
        
        for (let card of playerCards) {
            promises.push(this.animator.celebrate(card));
        }
        
        await Promise.all(promises);
        console.log('🎉 Celebration animation complete');
    }
}
