/*-------------- Constants -------------*/

const buttons = document.querySelectorAll(".difficulty-btn");

/*---------- Variables (state) ---------*/



/*----- Cached Element References  -----*/
const playBtn = document.getElementById("playBtn");
const contactLink = document.querySelector(".contact-link");


/*-------------- Functions -------------*/



/*----------- Event Listeners ----------*/
playBtn.addEventListener("click", () => {
  window.location.href = "difficulty.html";
});

helpBtn.addEventListener("click", () => {
  alert("How to Play:\n-Guess the hidden word one letter at a time.\n-Each wrong guess brings Ahmed closer to danger.\n-You have limited tries, save Ahmed before it's too late!");
});


buttons.forEach(btn => {
    btn.addEventListener("click", () => {
    const level = btn.dataset.difficulty;
    localStorage.setItem("difficulty", level); 
    window.location.href = "game.html";
    });
});