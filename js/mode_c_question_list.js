function displayQuestionList() {
  const questionListDiv = document.getElementById("question-list");
  questionListDiv.innerHTML = "";

  const questions = window.quizState.getQuestions();
  const userAnswers = window.quizState.getUserAnswers();
  const currentQuestion = window.quizState.getCurrentQuestion();

  questions.forEach((_, index) => {
    const questionItem = document.createElement("div");
    questionItem.classList.add("question-item");
    if (userAnswers[index] !== null) {
      questionItem.classList.add("answered");
    }
    if (index === currentQuestion) {
      questionItem.classList.add("current");
    }
    questionItem.textContent = `${index + 1}`;
    questionItem.onclick = () => {
      window.quizState.setCurrentQuestion(index);
      updateQuestionList();
    };
    questionListDiv.appendChild(questionItem);
  });
}

function updateQuestionList() {
  const questionItems = document.querySelectorAll(".question-item");
  const userAnswers = window.quizState.getUserAnswers();
  const currentQuestion = window.quizState.getCurrentQuestion();

  questionItems.forEach((item, index) => {
    item.classList.remove("current", "answered");
    if (userAnswers[index] !== null) {
      item.classList.add("answered");
    }
    if (index === currentQuestion) {
      item.classList.add("current");
    }
  });
}

// Initialize question list on page load
document.addEventListener("DOMContentLoaded", () => {
  if (window.quizState) {
    displayQuestionList();
  }
});
