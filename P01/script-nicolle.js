let questionShow = document.getElementById("questionShow");
let answersShow = document.querySelectorAll(".answersShow");
let prevBtn = document.getElementById("backbtn");
let nextBtn = document.getElementById("nextBtn");
let powerUp = document.getElementById("powerUp");
let powerUpInfo = document.querySelector("#powerInfo");
let scoreShow = document.getElementById("score");
let winFeedbackScreen = document.getElementById("win");
let loseFeedbackScreen = document.getElementById("lose");
let finalScore = document.querySelectorAll(".finalScore");
let retryBtn = document.querySelectorAll(".rettryBtn");
let homeBtn = document.querySelectorAll(".homeBtn");
let backToHomePage = document.getElementById("goToHome");
let startTheQuiz = document.getElementById("startTheQuiz");
let closeQuiz = document.getElementById("closeQuiz");
let cancelBtn = document.getElementById("cancel");
let quiz = document.getElementById("quiz");
let startScreen = document.getElementById("startScreen");
const popUp = document.getElementById("popUp");
let score = 0;
let answered = false;
let currentIndex = 0;
let ourQuestions = "questions.json";
// shuffle function for ramdom ex. answers
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
// script for pop up when quiz
startTheQuiz.addEventListener("click", () => {
  popUp.hidden = false;
});
cancelBtn.addEventListener("click", () => {
  popUp.hidden = true;
  quiz.removeAttribute("blurActive");
});
// script for cool sticker aniamtion

