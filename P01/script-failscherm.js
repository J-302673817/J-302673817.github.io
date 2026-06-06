const finalScore = localStorage.getItem("finalScore");
const totalQuestions = localStorage.getItem("totalQuestions");
const wrongAnswers = localStorage.getItem ("WrongAnswers")

// Score tonen
document.getElementById("final-score").textContent = `${finalScore} / ${totalQuestions}`;
// restart knop laten werken
document.getElementById("restart-btn").addEventListener("click", () => {
window.location.href = "index-iliyana.html";
console.log(document.getElementById("restart-btn"));
});