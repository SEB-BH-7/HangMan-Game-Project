// --- DOM Elements ---
// Get references to all necessary DOM elements for the game UI
const playBtn = document.getElementById("playBtn");
const contactLink = document.querySelector(".contact-link");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const wordDiv = document.getElementById("word");
const lettersDiv = document.getElementById("letters");
const hangmanDiv = document.getElementById("hangman-drawing");
const messageDiv = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const attemptsDiv = document.getElementById("attempts");
const wrongLettersDiv = document.getElementById("wrong-letters");
const hintBtn = document.getElementById("hintBtn");

// --- Game State ---
// Variables to track the current game state
let chosenWord = "";           // The word to guess
let guessedLetters = [];       // Array of guessed letters
let wrongGuesses = 0;          // Number of wrong guesses
const maxWrong = 7;            // Maximum allowed wrong guesses
let gameOver = false;          // Flag for game over state
let wrongLetters = [];         // Array of wrong guessed letters
let difficulty = localStorage.getItem("difficulty") || "easy"; // Current difficulty
let hintUsed = false;          // Flag to check if hint was used

// --- Word Banks ---
// Words for each difficulty level
const WORDS = {
  easy: [
    "cat", "dog", "sun", "car", "book",
    "tree", "fish", "milk", "star", "bird",
    "cake", "shoe", "rain", "frog", "moon",
    "ball", "duck", "leaf", "ship", "bear"
  ],
  medium: [
    "planet", "guitar", "window", "school", "garden",
    "pencil", "rocket", "orange", "purple", "castle"
  ],
  hard: [
    "javascript", "hangman", "difficulty", "computer", "project",
    "elephant", "umbrella", "triangle", "diamond", "library"
  ],
  extreme: [
    "xylophone", "quizzical", "mnemonic", "juxtapose", "zephyr",
    "pneumonia", "subtlety", "syzygy", "flummox", "bizarre"
  ]
};

// --- Hangman Drawing Stages ---
// HTML for each stage of the hangman drawing
const hangmanStages = [
  `<div style="height: 160px;"></div>`,
  `<div class="stickman"><div class="head"></div></div>`,
  `<div class="stickman"><div class="head"></div><div class="body"></div></div>`,
  `<div class="stickman"><div class="head"></div><div class="body"></div><div class="left-arm"></div></div>`,
  `<div class="stickman"><div class="head"></div><div class="body"></div><div class="left-arm"></div><div class="right-arm"></div></div>`,
  `<div class="stickman"><div class="head"></div><div class="body"></div><div class="left-arm"></div><div class="right-arm"></div><div class="left-leg"></div></div>`,
  `<div class="stickman"><div class="head"></div><div class="body"></div><div class="left-arm"></div><div class="right-arm"></div><div class="left-leg"></div><div class="right-leg"></div></div>`,
  `<div class="stickman red"><div class="head"></div><div class="body"></div><div class="left-arm"></div><div class="right-arm"></div><div class="left-leg"></div><div class="right-leg"></div></div>`
];

// --- Event Listeners for Navigation and Difficulty ---
// Play button navigates to the story page
if (playBtn) {
  playBtn.addEventListener("click", () => {
    window.location.href = "Story.html";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Help popup for index.html
  const helpBtn = document.getElementById("helpBtn");
  const helpBox = document.getElementById("helpBox");
  const closeHelp = document.getElementById("closeHelp");
  if (helpBtn && helpBox && closeHelp) {
    helpBtn.addEventListener("click", () => {
      helpBox.style.display = "block";
    });
    closeHelp.addEventListener("click", () => {
      helpBox.style.display = "none";
    });
  }

  // Difficulty selection for difficulty.html
  if (difficultyBtns.length) {
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const diff = this.getAttribute('data-difficulty');
        localStorage.setItem('difficulty', diff);
        window.location.href = 'game.html';
      });
    });
  }

  // Hangman Game for game.html
  if (wordDiv && lettersDiv && hangmanDiv && messageDiv && attemptsDiv && wrongLettersDiv) {
    startGame();
    if (restartBtn) {
      restartBtn.addEventListener("click", startGame);
    }
    if (hintBtn) {
      hintBtn.addEventListener("click", useHint);
    }
  }
});

