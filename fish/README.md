# Fish Escape - Underwater Gaming Platform

Educational Underwater Game & Distributed Service Architecture  
CIS045-3 Distributed Service Architectures  
University of Bedfordshire

---

## Visual Design and User Interface

The user interface is designed with a modern underwater visual aesthetic:
- Ocean environment gradients, animated bubble particles, coral reefs, and marine elements.
- Character designs: Swimmer / Diver avatar and interactive ocean creatures.
- UI elements: Navigation headers, gold coin indicators, health indicators (3 lives), and level markers.
- Responsive gaming experience: Adaptive layouts, on-screen controls, and keyboard navigation.

---

## Features and Playable Mini-Games

The platform contains interactive underwater mini-games:

1. **Game 01: Fish Counting (Official API Integration & Shark Chase Adventure)**
   - **Interactive Story Sequence**: Dynamic narrative sequence leading into the underwater swim run.
   - **Shark Chase Distance Mechanic**: Track showing distance to safety (0m to 100m).
     - Correct Answer: Diver swims faster away from danger.
     - Wrong Answer: Player loses 1 heart / life.
     - Game Over: Triggered if health reaches 0.
   - **Live Countdown Timer**: Per-round countdown with visual warning alerts.
   - **Mystery Chests**: Collectible items granting bonuses, shield protection, or score boosts.
   - **Multi-Level Progression**: Coastal Waters, Coral Trench, and Deep Ocean environments.
   - **Official REST API**: Fetches real-time counting puzzle images from `https://marcconrad.com/uob/fish/api.php?out=json` with error handling, fallbacks, and score tracking.

2. **Game 02: Memory Match**
   - 12 underwater creature cards (clownfish, octopus, dolphin, sea turtle, starfish, crab).
   - Card flipping logic with match detection, move tracking, real-time timer, and completion feedback.
   - Bonus coin rewards scaled to move efficiency and completion speed.

3. **Game 03: Ocean Quiz**
   - Curated marine biology trivia questions across multiple categories.
   - Selectable options with instant feedback and final score summary.

4. **Game 04: Save the Little Fish (Maze Arcade)**
   - Underwater grid-based maze navigation.
   - Arrow keys / WASD controls on desktop and on-screen touch controls on mobile devices.
   - Obstacles and power-up pickups.

5. **Game 05: Treasure Hunt (Seabed Explorer)**
   - Interactive seabed exploration where players discover hidden ocean relics, shells, and chests.

---

## CIS045-3 Assignment Themes Reflection

### 1. Software Design Principles (Low Coupling and High Cohesion)
- **High Cohesion**: Every module has a single, well-defined responsibility:
  - `src/services/fishApi.js` / `fishApiService.js`: Manages communication, error handling, and parameter serialization with the external Fish Game API.
  - `src/services/soundService.js`: Encapsulates procedural audio generation (bubbles, coins, chimes, victory fanfare) without cluttering UI components.
  - `src/services/authService.js`: Handles virtual identity, session cookies, and login/registration token flows.
  - `src/context/GameContext.jsx`: Centralizes global game state (scores, coins, levels, power-ups, achievements) with reusable action functions.
- **Low Coupling**: The React UI components do not handle raw API communication directly. If the backend changes from the local development server to an external REST API, only the corresponding service file in `src/services/` needs to be updated.

### 2. Event-Driven Programming
The application operates on an asynchronous, event-driven model:
- **User Input Events**: `onClick`, `onChange`, and `onSubmit` event handlers manage puzzle submissions, card flipping, and shop transactions.
- **Keyboard Events**: `window.addEventListener('keydown')` captures `ArrowLeft`, `ArrowRight`, `KeyA`, `KeyD`, and `Space` for lane switching and game control.
- **Touch and Pointer Events**: Responsive controls for mobile and tablet devices.
- **Asynchronous Lifecycle Events**: React hooks listen for intervals, asynchronous API responses, and reactive game-over triggers.

### 3. Interoperability
- **External Web Service Integration**: The platform interoperates with the external Fish Game API authored by Dr. Marc Conrad (`https://marcconrad.com/uob/fish/api.php?out=json`).
- **Data Exchange Protocol**: HTTP GET requests receiving JSON payloads containing the image resource URL and integer solutions:
  ```json
  {
    "question": "https://www.sanfoh.com/uob/fish/data/ch_...png",
    "fish": 4,
    "chest": 3
  }
  ```
