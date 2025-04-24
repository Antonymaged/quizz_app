// Import confetti library (assumes it's included via CDN in HTML)
import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.esm.js';

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const playAgainButton = document.querySelector('.buttons button:first-child');
    const backToHomeButton = document.querySelector('.buttons button:last-child');
    const scoreDisplay = document.querySelector('.result-text p:nth-child(2)');
    const userNameDisplay = document.querySelector('.user-info span');
    const mainContent = document.querySelector('.main-content');

    // Mock user data and score (could be fetched from localStorage or an API)
    const userName = localStorage.getItem('username') || 'Emad Metoub';
    const quizScore = 5; // Mock score (out of 5)
    const totalQuestions = 5;

    // Update user info
    userNameDisplay.textContent = userName;

    // Animate score display (count up from 0 to the final score)
    let currentScore = 0;
    const scoreAnimation = setInterval(() => {
        if (currentScore <= quizScore) {
            scoreDisplay.textContent = `${currentScore} / ${totalQuestions}`;
            currentScore++;
        } else {
            clearInterval(scoreAnimation);
        }
    }, 300);

    // Trigger confetti effect on page load
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3F739A', '#8DC4FF', '#CFE7FF'] // Use colors from the palette
    });

    // Add "Play Again" button functionality
    playAgainButton.addEventListener('click', () => {
        try {
            // Reset score (for demo purposes)
            localStorage.setItem('quizScore', '0');
            // Redirect to quiz page (placeholder URL)
            window.location.href = '/Quiz_Final_Result.html';
        } catch (error) {
            console.error('Error redirecting to quiz page:', error);
            alert('Unable to redirect to the quiz page. Please try again later.');
        }
    });

    // Add "Back to Home" button functionality
    backToHomeButton.addEventListener('click', () => {
        try {
            // Redirect to homepage (placeholder URL)
            window.location.href = '/index.html';
        } catch (error) {
            console.error('Error redirecting to homepage:', error);
            alert('Unable to redirect to the homepage. Please try again later.');
        }
    });

    // Add a "Share Result" button dynamically
    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share Result';
    shareButton.className = 'share-button';
    shareButton.style.marginTop = '1rem';
    shareButton.style.padding = '0.5rem 1.5rem';
    shareButton.style.borderRadius = '9999px';
    shareButton.style.backgroundColor = '#8DC4FF'; // Use a color from the palette
    shareButton.style.color = '#002141';
    shareButton.style.fontWeight = '500';
    shareButton.style.border = 'none';
    shareButton.style.cursor = 'pointer';
    shareButton.style.transition = 'background-color 0.3s ease, transform 0.2s ease';
    shareButton.addEventListener('mouseover', () => {
        shareButton.style.backgroundColor = '#3F739A';
        shareButton.style.transform = 'scale(1.05)';
    });
    shareButton.addEventListener('mouseout', () => {
        shareButton.style.backgroundColor = '#8DC4FF';
        shareButton.style.transform = 'scale(1)';
    });

    // Add share functionality
    shareButton.addEventListener('click', async () => {
        const shareText = `I scored ${quizScore}/${totalQuestions} on my quiz at Quizapp! 🎉 Can you beat my score?`;
        try {
            await navigator.clipboard.writeText(shareText);
            // Show confirmation message
            const confirmation = document.createElement('p');
            confirmation.textContent = 'Result copied to clipboard!';
            confirmation.style.color = '#3F739A';
            confirmation.style.marginTop = '0.5rem';
            confirmation.style.fontSize = '0.875rem';
            mainContent.appendChild(confirmation);
            setTimeout(() => confirmation.remove(), 3000); // Remove after 3 seconds
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            alert('Failed to copy result. Please try again.');
        }
    });

    // Append the share button to the buttons section
    const buttonsSection = document.querySelector('.buttons');
    buttonsSection.appendChild(shareButton);
});