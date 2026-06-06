
let questions = [
    { 
       question: "What is the name of Joe's first major love interest?",
       answers: ["Beck", "Love", "Peach", "Candace"],
       correct: 3,
    },
    {
        question: "Where does Joe work in New York?",
        answers: ["Library", "Coffee shop", "Bookstore", "Music store"],
        correct: 2,
    },
    {
        question: "Who is Beck's wealthy best friend?",
        answers: ["Delilah", "Love", "Karen", "Peach"],
        correct: 3,
    },
    {
        question: "What is the name of Joe's young neighbor?",
        answers: ["Theo", "Forty", "Paco", "Gabe"],
        correct: 2,
    },
    {
        question: "Who is Joe's new love interest in Los Angeles?",
        answers: ["Delilah", "Love", "Candace", "Ellie"],
        correct: 1,
    },
    {
        question: "What alias does Joe use in season 2",
        answers: ["Will Bettelheim", "Jonathan Moore", "Ben Ashby", "David Fincher"],
        correct: 0,
    },
    {
        question: "Who is Love's twin brother?",
        answers: ["Henry", "Theo", "Milo", "Forty"],
        correct: 3,
    },
    {
        question: "What is the name of Joe and love's baby?",
        answers: ["Henry", "James", "Lucas", "Theo"],
        correct: 0,
    },
    {
        question: "Who is Joe's new neighbor that he becomes obsessed with?",
        answers: ["Sherry", "Nathalie", "Marienne", "Delilah"],
        correct: 1,
    },
    {
        question: "Who is the librarian that Joe falls for?",
        answers: ["Ellie", "Love", "Marienne", "Julia"],
        correct: 2,
    },
    {
        question: "Which hobby do Joe and Love take up together to appear normal?",
        answers: ["Painting", "Beekeeping", "Gardening", "Baking"],
        correct: 1,
    },
    {
        question: "Where does season 4 mainly take place?",
        answers: ["Paris", "London", "Los Angeles", "Rome"],
        correct: 1,
    },
    {
        question: "What alias does Joe use in season 4?",
        answers: ["Will Bettelheim", "Edwad Hall", "Patrick Reed", "Johnatan Moore"],
        correct: 3,
    },
    {
        question: "Which group of wealthy friends does Joe get involved with in London?",
        answers: ["The Rich kids", "The Eat The Rich Club", "The Royal Circle", "The Soho crew"],
        correct: 1,
    },
    {
        question: "Who turns out to be the real 'Eat The Rich' killer in season 4?",
        answers: ["Joe", "Marienne", "Rhys Montrose", "Kate"],
        correct: 0,
    },
    {
        question: "What is Joe's favorite place to stalk his crush in season 1?",
        answers: ["Coffee shop", "Bookstore", "Social media", "Library"],
        correct: 1,
    },
    {
        question: "Who is Joe's ex-girlfriend that comes back unexpectedly in season 2?",
        answers: ["Love", "Beck", "Candace", "Marienne"],
        correct: 2,
    },
    {
        question: "What alias does Joe use when meeting people in season 3?",
        answers: ["Jonathan Moore", "Will Bettelheim", "Edward Hall", "Patrick Reed"],
        correct: 1,
    },
    {
        question: "What is Joe's favorite way to learn about someone?",
        answers: ["Stalking their social media", "Talking to them directly", "Asking mutual friends", "Reading books"],
        correct: 0,
    },
    {
        question: "How many people has Joe killed throughout the series?",
        answers: ["5", "12", "24", "35"],
        correct: 2,
    },
]


let currentQuestion = 0; // bijhouden welke vraag je nu hebt.
let score = 0; // score bijhouden
let fouten = 0; // aantal foute antwoorden
const maxFouten = 10; // max aantal fouten
let fiftyUses = 0; // telt hoeveel keer je hem hebt gebruikt
const maxFiftyUses = 5; // maximaal aantal keer
let fiftyUsedThisQuestion = false; 
let questionAnswered = false; // 50/50 button
let timer;             // voor setInterval
let timeLeft = 15;     // 15 seconden per vraag

