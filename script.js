const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ── State ──
let board = Array(9).fill(null);
let currentPlayer = 'X'; // internal game symbol
let gameOver = false;
let lastMoveIndex = null;
let scores = [0, 0];  // scores[0] = Player 1, scores[1] = Player 2
let xPlayerIndex = 0; // 0 = Player 1 is X, 1 = Player 2 is X
let aiTimer = null;

// ── DOM Refs ──
const cells        = document.querySelectorAll('.cell');
const statusEl     = document.getElementById('status');
const modalEl      = document.getElementById('modal');
const modalResult  = document.getElementById('modal-result');
const modalSub     = document.getElementById('modal-sub');
const p1NameEl     = document.getElementById('p1-name');
const p2NameEl     = document.getElementById('p2-name');
const p1TypeEl     = document.getElementById('p1-type');
const p2TypeEl     = document.getElementById('p2-type');
const scoreP1El    = document.getElementById('score-p1-value');
const scoreP2El    = document.getElementById('score-p2-value');
const scoreP1Card  = document.getElementById('score-p1');
const scoreP2Card  = document.getElementById('score-p2');
const scoreP1Name  = document.getElementById('score-p1-name');
const scoreP2Name  = document.getElementById('score-p2-name');
const scoreP1Role  = document.getElementById('score-p1-role');
const scoreP2Role  = document.getElementById('score-p2-role');

// ── Player Helpers ──
function playerName(idx) {
  return (idx === 0 ? p1NameEl.value : p2NameEl.value).trim() || `Player ${idx + 1}`;
}

function playerType(idx) {
  return idx === 0 ? p1TypeEl.value : p2TypeEl.value;
}

function symbolToIndex(symbol) {
  return symbol === 'X' ? xPlayerIndex : 1 - xPlayerIndex;
}

function currentPlayerIndex() {
  return symbolToIndex(currentPlayer);
}

function isHumanTurn() {
  return playerType(currentPlayerIndex()) === 'human';
}

// ── Theme ──
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').textContent = '☀️';
  }
})();

document.getElementById('theme-toggle').addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ── Setup Controls ──
p1TypeEl.addEventListener('change', resetBoard);
p2TypeEl.addEventListener('change', resetBoard);
p1NameEl.addEventListener('input', () => { updateScoreLabels(); updateStatus(); });
p2NameEl.addEventListener('input', () => { updateScoreLabels(); updateStatus(); });

document.getElementById('restart').addEventListener('click', resetBoard);

document.getElementById('play-again').addEventListener('click', () => {
  modalEl.classList.add('hidden');
  xPlayerIndex = 1 - xPlayerIndex; // swap X/O roles each game
  resetBoard();
});

// ── Board Interaction ──
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const idx = parseInt(cell.dataset.index);
    if (gameOver || board[idx] || !isHumanTurn()) return;
    makeMove(idx);
  });

  cell.addEventListener('mouseenter', () => {
    const idx = parseInt(cell.dataset.index);
    if (!gameOver && !board[idx] && isHumanTurn()) {
      cell.classList.add('hover-preview');
    }
  });

  cell.addEventListener('mouseleave', () => {
    cell.classList.remove('hover-preview');
  });
});

// ── Core Game ──
function makeMove(idx) {
  if (board[idx] || gameOver) return;
  board[idx] = currentPlayer;
  lastMoveIndex = idx;
  renderBoard();

  const result = checkResult();
  if (result) { endGame(result); return; }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
  updateScoreHighlight();
  scheduleAI();
}

function scheduleAI() {
  if (gameOver || playerType(currentPlayerIndex()) !== 'ai') return;
  const bothAI = p1TypeEl.value === 'ai' && p2TypeEl.value === 'ai';
  aiTimer = setTimeout(() => {
    if (!gameOver) makeMove(getBestMove());
  }, bothAI ? 600 : 300);
}

function getBestMove() {
  let bestScore = -Infinity, bestIdx = null;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = currentPlayer;
      const score = minimax(board, 0, false, currentPlayer);
      board[i] = null;
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    }
  }
  return bestIdx;
}

