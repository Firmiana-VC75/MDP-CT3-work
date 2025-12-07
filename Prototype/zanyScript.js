// ================================
// ZANY PAGE LOGIC
// ================================

const startScreen = document.getElementById('start-screen');
const videoScreen = document.getElementById('video-screen');
const startBtn = document.getElementById('start-btn');
const video = document.getElementById('performance-video');

// Start button click
startBtn.addEventListener('click', function() {
    // Hide start screen
    startScreen.classList.remove('active');
    
    // Show video screen
    videoScreen.classList.add('active');
    
    // Play video (will loop infinitely)
    video.play();
});

console.log('ZANY page loaded');
console.log('Click BEGIN to start performance');
console.log('Video will loop infinitely - only way out is to leave the page');