// useGame.js - Custom hook for game state management
import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../game/GameState';

export function useGame() {
  const [gameState, setGameState] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [message, setMessage] = useState('');
  const [isHumanTurn, setIsHumanTurn] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Force re-render function
  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  // Show a temporary message
  const showMessage = useCallback((msg, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  }, []);

  // Start a new game
  const startNewGame = useCallback((difficulty = 'Medium', optional8 = false, optional9 = false) => {
    const newGame = new GameState();
    newGame.newGame(difficulty, optional8, optional9);
    setGameState(newGame);
    setSelectedCards([]);
    setMessage('');
    setIsHumanTurn(false);
  }, []);

  // Transition to playing phase
  const startPlayingPhase = useCallback(() => {
    if (gameState && gameState.gamePhase === 'swap') {
      gameState.startPlayingPhase();
      setSelectedCards([]);
      forceUpdate();
      
      // Determine who goes first
      const isHuman = gameState.currentPlayer === gameState.humanPlayer;
      setIsHumanTurn(isHuman);
      
      if (!isHuman) {
        // AI goes first
        setTimeout(() => {
          handleAITurn();
        }, 1000);
      }
    }
  }, [gameState]);

  // Handle card double-click - auto-play if no duplicates in hand
  const handleCardDoubleClick = useCallback((card) => {
    if (!gameState || !isHumanTurn || gameState.gamePhase !== 'playing') return;

    // Check if there are multiple cards of the same rank
    const playableCards = gameState.humanPlayer.hand.length > 0 
      ? gameState.humanPlayer.hand 
      : gameState.humanPlayer.faceUpCards.length > 0
        ? gameState.humanPlayer.faceUpCards
        : gameState.humanPlayer.faceDownCards;

    const sameRankCards = playableCards.filter(c => c.rank === card.rank);

    // If only one card of this rank, auto-play it
    if (sameRankCards.length === 1) {
      // Select and play immediately
      setSelectedCards([card]);
      setTimeout(() => {
        handlePlayCards([card]);
      }, 50);
    } else {
      // Multiple cards of same rank, just select it
      handleCardClick(card);
    }
  }, [gameState, isHumanTurn]);

  // Handle card selection
  const handleCardClick = useCallback((card) => {
    if (!gameState || gameState.gamePhase === 'ended') return;

    // During setup/swap phase, allow swapping between hand and face-up
    if (gameState.gamePhase === 'swap') {
      const isInHand = gameState.humanPlayer.hand.some(c => c.id === card.id);
      const isInFaceUp = gameState.humanPlayer.faceUpCards.some(c => c.id === card.id);

      if (!isInHand && !isInFaceUp) return;

      // Check if already selected
      const alreadySelected = selectedCards.find(c => c.id === card.id);
      
      if (alreadySelected) {
        // Deselect it
        setSelectedCards(prev => prev.filter(c => c.id !== card.id));
        return;
      }

      // If we already have a card selected
      if (selectedCards.length === 1) {
        const firstCard = selectedCards[0];
        const firstInHand = gameState.humanPlayer.hand.some(c => c.id === firstCard.id);
        const cardInHand = isInHand;

        // Only allow swap if one is in hand and one is in face-up
        if (firstInHand === cardInHand) {
          showMessage('Select one card from hand and one from face-up', 1500);
          setSelectedCards([card]); // Replace selection
          return;
        }

        // Perform the swap
        const handCard = firstInHand ? firstCard : card;
        const faceUpCard = firstInHand ? card : firstCard;

        const handIndex = gameState.humanPlayer.hand.findIndex(c => c.id === handCard.id);
        const faceUpIndex = gameState.humanPlayer.faceUpCards.findIndex(c => c.id === faceUpCard.id);

        if (handIndex > -1 && faceUpIndex > -1) {
          // Swap the cards
          gameState.humanPlayer.hand[handIndex] = faceUpCard;
          gameState.humanPlayer.faceUpCards[faceUpIndex] = handCard;
          
          // Force update
          forceUpdate();
          showMessage('Cards swapped!', 1000);
          setSelectedCards([]);
        }
        return;
      }

      // Select the card
      setSelectedCards([card]);
      return;
    }

    // During playing phase
    if (!isHumanTurn) return;

    // Toggle card selection
    setSelectedCards(prev => {
      const isSelected = prev.some(c => c.id === card.id);
      if (isSelected) {
        return prev.filter(c => c.id !== card.id);
      }

      // Check if card is from same source as already selected cards
      if (prev.length > 0) {
        const firstCard = prev[0];
        const firstInHand = gameState.humanPlayer.hand.some(c => c.id === firstCard.id);
        const firstInFaceUp = gameState.humanPlayer.faceUpCards.some(c => c.id === firstCard.id);
        const cardInHand = gameState.humanPlayer.hand.some(c => c.id === card.id);
        const cardInFaceUp = gameState.humanPlayer.faceUpCards.some(c => c.id === card.id);

        // Must be from same area
        if ((firstInHand && !cardInHand) || (firstInFaceUp && !cardInFaceUp)) {
          showMessage('Select cards from the same area', 1500);
          return prev;
        }

        // Must be same rank for multiple selection
        if (card.rank !== firstCard.rank) {
          showMessage('Multiple cards must be same rank', 1500);
          return prev;
        }
      }

      return [...prev, card];
    });
  }, [gameState, isHumanTurn, selectedCards, showMessage, forceUpdate]);

  // Handle playing selected cards (with optional override)
  const handlePlayCards = useCallback((cardsOverride = null) => {
    const cardsToPlay = cardsOverride || selectedCards;
    
    if (!gameState || !isHumanTurn || cardsToPlay.length === 0) return;

    // Check if cards are valid
    const topCard = gameState.discardPile.length > 0 
      ? gameState.discardPile[gameState.discardPile.length - 1] 
      : null;

    // Check if all selected cards can be played
    const allValid = cardsToPlay.every(card => gameState.canPlayCard(card, topCard));

    if (!allValid) {
      showMessage('Invalid play! Pick up the pile instead.', 2000);
      setSelectedCards([]);
      return;
    }

    // Play the cards
    const result = gameState.playCards(gameState.humanPlayer, cardsToPlay);
    
    setSelectedCards([]);
    forceUpdate();

    // Show feedback
    if (result.burnOccurred) {
      showMessage('🔥 Pile burned! Go again!', 2000);
    } else if (result.playedRank === 7) {
      showMessage('7 played! Next must play 7 or lower', 2000);
    } else if (result.playedRank === 2) {
      showMessage('2 played! Pile reset', 2000);
    }

    // Check for game over
    if (gameState.checkGameOver()) {
      forceUpdate();
      return;
    }

    // If player gets extra turn, don't switch
    if (result.extraTurn) {
      setIsHumanTurn(true);
      return;
    }

    // Switch to AI turn
    setIsHumanTurn(false);
    gameState.switchPlayer();
    
    // Trigger AI turn after a delay
    setTimeout(() => {
      handleAITurn();
    }, 1000);
  }, [gameState, isHumanTurn, selectedCards, showMessage, forceUpdate]);

  // Handle picking up the pile
  const handlePickupPile = useCallback(() => {
    if (!gameState || !isHumanTurn || gameState.discardPile.length === 0) return;

    const cards = gameState.pickupPile(gameState.humanPlayer);
    setSelectedCards([]);
    forceUpdate();
    
    showMessage(`Picked up ${cards.length} cards`, 2000);

    // Switch to AI turn
    setIsHumanTurn(false);
    gameState.switchPlayer();
    
    // Trigger AI turn after a delay
    setTimeout(() => {
      handleAITurn();
    }, 1000);
  }, [gameState, isHumanTurn, showMessage, forceUpdate]);

  // Handle AI turn
  const handleAITurn = useCallback(() => {
    if (!gameState || gameState.currentPlayer !== gameState.aiPlayer) return;

    const aiGameState = gameState.getGameStateForAI();
    const cardsToPlay = gameState.aiPlayer.choosePlay(aiGameState);

    if (!cardsToPlay || cardsToPlay.length === 0) {
      // AI must pick up pile
      setTimeout(() => {
        const cards = gameState.pickupPile(gameState.aiPlayer);
        forceUpdate();
        showMessage(`Computer picked up ${cards.length} cards`, 2000);

        // Check for game over
        if (!gameState.checkGameOver()) {
          // Switch back to human
          setIsHumanTurn(true);
          gameState.switchPlayer();
        } else {
          forceUpdate();
        }
      }, 800);
      return;
    }

    // AI plays cards
    setTimeout(() => {
      const result = gameState.playCards(gameState.aiPlayer, cardsToPlay);
      forceUpdate();

      const cardNames = cardsToPlay.map(c => c.displayName).join(', ');
      let msg = `Computer played ${cardNames}`;
      
      if (result.burnOccurred) {
        msg += ' - Pile burned!';
      }
      
      showMessage(msg, 2000);

      // Check for game over
      if (gameState.checkGameOver()) {
        forceUpdate();
        return;
      }

      // If AI gets extra turn, trigger another AI turn
      if (result.extraTurn) {
        setTimeout(() => {
          handleAITurn();
        }, 1000);
        return;
      }

      // Switch back to human
      setIsHumanTurn(true);
      gameState.switchPlayer();
    }, 1000);
  }, [gameState, showMessage, forceUpdate]);

  return {
    gameState,
    selectedCards,
    message,
    isHumanTurn,
    updateTrigger,
    startNewGame,
    startPlayingPhase,
    handleCardClick,
    handleCardDoubleClick,
    handlePlayCards,
    handlePickupPile
  };
}
