# Tic-Tac-Toe Website Plan

## Overview
A browser-based tic-tac-toe game deployed on GitHub Pages, built with vanilla HTML, CSS, and JavaScript in separate files.

---

## File Structure
```
tic-tac-toe-website/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Game Modes
- **Human vs Human** — two players take turns on the same device
- **Human vs AI** — one human player against the computer
- **AI vs AI** — watch two AI players compete automatically

---

## Player Setup
- Players are identified as **Player 1** and **Player 2**, each with a customizable name (editable text input)
- Each player also has a type dropdown: `Human` | `AI`
- **X always goes first**
- X and O roles are automatically swapped between Player 1 and Player 2 after each game (via Play Again), so neither player is permanently stuck going first
- The Restart button resets the board without swapping roles or scores

---

## Visuals & Theme
- **X** rendered in **red**
- **O** rendered in **blue**
- **Light mode and dark mode** with a toggle button (e.g. sun/moon icon)
- Color schemes:

  | Element              | Light Mode              | Dark Mode                |
  |----------------------|-------------------------|--------------------------|
  | Background           | Soft white (#f5f5f5)    | Deep navy (#1a1a2e)      |
  | Board background     | White (#ffffff)         | Dark slate (#16213e)     |
  | Cell borders         | Gray (#ccc)             | Muted blue-gray (#2a2a4a)|
  | Cell hover (empty)   | Soft green (#d4edda)    | Muted green (#1a3d2b)    |
  | X color              | Crimson red (#d62828)   | Bright red (#ff4d4d)     |
  | O color              | Royal blue (#1a5fa3)    | Sky blue (#4da6ff)       |
  | Last move highlight  | Yellow (#ffd700)        | Gold (#ffc200)           |
  | Text                 | Dark gray (#222)        | Light gray (#e0e0e0)     |
  | Button background    | Medium gray (#ddd)      | Dark blue-gray (#2a2a4a) |
  | Win screen overlay   | Semi-transparent white  | Semi-transparent dark    |

- Clean, centered board layout
- Winning cells highlighted on game end
- Status message shows whose turn it is (styled in that player's color)

---

## Turn Indicator
- Status bar shows the current player's name and symbol, e.g. **"Jimmy's Turn (X)"** in red or **"Player 2's Turn (O)"** in blue
- Status text updates live as player names are typed — no move required
- Active player's score card is subtly highlighted (green border and background accent)

---

## Move Highlights
- **Last move**: cell background set to yellow/gold after a move is made
- **Hover highlight**: hovering over an empty cell shows a soft green background (only for human turns) — green is neutral and distinct from both red (X) and blue (O)

---

## Win / Draw Screen
- On game end, a **modal overlay** appears centered on the board:
  - **Win**: Shows "X Wins!" (in red) or "O Wins!" (in blue) with a trophy or celebratory message
  - **Draw**: Shows "It's a Draw!" in neutral styling
- Winning cells on the board remain highlighted beneath the overlay
- **Play Again** button in the modal resets the board (keeps player setup and scores)

---

## Scoring
- Tracked per session (reset only on page refresh)
- **Win**: +1 point
- **Draw**: +0.5 points each
- **Loss**: +0 points
- Scores are tracked by **Player 1** and **Player 2**, not by symbol — so points follow the person across role swaps
- Scoreboard shows each player's name, their current X/O role badge, and their score side by side
- Scores and name labels update live when player names are typed

---

## UI Layout (`index.html`)
1. **Header** — game title + light/dark mode toggle button
2. **Setup Panel** — two player rows, each with a name text input and a Human/AI dropdown
3. **Scoreboard** — Player 1 | Player 2 score cards, each showing name, X/O role badge, and score; active player highlighted
4. **Status Bar** — current player's name and symbol (e.g. "Jimmy's Turn (X)"), colored by symbol; updates live on name input
5. **Game Board** — 3×3 grid of clickable cells
6. **Restart Button** — reset the board without changing player setup, roles, or scores
7. **Win/Draw Modal** — overlay shown on game end with result and Play Again button (Play Again also swaps X/O roles)

---

## Game Logic (`script.js`)
- Board state as a 9-element array
- Turn tracking (X always starts); `xPlayerIndex` tracks which player (0 or 1) is currently X
- Win detection: check all 8 winning combinations after each move
- Draw detection: all cells filled with no winner
- Last move index tracked and applied as yellow highlight class
- Hover preview via CSS class toggled on `mouseenter`/`mouseleave` for empty cells on human turns
- Event-driven: cell clicks trigger human moves; AI moves triggered automatically after human turn (or on a short delay for AI vs AI)
- Name input events trigger live re-render of status bar and scoreboard labels
- Score updated and modal shown on game end; Play Again swaps `xPlayerIndex` before resetting

---

## AI Logic (`script.js`)
- Uses the **Minimax algorithm** — results in an unbeatable AI
- AI vs AI mode runs moves on a timed interval so the game is watchable
- AI plays optimally for both X and O roles

---

## Light/Dark Mode (`script.js` + `style.css`)
- Default: system preference via `prefers-color-scheme` media query
- Toggle button switches a `.dark-mode` class on `<body>`
- All colors defined as CSS custom properties (variables) scoped to `:root` (light) and `.dark-mode`
- Toggle state persisted in `localStorage` so preference survives refresh

---

## Deployment (GitHub Pages)
1. Create a GitHub repository
2. Push all files to the `main` branch
3. Enable GitHub Pages in repo Settings → Pages → source: `main` branch, root `/`
4. Site will be live at `https://<username>.github.io/<repo-name>/`

---

## Build Order
1. `index.html` — structure and layout (all sections and modal)
2. `style.css` — CSS variables for both themes, board, colors, highlights, modal, responsive layout
3. `script.js` — game state, win detection, human input, hover preview, last move highlight, AI (minimax), scoring, modal, dark mode toggle
4. `README.md` — setup and usage instructions
