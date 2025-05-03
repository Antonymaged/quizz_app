/**
 * Internet Technology Quiz Application
 *
 * This application provides an interactive quiz experience with multiple question types,
 * progress tracking, timer functionality, and a detailed review section.
 *
 * Author: Hosam Dyab
 * Version: 1.0
 */

//=============================================================================
// DOM ELEMENTS
//=============================================================================

/**
 * Screen container elements - Main view containers that are shown/hidden based on quiz state
 */
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const reviewScreen = document.getElementById("review-screen");

/**
 * Interactive UI elements - Buttons, containers, and display elements
 */
const startBtn = document.getElementById("start-btn"); // Initiates the quiz
const nextBtn = document.getElementById("next-btn"); // Navigates to next question
const questionText = document.getElementById("question-text"); // Displays current question
const answerButtonsContainer = document.getElementById("answer-buttons"); // Container for answer options
const questionCounter = document.getElementById("question-counter"); // Shows current question number
const progressBar = document.getElementById("progress-bar"); // Visual progress indicator
const timeDisplay = document.getElementById("time-display"); // Shows remaining time
const scoreDisplay = document.getElementById("score-display"); // Shows final score
const timeTaken = document.getElementById("time-taken"); // Shows time spent on quiz
const resultMessage = document.getElementById("result-message"); // Displays performance message
const reviewBtn = document.getElementById("review-btn"); // Opens review screen
const restartBtn = document.getElementById("restart-btn"); // Restarts the quiz
const reviewContainer = document.getElementById("review-container"); // Contains review items
const backToResultsBtn = document.getElementById("back-to-results-btn"); // Returns to results
const themeToggle = document.getElementById("theme-toggle"); // Toggles dark/light mode
const bodyElement = document.body; // For theme application
const prevBtn = document.getElementById("prev-btn"); // Navigates to previous question
const questionList = document.getElementById("questionList"); // Question list for mobile view

//=============================================================================
// QUIZ STATE VARIABLES
//=============================================================================

let currentQuestionIndex = 0; // Tracks the current question (0-based index)
let score = 0; // Tracks user's correct answers
let timer; // Interval reference for the countdown timer
let timeLeft = 15 * 60; // Quiz duration: 15 minutes in seconds
let userAnswers = []; // Stores user's answers for each question
let quizStartTime; // Timestamp when quiz started
let quizEndTime; // Timestamp when quiz ended

//=============================================================================
// THEME HANDLING
//=============================================================================

/**
 * Sets the initial theme based on:
 * 1. User's previously saved preference in localStorage
 * 2. System preference (prefers-color-scheme) if no saved preference
 */
function setInitialTheme() {
  const savedTheme = localStorage.getItem("quizTheme");
  if (savedTheme) {
    // Apply saved user preference
    bodyElement.classList.toggle("dark-mode", savedTheme === "dark");
    themeToggle.checked = savedTheme === "dark";
  } else {
    // If no saved preference, check system preference
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    bodyElement.classList.toggle("dark-mode", prefersDark);
    themeToggle.checked = prefersDark;
  }
}

/**
 * Event listener for theme toggle switch
 * Updates theme and saves preference to localStorage
 */
themeToggle.addEventListener("change", () => {
  bodyElement.classList.toggle("dark-mode");
  if (bodyElement.classList.contains("dark-mode")) {
    localStorage.setItem("quizTheme", "dark");
  } else {
    localStorage.setItem("quizTheme", "light");
  }
});

//=============================================================================
// QUIZ QUESTIONS
//=============================================================================

/**
 * Quiz question data structure
 * Contains different question types:
 * - Multiple Choice Questions (MCQ)
 * - True/False Questions
 * - Text Input Questions with acceptable alternative answers
 */
