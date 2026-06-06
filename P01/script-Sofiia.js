const questionShow = document.getElementById("questionShow");
const answersShow = document.querySelectorAll(".answersShow");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let ourQuestions = "questions.json";
let score = 0;
let fiftyUsed = false;
let correctCount = 0;
let wrongCount = 0;

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
function scoreUp() {
  score++;
  let scoreShow = document.getElementById("score");
  scoreShow.innerText = "Score:" + score + "/20";
}
function scoreDown(){
  score--;
  let scoreShow = document.getElementById("score");
  scoreShow.innerText = "Score:" + score + "/20";
}

function updateTeller() {
  const teller = document.getElementById("teller");
  teller.innerText = `Vraag: ${currentIndex + 1} / 20`;
}

let currentIndex = 0;
let shuffledQuestions = [];
fetch(ourQuestions)
  .then((res) => res.json())
  .then((data) => {
    shuffledQuestions = shuffle([...data.sofiia]);
    console.log(data.sofiia);
    showQuestion(currentIndex);

    nextBtn.addEventListener("click", () => {
      currentIndex++;
      if (currentIndex < shuffledQuestions.length) {
        showQuestion(currentIndex);
        resetBgColor();
        allvisible();
      } else {
        showEndScreen();
      }
      console.log("btn clicked");
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        showQuestion(currentIndex);
        resetBgColor();
        allvisible();
        console.log(prevBtn);

      } else {
        console.log("eerste vraag bereikt");
      }
    });
    answersShow.forEach((btn) => {
      btn.disabled = false;
      btn.addEventListener("click", () => {
        answersShow.forEach(b => b.disabled = true);

        const rightAnswer = shuffledQuestions[currentIndex].answer;

        if (btn.innerText ===rightAnswer) {
          btn.style.backgroundColor = " rgb(25, 183, 25)";
          scoreUp();
          correctCount++;
        } else {
          btn.style.backgroundColor = "rgb(154, 16, 16)";
          scoreDown();
          wrongCount++;
          answersShow.forEach((b) => {
            if (b.innerText === rightAnswer) {
              b.style.backgroundColor = "rgb(25, 183, 25)";
            }
          });
        }
      });
    });

    function showQuestion(index) {
      const currentQuestion = shuffledQuestions[index];
      questionShow.innerHTML = currentQuestion.question;

      const shuffledOptions = shuffle([...currentQuestion.options]);
      answersShow.forEach((li, i) => {
        li.innerHTML = shuffledOptions[i];
        li.style.visibility = "visible";
        li.disabled = false;
        li.style.backgroundColor = "rgb(202, 200, 43)";
      });
      fiftyUsed = false;
      updateTeller();
    }
    function resetBgColor() {
      answersShow.forEach((btn) => {
        btn.style.backgroundColor = "rgb(202, 200, 43)";
        btn.disabled = false;
        btn.style.visibility = "visible";
      });
    }
    function allvisible() {
      answersShow.forEach((b) => {
        b.style.visibility = "visible";
      });
    }
    document.getElementById("fiftyBtn").addEventListener("click", () => {
      if (fiftyUsed) return; 
      const rightAnswer = shuffledQuestions[currentIndex].answer;
      const verkeerdeknop =  Array.from(answersShow).filter((btn) => btn.innerText !== rightAnswer);
      const oneToShow = verkeerdeknop [Math.floor(Math.random() * verkeerdeknop.length)];

      verkeerdeknop.forEach((btn) => {
        if (btn !== oneToShow) {
          btn.style.visibility = "hidden";
        }
      });
      fiftyUsed = true;
    });
    function showEndScreen() {
        document.getElementById("questionShow").style.display = "none";
        answersShow.forEach(btn => btn.style.display = "none");
        nextBtn.style.display ="none";
        prevBtn.style.display ="none";
        document.getElementById("fiftyBtn").style.display ="none";
        document.getElementById("score").style.display = "none";
        document.getElementById("teller").style.display = "none";

        const endScreen = document.getElementById("endScreen");
        endScreen.style.display = "block";

        const percentage = Math.round((correctCount/(correctCount+wrongCount)) *100);
        document.getElementById("finalScore").innerText = `Eindscore:${score}/20`;
        document.getElementById("correctAnswers").innerText = `Goede antwoorden:${correctCount}`;
        document.getElementById("wrongAnswers").innerText = `Foute antwoorden:${wrongCount}`;
        document.getElementById("percentage").innerText = `Percentage goed: ${percentage}%`;

        document.getElementById("restartBtn").addEventListener("click", () => {
          location.reload();
        });
      }
      
  });


