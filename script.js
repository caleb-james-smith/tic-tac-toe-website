const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ── State ──
let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let lastMoveIndex = null;
let scores = { X: 0, O: 0 };
let aiTimer = null;

const cells       = document.querySelectorAll('.cell');
const statusEl    = document.getElementById('status');
const modalEl     = document.getElementById('modal');
const modalResult = document.getElementById('modal-result');
const modalSub    = document.getElementById('modal-sub');
const scoreXEl    = document.getElementById('score-x-value');
const scoreOEl    = document.getElementById('score-o-value');
const scoreXCard  = document.getElementById('score-x');
const scoreOCard  = document.getElementById('score-o');
const xTypeEl     = document.getElementById('x-type');
const oTypeEl     = document.getElementById('o-type');

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

xTypeEl.addEventListener('change', resetBoard);
oTypeEl.addEventListener('change', resetBoard);

document.getElementById('restart').addEventListener('click', resetBoard);
document.getElementById('play-again').addEventListener('click', () => {
  modalEl.classList.add('hidden');
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

function isHumanTurn() {
  return getPlayerType(currentPlayer) === 'human';
}

function getPlayerType(player) {
  return player === 'X' ? xTypeEl.value : oTypeEl.value;
}

// ── Core Game ──
function makeMove(idx) {
  if (board[idx] || gameOver) return;

  board[idx] = currentPlayer;
  lastMoveIndex = idx;
  renderBoard();

  const result = checkResult();
  if (result) {
    endGame(result);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
  updateScoreHighlight();
  scheduleAI();
}

function scheduleAI() {
  if (gameOver || getPlayerType(currentPlayer) !== 'ai') return;
  const bothAI = xTypeEl.value === 'ai' && oTypeEl.value === 'ai';
  const delay = bothAI ? 600 : 300;
  aiTimer = setTimeout(() => {
    if (!gameOver) makeMove(getBestMove());
  }, delay);
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestIdx = null;
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

function minimax(b, depth, isMaximizing, aiPlayer) {
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  const winner = getWinner(b);
  if (winner === aiPlayer)  return 10 - depth;
  if (winner === opponent)  return depth - 10;
  if (b.every(c => c))      return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = aiPlayer;
        best = Math.max(best, minimax(b, depth + 1, false, aiPlayer));
        b[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = opponent;
        best = Math.min(best, minimax(b, depth + 1, true, aiPlayer));
        b[i] = null;
      }
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
  if (winner) return { type: 'win', player: winner };
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

function updateStatus(text, colorClass) {
  if (text) {
    statusEl.textContent = text;
    statusEl.style.color = '';
    return;
  }
  const color = currentPlayer === 'X'
    ? getComputedStyle(document.documentElement).getPropertyValue('--x-color').trim()
    : getComputedStyle(document.documentElement).getPropertyValue('--o-color').trim();
  statusEl.style.color = color;
  const typeLabel = getPlayerType(currentPlayer) === 'ai' ? ' (AI)' : '';
  statusEl.textContent = `${currentPlayer}'s Turn${typeLabel}`;
}

function updateScoreHighlight() {
  scoreXCard.classList.toggle('active', currentPlayer === 'X');
  scoreOCard.classList.toggle('active', currentPlayer === 'O');
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

    scores[result.player] += 1;
    const loser = result.player === 'X' ? 'O' : 'X';
    const emoji = result.player === 'X' ? '🔴' : '🔵';
    updateScores();

    modalResult.textContent = `${emoji} ${result.player} Wins!`;
    modalResult.className = `modal-result ${result.player === 'X' ? 'x-wins' : 'o-wins'}`;
    modalSub.textContent = 'Congratulations!';
    statusEl.textContent = '';
    scoreXCard.classList.remove('active');
    scoreOCard.classList.remove('active');
  } else {
    scores['X'] += 0.5;
    scores['O'] += 0.5;
    updateScores();

    modalResult.textContent = "It's a Draw!";
    modalResult.className = 'modal-result draw';
    modalSub.textContent = 'Well played by both sides.';
    statusEl.textContent = '';
    scoreXCard.classList.remove('active');
    scoreOCard.classList.remove('active');
  }

  setTimeout(() => modalEl.classList.remove('hidden'), 400);
}

function updateScores() {
  scoreXEl.textContent = formatScore(scores.X);
  scoreOEl.textContent = formatScore(scores.O);
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
  updateStatus();
  updateScoreHighlight();
  scheduleAI();
}

// ── Init ──
resetBoard();