const questions = [
  {
    type: "mcq",
    question: "What does HTTP stand for?",
    answers: [
      { text: "Hypertext Transfer Protocol", correct: true },
      { text: "Hypertext Transfer Process", correct: false },
      { text: "Hypertext Technical Protocol", correct: false },
      { text: "Hypertext Transmission Protocol", correct: false },
    ],
  },
  {
    type: "true-false",
    question: "HTTP status code 404 means 'Server Error'.",
    answer: false,
    explanation:
      "HTTP status code 404 means 'Not Found'. Server errors are in the 500 range.",
  },
  {
    type: "mcq",
    question:
      "Which of the following is NOT a valid HTTP status code category?",
    answers: [
      { text: "100s - Informational", correct: false },
      { text: "200s - Success", correct: false },
      { text: "300s - Redirection", correct: false },
      { text: "600s - Server Error", correct: true },
    ],
  },
  {
    type: "text",
    question: "What does DNS stand for?",
    answer: "Domain Name System",
    acceptableAnswers: [
      "Domain Name System",
      "domain name system",
      "Domain Name Service",
    ],
  },
  {
    type: "mcq",
    question: "What is the primary function of DNS?",
    answers: [
      { text: "To encrypt web traffic", correct: false },
      { text: "To translate domain names to IP addresses", correct: true },
      { text: "To manage email delivery", correct: false },
      { text: "To block malicious websites", correct: false },
    ],
  },
  {
    type: "true-false",
    question: "HTTPS is more secure than HTTP because it uses encryption.",
    answer: true,
    explanation:
      "HTTPS (HTTP Secure) uses SSL/TLS encryption to secure the data transmitted between client and server.",
  },
  {
    type: "mcq",
    question: "Which protocol is used for secure web browsing?",
    answers: [
      { text: "HTTP", correct: false },
      { text: "FTP", correct: false },
      { text: "HTTPS", correct: true },
      { text: "SMTP", correct: false },
    ],
  },
  {
    type: "mcq",
    question: "What is the purpose of a firewall in network security?",
    answers: [
      { text: "To accelerate Internet connection", correct: false },
      {
        text: "To monitor and control incoming and outgoing network traffic",
        correct: true,
      },
      { text: "To host websites", correct: false },
      { text: "To compress data for faster transmission", correct: false },
    ],
  },
  {
    type: "text",
    question: "What port number does HTTP typically use?",
    answer: "80",
    acceptableAnswers: ["80", "port 80"],
  },
  {
    type: "mcq",
    question: "Which of the following is NOT a web browser?",
    answers: [
      { text: "Chrome", correct: false },
      { text: "Firefox", correct: false },
      { text: "Apache", correct: true },
      { text: "Safari", correct: false },
    ],
  },
  {
    type: "mcq",
    question: "What does CSS stand for?",
    answers: [
      { text: "Creative Style Sheets", correct: false },
      { text: "Computer Style Sheets", correct: false },
      { text: "Cascading Style Sheets", correct: true },
      { text: "Colorful Style Sheets", correct: false },
    ],
  },
  {
    type: "true-false",
    question: "IPv4 addresses are 128 bits long.",
    answer: false,
    explanation:
      "IPv4 addresses are 32 bits long. IPv6 addresses are 128 bits long.",
  },
  {
    type: "mcq",
    question: "What is the function of an IP address?",
    answers: [
      { text: "To identify devices on a network", correct: true },
      { text: "To encrypt data during transmission", correct: false },
      { text: "To compress web pages", correct: false },
      { text: "To block spam emails", correct: false },
    ],
  },
  {
    type: "mcq",
    question:
      "Which layer of the OSI model is responsible for end-to-end communication?",
    answers: [
      { text: "Network Layer", correct: false },
      { text: "Transport Layer", correct: true },
      { text: "Physical Layer", correct: false },
      { text: "Application Layer", correct: false },
    ],
  },
  {
    type: "text",
    question: "What HTML tag is used to create a hyperlink?",
    answer: "<a>",
    acceptableAnswers: ["<a>", "a", "anchor", "<a></a>"],
  },
  {
    type: "mcq",
    question: "What is the main purpose of HTML in web development?",
    answers: [
      { text: "To style web pages", correct: false },
      { text: "To create interactive features", correct: false },
      { text: "To structure content on web pages", correct: true },
      { text: "To secure data transmission", correct: false },
    ],
  },
  {
    type: "true-false",
    question: "TCP is a connectionless protocol.",
    answer: false,
    explanation:
      "TCP (Transmission Control Protocol) is a connection-oriented protocol. UDP is connectionless.",
  },
  {
    type: "mcq",
    question: "Which protocol is used for sending emails?",
    answers: [
      { text: "HTTP", correct: false },
      { text: "FTP", correct: false },
      { text: "SMTP", correct: true },
      { text: "TCP", correct: false },
    ],
  },
  {
    type: "mcq",
    question: "What is a cookie in the context of web browsing?",
    answers: [
      { text: "A small text file stored on the user's device", correct: true },
      { text: "A type of computer virus", correct: false },
      { text: "A secure connection protocol", correct: false },
      { text: "A programming language", correct: false },
    ],
  },
  {
    type: "mcq",
    question: "Which of the following is a client-side scripting language?",
    answers: [
      { text: "PHP", correct: false },
      { text: "Python", correct: false },
      { text: "JavaScript", correct: true },
      { text: "Ruby", correct: false },
    ],
  },
];

