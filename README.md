# Tic-Tac-Toe

A browser-based tic-tac-toe game with human and AI players, score tracking, and light/dark mode. Playable directly in the browser — no build step or dependencies required.

## Live Demo

Once deployed, the game is available at:
```
https://caleb-james-smith.github.io/tic-tac-toe-website/
```

---

## Features

- **Three game modes**: Human vs Human, Human vs AI, AI vs AI
- **Unbeatable AI** powered by the Minimax algorithm
- **Score tracking** across games in a session (Win = 1pt, Draw = 0.5pt, Loss = 0pt)
- **Light and dark mode** with a toggle button (respects system preference by default)
- **Turn indicator** always shows whose turn it is, colored by player
- **Last move highlight** shown in yellow
- **Hover preview** shows where your piece will land before you click
- **Win/Draw modal** with a Play Again option at the end of each game

---

## Setup (Local)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/caleb-james-smith/tic-tac-toe-website.git
   cd tic-tac-toe-website
   ```

2. Open `index.html` in any modern browser — no server or install needed:
   ```bash
   open index.html        # macOS
   start index.html       # Windows
   xdg-open index.html    # Linux
   ```

---

## Deployment (GitHub Pages)

1. Push the repository to GitHub.
2. Go to your repository on GitHub → **Settings** → **Pages**.
3. Under **Source**, select the `main` branch and root (`/`) folder.
4. Click **Save**. Your site will be live in a minute at:
   ```
   https://caleb-james-smith.github.io/tic-tac-toe-website/
   ```

---

## How to Play

### Player Setup
- Use the **X Player** and **O Player** dropdowns to choose `Human` or `AI` for each role.
- Click **Random Assign** to randomly decide who plays as X and who plays as O.
- **X always goes first.**

### Gameplay
- Click any empty cell on the board to place your piece (Human turns only).
- Hover over a cell to preview where your piece will land.
- The last move is highlighted in yellow.
- The current player's turn is shown in the status bar, colored in their player color (red for X, blue for O).

### Game End
- When a player wins or the game ends in a draw, a result screen appears.
- Click **Play Again** to start a new game with the same player setup.
- Scores carry over between games for the duration of your browser session.

### Scoring
| Result | Points |
|--------|--------|
| Win    | 1.0    |
| Draw   | 0.5    |
| Loss   | 0.0    |

### Dark Mode
- Click the **sun/moon toggle button** in the header to switch between light and dark mode.
- Your preference is saved and remembered on future visits.

---

## File Structure

```
tic-tac-toe-website/
├── index.html   # Page structure and layout
├── style.css    # Styling and theme variables (light/dark)
├── script.js    # Game logic, AI, scoring, and interactivity
└── README.md    # This file
```

---

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge). No Internet Explorer support.
