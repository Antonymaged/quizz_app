/**
 * Question List Functionality
 *
 * Provides a navigable list of question numbers for the quiz, with visual indicators
 * for current and answered questions, and mobile toggle support.
 */

/**
 * Toggles the visibility of the question list on mobile devices
 * @param {boolean|null} force 
 */
function toggleQuestionList(force = null) {
  const questionList = document.getElementById("questionList");
  const toggle = document.querySelector(".mobile-toggle");
  // Check if both elements has been found, log an error if not
  if (!questionList || !toggle) {
    console.error("Question list or toggle not found:", {
      questionList,
      toggle,
    });
    return;
  }
  // Determine the new visibility state: use 'force' if provided, otherwise toggle the current state
  const isVisible =
    force !== null ? force : questionList.style.display !== "none";
  const newState = !isVisible; 
  // Log the state before toggling for debugging
  console.log(
    "Before toggle - isVisible:",
    isVisible,
    "newState:",
    newState,
    "display:",
    window.getComputedStyle(questionList).display
  );

  // Update the visibility 
  const isMobile = window.innerWidth <= 768; 
  if (isMobile) {
    questionList.style.display = newState ? "flex" : "none"; 
  } else {
    questionList.style.display = "flex"; // Always visible on desktop
  }

  // Update the toggle icon and accessibility attributes
  toggle.classList.toggle("hidden", !newState); 
  toggle.setAttribute("aria-expanded", newState);
  toggle.className = `fas ${newState ? "fa-times" : "fa-list"} mobile-toggle`; // Switch icon

  // Log the state after toggling for debugging
  console.log(
    "After toggle - newState:",
    newState,
    "display:",
    window.getComputedStyle(questionList).display
  );
}

/**
 * Renders the question list with numbered items
 * Highlights current and answered questions
 */
function renderQuestionList() {
  const questionList = document.getElementById("questionList");
  // Check if the element exists
  if (!questionList) {
    console.error("Question list element (#questionList) not found");
    return;
  }
  // Clear the current content of the list
  questionList.innerHTML = "";
  // Log the current state for debugging
  console.log(
    "Rendering question list, current index:",
    currentQuestionIndex,
    "userAnswers:",
    userAnswers
  );
  // Loop through each question to create a numbered item
  questions.forEach((_, index) => {
    // Create a new span element for the question number
    const item = document.createElement("span");
    item.className = "question-item"; // Add base class
    item.textContent = index + 1; // Set the number (1-based)
    item.setAttribute("aria-label", `Go to question ${index + 1}`); // Accessibility label
    item.setAttribute("tabindex", "0"); // Make it focusable for accessibility
    // Highlight the current question
    if (index === currentQuestionIndex) {
      item.classList.add("current"); // Add 'current' class
    }
    // Mark answered questions
    if (userAnswers[index] !== undefined) {
      item.classList.add("answered"); 
      console.log(`Question ${index + 1} marked as answered`);
    }
    // Add click event to navigate to the question
    item.addEventListener("click", () => {
      console.log("Clicked question item:", index + 1);
      saveCurrentAnswer(); // Save the current answer
      currentQuestionIndex = index; // Update the current question index
      showQuestion(); // Show the selected question
      toggleQuestionList(false); // Hide the list on mobile after selection
    });
    // Add keyboard event for accessibility 
    item.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        console.log("Keypress on question item:", index + 1);
        saveCurrentAnswer();
        currentQuestionIndex = index;
        showQuestion();
        toggleQuestionList(false);
      }
    });
    // Append the item to the list
    questionList.appendChild(item);
  });
}

/**
 * Saves the current answer before switching questions
 */
function saveCurrentAnswer() {
  // Log the saving action for debugging
  console.log("Saving answer for question", currentQuestionIndex);
  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];
  // Handle text input questions
  if (currentQuestion.type === "text") {
    const input = document.getElementById("text-answer");
    if (input && input.value.trim()) {
      console.log("Text input:", input.value.trim());
      selectTextAnswer(input.value.trim()); // Save the text answer
    } else {
      console.log("No text input to save");
    }
  } else {
    // Handle multiple-choice or true/false questions
    const selectedButton = document.querySelector(".answer-btn.selected");
    if (selectedButton) {
      console.log("Selected button:", selectedButton.textContent);
      selectAnswer({ target: selectedButton }); // Save the selected answer
    } else {
      console.log("No selected button to save");
    }
  }
}
