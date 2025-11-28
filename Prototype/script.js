// Keywords for each category
const keywords = {
    cute: [
        'Powerlessness',
        'Consumption & desire',
        'Infantilization',
        'Gentle violence'
    ],
    interesting: [
        'Discourse circulation',
        'Continuous variation',
        'Algorithmic curation',
        'Data extraction'
    ],
    zany: [
        'Performance labor',
        'Affective exhaustion',
        'Precarious work',
        'Comedic desperation'
    ]
};

// Get elements
const cuteCard = document.getElementById('cute-card');
const interestingCard = document.getElementById('interesting-card');
const zanyCard = document.getElementById('zany-card');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const keywordsContainer = document.getElementById('keywords');
const closeBtn = document.getElementById('close-btn');
const exploreBtn = document.getElementById('explore-btn');

// Function to open modal
function openModal(category, title) {
    modalTitle.textContent = title;
    keywordsContainer.innerHTML = '';
    
    // Add keywords
    keywords[category].forEach(keyword => {
        const keywordDiv = document.createElement('div');
        keywordDiv.className = 'keyword';
        keywordDiv.textContent = keyword;
        keywordsContainer.appendChild(keywordDiv);
    });
    
    // Set the explore button link based on category
    exploreBtn.href = `${category}.html`;
    
    modal.classList.add('active');
}

// Function to close modal
function closeModal() {
    modal.classList.remove('active');
}

// Event listeners for cards
cuteCard.addEventListener('click', () => openModal('cute', 'CUTE'));
interestingCard.addEventListener('click', () => openModal('interesting', 'INTERESTING'));
zanyCard.addEventListener('click', () => openModal('zany', 'ZANY'));

// Event listeners for closing
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});