//=============================================================================
// EVENT LISTENERS
//=============================================================================

/**
 * Main button event listeners to control quiz flow
 */
startBtn.addEventListener("click", startQuiz);

/**
 * Previous Button - Navigates to the previous question
 * Only active if not on the first question
 */
prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    saveCurrentAnswer(); // Save current answer before navigating back
    currentQuestionIndex--;
    showQuestion();
  }
});

/**
 * Next Button - Navigates to the next question or completes the quiz
 * Text changes to "Finish" on the last question
 */
nextBtn.addEventListener("click", () => {
  saveCurrentAnswer(); // Save current answer before navigating forward
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    // If on the last question, clicking Next/Finish finishes the quiz
    endQuiz();
  }
});

/**
 * Review and restart buttons for navigation after quiz completion
 */
reviewBtn.addEventListener("click", showReviewScreen);
restartBtn.addEventListener("click", restartQuiz);
backToResultsBtn.addEventListener("click", () => {
  showScreen(resultsScreen);
});

// Initial theme setup
setInitialTheme();

//=============================================================================
// CORE QUIZ FUNCTIONS
//=============================================================================

/**
 * Initializes and starts the quiz:
 * - Captures start time
 * - Switches to the quiz screen
 * - Resets quiz state (score, answers)
 * - Starts the timer
 * - Shows the first question
 */
function startQuiz() {
  quizStartTime = new Date();
  showScreen(quizScreen);
  currentQuestionIndex = 0;
  score = 0;
  // Initialize userAnswers array with undefined for each question
  userAnswers = new Array(questions.length).fill(undefined);

  timeLeft = 15 * 60;
  updateTimerDisplay();
  startTimer();

  showQuestion();
}

/**
 * Displays the current question based on the currentQuestionIndex
 * - Updates question counter and progress bar
 * - Resets previous question state
 * - Renders the appropriate question type UI
 * - Restores any previous answer (if user is navigating back)
 * - Updates navigation button visibility
 */
function showQuestion() {
  resetState(); // Clear previous buttons/inputs

  const questionNum = currentQuestionIndex + 1;
  questionCounter.textContent = `Question ${questionNum}/${questions.length}`;
  progressBar.style.width = `${(questionNum / questions.length) * 100}%`;

  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  // Create answer options based on type
  switch (currentQuestion.type) {
    case "mcq":
      showMCQQuestion(currentQuestion);
      break;
    case "true-false":
      showTrueFalseQuestion(currentQuestion);
      break;
    case "text":
      showTextQuestion(currentQuestion);
      break;
  }

  // Restore previous answer state if exists
  restoreAnswerState();

  // Update button visibility and text
  prevBtn.classList.toggle("show", currentQuestionIndex > 0);
  nextBtn.classList.add("show"); // Always show Next/Finish

  // Update Next button text depending on position
  nextBtn.textContent =
    currentQuestionIndex === questions.length - 1 ? "Finish" : "Next";
  //to show the question list on mobile devices
  renderQuestionList();
}

/**
 * Renders a Multiple Choice Question (MCQ)
 * Creates buttons for each answer option
 *
 * @param {Object} question - The MCQ question object
 */
function showMCQQuestion(question) {
  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.index = index;
    button.dataset.type = "mcq";

    button.addEventListener("click", selectAnswer);
    answerButtonsContainer.appendChild(button);
  });
}

/**
 * Renders a True/False Question
 * Creates two buttons for True and False options
 *
 * @param {Object} question - The True/False question object
 */
function showTrueFalseQuestion(question) {
  const trueButton = document.createElement("button");
  trueButton.textContent = "True";
  trueButton.classList.add("answer-btn", "tf-btn");
  trueButton.dataset.value = "true";
  trueButton.dataset.type = "true-false";

  const falseButton = document.createElement("button");
  falseButton.textContent = "False";
  falseButton.classList.add("answer-btn", "tf-btn");
  falseButton.dataset.value = "false";
  falseButton.dataset.type = "true-false";

  trueButton.addEventListener("click", selectAnswer);
  falseButton.addEventListener("click", selectAnswer);

  answerButtonsContainer.appendChild(trueButton);
  answerButtonsContainer.appendChild(falseButton);
}