// --- Hangman Game Functions ---

// Initializes and starts a new game
function startGame() {
  guessedLetters = [];
  wrongGuesses = 0;
  gameOver = false;
  wrongLetters = [];
  hintUsed = false;
  messageDiv.textContent = "";
  if (restartBtn) restartBtn.style.display = "none";
  if (hintBtn) hintBtn.disabled = false;
  hangmanDiv.innerHTML = hangmanStages[0];
  updateAttempts();
  updateWrongLetters();

  // Get difficulty from localStorage or default to easy
  difficulty = localStorage.getItem("difficulty") || "easy";
  // Pick a random word from the selected difficulty
  const words = WORDS[difficulty] || WORDS.easy;
  chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

  displayWord();
  displayLetters();
}

// Displays the word with guessed letters and underscores for unguessed letters
function displayWord(hintLetter = null) {
  wordDiv.innerHTML = chosenWord
    .split("")
    .map(letter => {
      if (guessedLetters.includes(letter)) {
        return letter;
      } else if (hintLetter && letter === hintLetter) {
        // Highlight the hint letter
        return `<span style="color: orange; font-weight: bold;">${letter}</span>`;
      } else {
        return "_";
      }
    })
    .join(" ");
}

// Displays the alphabet buttons for guessing
function displayLetters() {
  lettersDiv.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.disabled = guessedLetters.includes(letter) || gameOver;
    btn.className = "letter-btn";
    btn.addEventListener("click", () => handleGuess(letter));
    lettersDiv.appendChild(btn);
  }
}

// Updates the remaining attempts display
function updateAttempts() {
  attemptsDiv.textContent = `Remaining Attempts: ${maxWrong - wrongGuesses}`;
}

// Updates the display of wrong guessed letters
function updateWrongLetters() {
  if (wrongLetters.length > 0) {
    wrongLettersDiv.textContent = "Wrong guesses: " + wrongLetters.join(", ");
  } else {
    wrongLettersDiv.textContent = "";
  }
}

// Handles a letter guess by the player
function handleGuess(letter) {
  if (gameOver || guessedLetters.includes(letter)) return;
  guessedLetters.push(letter);

  if (chosenWord.includes(letter)) {
    displayWord();
    // Check if all letters have been guessed
    if (chosenWord.split("").every(l => guessedLetters.includes(l))) {
      messageDiv.textContent = "🎉 You saved Ahmed!";
      gameOver = true;
      if (restartBtn) restartBtn.style.display = "inline-block";
      if (hintBtn) hintBtn.disabled = true;
    }
  } else {
    wrongGuesses++;
    wrongLetters.push(letter);
    hangmanDiv.innerHTML = hangmanStages[wrongGuesses];
    updateAttempts();
    updateWrongLetters();
    // Check if player has lost
    if (wrongGuesses >= maxWrong) {
      messageDiv.textContent = `💀 Game Over! The word was: ${chosenWord}`;
      gameOver = true;
      displayWord();
      if (restartBtn) restartBtn.style.display = "inline-block";
      if (hintBtn) hintBtn.disabled = true;
    }
  }
  displayLetters();
}

// Reveals a random unguessed letter as a hint
function useHint() {
  if (gameOver || hintUsed) return;
  // Find unguessed letters in the word
  const unguessed = chosenWord.split("").filter(l => !guessedLetters.includes(l));
  if (unguessed.length === 0) return;
  // Pick a random unguessed letter
  const hintLetter = unguessed[Math.floor(Math.random() * unguessed.length)];
  // Show the hint letter in color
  displayWord(hintLetter);
  hintBtn.disabled = true;
  hintUsed = true;
  // After a short delay, auto-guess the letter
  setTimeout(() => {
    guessedLetters.push(hintLetter);
    displayWord();
    displayLetters();
    // Check if the hint wins the game
    if (chosenWord.split("").every(l => guessedLetters.includes(l))) {
      messageDiv.textContent = "🎉 You saved Ahmed!";
      gameOver = true;
      if (restartBtn) restartBtn.style.display = "inline-block";
      if (hintBtn) hintBtn.disabled = true;
    }
  }, 1200);
}
