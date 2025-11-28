// Optional: Add click to flip on mobile (since hover doesn't work well on touch devices)
const flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach(card => {
    card.addEventListener('click', function() {
        this.querySelector('.flip-card-inner').style.transform = 
            this.querySelector('.flip-card-inner').style.transform === 'rotateY(180deg)' 
            ? 'rotateY(0deg)' 
            : 'rotateY(180deg)';
    });
});

// Optional: Track how many cards have been flipped
let flippedCount = 0;
const totalCards = flipCards.length;

flipCards.forEach(card => {
    let hasFlipped = false;
    
    card.addEventListener('mouseenter', function() {
        if (!hasFlipped) {
            hasFlipped = true;
            flippedCount++;
            
            // Optional: Change background gradually as more cards are revealed
            if (flippedCount === totalCards) {
                document.body.style.backgroundColor = '#f0f0f0';
                console.log('All truths revealed');
            }
        }
    });
});

// Log page load
console.log('CUTE page loaded');
console.log('Hover over cards to reveal the truth behind cute aesthetics');