/**
 * Renders a Text Input Question
 * Creates a form with text input and submit button
 * Includes character counter and visual feedback
 *
 * @param {Object} question - The text question object
 */
function showTextQuestion(question) {
  const form = document.createElement("form");
  form.classList.add("text-answer-form");

  // Create container for input with icon
  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");

  // Create label for better accessibility
  const label = document.createElement("label");
  label.setAttribute("for", "text-answer");
  label.classList.add("sr-only"); // Screen reader only
  label.textContent = "Your answer";

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.classList.add("text-answer-input");
  inputField.placeholder = "Type your answer here...";
  inputField.id = "text-answer";
  inputField.autocomplete = "off"; // Prevent autocomplete

  // Add floating icon to indicate text entry
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-keyboard", "input-icon");

  // Create submit button with icon
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.classList.add("btn", "submit-text-btn");
  submitBtn.dataset.type = "text";
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit';

  // Add character counter for visual feedback
  const charCounter = document.createElement("div");
  charCounter.classList.add("char-counter");
  charCounter.textContent = "0 characters";

  // Append elements
  inputGroup.appendChild(icon);
  inputGroup.appendChild(inputField);

  form.appendChild(label);
  form.appendChild(inputGroup);
  form.appendChild(charCounter);
  form.appendChild(submitBtn);

  // Add character counter event
  inputField.addEventListener("input", () => {
    const count = inputField.value.trim().length;
    charCounter.textContent = `${count} character${count !== 1 ? "s" : ""}`;

    // Visual feedback based on input length
    if (count > 0) {
      charCounter.classList.add("has-text");
      submitBtn.disabled = false;
    } else {
      charCounter.classList.remove("has-text");
      submitBtn.disabled = true;
    }
  });

  // Submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = inputField.value.trim();
    if (inputValue) {
      selectTextAnswer(inputValue);
    }
  });

  // Disable submit initially
  submitBtn.disabled = true;

  answerButtonsContainer.appendChild(form);

  // Focus the input field with slight delay
  setTimeout(() => inputField.focus(), 100);

  // Add 'Enter' key press handler
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputValue = inputField.value.trim();
      if (inputValue) {
        selectTextAnswer(inputValue);
      }
    }
  });
}

/**
 * Resets the question state
 * - Clears answer options
 * - Hides navigation buttons
 */
function resetState() {
  // Hide nav buttons initially
  prevBtn.classList.remove("show");
  nextBtn.classList.remove("show");
  // Clear answer area
  while (answerButtonsContainer.firstChild) {
    answerButtonsContainer.removeChild(answerButtonsContainer.firstChild);
  }
}

/**
 * Restores previous answer state when navigating back to a question
 * Shows only that an answer was selected, without indicating correctness
 */
