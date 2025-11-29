// ================================
// DATA: Feed content for each topic
// ================================

const feedData = {
    cats: {
        main: [
            {title: 'Why cats are the best pets', meta: '2.3M views' },
            {title: 'Funny cat compilation 2024', meta: 'Trending' },
            {title: 'Understanding cat behavior', meta: '891K views' },
            {title: 'Cute kittens playing', meta: '1.5M views' },
            {title: 'How to care for your cat', meta: '654K views' },
            {title: 'Cats doing silly things', meta: 'Trending' },
            {title: 'The science behind cat purring', meta: '432K views' },
            {title: 'Adorable cat moments', meta: '2.1M views' },
        ],
        other: [
            {title: 'Modern art exhibition opens', meta: '234K views', category: 'art' },
            { title: 'Hidden travel destinations', meta: '567K views', category: 'travel' },
            {title: 'Best books of the year', meta: '345K views', category: 'books' },
            {title: 'Innovation in renewable energy', meta: '123K views', category: 'tech' },
            {title: 'Theater revival in small towns', meta: '89K views', category: 'culture' },
            {title: 'Mountain hiking safety tips', meta: '201K views', category: 'outdoor' },
        ]
    },
    art: {
        main: [
            {title: 'New contemporary art trends', meta: '1.8M views' },
            {title: 'Museum rare collection', meta: 'Trending' },
            {title: 'Drawing techniques for beginners', meta: '723K views' },
            {title: 'Abstract art explained', meta: '1.2M views' },
            {title: 'Famous paintings reimagined', meta: '891K views' },
            {title: 'Sketching in urban settings', meta: '456K views' },
            {title: 'Color theory masterclass', meta: '1.5M views' },
            {title: 'Art history deep dive', meta: '678K views' },
        ],
        other: [
            {title: 'Cats in art history', meta: '345K views', category: 'cats' },
            {title: 'Culinary art meets fine dining', meta: '567K views', category: 'food' },
            {title: 'Literature and visual arts', meta: '234K views', category: 'books' },
            {title: 'Video game art design', meta: '891K views', category: 'gaming' },
            {title: 'Travel photography showcase', meta: '123K views', category: 'travel' },
            {title: 'Tech innovations in art', meta: '456K views', category: 'tech' },
        ]
    },
    food: {
        main: [
            {title: 'Best pizza recipes at home', meta: '2.1M views' },
            {title: 'Authentic ramen techniques', meta: 'Trending' },
            {title: 'Baking tips for beginners', meta: '1.3M views' },
            {title: 'Italian cuisine secrets', meta: '987K views' },
            {title: 'Street food around the world', meta: '1.6M views' },
            {title: 'Dessert trends 2024', meta: '743K views' },
            {title: 'Cooking with seasonal ingredients', meta: '1.1M views' },
            {title: 'Food science explained', meta: '567K views' },
        ],
        other: [
            {title: 'Food as art installation', meta: '234K views', category: 'art' },
            {title: 'Culinary tourism guide', meta: '456K views', category: 'travel' },
            {title: 'Cookbooks that changed cuisine', meta: '189K views', category: 'books' },
            {title: 'Tech in modern kitchens', meta: '345K views', category: 'tech' },
            {title: 'What cats can and cannot eat', meta: '678K views', category: 'cats' },
            {itle: 'Nutrition for athletes', meta: '234K views', category: 'health' },
        ]
    }
};

// ================================
// STATE MANAGEMENT
// ================================

let currentTopic = null;
let clickCount = 0;
let mainTopicClicks = 0;
let otherClicks = 0;
let startTime = null;
let currentStage = 1; // 1: diverse, 2: narrowing, 3: monopoly
let viewedPosts = 0;

// ================================
// STAGE 1: TOPIC SELECTION
// ================================

document.querySelectorAll('.topic-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        currentTopic = this.dataset.topic;
        startFeed();
    });
});

// ================================
// STAGE 2: FEED GENERATION
// ================================

function startFeed() {
    // Hide selection, show feed
    document.getElementById('selection-screen').classList.remove('active');
    document.getElementById('feed-screen').classList.add('active');
    
    // Start timer
    startTime = Date.now();
    
    // Generate initial feed
    generateFeed(1);
}

