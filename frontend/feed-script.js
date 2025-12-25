let feedPosts = [];
// Fetch posts on load
async function fetchFeedPosts() {
    if (window.dataManager) {
        const posts = await window.dataManager.getFeedPosts();
        if (posts && posts.length > 0) {
            feedPosts = posts;
            loadFeedPosts(); // Reload UI
        }
    }
}

// Initial Mock data (fallback)
feedPosts = [
    {
        id: 1,
        author: { name: "Dr. Sarah Wilson", role: "Cyber Security Expert", initials: "SW" },
        category: "phishing",
        categoryLabel: "🎣 Phishing Attack",
        title: "How I helped recover ₹50,000 from a fake bank call",
        description: "Victim received call from someone claiming to be bank manager...",
        solution: ["Blocked cards", "Filed complaint"],
        prevention: ["Never share OTP"],
        stats: { likes: 245, comments: 42, shares: 89, helpful: 98 },
        timestamp: "2 hours ago",
        tags: ["bank-fraud"]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    fetchFeedPosts();
});

let likedPosts = new Set();
let savedPosts = new Set();

// Initialize Feed
document.addEventListener('DOMContentLoaded', function () {
    loadFeedPosts();
    setupInfiniteScroll();
});

// Load Feed Posts
function loadFeedPosts(filter = 'all') {
    const feedContainer = document.getElementById('feedPosts');
    const exploreContainer = document.getElementById('explorePosts');

    if (!feedContainer && !exploreContainer) return;

    let filteredPosts = [...feedPosts];

    // Apply filters
    if (filter !== 'all') {
        switch (filter) {
            case 'phishing':
                filteredPosts = feedPosts.filter(post => post.category === 'phishing');
                break;
            case 'hacking':
                filteredPosts = feedPosts.filter(post => post.category === 'hacking');
                break;
            case 'fraud':
                filteredPosts = feedPosts.filter(post => post.category === 'fraud');
                break;
            case 'bullying':
                filteredPosts = feedPosts.filter(post => post.category === 'bullying');
                break;
            case 'resolved':
                filteredPosts = feedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'popular':
                filteredPosts = feedPosts.sort((a, b) => b.stats.helpful - a.stats.helpful);
                break;
            case 'trending':
                filteredPosts = feedPosts.sort((a, b) => (b.stats.likes + b.stats.shares) - (a.stats.likes + a.stats.shares));
                break;
            case 'job-fraud':
                filteredPosts = feedPosts.filter(post => post.tags.includes('job-scam'));
                break;
            case 'online-shopping':
                filteredPosts = feedPosts.filter(post => post.tags.includes('ecommerce'));
                break;
            case 'investment':
                filteredPosts = feedPosts.filter(post => post.tags.includes('investment'));
                break;
            case 'whatsapp':
                filteredPosts = feedPosts.filter(post => post.tags.includes('whatsapp'));
                break;
        }
    }

    // Clear containers
    if (feedContainer) {
        feedContainer.innerHTML = '';
    }
    if (exploreContainer) {
        exploreContainer.innerHTML = '';
    }

    // Render posts
    filteredPosts.forEach(post => {
        const postElement = createPostElement(post);

        if (feedContainer) {
            feedContainer.appendChild(postElement);
        }
        if (exploreContainer) {
            exploreContainer.appendChild(postElement.cloneNode(true));
        }
    });

    // Update active filter button
    updateActiveFilter(filter);
}

