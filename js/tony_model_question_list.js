function updateQuestionList() {
  if (!window.quizState) return;
  const questions = window.quizState.getQuestions();
  const current = window.quizState.getCurrent();
  const userAnswers = window.quizState.getUserAnswers();
  const listItems = document.getElementById("question-list-items");
  if (!listItems) {
    console.error("Question list items container not found");
    return;
  }
  listItems.innerHTML = "";
  questions.forEach((_, idx) => {
    const item = document.createElement("div");
    item.classList.add("question-item");
    if (idx === current) item.classList.add("current");
    if (userAnswers[idx] !== null) item.classList.add("answered");
    item.innerText = idx + 1;
    item.onclick = () => {
      window.quizState.setCurrent(idx);
    };
    listItems.appendChild(item);
  });
}

updateQuestionList();
document.addEventListener("quizQuestionChanged", updateQuestionList);
document.addEventListener("quizAnswerChanged", updateQuestionList);