function restoreAnswerState() {
  const previousAnswer = userAnswers[currentQuestionIndex];
  if (previousAnswer === undefined) {
    // If no previous answer, ensure buttons/inputs are enabled
    answerButtonsContainer
      .querySelectorAll("button, input")
      .forEach((el) => (el.disabled = false));
    // Clear any residual styles from text input if navigating back
    const textInput = document.getElementById("text-answer");
    if (textInput) {
      textInput.classList.remove("correct-text", "wrong-text");
      // Remove potential answer display if user revisits
      const correctAnswerDisplay = answerButtonsContainer.querySelector(
        ".correct-text-answer"
      );
      if (correctAnswerDisplay) correctAnswerDisplay.remove();
    }
    return; // No state to restore
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswerElements = answerButtonsContainer.querySelectorAll(
    ".answer-btn, .text-answer-input, .submit-text-btn"
  );

  // CHANGE: Enable elements instead of disabling them to allow changing answers
  allAnswerElements.forEach((el) => (el.disabled = false));

  // Restore state based on question type - only show selection, not correctness
  if (currentQuestion.type === "mcq") {
    answerButtonsContainer.querySelectorAll(".answer-btn").forEach((btn) => {
      // Only highlight the selected answer, no right/wrong indication
      if (btn.textContent === previousAnswer.userAnswer) {
        btn.classList.add("selected");
        // Remove correctness indication
        btn.classList.remove("correct", "wrong");
      }
    });
  } else if (currentQuestion.type === "true-false") {
    answerButtonsContainer.querySelectorAll(".tf-btn").forEach((btn) => {
      // Only highlight the selected answer, no right/wrong indication
      if (btn.textContent === previousAnswer.userAnswer) {
        btn.classList.add("selected");
        // Remove correctness indication
        btn.classList.remove("correct", "wrong");
      }
    });
  } else if (currentQuestion.type === "text") {
    const inputField = document.getElementById("text-answer");
    if (inputField) {
      inputField.value = previousAnswer.userAnswer;
      // Remove correctness indication
      inputField.classList.remove("correct-text", "wrong-text");
      inputField.classList.add("answered-text");

      // CHANGE: Enable the submit button if there's text in the input
      const submitBtn = document.querySelector(".submit-text-btn");
      const charCounter = document.querySelector(".char-counter");
      if (submitBtn && inputField.value.trim().length > 0) {
        submitBtn.disabled = false;
        if (charCounter) {
          const count = inputField.value.trim().length;
          charCounter.textContent = `${count} character${
            count !== 1 ? "s" : ""
          }`;
          charCounter.classList.add("has-text");
        }
      }
    }
  }
}

/**
 * Handles selection of an answer (MCQ or True/False)
 * Records the answer but doesn't show if it's correct or wrong
 *
 * @param {Event} e - The click event object
 */
function selectAnswer(e) {
  const selectedButton = e.target;
  const currentQuestion = questions[currentQuestionIndex];
  let correct = false;
  let userAnswer = "";
  const previouslyAnswered = userAnswers[currentQuestionIndex] !== undefined;
  const previousCorrectState = previouslyAnswered
    ? userAnswers[currentQuestionIndex].correct
    : undefined;

  // CHANGE: Don't disable buttons to allow changing answers
  // Remove selected class from all buttons first
  answerButtonsContainer.querySelectorAll(".answer-btn").forEach((btn) => {
    btn.classList.remove("selected", "correct", "wrong");
  });

  // Determine correctness internally (but don't show it) and get user answer
  if (selectedButton.dataset.type === "mcq") {
    const answerIndex = parseInt(selectedButton.dataset.index);
    correct = currentQuestion.answers[answerIndex].correct;
    userAnswer = currentQuestion.answers[answerIndex].text;

    // Visual feedback - only show selection, not correctness
    selectedButton.classList.add("selected");
    selectedButton.classList.remove("correct", "wrong");
  } else if (selectedButton.dataset.type === "true-false") {
    const selectedValue = selectedButton.dataset.value === "true";
    correct = selectedValue === currentQuestion.answer;
    userAnswer = selectedValue ? "True" : "False";

    // Visual feedback - only show selection, not correctness
    selectedButton.classList.add("selected");
    selectedButton.classList.remove("correct", "wrong");
  }

  // --- Score Adjustment Logic (still track internally) ---
  if (!previouslyAnswered) {
    // First time answering this question
    if (correct) score++;
  } else {
    // Changing a previous answer
    if (previousCorrectState === false && correct === true) {
      score++; // Changed from wrong to right
    } else if (previousCorrectState === true && correct === false) {
      score--; // Changed from right to wrong
    }
  }
  // --- End Score Adjustment ---

  // Store/Update user answer object in the array
  userAnswers[currentQuestionIndex] = {
    question: currentQuestion.question,
    userAnswer: userAnswer,
    correct: correct, // Still track correctness internally
    type: currentQuestion.type,
    correctAnswer: getCorrectAnswerText(currentQuestion),
    explanation: currentQuestion.explanation || null,
  };

  // Show navigation buttons
  prevBtn.classList.toggle("show", currentQuestionIndex > 0);
  nextBtn.classList.add("show");
}

/**
 * Handles text input answer submission
 * Records the answer but doesn't show if it's correct or wrong
 *
 * @param {string} inputText - The text input by the user
 */
function selectTextAnswer(inputText) {
  const currentQuestion = questions[currentQuestionIndex];
  const form = document.querySelector(".text-answer-form");
  const input = document.getElementById("text-answer");
  const previouslyAnswered = userAnswers[currentQuestionIndex] !== undefined;
  const previousCorrectState = previouslyAnswered
    ? userAnswers[currentQuestionIndex].correct
    : undefined;

  // CHANGE: Don't disable form to allow changing answers
  // Just provide visual feedback
  input.classList.remove("correct-text", "wrong-text");
  input.classList.add("answered-text");

  // Check correctness internally (but don't show it)
  const correct = isTextAnswerCorrect(
    inputText,
    currentQuestion.acceptableAnswers
  );

  // --- Score Adjustment Logic (still track internally) ---
  if (!previouslyAnswered) {
    // First time answering
    if (correct) score++;
  } else {
    // Changing previous answer
    if (previousCorrectState === false && correct === true) {
      score++; // Changed from wrong to right
    } else if (previousCorrectState === true && correct === false) {
      score--; // Changed from right to wrong
    }
  }
  // --- End Score Adjustment ---

  // Store/Update user answer object
  userAnswers[currentQuestionIndex] = {
    question: currentQuestion.question,
    userAnswer: inputText,
    correct: correct, // Still track correctness internally
    type: currentQuestion.type,
    correctAnswer: currentQuestion.answer,
  };

  // Show navigation buttons
  prevBtn.classList.toggle("show", currentQuestionIndex > 0);
  nextBtn.classList.add("show");
}

//=============================================================================
// UTILITY FUNCTIONS
//=============================================================================

/**
 * Checks if a text input answer is correct by comparing with acceptable answers
 * Performs case-insensitive comparison after trimming whitespace
 *
 * @param {string} userInput - The user's text input answer
 * @param {string[]} acceptableAnswers - Array of acceptable answers
 * @returns {boolean} True if the answer is correct, false otherwise
 */
function isTextAnswerCorrect(userInput, acceptableAnswers) {
  const cleanedInput = userInput.trim().toLowerCase();
  return acceptableAnswers.some(
    (answer) => cleanedInput === answer.toLowerCase().trim()
  );
}

/**
 * Gets the correct answer text for a question based on its type
 *
 * @param {Object} question - The question object
 * @returns {string} The correct answer text
 */
function getCorrectAnswerText(question) {
  if (question.type === "mcq") {
    return question.answers.find((a) => a.correct).text;
  } else if (question.type === "true-false") {
    return question.answer ? "True" : "False";
  } else if (question.type === "text") {
    return question.answer;
  }
  return "";
}

/**
 * Gets the user's answer text for a question
 *
 * @param {Object} question - The question object
 * @returns {string} The user's answer text or a placeholder if not answered
 */
function getUserAnswerText(question) {
  const index = questions.findIndex((q) => q.question === question.question);
  const userAnswer = userAnswers[index];

  if (!userAnswer) {
    return "Not answered";
  }

  return userAnswer.userAnswer;
}

//=============================================================================
// TIMER FUNCTIONS
//=============================================================================

/**
 * Starts the quiz countdown timer
 * Updates the timer display every second
 * Ends the quiz automatically when time reaches zero
 */
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

/**
 * Updates the timer display with formatted minutes and seconds
 * Adds visual indication when time is running low (less than 1 minute)
 */
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Add visual indicator when time is running low
  if (timeLeft < 60) {
    timeDisplay.classList.add("time-low");
  } else {
    timeDisplay.classList.remove("time-low");
  }
}