function minimax(b, depth, isMaximizing, aiSymbol) {
  const oppSymbol = aiSymbol === 'X' ? 'O' : 'X';
  const winner = getWinner(b);
  if (winner === aiSymbol)  return 10 - depth;
  if (winner === oppSymbol) return depth - 10;
  if (b.every(c => c))      return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) { b[i] = aiSymbol; best = Math.max(best, minimax(b, depth + 1, false, aiSymbol)); b[i] = null; }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) { b[i] = oppSymbol; best = Math.min(best, minimax(b, depth + 1, true, aiSymbol)); b[i] = null; }
    }
    return best;
  }
}

function getWinner(b) {
  for (const [a, c, e] of WIN_LINES) {
    if (b[a] && b[a] === b[c] && b[c] === b[e]) return b[a];
  }
  return null;
}

function checkResult() {
  const winner = getWinner(board);
  if (winner) return { type: 'win', symbol: winner };
  if (board.every(c => c)) return { type: 'draw' };
  return null;
}

// ── Render ──
function renderBoard() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i] || '';
    cell.className = 'cell';
    if (board[i]) cell.classList.add(board[i].toLowerCase());
    if (i === lastMoveIndex) cell.classList.add('last-move');
  });
}

function highlightWin(winLine) {
  winLine.forEach(i => {
    cells[i].classList.remove('last-move');
    cells[i].classList.add('win-cell');
  });
}

function updateStatus() {
  const idx = currentPlayerIndex();
  const name = playerName(idx);
  const typeLabel = playerType(idx) === 'ai' ? ' (AI)' : '';
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(currentPlayer === 'X' ? '--x-color' : '--o-color').trim();
  statusEl.style.color = color;
  statusEl.textContent = `${name}'s Turn (${currentPlayer})${typeLabel}`;
}

function updateScoreLabels() {
  scoreP1Name.textContent = playerName(0);
  scoreP2Name.textContent = playerName(1);
  const p1Symbol = xPlayerIndex === 0 ? 'X' : 'O';
  const p2Symbol = xPlayerIndex === 1 ? 'X' : 'O';
  scoreP1Role.textContent = p1Symbol;
  scoreP1Role.className = `score-role ${p1Symbol === 'X' ? 'x-label' : 'o-label'}`;
  scoreP2Role.textContent = p2Symbol;
  scoreP2Role.className = `score-role ${p2Symbol === 'X' ? 'x-label' : 'o-label'}`;
}

function updateScoreHighlight() {
  scoreP1Card.classList.toggle('active', currentPlayerIndex() === 0);
  scoreP2Card.classList.toggle('active', currentPlayerIndex() === 1);
}

// ── End Game ──
function endGame(result) {
  gameOver = true;
  clearTimeout(aiTimer);

  if (result.type === 'win') {
    const winLine = WIN_LINES.find(([a, b, c]) =>
      board[a] && board[a] === board[b] && board[b] === board[c]
    );
    renderBoard();
    highlightWin(winLine);

    const winnerIdx = symbolToIndex(result.symbol);
    scores[winnerIdx] += 1;
    updateScores();

    const emoji = result.symbol === 'X' ? '🔴' : '🔵';
    modalResult.textContent = `${emoji} ${playerName(winnerIdx)} Wins!`;
    modalResult.className = `modal-result ${result.symbol === 'X' ? 'x-wins' : 'o-wins'}`;
    modalSub.textContent = 'X and O will swap next game!';
  } else {
    scores[0] += 0.5;
    scores[1] += 0.5;
    updateScores();
    modalResult.textContent = "It's a Draw!";
    modalResult.className = 'modal-result draw';
    modalSub.textContent = 'Well played — X and O will swap next game!';
  }

  statusEl.textContent = '';
  scoreP1Card.classList.remove('active');
  scoreP2Card.classList.remove('active');
  setTimeout(() => modalEl.classList.remove('hidden'), 400);
}

function updateScores() {
  scoreP1El.textContent = formatScore(scores[0]);
  scoreP2El.textContent = formatScore(scores[1]);
}

function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

// ── Reset ──
function resetBoard() {
  clearTimeout(aiTimer);
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  lastMoveIndex = null;
  modalEl.classList.add('hidden');
  renderBoard();
  updateScoreLabels();
  updateScores();
  updateStatus();
  updateScoreHighlight();
  scheduleAI();
}

// ── Init ──
resetBoard();