// Create Post Element
function createPostElement(post) {
    const postElement = document.createElement('article');
    postElement.className = 'post-card';
    postElement.dataset.id = post.id;

    return `
        <div class="post-header">
            <div class="post-avatar">${post.author.initials}</div>
            <div class="post-user-info">
                <h4>
                    ${post.author.name}
                    ${post.author.isVerified ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
                </h4>
                <div class="post-meta">
                    <span>${post.author.role}</span>
                    <span>•</span>
                    <span>${post.timestamp}</span>
                    <div class="post-category">${post.categoryLabel}</div>
                </div>
            </div>
        </div>
        
        <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-description">${post.description}</p>
            
            <div class="post-solution">
                <h5><i class="fas fa-check-circle"></i> SOLUTION APPLIED</h5>
                <ul class="solution-steps">
                    ${post.solution.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
            
            <div class="post-prevention">
                <h5><i class="fas fa-shield-alt"></i> PREVENTION TIPS</h5>
                <ul class="prevention-steps">
                    ${post.prevention.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
        </div>
        
        <div class="post-footer">
            <div class="post-actions">
                <button class="action-btn ${likedPosts.has(post.id) ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                    <i class="fas fa-heart"></i>
                    <span>${post.stats.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                </button>
                <button class="action-btn" onclick="showComments(${post.id})">
                    <i class="fas fa-comment"></i>
                    <span>${post.stats.comments}</span>
                </button>
                <button class="action-btn" onclick="sharePost(${post.id})">
                    <i class="fas fa-share"></i>
                    <span>${post.stats.shares}</span>
                </button>
                <button class="action-btn ${savedPosts.has(post.id) ? 'saved' : ''}" onclick="toggleSave(${post.id})">
                    <i class="fas fa-bookmark"></i>
                    <span>Save</span>
                </button>
            </div>
            
            <div class="post-helpful">
                <i class="fas fa-thumbs-up"></i>
                <span>${post.stats.helpful}% found helpful</span>
            </div>
        </div>
    `;
}

// Filter Feed
function filterFeed(filter) {
    loadFeedPosts(filter);
    showNotification(`Showing ${filter} cases`, 'info');
}

function updateActiveFilter(activeFilter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(activeFilter)) {
            btn.classList.add('active');
        }
    });
}

// Post Interactions
function toggleLike(postId) {
    if (likedPosts.has(postId)) {
        likedPosts.delete(postId);
        showNotification('Like removed', 'info');
    } else {
        likedPosts.add(postId);
        showNotification('Post liked!', 'success');
    }

    // Update UI
    const likeStat = document.querySelector(`.post-card[data-id="${postId}"] .stat:nth-child(1)`);
    if (likeStat) {
        likeStat.classList.toggle('liked');
        const span = likeStat.querySelector('span');
        const currentLikes = parseInt(span.textContent);
        span.textContent = likedPosts.has(postId) ? currentLikes + 1 : currentLikes - 1;
    }
}

function toggleSave(postId) {
    if (savedPosts.has(postId)) {
        savedPosts.delete(postId);
        showNotification('Removed from saved', 'info');
    } else {
        savedPosts.add(postId);
        showNotification('Post saved!', 'success');
    }

    // Update UI
    const saveStat = document.querySelector(`.post-card[data-id="${postId}"] .stat:nth-child(4)`);
    if (saveStat) {
        saveStat.classList.toggle('saved');
    }
}

function showComments(postId) {
    showNotification('Comments feature coming soon!', 'info');
}

function sharePost(postId) {
    const post = feedPosts.find(p => p.id === postId);
    if (post) {
        const shareText = `Check out this cyber crime case: ${post.title}\n\nLearn more at CyberShield`;
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText);
            showNotification('Link copied to clipboard!', 'success');
        }
    }
}

// Search Functionality
function searchCases() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        showNotification('Please enter search terms', 'error');
        return;
    }

    const results = feedPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.includes(query))
    );

    if (results.length === 0) {
        showNotification(`No cases found for "${query}"`, 'info');
        return;
    }

    // Show results
    const feedContainer = document.getElementById('feedPosts') || document.getElementById('explorePosts');
    if (feedContainer) {
        feedContainer.innerHTML = '';
        results.forEach(post => {
            feedContainer.appendChild(createPostElement(post));
        });
        showNotification(`Found ${results.length} case(s)`, 'success');
    }
}

// Infinite Scroll
function setupInfiniteScroll() {
    window.addEventListener('scroll', function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMorePosts();
        }
    });
}

function loadMorePosts() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';

        // Simulate loading delay
        setTimeout(() => {
            // In real app, this would fetch more posts from API
            loadingIndicator.style.display = 'none';
            showNotification('No more posts to load', 'info');
        }, 1500);
    }
}

// Other Functions
function viewReport() {
    showNotification('Monthly report will open in new tab', 'info');
    // In real app: window.open('/monthly-report.html', '_blank');
}