//=============================================================================
// QUIZ COMPLETION FUNCTIONS
//=============================================================================

/**
 * Shows the review screen with a list of questions and user's answers
 * Doesn't indicate if answers were correct or incorrect
 */
function showReviewScreen() {
  showScreen(reviewScreen);
  reviewContainer.innerHTML = "";

  // Create a header for the review
  const reviewHeader = document.createElement("div");
  reviewHeader.classList.add("review-header");

  // Calculate score internally
  const correctCount = userAnswers.reduce(
    (count, answer) => count + (answer && answer.correct ? 1 : 0),
    0
  );

  // Show only total number of questions, not correct/incorrect counts
  reviewHeader.innerHTML = `
        <div class="review-summary">
            <span class="review-score">
                <i class="fas fa-clipboard-list"></i> ${
                  userAnswers.filter((answer) => answer !== undefined).length
                } questions answered
            </span>
        </div>
    `;

  reviewContainer.appendChild(reviewHeader);

  // Iterate through all questions to display review
  questions.forEach((question, index) => {
    const reviewItem = document.createElement("div");
    reviewItem.classList.add("review-item");

    // Add custom property for staggered animation
    reviewItem.style.setProperty("--item-index", index);

    const questionTitle = document.createElement("h3");
    questionTitle.classList.add("review-question");
    questionTitle.textContent = `${index + 1}. ${question.question}`;
    reviewItem.appendChild(questionTitle);

    // Add question type badge
    const questionType = document.createElement("div");
    questionType.classList.add("question-type");
    // Format type nicely
    questionType.textContent = question.type
      .replace("-", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    reviewItem.appendChild(questionType);

    // Create container for user's answer
    const userAnswerContainer = document.createElement("div");
    userAnswerContainer.classList.add("answer-container");

    const userAnswerLabel = document.createElement("div");
    userAnswerLabel.classList.add("answer-label");
    userAnswerLabel.innerHTML = `<i class="fas fa-user"></i> Your Answer`;
    userAnswerContainer.appendChild(userAnswerLabel);

    const userAnswer = document.createElement("div");
    userAnswer.classList.add("review-answer", "user-answer");

    // Get user's answer
    const userAnswerText = getUserAnswerText(question);
    userAnswer.textContent = userAnswerText;

    // Add correct/wrong class based on if the answer is correct
    const userAnswerObj = userAnswers[index];
    if (userAnswerObj && userAnswerObj.correct) {
      userAnswer.classList.add("correct");
    } else if (userAnswerText !== "Not answered") {
      userAnswer.classList.add("wrong");
    }

    userAnswerContainer.appendChild(userAnswer);

    reviewItem.appendChild(userAnswerContainer);

    // Create container for correct answer
    const correctAnswerContainer = document.createElement("div");
    correctAnswerContainer.classList.add("answer-container");

    const correctAnswerLabel = document.createElement("div");
    correctAnswerLabel.classList.add("answer-label");
    correctAnswerLabel.innerHTML = `<i class="fas fa-check"></i> Correct Answer`;
    correctAnswerContainer.appendChild(correctAnswerLabel);

    const correctAnswer = document.createElement("div");
    correctAnswer.classList.add("review-answer", "correct-answer");
    correctAnswer.textContent = getCorrectAnswerText(question);
    correctAnswerContainer.appendChild(correctAnswer);

    reviewItem.appendChild(correctAnswerContainer);

    // Add explanation if available
    if (question.explanation) {
      const explanationDiv = document.createElement("div");
      explanationDiv.classList.add("explanation");

      // Add a heading to the explanation
      const explanationHeading = document.createElement("strong");
      explanationHeading.textContent = "Note: ";
      explanationDiv.appendChild(explanationHeading);

      const explanationText = document.createElement("span");
      explanationText.textContent = question.explanation;
      explanationDiv.appendChild(explanationText);

      reviewItem.appendChild(explanationDiv);
    }

    reviewContainer.appendChild(reviewItem);
  });
}

/**
 * Ends the quiz and displays the results screen
 * Shows total score without indicating which answers were correct or wrong
 */
function endQuiz() {
  clearInterval(timer);
  quizEndTime = new Date();

  // Calculate score internally
  score = userAnswers.reduce((currentScore, answer) => {
    return currentScore + (answer && answer.correct ? 1 : 0);
  }, 0);

  const timeDiff = Math.floor(
    (quizEndTime - (quizStartTime || quizEndTime)) / 1000
  );
  const minutesTaken = Math.floor(timeDiff / 60);
  const secondsTaken = timeDiff % 60;

  showScreen(resultsScreen);

  // Show score but don't indicate which answers were right/wrong
  scoreDisplay.textContent = score;
  timeTaken.textContent = `${minutesTaken
    .toString()
    .padStart(2, "0")}:${secondsTaken.toString().padStart(2, "0")}`;

  // Generate neutral message regardless of score
  resultMessage.textContent = "Thank you for completing the quiz!";
}

/**
 * Restarts the quiz - resets all state and returns to welcome screen
 */
function restartQuiz() {
  // Reset everything and go to welcome screen
  clearInterval(timer);
  showScreen(welcomeScreen);
}

/**
 * Shows a specific screen and hides all others
 * Handles animation and visibility transitions
 *
 * @param {HTMLElement} screenToShow - The screen element to display
 */
function showScreen(screenToShow) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  screenToShow.classList.add("active");
}

// Initialize theme on page load
setInitialTheme();
