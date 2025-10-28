// App.jsx - Main game component
import { useState } from 'react';
import Card from './components/Card';
import { useGame } from './hooks/useGame';

function App() {
  const {
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
  } = useGame();

  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [optional8, setOptional8] = useState(false);
  const [optional9, setOptional9] = useState(false);

  const handleNewGame = () => {
    startNewGame(difficulty, optional8, optional9);
    setShowSettings(false);
  };

  // Setup phase: Allow swapping cards between hand and face-up
  const renderSetupPhase = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Setup Phase</h1>
        
        <div className="text-white text-center mb-8">
          <p className="text-xl mb-4">Arrange your cards!</p>
          <p className="text-sm opacity-75">Click cards in your hand and face-up area to swap them.</p>
          <p className="text-sm opacity-75">Keep your best cards in your hand.</p>
        </div>

        {/* Face-down cards with face-up cards on top */}
        <div className="mb-8">
          <h3 className="text-white text-lg mb-4">Face-Up Cards (on Face-Down)</h3>
          <div className="flex gap-8 justify-center">
            {gameState.humanPlayer.faceUpCards.map((card, idx) => (
              <div key={card.id} className="relative">
                {/* Face-down card underneath */}
                <div className="absolute -bottom-2 -right-2">
                  <Card
                    card={gameState.humanPlayer.faceDownCards[idx]}
                    isFaceDown={true}
                    isClickable={false}
                    disableAnimation={true}
                  />
                </div>
                {/* Face-up card on top */}
                <Card
                  card={card}
                  isSelected={selectedCards.some(c => c.id === card.id)}
                  isClickable={true}
                  onClick={handleCardClick}
                  disableAnimation={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hand */}
        <div className="mb-8">
          <h3 className="text-white text-lg mb-4">Your Hand</h3>
          <div className="flex gap-4 justify-center">
            {gameState.humanPlayer.hand.map((card) => (
              <Card
                key={card.id}
                card={card}
                isSelected={selectedCards.some(c => c.id === card.id)}
                isClickable={true}
                onClick={handleCardClick}
                disableAnimation={true}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={startPlayingPhase}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl shadow-lg transition-all"
          >
            Start Game!
          </button>
        </div>
      </div>
    </div>
  );

  // Playing phase: Main game with FIXED grid layout
  const renderPlayingPhase = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-slate-900 flex flex-col p-4" key={updateTrigger}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-white">
          <h1 className="text-3xl font-bold">Shithead</h1>
          <p className="text-sm opacity-75">Time: {gameState.formatGameTime()}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-white text-right">
            <p className="text-sm opacity-75">Burns: {gameState.burnsAchieved}</p>
            <p className="text-sm opacity-75">Pickups: {gameState.pilesPickedUp}</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Main game area - FIXED 3-column grid */}
      <div className="flex-1 grid grid-cols-[180px_1fr_180px] gap-4 max-w-7xl mx-auto w-full">
        
        {/* LEFT COLUMN - AI Hand (FIXED WIDTH) */}
        <div className="flex flex-col">
          <div className="text-white text-center mb-2">
            <p className="text-sm font-bold">AI Hand</p>
            <p className="text-xs opacity-75">{gameState.aiPlayer.hand.length} cards</p>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {gameState.aiPlayer.hand.map((_, idx) => (
              <Card
                key={`ai-hand-${idx}`}
                isFaceDown={true}
                isClickable={false}
                disableAnimation={true}
              />
            ))}
          </div>
        </div>

        {/* CENTER COLUMN - Main play area (FLEXIBLE) */}
        <div className="flex flex-col justify-between">
          
          {/* AI Player area - table cards (FIXED HEIGHT) */}
          <div className="h-48 flex flex-col items-center justify-start">
            <div className="text-white text-center mb-2">
              <h2 className="text-xl font-bold">
                Computer {!isHumanTurn && '(Playing...)'}
              </h2>
              <p className="text-sm opacity-75">
                Cards: {gameState.aiPlayer.totalCards}
              </p>
            </div>

            {/* AI Face-down/face-up cards stacked */}
            <div className="flex gap-8 justify-center">
              {gameState.aiPlayer.faceUpCards.length > 0 ? (
                gameState.aiPlayer.faceUpCards.map((card, idx) => (
                  <div key={card.id} className="relative">
                    {gameState.aiPlayer.faceDownCards[idx] && (
                      <div className="absolute -bottom-2 -right-2">
                        <Card
                          isFaceDown={true}
                          isClickable={false}
                          disableAnimation={true}
                        />
                      </div>
                    )}
                    <Card
                      card={card}
                      isClickable={false}
                      disableAnimation={true}
                    />
                  </div>
                ))
              ) : gameState.aiPlayer.faceDownCards.length > 0 ? (
                gameState.aiPlayer.faceDownCards.map((_, idx) => (
                  <Card
                    key={`ai-facedown-${idx}`}
                    isFaceDown={true}
                    isClickable={false}
                    disableAnimation={true}
                  />
                ))
              ) : null}
            </div>
          </div>

          {/* Center area - Deck and Discard Pile (FIXED HEIGHT) */}
          <div className="h-64 flex gap-8 items-center justify-center">
            {/* Deck */}
            <div className="text-center">
              <p className="text-white text-sm mb-2">Deck</p>
              {!gameState.deck.isEmpty() ? (
                <Card isFaceDown={true} isClickable={false} disableAnimation={true} />
              ) : (
                <div className="w-24 h-36 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  <p className="text-white/50 text-xs">Empty</p>
                </div>
              )}
              <p className="text-white text-xs mt-2">{gameState.deck.size} cards</p>
            </div>

            {/* Discard Pile */}
            <div className="text-center">
              <p className="text-white text-sm mb-2">Discard Pile</p>
              {gameState.discardPile.length > 0 ? (
                <div className="relative">
                  {gameState.discardPile.slice(-3).map((card, idx) => (
                    <div
                      key={card.id}
                      style={{
                        position: idx > 0 ? 'absolute' : 'relative',
                        left: idx > 0 ? `${idx * 2}px` : 0,
                        top: idx > 0 ? `${idx * 2}px` : 0
                      }}
                    >
                      <Card card={card} isClickable={false} disableAnimation={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-24 h-36 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  <p className="text-white/50 text-xs">Empty</p>
                </div>
              )}
              <p className="text-white text-xs mt-2">{gameState.discardPile.length} cards</p>
              
              {/* Special effects indicator */}
              {gameState.sevenEffectActive && (
                <p className="text-yellow-400 text-xs mt-1 font-bold">7 Effect: Play ≤7</p>
              )}
              {gameState.nineThreshold && (
                <p className="text-purple-400 text-xs mt-1 font-bold">
                  9 Effect: Play {gameState.nineThreshold === 'lower' ? '≤' : '≥'}9
                </p>
              )}
            </div>
          </div>

          {/* Human Player area - table cards (FIXED HEIGHT) */}
          <div className="h-64 flex flex-col items-center justify-end">
            {/* Human Face-down/face-up cards stacked */}
            <div className="flex gap-8 justify-center mb-4">
              {gameState.humanPlayer.faceUpCards.length > 0 ? (
                gameState.humanPlayer.faceUpCards.map((card, idx) => (
                  <div key={card.id} className="relative">
                    {gameState.humanPlayer.faceDownCards[idx] && (
                      <div className="absolute -bottom-2 -right-2">
                        <Card
                          isFaceDown={true}
                          isClickable={false}
                          disableAnimation={true}
                        />
                      </div>
                    )}
                    <Card
                      card={card}
                      isSelected={selectedCards.some(c => c.id === card.id)}
                      isClickable={isHumanTurn && gameState.humanPlayer.hand.length === 0}
                      onClick={handleCardClick}
                      onDoubleClick={handleCardDoubleClick}
                      disableAnimation={true}
                    />
                  </div>
                ))
              ) : gameState.humanPlayer.faceDownCards.length > 0 ? (
                gameState.humanPlayer.faceDownCards.map((card, idx) => (
                  <Card
                    key={`human-facedown-${idx}`}
                    card={card}
                    isFaceDown={true}
                    isSelected={selectedCards.some(c => c.id === card.id)}
                    isClickable={isHumanTurn && gameState.humanPlayer.hand.length === 0}
                    onClick={handleCardClick}
                    onDoubleClick={handleCardDoubleClick}
                    disableAnimation={true}
                  />
                ))
              ) : null}
            </div>

            <div className="text-white text-center mb-2">
              <h2 className="text-xl font-bold">
                You {isHumanTurn && '(Your Turn)'}
              </h2>
              <p className="text-sm opacity-75">
                Cards: {gameState.humanPlayer.totalCards}
              </p>
            </div>

            {/* Action buttons */}
            {isHumanTurn && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handlePlayCards()}
                  disabled={selectedCards.length === 0}
                  className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
                    selectedCards.length > 0
                      ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                      : 'bg-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  Play {selectedCards.length > 0 && `(${selectedCards.length})`}
                </button>
                
                <button
                  onClick={handlePickupPile}
                  disabled={gameState.discardPile.length === 0}
                  className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
                    gameState.discardPile.length > 0
                      ? 'bg-red-600 hover:bg-red-700 shadow-lg'
                      : 'bg-gray-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  Pick Up Pile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Human Hand (FIXED WIDTH) */}
        <div className="flex flex-col">
          <div className="text-white text-center mb-2">
            <p className="text-sm font-bold">Your Hand</p>
            <p className="text-xs opacity-75">{gameState.humanPlayer.hand.length} cards</p>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {gameState.humanPlayer.hand.map((card) => (
              <Card
                key={card.id}
                card={card}
                isSelected={selectedCards.some(c => c.id === card.id)}
                isClickable={isHumanTurn}
                onClick={handleCardClick}
                onDoubleClick={handleCardDoubleClick}
                disableAnimation={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Message display */}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-lg shadow-xl z-50">
          <p className="text-gray-800 font-medium">{message}</p>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New Game Settings</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="optional8"
                  checked={optional8}
                  onChange={(e) => setOptional8(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="optional8" className="text-sm">
                  8 skips next player
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="optional9"
                  checked={optional9}
                  onChange={(e) => setOptional9(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="optional9" className="text-sm">
                  9 reverses direction
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleNewGame}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Start Game
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Game over phase
  const renderEndedPhase = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          {gameState.winner === gameState.humanPlayer ? '🎉 You Win!' : '💀 You Lose!'}
        </h1>
        
        <div className="text-white space-y-2 mb-8">
          <p className="text-xl">Game Stats</p>
          <p>Time: {gameState.formatGameTime()}</p>
          <p>Burns: {gameState.burnsAchieved}</p>
          <p>Piles Picked Up: {gameState.pilesPickedUp}</p>
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl shadow-lg transition-all"
        >
          Play Again
        </button>
      </div>
    </div>
  );

  // Initial screen
  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-slate-900 flex items-center justify-center">
        <button
          onClick={() => setShowSettings(true)}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xl shadow-lg transition-all"
        >
          Start New Game
        </button>

        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">New Game Settings</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="optional8-init"
                    checked={optional8}
                    onChange={(e) => setOptional8(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="optional8-init" className="text-sm">
                    8 skips next player
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="optional9-init"
                    checked={optional9}
                    onChange={(e) => setOptional9(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="optional9-init" className="text-sm">
                    9 reverses direction
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleNewGame}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                >
                  Start Game
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render appropriate phase
  switch (gameState.gamePhase) {
    case 'setup':
      return renderSetupPhase();
    case 'swap':
      return renderSetupPhase();
    case 'playing':
      return renderPlayingPhase();
    case 'ended':
      return renderEndedPhase();
    default:
      return null;
  }
}

export default App;