- **REST API Backend Integration**: The service layer includes standardized interfaces matching REST API conventions:
  - `GET /api/leaderboard` -> `leaderboardService.js`
  - `POST /api/auth/login` and `POST /api/auth/register` -> `authService.js`
  - `POST /api/history` -> Submitting player game results.

### 4. Virtual Identity (Authentication, Cookies, Sessions)
- **Virtual Identity**: A digital persona represents the player in the virtual ocean world.
- **Authentication Mechanisms**:
  - Sign-in and registration forms with validation and password visibility toggles.
  - Supports lecture credentials (`username: Marc`, `password: hello26`) as demonstrated in `FishGame26/com/perisic/fish/peripherals/LoginData.java`.
  - Token-based authentication (Bearer Tokens) and browser session cookies with secure settings.
  - LocalStorage persistence ensures session continuity across page reloads.

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Component-based interactive UI library |
| JavaScript (ES6+) | Application logic and event handling |
| Vite | Frontend bundler and local development server |
| Tailwind CSS | Utility-first styling and underwater layout system |
| React Router DOM | Client-side routing across game pages and authentication screens |
| Lucide React | Clean vector iconography |
| Web Audio API | Procedural sound generation |
| Canvas Confetti | Celebration effects upon round victories |
| Context API & LocalStorage | Global state management and player progress persistence |

---

## Project Structure

```
fish/
|-- public/
|   `-- game-assets/             # Game graphics, backgrounds, and sprites
|-- src/
|   |-- components/
|   |   |-- common/              # Reusable UI components
|   |   |-- game/                # GameEngine, Fish, Player, HUD, Modals
|   |   `-- navigation/          # Navigation headers and tab bars
|   |-- context/
|   |   |-- AuthContext.jsx      # Authentication and virtual identity state
|   |   `-- GameContext.jsx      # Central game state management
|   |-- data/
|   |   |-- achievements.js      # Achievements and progress definitions
|   |   |-- miniGames.js         # Mini-game metadata and routes
|   |   `-- quizQuestions.js     # Trivia questions and answers
|   |-- pages/
|   |   |-- Home.jsx             # Main landing and hub page
|   |   |-- Play.jsx             # Mini-game selection grid
|   |   |-- Leaderboard.jsx      # Global rankings
|   |   |-- Login.jsx            # Sign-in screen
|   |   `-- Register.jsx         # Registration screen
|   |-- services/
|   |   |-- authService.js       # Authentication service
|   |   |-- fishApi.js           # Fish Game API client
|   |   |-- fishApiService.js    # External Fish API integration
|   |   |-- leaderboardService.js # High scores and rankings
|   |   `-- soundService.js      # Procedural Web Audio API sound generator
|   |-- App.jsx                  # Main router and layout
|   |-- index.css                # Base styling and animations
|   `-- main.jsx                 # Application entry point
|-- package.json                 # Project dependencies and scripts
`-- vite.config.js               # Vite configuration and API proxy
```

---

## How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## Backend Integration Architecture

When connecting to the Node.js / Express backend:
1. **API Endpoints**:
   - `POST /api/auth/register` - Registers player account.
   - `POST /api/auth/login` - Authenticates user and returns JWT token.
   - `GET /api/auth/me` - Retrieves authenticated player profile.
   - `GET /api/leaderboard` - Queries top scores.
   - `POST /api/leaderboard` - Records high scores.
   - `POST /api/history` - Saves completed game round details.
   - `GET /api/puzzle` - Fetches the Marc Conrad Fish Math puzzle.
2. **Data Collections**:
   - `users` (name, email, password, avatar, score, level)
   - `leaderboard` (name, score, date)
   - `game_histories` (playerName, score, fishes, treasures, result, date)

---

## References and Acknowledgements
- **University of Bedfordshire** - CIS045-3 Distributed Service Architectures Coursework Specification.
- **Dr. Marc Conrad** - Official Fish Game API (`https://marcconrad.com/uob/fish/api.php` and `https://marcconrad.com/uob/fish/doc.php`).
- **Lucide Icons** - Clean open-source icon set (`https://lucide.dev`).
- **Canvas Confetti** - Kiril Vatev (`https://github.com/catdad/canvas-confetti`).