function showQuestion() {

  startTimer();
  let q = questions[currentQuestion];
  document.querySelector(".quiz-question").textContent = q.question;
  
let buttons = document.querySelectorAll (".answer-btn");
buttons.forEach ((btn, i) =>  {
btn.textContent = q.answers [i];
btn.classList.remove ("correct", "wrong");
btn.disabled = false;
btn.style.visibility = "visible";
popupAnswer.classList.remove("zichtbaar");
popupFifty.classList.remove("zichtbaar");
fiftyUsedThisQuestion = false;
questionAnswered = false; 
btn.onclick = () => checkAnswer (i, btn);
})
}

function checkAnswer(i, btn) {
  if (questionAnswered) return; // voorkomt meerdere clicks
  questionAnswered = true;

  let q = questions[currentQuestion];

  if (i === q.correct) {
    if (btn) btn.classList.add("correct");
    score++;
    scoreDisplay.textContent = score;
  } else {
    if (btn) btn.classList.add("wrong");
    fouten++;
    score--;
    scoreDisplay.textContent = score;
  }

  let buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btnEl, idx) => {
    btnEl.disabled = true;
    if (idx === q.correct) {
      btnEl.classList.add("correct");
    }
  });



  if (fouten >= maxFouten) {
    localStorage.setItem("finalScore", score);
    localStorage.setItem("totalQuestions", questions.length);
    localStorage.setItem("wrongAnswers", fouten);
    window.location.href = "fail-scherm.html";
  }
}

const nextBtn = document.querySelector(".next-question-btn"); 
const questionStatus = document.querySelector(".question-status b"); 
const scoreDisplay = document.querySelector(".score b");
const popupAnswer = document.querySelector("#pop-up");
const popupFifty = document.querySelector("#pop-up-1");
const timerDisplay = document.querySelector(".quiz-timer .time-duration");

nextBtn.addEventListener("click", () => {
  if (!questionAnswered) {
    popupAnswer.classList.add("zichtbaar");
    setTimeout(() => {
      popupAnswer.classList.remove("zichtbaar");
    }, 1000);
    return;
  }
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();             
    questionStatus.textContent = currentQuestion + 1; 
  } else {
    // Laatste vraag beantwoord → naar eindscherm
    localStorage.setItem("finalScore", score);
    localStorage.setItem("totalQuestions", questions.length);

    window.location.href = "eindscherm-iliyana.html"; // hier gaat hij naar je eindscherm
  }
  });




const fiftyBtn = document.querySelector(".fifty-btn");

fiftyBtn.addEventListener("click", () => {
  if (fiftyUsedThisQuestion) return;

  if (fiftyUses < maxFiftyUses) {
    fiftyUses++;

    let q = questions[currentQuestion];
    let buttons = document.querySelectorAll(".answer-btn");


    let wrongButtons = [];
    buttons.forEach((btn, i) => {
      if (i !== q.correct) wrongButtons.push(btn);
    });


    let random = wrongButtons.sort(() => 0.5 - Math.random()).slice(0, 2); 
    random.forEach(btn => btn.style.visibility = "hidden");

    fiftyUsedThisQuestion = true;

  } else {
    popupFifty.classList.add("zichtbaar");
    setTimeout(() => {
      popupFifty.classList.remove("zichtbaar");
    }, 1000);
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i +1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  clearInterval(timer); // oude timer stoppen
  timeLeft = 15;        // reset timer
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
  clearInterval(timer);
  checkAnswer(-1);
  setTimeout(() => nextBtn.click(), 1000); // na 1 seconde naar volgende vraag
}
  }, 1000);
}

function updateTimerDisplay() {
  if (timerDisplay) timerDisplay.textContent = timeLeft + "s";
}



shuffleArray(questions);
showQuestion();



