/*-------------- Constants -------------*/

// For index.html (Play and Help)
const playBtn = document.getElementById("playBtn");
const contactLink = document.querySelector(".contact-link");

// For difficulty.html
const difficultyBtns = document.querySelectorAll(".difficulty-btn, .difficulty-btn-later");

// For game.html
const wordDiv = document.getElementById("word");
const lettersDiv = document.getElementById("letters");
const hangmanDiv = document.getElementById("hangman-drawing");
const messageDiv = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const attemptsDiv = document.getElementById("attempts");
const wrongLettersDiv = document.getElementById("wrong-letters");

/*---------- Variables (state) ---------*/
let chosenWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
let maxWrong = 7;
let gameOver = false;
let wrongLetters = [];
let difficulty = localStorage.getItem("difficulty") || "easy";

/*----- Word Banks -----*/
const WORDS = {
  easy: [
    "cat", "dog", "sun", "car", "book",
    "tree", "fish", "milk", "star", "bird",
    "cake", "shoe", "rain", "frog", "moon",
    "ball", "duck", "leaf", "ship", "bear"
  ]
   };

/*----- Hangman Drawing Stages -----*/
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

/*-------------- Functions -------------*/

// For index.html (Play and Help)
if (playBtn) {
  playBtn.addEventListener("click", () => {
    window.location.href = "Story.html";
  });
}

document.addEventListener("DOMContentLoaded", function() {
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
        const difficulty = this.getAttribute('data-difficulty');
        localStorage.setItem('difficulty', difficulty);
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
  }
});

/*----- Hangman Game Functions -----*/
function startGame() {
  guessedLetters = [];
  wrongGuesses = 0;
  gameOver = false;
  wrongLetters = [];
  messageDiv.textContent = "";
  if (restartBtn) restartBtn.style.display = "none";
  hangmanDiv.innerHTML = hangmanStages[0];
  updateAttempts();
  updateWrongLetters();

  // Pick a random word
  const words = WORDS[difficulty] || WORDS.easy;
  chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

  // Display word
  displayWord();

  // Display letter buttons
  displayLetters();
}

function displayWord() {
  wordDiv.innerHTML = chosenWord
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
}

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

function updateAttempts() {
  attemptsDiv.textContent = `Remaining Attempts: ${maxWrong - wrongGuesses}`;
}

function updateWrongLetters() {
  if (wrongLetters.length > 0) {
    wrongLettersDiv.textContent = "Wrong guesses: " + wrongLetters.join(", ");
  } else {
    wrongLettersDiv.textContent = "";
  }
}

function handleGuess(letter) {
  if (gameOver || guessedLetters.includes(letter)) return;
  guessedLetters.push(letter);

  if (chosenWord.includes(letter)) {
    displayWord();
    if (chosenWord.split("").every(l => guessedLetters.includes(l))) {
      messageDiv.textContent = "🎉 You saved Ahmed!";
      gameOver = true;
      if (restartBtn) restartBtn.style.display = "inline-block";
    }
  } else {
    wrongGuesses++;
    wrongLetters.push(letter);
    hangmanDiv.innerHTML = hangmanStages[wrongGuesses];
    updateAttempts();
    updateWrongLetters();
    if (wrongGuesses >= maxWrong) {
      messageDiv.textContent = `💀 Game Over! The word was: ${chosenWord}`;
      gameOver = true;
      displayWord();
      if (restartBtn) restartBtn.style.display = "inline-block";
    }
  }
  displayLetters();
}