function generateFeed(stage) {
    currentStage = stage;
    const container = document.getElementById('feed-container');
    container.innerHTML = '';
    
    const data = feedData[currentTopic];
    let feedItems = [];
    
    if (stage === 1) {
        // Stage 1: Diverse feed (alternating main and other)
        feedItems = [
            data.main[0],
            data.other[0],
            data.main[1],
            data.other[1],
            data.main[2],
            data.other[2],
            data.main[3],
            data.other[3],
            data.main[4],
            data.other[4],
            data.main[5],
            data.other[5],
        ];
    } else if (stage === 2) {
        // Stage 2: More main topic, other content fading
        feedItems = [
            data.main[0],
            data.main[1],
            { ...data.other[0], fading: true },
            data.main[2],
            data.main[3],
            { ...data.other[1], fading: true },
            data.main[4],
            data.main[5],
            { ...data.other[2], fading: true },
            data.main[6],
            data.main[7],
            { ...data.other[3], buried: true },
        ];
    } else if (stage === 3) {
        // Stage 3: Monopoly - mostly main topic, loop begins
        feedItems = [
            data.main[0],
            data.main[1],
            data.main[2],
            data.main[3],
            data.main[4],
            data.main[5],
            data.main[6],
            data.main[7],
            data.main[0], // Loop begins
            data.main[1],
            data.main[2],
            { ...data.other[0], buried: true },
            { ...data.other[1], buried: true },
        ];
    }
    
    // Create feed item elements
    feedItems.forEach((item, index) => {
        const feedItem = createFeedItem(item, index);
        container.appendChild(feedItem);
    });
    
    // Add scroll detection for stage 3 loop
    if (stage === 3) {
        addScrollLoopDetection();
    }
}

function createFeedItem(item, index) {
    const div = document.createElement('div');
    div.className = 'feed-item';
    
    if (item.fading) div.classList.add('fading');
    if (item.buried) div.classList.add('buried');
    
    div.dataset.isMain = !item.category;
    div.dataset.index = index;
    
    div.innerHTML = `
        <div class="feed-item-header">
            <div class="feed-item-icon">${item.icon}</div>
            <div class="feed-item-title">${item.title}</div>
        </div>
        <div class="feed-item-meta">${item.meta}</div>
    `;
    
    // Click handler
    div.addEventListener('click', function() {
        if (this.classList.contains('buried')) return;
        
        this.classList.add('clicked');
        viewedPosts++;
        clickCount++;
        
        if (this.dataset.isMain === 'true') {
            mainTopicClicks++;
        } else {
            otherClicks++;
        }
        
        // Stage transitions
        if (clickCount === 3 && currentStage === 1) {
            setTimeout(() => generateFeed(2), 500);
        } else if (clickCount === 6 && currentStage === 2) {
            setTimeout(() => generateFeed(3), 500);
        } else if (clickCount >= 10 && currentStage === 3) {
            setTimeout(() => showReveal(), 500);
        }
    });
    
    return div;
}

function addScrollLoopDetection() {
    // Detect when user scrolls to bottom
    window.addEventListener('scroll', function checkScroll() {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            // User reached bottom - could add loop animation here
            console.log('Loop detected');
        }
    });
}

// ================================
// STAGE 3: REVEAL SCREEN
// ================================

function showReveal() {
    // Hide feed, show reveal
    document.getElementById('feed-screen').classList.remove('active');
    document.getElementById('reveal-screen').classList.add('active');
    
    // Calculate stats
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    
    // Display stats
    document.getElementById('time-spent').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('posts-viewed').textContent = viewedPosts;
    document.getElementById('main-clicks').textContent = mainTopicClicks;
    
    // Generate attention chart
    const totalClicks = mainTopicClicks + otherClicks;
    const mainPercentage = Math.round((mainTopicClicks / totalClicks) * 100);
    const otherPercentage = 100 - mainPercentage;
    
    const chartContainer = document.getElementById('attention-chart');
    chartContainer.innerHTML = `
        <div class="chart-bar">
            <div class="chart-label">${currentTopic.charAt(0).toUpperCase() + currentTopic.slice(1)}</div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="width: ${mainPercentage}%"></div>
            </div>
            <div class="chart-percentage">${mainPercentage}%</div>
        </div>
        <div class="chart-bar">
            <div class="chart-label">Other topics</div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="width: ${otherPercentage}%; background: #999;"></div>
            </div>
            <div class="chart-percentage">${otherPercentage}%</div>
        </div>
    `;
    
    // Show missed button handler
    document.getElementById('show-missed-btn').addEventListener('click', showMissed);
}

// ================================
// STAGE 4: MISSED CONTENT
// ================================

function showMissed() {
    // Hide reveal, show missed
    document.getElementById('reveal-screen').classList.remove('active');
    document.getElementById('missed-screen').classList.add('active');
    
    // Generate buried content list
    const buriedContainer = document.getElementById('buried-content');
    const otherTopics = feedData[currentTopic].other;
    
    buriedContainer.innerHTML = '';
    
    otherTopics.forEach((item, index) => {
        const buriedItem = document.createElement('div');
        buriedItem.className = 'buried-item';
        buriedItem.innerHTML = `
            <div class="buried-item-header">
                <span class="buried-item-icon">${item.icon}</span>
                <span class="buried-item-title">${item.title}</span>
            </div>
            <div class="buried-item-reason">
                Buried after ${3 + index * 3} posts
            </div>
        `;
        buriedContainer.appendChild(buriedItem);
    });
}

// ================================
// INITIALIZE
// ================================

console.log('INTERESTING page loaded');
console.log('Select a topic to begin');