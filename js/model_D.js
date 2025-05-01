const questions = [
  {
    question: "What is the capital of France?",
    choices: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: 2,
  },
  {
    question: "Who wrote 'Hamlet'?",
    choices: [
      "Mark Twain",
      "William Shakespeare",
      "Charles Dickens",
      "Ernest Hemingway",
    ],
    answer: 1,
  },
  {
    question: "What is the largest planet in our solar system?",
    choices: ["Earth", "Jupiter", "Saturn", "Neptune"],
    answer: 1,
  },
  {
    question: "How many continents are there?",
    choices: ["5", "6", "7", "8"],
    answer: 2,
  },
  {
    question: "What is the chemical symbol for water?",
    choices: ["O2", "H2O", "CO2", "NaCl"],
    answer: 1,
  },
  {
    question: "Which element has the atomic number 1?",
    choices: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
    answer: 1,
  },
  {
    question: "Who painted the Mona Lisa?",
    choices: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Claude Monet",
    ],
    answer: 1,
  },
  {
    question: "What is the fastest land animal?",
    choices: ["Lion", "Cheetah", "Horse", "Gazelle"],
    answer: 1,
  },
  {
    question: "Which ocean is the largest?",
    choices: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: 3,
  },
  { question: "What is 9 x 9?", choices: ["81", "72", "99", "90"], answer: 0 },
  {
    question: "What year did the Titanic sink?",
    choices: ["1910", "1912", "1914", "1916"],
    answer: 1,
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    choices: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
    answer: 2,
  },
  {
    question: "What is the hardest natural substance?",
    choices: ["Gold", "Iron", "Diamond", "Quartz"],
    answer: 2,
  },
  {
    question: "Who discovered penicillin?",
    choices: [
      "Alexander Fleming",
      "Marie Curie",
      "Louis Pasteur",
      "Isaac Newton",
    ],
    answer: 0,
  },
  {
    question: "What is the square root of 144?",
    choices: ["10", "11", "12", "13"],
    answer: 2,
  },
  {
    question: "What is the capital of Japan?",
    choices: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    answer: 2,
  },
  {
    question: "Which planet is closest to the sun?",
    choices: ["Venus", "Mercury", "Earth", "Mars"],
    answer: 1,
  },
  {
    question: "What currency is used in the United Kingdom?",
    choices: ["Euro", "Dollar", "Pound Sterling", "Yen"],
    answer: 2,
  },
  {
    question: "How many players are on a soccer team on the field?",
    choices: ["9", "10", "11", "12"],
    answer: 2,
  },
  {
    question: "What is the tallest mountain in the world?",
    choices: ["K2", "Kanchenjunga", "Mount Everest", "Mount Kilimanjaro"],
    answer: 2,
  },
];

let current = 0;
let userAnswers = Array(questions.length).fill(null);
let timeLeft = 10 * 60;
let timer;

window.quizState = {
  getCurrent: () => current,
  setCurrent: (idx) => {
    current = idx;
    showQuestion();
  },
  getUserAnswers: () => userAnswers,
  getQuestions: () => questions,
};

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeIcon.classList.replace("fa-sun", "fa-moon");
} else {
  themeIcon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
    themeIcon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  } else {
    themeIcon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  }
});

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("time-display").textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);
}

function updateResetVisibility() {
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.style.display =
      userAnswers[current] !== null ? "inline-block" : "none";
  }
}

function showQuestion() {
  try {
    const q = questions[current];
    const questionElement = document.getElementById("question");
    const questionNumberElement = document.getElementById("question-number");
    const questionCounterElement = document.querySelector(".question-counter");
    const choicesDiv = document.getElementById("choices");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (
      !questionElement ||
      !questionNumberElement ||
      !questionCounterElement ||
      !choicesDiv ||
      !prevBtn ||
      !nextBtn
    ) {
      console.error("One or more DOM elements are missing:", {
        questionElement: !!questionElement,
        questionNumberElement: !!questionNumberElement,
        questionCounterElement: !!questionCounterElement,
        choicesDiv: !!choicesDiv,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
      });
      return;
    }

    questionElement.innerText = q.question;
    questionNumberElement.innerText = `Question ${current + 1}/${
      questions.length
    }`;
    questionCounterElement.style.display = "flex";
    choicesDiv.innerHTML = "";
    q.choices.forEach((choice, idx) => {
      const btn = document.createElement("button");
      btn.innerText = choice;
      if (userAnswers[current] === idx) btn.classList.add("greyed");
      btn.onclick = () => {
        if (userAnswers[current] === null) {
          userAnswers[current] = idx;
          btn.classList.add("greyed");
          updateResetVisibility();
          document.dispatchEvent(new CustomEvent("quizAnswerChanged"));
        }
      };
      choicesDiv.appendChild(btn);
    });
    prevBtn.disabled = current === 0;
    nextBtn.innerText = current === questions.length - 1 ? "Submit" : "Next";
    updateResetVisibility();
    document.dispatchEvent(new CustomEvent("quizQuestionChanged"));
  } catch (error) {
    console.error("Error in showQuestion:", error);
  }
}

document.getElementById("prev-btn").onclick = () => {
  if (current > 0) current--;
  showQuestion();
};
document.getElementById("reset-btn").onclick = () => {
  userAnswers[current] = null;
  showQuestion();
};
document.getElementById("next-btn").onclick = () => {
  if (current < questions.length - 1) {
    current++;
    showQuestion();
  } else showResults();
};

function showResults() {
  clearInterval(timer);
  let score = 0;
  document.getElementById("navigation").style.display = "none";
  document.getElementById("question").innerText = "Quiz Completed!";
  document.querySelector(".question-counter").style.display = "none";
  document.querySelector(".question-list").style.display = "none";
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  questions.forEach((q, idx) => {
    const p = document.createElement("p");
    const user =
      userAnswers[idx] !== null ? q.choices[userAnswers[idx]] : "No answer";
    if (userAnswers[idx] === q.answer) score++;
    p.innerHTML = `Q${idx + 1}: ${q.question}<br>✅ Correct: <strong>${
      q.choices[q.answer]
    }</strong><br>📝 Yours: ${user}`;
    p.classList.add(userAnswers[idx] === q.answer ? "correct" : "incorrect");
    choicesDiv.appendChild(p);
  });
  document.getElementById(
    "result"
  ).innerText = `You scored ${score} out of ${questions.length}`;
  document.getElementById("restart-btn").style.display = "inline-block";
}

document.getElementById("restart-btn").onclick = () => {
  current = 0;
  userAnswers = Array(questions.length).fill(null);
  timeLeft = 10 * 60;
  document.getElementById("time-display").textContent = "10:00";
  document.getElementById("navigation").style.display = "flex";
  document.getElementById("restart-btn").style.display = "none";
  document.getElementById("result").innerText = "";
  document.querySelector(".question-list").style.display = "block";
  startTimer();
  showQuestion();
};

startTimer();
showQuestion();