const carSticker = document.getElementById("carSticker");
const carStickerAnimation = [
  { filter: "blur(9px)", width: "700px", display: "none" },
  { filter: "blur(0px)", width: "400px", display: "block" },
];
const stickerTiming = {
  duration: 1000,
  iterations: 1,
  easing: "ease-out",
  fill: "forwards",
};
function stickerAnimate() {
  carSticker.animate(carStickerAnimation, stickerTiming);
}
// the loaded in questions
fetch(ourQuestions)
  .then((res) => res.json())
  .then((data) => {
    // //console.log(data.nicolle);
    let qstate = data.nicolle.map(() => ({
      shuffle: null,
      answered: false,
    }));
    //shuffled options for quiz

    showQuestion(currentIndex); //display the different questions by using the next button
    showOptions(currentIndex);
    nextBtn.addEventListener("click", function () {
      if (!answered) {
        nextBtn.setAttribute("notClickable", "");
        return;
      }
      currentIndex++;
      if (currentIndex < data.nicolle.length) {
        showQuestion(currentIndex);
        showOptions(currentIndex);

        resetBgColor();
        allVisible();
      } else {
        endQuiz();
        finalScoredraw();

        setTimeout(() => {
          stickerAnimate();
        }, 1000);
      }
    });

    function showQuestion(currentIndex) {
      questionShow.innerHTML = data.nicolle[currentIndex].question;
      answered = false;
      powerUp.disabled = false;

      nextBtn.setAttribute("notClickable", "");
    } //display the questions in your html

    function showOptions(currentIndex) {
      const q = data.nicolle[currentIndex];

      if (!qstate[currentIndex].shuffled) {
        qstate[currentIndex].shuffled = shuffle([...q.options]);
      }

      const opts = qstate[currentIndex].shuffled;
      answersShow.forEach((li, i) => {
        // show the options fron json array in the html shuffled
        li.innerHTML = opts[i];
      });
      // //console.log("options:", opts);
      //// console.log("shuffled:", shuffled);
    } //display your optionns in html

    // show whichones clicked and right
    //function for changing the bg color on right/ wrong answer
    answersShow.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (answered) return;
        const correct = data.nicolle[currentIndex].answer.trim();
        const choice = btn.textContent.trim();
        powerUp.disabled = true;

        if (choice === correct) {
          drawScore();
        }
        answered = true;
        nextBtn.removeAttribute("notClickable");
        // if statement for showing wrong / right answer
        if (btn.innerText === data.nicolle[currentIndex].answer) {
          btn.style.backgroundColor = "#72bf6a";
          return;
        } else {
          btn.style.backgroundColor = "#f94449";
          answersShow.forEach((option) => {
            if (option.innerText === data.nicolle[currentIndex].answer) {
              option.style.backgroundColor = "#72bf6a";
            }
          });
        }
      });
    });
    // function clearing bg color on answer when clicked to next question
    function resetBgColor() {
      answersShow.forEach((btn) => {
        btn.style.backgroundColor = "#ffb100";
      });
    }
    let usage = 3;
    let powerUsed = false;
    powerUp.addEventListener("click", function () {
      if (powerUsed) return;
      powerUsed = true;

      if (usage > 0) {
        usage--;
        console.log(usage);
        powerUpInfo.innerHTML = `<p>You can use this feature ${usage}x</p>`;
      }
      // make the powerup btn unclickable
      if (usage == 0) {
        powerUp.disabled = true;
        powerUpInfo.innerHTML = `<p>You can't use this feature anymore!</p>`;
        powerUp.setAttribute("notClickable", "");
      }

      const correctAns = data.nicolle[currentIndex].answer;
      const buttons = Array.from(answersShow);
      const wrongBtn = buttons.filter((b) => b.innerText !== correctAns);

      const keepWrong = wrongBtn[Math.floor(Math.random() * wrongBtn.length)];

      wrongBtn.forEach((b) => {
        if (b !== keepWrong) b.style.visibility = "hidden";
      });
    });
    function allVisible() {
      answersShow.forEach((b) => {
        b.style.visibility = "visible";
      });
    }
    nextBtn.addEventListener("click", () => {
      if (usage > 0) {
        powerUsed = false;
      }
    });
    // function for showing the infos for the feature btns
    powerUpInfo.classList.add("notVisible");

    powerUp.addEventListener("mouseover", () => {
      powerUpInfo.classList.remove("notVisible");
    });
    powerUp.addEventListener("mouseout", () => {
      powerUpInfo.classList.add("notVisible");
    });
    // draw score functiion
    function drawScore() {
      score++;
      scoreShow.innerText = "Score: " + score + "/20";
      scoreShow.classList.remove("is-animated");
      void scoreShow.offsetWidth;
      scoreShow.classList.add("is-animated");
    }
    function finalScoredraw() {
      finalScore.forEach((el) => {
        el.innerText = "Final score: " + score + "/20";
      });
      // console.log(finalScore);
    }
    function endQuiz() {
      quiz.hidden = true;
      toggleFeedback();
      console.log("quiz finished score: ", score);
    }
    // code for showing feedbackscreen

    function toggleFeedback() {
      if (score >= 10) {
        winFeedbackScreen.style.display = "flex";
        loseFeedbackScreen.style.display = "none";
      } else {
        winFeedbackScreen.style.display = "none";
        loseFeedbackScreen.style.display = "flex";
      }
    }
    // js for switching betwheen pages

    // ! change to false when you want to hide the quiz at the start

    startScreen.hidden = false;
    // ! change to true when you want to hide the quiz at the start

    quiz.hidden = true;

    startTheQuiz.addEventListener("click", () => {
      startScreen.hidden = true;
      quiz.hidden = false;
      currentIndex = 0;
      quiz.setAttribute("blurActive", "");
    });
    closeQuiz.addEventListener("click", () => {
      startScreen.hidden = false;
      quiz.hidden = true;
      popUp.hidden = true;
    });
    retryBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        score = 0;
        scoreShow.innerText = "Score: 0/20";
        console.log(score);
        currentIndex = 0;
        qstate = data.nicolle.map(() => ({
          shuffled: null,
          answered: false,
        }));
        quiz.hidden = false;
        winFeedbackScreen.style.display = "none";
        loseFeedbackScreen.style.display = "none";
        showOptions(currentIndex);
        showQuestion(currentIndex);
      });
    });
    // backToHomePage.addEventListener("click", () => {
    //   startScreen.hidden = true;
    // });

    homeBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        // TODO: HERE COMES THE HOME PAGE .hidden = false;
        winFeedbackScreen.style.display = "none";
        loseFeedbackScreen.style.display = "none";
      });
    });
  });

// script for home page ###########################

   

