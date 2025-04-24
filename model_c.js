const allQuestions = [
  {
    q: "Which language is used for web apps?",
    options: ["Python", "Java", "PHP", "All"],
    answer: 3,
  },
  {
    q: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyperlinks and Text Markup Language",
      "None",
    ],
    answer: 0,
  },
  {
    q: "What is CSS used for?",
    options: ["Styling", "Logic", "Database", "Server"],
    answer: 0,
  },
  {
    q: "What is JS short for?",
    options: ["Java", "JavaScript", "JScript", "JustScript"],
    answer: 1,
  },
  {
    q: "Which tag is used for a paragraph?",
    options: ["<p>", "<para>", "<paragraph>", "<pg>"],
    answer: 0,
  },
  {
    q: "Which keyword is used to define a variable in JavaScript?",
    options: ["var", "int", "define", "v"],
    answer: 0,
  },
  {
    q: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Language",
      "Statement Query Language",
      "None",
    ],
    answer: 0,
  },
  {
    q: "Which company developed Java?",
    options: ["Sun Microsystems", "Microsoft", "Google", "Oracle"],
    answer: 0,
  },
  {
    q: "React is a ___?",
    options: ["Framework", "Library", "Language", "Tool"],
    answer: 1,
  },
  {
    q: "What does API stand for?",
    options: [
      "App Program Interface",
      "Application Programming Interface",
      "Application Programming Instruction",
      "None",
    ],
    answer: 1,
  },
  {
    q: "Which is not a programming language?",
    options: ["Python", "HTML", "Java", "C++"],
    answer: 1,
  },
  {
    q: "Which is a front-end framework?",
    options: ["Angular", "Node.js", "Django", "Laravel"],
    answer: 0,
  },
  {
    q: "What is used for version control?",
    options: ["Git", "Bit", "Fit", "Sit"],
    answer: 0,
  },
  {
    q: "Which is a backend language?",
    options: ["PHP", "CSS", "HTML", "Bootstrap"],
    answer: 0,
  },
  {
    q: "Who invented the WWW?",
    options: ["Bill Gates", "Tim Berners-Lee", "Steve Jobs", "Larry Page"],
    answer: 1,
  },
];

let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let timer = 1800;
let timerInterval;

function startQuiz() {
  questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 15);
  userAnswers = Array(questions.length).fill(null);
  currentQuestion = 0;
  score = 0;
  displayQuestion();
  startTimer();
}

function displayQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question-number").textContent = `${
    currentQuestion + 1
  }.`;
  document.getElementById("question-text").textContent = q.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    if (userAnswers[currentQuestion] === index) {
      btn.classList.add("selected");
    }
    btn.onclick = () => {
      userAnswers[currentQuestion] = index;
      displayQuestion();
    };
    optionsDiv.appendChild(btn);
  });
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    displayQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    document.getElementById("timer").textContent = `Time Left: ${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1000);
}

function finishQuiz() {
  clearInterval(timerInterval);
  currentQuestion = 0;

  let resultHTML = "<h2>Quiz Finished!</h2><ul>";
  score = 0;

  questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    const correct = q.answer;
    if (userAns === correct) score++;
    const isCorrect = userAns === correct ? "✅" : "❌";

    resultHTML += `<li><strong>${i + 1}. ${q.q}</strong><br> 
          Your answer: ${q.options[userAns] || "No Answer"} ${isCorrect} <br>
          Correct answer: ${q.options[correct]}</li><br>`;
  });

  resultHTML += `</ul><h3>Your score: ${score} / ${questions.length}</h3>`;

  document.getElementById("quiz-box").style.display = "none";
  document.querySelector(".navigation").style.display = "none";
  document.getElementById("result").innerHTML = resultHTML;
  document.getElementById("result").style.display = "block";
  document.getElementById("score").textContent = `Score: ${score}`;
}

startQuiz();
