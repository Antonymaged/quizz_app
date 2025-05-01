document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const welcomeScreen = document.getElementById("welcome-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultsScreen = document.getElementById("results-screen");
    const startBtn = document.getElementById("start-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-btn");
    const showCorrectionsBtn = document.getElementById("show-corrections-btn");
    const questionText = document.getElementById("question-text");
    const answerButtons = document.getElementById("answer-buttons");
    const questionCounter = document.getElementById("question-counter");
    const timeDisplay = document.getElementById("time-display");
    const progressCircle = document.querySelector(".progress-ring-circle");
    const progressPercentage = document.getElementById("progress-percentage");
    const questionListItems = document.getElementById("question-list-items");
    const scoreDisplay = document.getElementById("score-display");
    const timeTaken = document.getElementById("time-taken");
    const correctionsDisplay = document.getElementById("corrections-display");

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Load saved theme from localStorage and set initial icon
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Add click event listener for theme toggle
    themeToggle.addEventListener('click', () => {
        const isLightMode = document.body.classList.contains('light-mode');
        
        if (isLightMode) {
            // Switch to dark mode
            document.body.classList.remove('light-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            // Switch to light mode
            document.body.classList.add('light-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Quiz State
    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 10 * 60; // 10 minutes
    let userAnswers = [];
    let timer;
    let quizStartTime;

    // Questions (33 total: 15 Liverpool-focused, 15 other EPL, 3 drag-and-drop)
    const questions = [
        // Liverpool-focused (15 questions)
        { type: "mcq", question: "Who is Liverpool's current manager as of 2025?", answers: [{ text: "Jurgen Klopp", correct: false }, { text: "Arne Slot", correct: true }, { text: "Pep Guardiola", correct: false }, { text: "Steven Gerrard", correct: false }] },
        { type: "true-false", question: "Liverpool has won the Premier League title more than 20 times.", answer: false },
        { type: "text", question: "What is the name of Liverpool's home stadium?", answer: "Anfield", acceptableAnswers: ["Anfield", "anfield"] },
        { type: "mcq", question: "Which player holds the record for most goals scored for Liverpool?", answers: [{ text: "Ian Rush", correct: true }, { text: "Kenny Dalglish", correct: false }, { text: "Steven Gerrard", correct: false }, { text: "Mohamed Salah", correct: false }] },
        { type: "true-false", question: "Mohamed Salah won the Premier League Golden Boot in the 2021-22 season.", answer: true },
        { type: "text", question: "What is Liverpool's nickname?", answer: "The Reds", acceptableAnswers: ["The Reds", "Reds", "the reds"] },
        { type: "mcq", question: "In which year did Liverpool last win the UEFA Champions League as of 2025?", answers: [{ text: "2019", correct: true }, { text: "2020", correct: false }, { text: "2018", correct: false }, { text: "2022", correct: false }] },
        { type: "true-false", question: "Liverpool has never been relegated from the English top flight.", answer: false },
        { type: "mcq", question: "Which Liverpool player is known for the 'Egyptian King' nickname?", answers: [{ text: "Sadio Mane", correct: false }, { text: "Mohamed Salah", correct: true }, { text: "Roberto Firmino", correct: false }, { text: "Diogo Jota", correct: false }] },
        { type: "text", question: "What is the capacity of Liverpool's Anfield stadium (approx.)?", answer: "61000", acceptableAnswers: ["61000", "61,000", "60000", "60,000"] },
        { type: "mcq", question: "Who was Liverpool's captain during their 2019 Champions League win?", answers: [{ text: "Jordan Henderson", correct: true }, { text: "Steven Gerrard", correct: false }, { text: "Virgil van Dijk", correct: false }, { text: "James Milner", correct: false }] },
        { type: "true-false", question: "Liverpool won the Premier League title in the 2019-20 season.", answer: true },
        { type: "text", question: "What is the name of Liverpool's famous stand known for its atmosphere?", answer: "The Kop", acceptableAnswers: ["The Kop", "Kop", "the kop"] },
        { type: "mcq", question: "Which Liverpool player scored the decisive penalty in the 2019 Champions League final?", answers: [{ text: "Mohamed Salah", correct: true }, { text: "Divock Origi", correct: false }, { text: "Sadio Mane", correct: false }, { text: "Alisson Becker", correct: false }] },
        { type: "true-false", question: "Liverpool's 'You'll Never Walk Alone' anthem was originally from a musical.", answer: true },
        // Other EPL Teams (15 questions)
        { type: "mcq", question: "Which team has won the most Premier League titles?", answers: [{ text: "Manchester United", correct: true }, { text: "Chelsea", correct: false }, { text: "Arsenal", correct: false }, { text: "Manchester City", correct: false }] },
        { type: "true-false", question: "Arsenal's 'Invincibles' season was in 2003-04.", answer: true },
        { type: "text", question: "What is Manchester United's nickname?", answer: "Red Devils", acceptableAnswers: ["Red Devils", "red devils", "The Red Devils"] },
        { type: "mcq", question: "Which team won the Premier League in the 2022-23 season?", answers: [{ text: "Manchester City", correct: true }, { text: "Arsenal", correct: false }, { text: "Manchester United", correct: false }, { text: "Newcastle United", correct: false }] },
        { type: "true-false", question: "Tottenham Hotspur has won the Premier League in the modern era.", answer: false },
        { type: "text", question: "What is the name of Arsenal's home stadium?", answer: "Emirates Stadium", acceptableAnswers: ["Emirates Stadium", "emirates stadium", "Emirates"] },
        { type: "mcq", question: "Which player has the most Premier League assists of all time as of 2025?", answers: [{ text: "Ryan Giggs", correct: true }, { text: "Cesc Fabregas", correct: false }, { text: "Kevin De Bruyne", correct: false }, { text: "David Beckham", correct: false }] },
        { type: "true-false", question: "Leicester City's Premier League win in 2015-16 was considered a major upset.", answer: true },
        { type: "mcq", question: "Which team is known as 'The Toffees'?", answers: [{ text: "Everton", correct: true }, { text: "West Ham United", correct: false }, { text: "Aston Villa", correct: false }, { text: "Brighton", correct: false }] },
        { type: "text", question: "What year did the Premier League officially start?", answer: "1992", acceptableAnswers: ["1992", "92"] },
        { type: "mcq", question: "Which team won the Premier League in the 2023-24 season?", answers: [{ text: "Manchester City", correct: true }, { text: "Arsenal", correct: false }, { text: "Liverpool", correct: false }, { text: "Chelsea", correct: false }] },
        { type: "true-false", question: "Chelsea won the Premier League under Jose Mourinho in 2014-15.", answer: true },
        { type: "text", question: "What is the name of Manchester City's home stadium?", answer: "Etihad Stadium", acceptableAnswers: ["Etihad Stadium", "etihad stadium", "Etihad"] },
        { type: "mcq", question: "Which player scored the most goals in a single Premier League season as of 2025?", answers: [{ text: "Erling Haaland", correct: true }, { text: "Alan Shearer", correct: false }, { text: "Thierry Henry", correct: false }, { text: "Cristiano Ronaldo", correct: false }] },
        { type: "true-false", question: "Aston Villa has never won the European Cup.", answer: false },
        // Drag-and-Drop Questions (3 questions)
        { 
            type: "drag-drop", 
            question: "Complete the sentence about Liverpool's history:", 
            sentence: "Liverpool won ___ Champions League in ___ with ___ as captain.", 
            words: ["2019", "2020", "Jordan Henderson", "Steven Gerrard", "the", "their"], 
            correctAnswers: ["the", "2019", "Jordan Henderson"] 
        },
        { 
            type: "drag-drop", 
            question: "Complete the sentence about Manchester United:", 
            sentence: "Manchester United, known as ___ Red Devils, plays at ___ Trafford with a capacity of over ___ fans.", 
            words: ["Old", "New", "the", "their", "76000", "50000"], 
            correctAnswers: ["the", "Old", "76000"] 
        },
        { 
            type: "drag-drop", 
            question: "Complete the sentence about the Premier League:", 
            sentence: "The Premier League began in ___ and ___ team has won it the most, with ___ titles.", 
            words: ["1992", "1990", "Manchester United", "Chelsea", "13", "5"], 
            correctAnswers: ["1992", "Manchester United", "13"] 
        },
    ];

    // Event Listeners
    startBtn.addEventListener("click", startQuiz);
    prevBtn.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });
    nextBtn.addEventListener("click", () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            endQuiz();
        }
    });
    restartBtn.addEventListener("click", restartQuiz);
    showCorrectionsBtn.addEventListener("click", showCorrections);

    // Functions
    function startQuiz() {
        quizStartTime = new Date();
        userAnswers = new Array(questions.length).fill(null);
        score = 0;
        timeLeft = 10 * 60;
        currentQuestionIndex = 0;
        showScreen(quizScreen);
        startTimer();
        showQuestion();
        renderQuestionList();
    }

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
        answerButtons.innerHTML = "";

        if (question.type === "mcq") {
            question.answers.forEach(answer => {
                const btn = document.createElement("button");
                btn.classList.add("answer-btn");
                btn.textContent = answer.text;
                btn.addEventListener("click", () => selectAnswer(answer));
                if (userAnswers[currentQuestionIndex]?.userAnswer === answer.text) {
                    btn.classList.add("selected");
                }
                answerButtons.appendChild(btn);
            });
        } else if (question.type === "true-false") {
            const trueBtn = document.createElement("button");
            trueBtn.classList.add("answer-btn");
            trueBtn.textContent = "True";
            trueBtn.addEventListener("click", () => selectAnswer({ text: "True", correct: question.answer }));
            if (userAnswers[currentQuestionIndex]?.userAnswer === "True") {
                trueBtn.classList.add("selected");
            }
            answerButtons.appendChild(trueBtn);

            const falseBtn = document.createElement("button");
            falseBtn.classList.add("answer-btn");
            falseBtn.textContent = "False";
            falseBtn.addEventListener("click", () => selectAnswer({ text: "False", correct: !question.answer }));
            if (userAnswers[currentQuestionIndex]?.userAnswer === "False") {
                falseBtn.classList.add("selected");
            }
            answerButtons.appendChild(falseBtn);
        } else if (question.type === "text") {
            const input = document.createElement("input");
            input.classList.add("answer-input");
            input.type = "text";
            input.placeholder = "Type your answer...";
            input.value = userAnswers[currentQuestionIndex]?.userAnswer || "";
            input.addEventListener("input", (e) => {
                if (e.target.value.trim()) {
                    selectAnswer({ text: e.target.value });
                } else {
                    userAnswers[currentQuestionIndex] = null;
                    updateProgressCircle();
                    renderQuestionList();
                }
            });
            answerButtons.appendChild(input);
        } else if (question.type === "drag-drop") {
            const container = document.createElement("div");
            container.classList.add("drag-drop-container");

            // Create the sentence with blanks
            const sentenceDiv = document.createElement("div");
            sentenceDiv.classList.add("sentence");
            const parts = question.sentence.split("___");
            parts.forEach((part, index) => {
                const textSpan = document.createElement("span");
                textSpan.textContent = part;
                sentenceDiv.appendChild(textSpan);

                if (index < parts.length - 1) {
                    const blank = document.createElement("span");
                    blank.classList.add("blank");
                    blank.dataset.index = index;
                    blank.addEventListener("dragover", (e) => {
                        e.preventDefault();
                        blank.classList.add("drag-over");
                    });
                    blank.addEventListener("dragleave", () => {
                        blank.classList.remove("drag-over");
                    });
                    blank.addEventListener("drop", (e) => {
                        e.preventDefault();
                        blank.classList.remove("drag-over");
                        const word = e.dataTransfer.getData("text");
                        blank.textContent = word;
                        blank.classList.add("filled");

                        // Update user answers
                        const currentAnswer = userAnswers[currentQuestionIndex]?.userAnswer || new Array(question.correctAnswers.length).fill("");
                        currentAnswer[blank.dataset.index] = word;
                        userAnswers[currentQuestionIndex] = { userAnswer: currentAnswer };
                        updateProgressCircle();
                        renderQuestionList();
                    });

                    // Restore previous answer if exists
                    if (userAnswers[currentQuestionIndex]?.userAnswer?.[index]) {
                        blank.textContent = userAnswers[currentQuestionIndex].userAnswer[index];
                        blank.classList.add("filled");
                    }

                    sentenceDiv.appendChild(blank);
                }
            });

            // Create the word options
            const wordOptions = document.createElement("div");
            wordOptions.classList.add("word-options");
            question.words.forEach(word => {
                const wordDiv = document.createElement("div");
                wordDiv.classList.add("word");
                wordDiv.textContent = word;
                wordDiv.draggable = true;
                wordDiv.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("text", word);
                    wordDiv.classList.add("dragging");
                });
                wordDiv.addEventListener("dragend", () => {
                    wordDiv.classList.remove("dragging");
                });
                wordOptions.appendChild(wordDiv);
            });

            container.appendChild(sentenceDiv);
            container.appendChild(wordOptions);
            answerButtons.appendChild(container);
        }

        prevBtn.style.display = currentQuestionIndex > 0 ? "block" : "none";
        nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? "Finish" : "Next";
        updateProgressCircle();
        renderQuestionList();
    }

    function selectAnswer(answer) {
        userAnswers[currentQuestionIndex] = { userAnswer: answer.text };
        const buttons = answerButtons.querySelectorAll(".answer-btn");
        buttons.forEach(btn => btn.classList.remove("selected"));
        if (answer.text) {
            const selectedBtn = Array.from(buttons).find(btn => btn.textContent === answer.text);
            if (selectedBtn) selectedBtn.classList.add("selected");
        }
        updateProgressCircle();
        renderQuestionList();
    }

    function updateProgressCircle() {
        const answeredCount = userAnswers.filter(answer => {
            if (answer === null) return false;
            if (Array.isArray(answer.userAnswer)) {
                return answer.userAnswer.some(val => val !== "");
            }
            return true;
        }).length;
        const percentage = (answeredCount / questions.length) * 100;
        const circumference = 220; // 2 * π * 35
        const offset = circumference - (percentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        progressPercentage.textContent = `${Math.round(percentage)}%`;
    }

    function renderQuestionList() {
        questionListItems.innerHTML = "";
        questions.forEach((_, index) => {
            const item = document.createElement("div");
            item.classList.add("question-item");
            item.textContent = `Question ${index + 1}`;
            if (index === currentQuestionIndex) item.classList.add("active");
            if (userAnswers[index] !== null) {
                if (Array.isArray(userAnswers[index].userAnswer)) {
                    if (userAnswers[index].userAnswer.some(val => val !== "")) {
                        item.classList.add("answered");
                    }
                } else {
                    item.classList.add("answered");
                }
            }
            item.addEventListener("click", () => {
                currentQuestionIndex = index;
                showQuestion();
            });
            questionListItems.appendChild(item);
        });
    }

    function endQuiz() {
        clearInterval(timer);
        const quizEndTime = new Date();
        const timeDiff = (quizEndTime - quizStartTime) / 1000;
        const minutes = Math.floor(timeDiff / 60);
        const seconds = Math.floor(timeDiff % 60);

        // Evaluate answers at the end
        userAnswers.forEach((answer, index) => {
            if (answer === null) return;
            const question = questions[index];
            let correct = false;
            if (question.type === "text") {
                correct = question.acceptableAnswers.includes(answer.userAnswer.toLowerCase());
            } else if (question.type === "mcq") {
                correct = question.answers.find(a => a.text === answer.userAnswer)?.correct;
            } else if (question.type === "true-false") {
                correct = answer.userAnswer === (question.answer ? "True" : "False");
            } else if (question.type === "drag-drop") {
                correct = JSON.stringify(answer.userAnswer) === JSON.stringify(question.correctAnswers);
            }
            if (correct) score++;
        });

        showScreen(resultsScreen);
        scoreDisplay.textContent = `Score: ${score}/${questions.length}`;
        timeTaken.textContent = `Time Taken: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    function showCorrections() {
        correctionsDisplay.innerHTML = "";
        userAnswers.forEach((answer, index) => {
            const question = questions[index];
            const item = document.createElement("div");
            item.classList.add("correction-item");

            let correct = false;
            let correctAnswer = "";
            if (question.type === "text") {
                correct = question.acceptableAnswers.includes(answer?.userAnswer.toLowerCase());
                correctAnswer = question.answer;
            } else if (question.type === "mcq") {
                correct = question.answers.find(a => a.text === answer?.userAnswer)?.correct;
                correctAnswer = question.answers.find(a => a.correct)?.text;
            } else if (question.type === "true-false") {
                correct = answer?.userAnswer === (question.answer ? "True" : "False");
                correctAnswer = question.answer ? "True" : "False";
            } else if (question.type === "drag-drop") {
                correct = JSON.stringify(answer?.userAnswer) === JSON.stringify(question.correctAnswers);
                correctAnswer = question.correctAnswers.join(", ");
            }

            item.classList.add(correct ? "correct" : "incorrect");
            item.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                <p><strong>Your Answer:</strong> ${Array.isArray(answer?.userAnswer) ? answer.userAnswer.join(", ") : (answer?.userAnswer || "Not answered")}</p>
                <p><strong>Correct Answer:</strong> ${correctAnswer}</p>
                <p><strong>Result:</strong> ${correct ? "Correct" : "Incorrect"}</p>
            `;
            correctionsDisplay.appendChild(item);
        });
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endQuiz();
            }
        }, 1000);
    }

    function restartQuiz() {
        showScreen(welcomeScreen);
        clearInterval(timer);
        correctionsDisplay.innerHTML = "";
    }

    function showScreen(screen) {
        welcomeScreen.classList.remove("active");
        quizScreen.classList.remove("active");
        resultsScreen.classList.remove("active");
        screen.classList.add("active");
    }
});