// Golf Restaurant Blog JavaScript

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const restaurantList = document.getElementById('restaurantList');
const noResults = document.getElementById('noResults');
const navLinks = document.querySelectorAll('.nav-list a');

// Golf course and restaurant data
const golfRestaurantData = {
    'seoul': [
        { name: '스카이힐', keywords: ['스카이힐', 'skyhill', '스카이힐cc'] },
        { name: '남서울', keywords: ['남서울', '남서울cc'] },
        { name: '레이크사이드', keywords: ['레이크사이드', 'lakeside'] }
    ],
    'chungcheong': [
        { name: '프린세스', keywords: ['프린세스', 'princess', '프린세스cc', '천안'] },
        { name: '불고기', keywords: ['불고기', '홍정'] },
        { name: '보령', keywords: ['보령', '열월청춘'] },
        { name: '천안', keywords: ['천안', '천안cc'] }
    ],
    'gyeongsang': [
        { name: '한정식', keywords: ['한정식', '산수팀'] },
        { name: '통도', keywords: ['통도', '통도cc'] },
        { name: '부산', keywords: ['부산', '부산cc'] }
    ],
    'jeju': [
        { name: '오라', keywords: ['오라', '오라cc'] },
        { name: '제주', keywords: ['제주', '제주cc'] },
        { name: '중문', keywords: ['중문', '중문cc'] }
    ],
    'jeolla': [
        { name: '무등산', keywords: ['무등산', '무등산cc'] },
        { name: '순천', keywords: ['순천', '순천cc'] }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Get golf course grid if exists
    const golfCoursesGrid = document.getElementById('golfCoursesGrid');
    
    // Load saved golf courses from localStorage
    loadSavedGolfCourses();
    
    // Add event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Navigation filters
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter restaurants
            const region = this.dataset.region;
            filterByRegion(region);
        });
    });
});

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const golfCoursesGrid = document.getElementById('golfCoursesGrid');
    const restaurantListSection = document.getElementById('restaurantList');
    
    if (!searchTerm) {
        // Show golf courses grid, hide restaurant list
        if (golfCoursesGrid) golfCoursesGrid.style.display = 'grid';
        if (restaurantListSection) restaurantListSection.style.display = 'none';
        showAllRestaurants();
        return;
    }

    // Check if search term matches any golf course
    let matchedCourse = null;
    for (const region in golfRestaurantData) {
        const courses = golfRestaurantData[region];
        for (const course of courses) {
            if (course.keywords.some(keyword => keyword.includes(searchTerm) || searchTerm.includes(keyword))) {
                matchedCourse = course.name;
                break;
            }
        }
        if (matchedCourse) break;
    }

    // If it's a golf course search
    if (matchedCourse) {
        // Check if it's Princess CC
        if (matchedCourse === '프린세스') {
            // Redirect to Princess CC page
            window.location.href = 'princess-cc.html';
            return;
        }
        
        // For other golf courses, show alert (since they're not ready yet)
        alert('해당 골프장 페이지는 준비중입니다.');
        searchInput.value = '';
        return;
    }

    // Otherwise, search in restaurant cards
    const cards = document.querySelectorAll('.restaurant-card');
    let hasResults = false;

    // Hide golf courses grid if it exists
    if (golfCoursesGrid) golfCoursesGrid.style.display = 'none';
    if (restaurantListSection) restaurantListSection.style.display = 'flex';

    cards.forEach(card => {
        const golfCourse = card.dataset.golf?.toLowerCase() || '';
        const restaurantName = card.querySelector('.restaurant-name')?.textContent.toLowerCase() || '';
        const restaurantInfo = card.textContent.toLowerCase();
        
        const isMatch = golfCourse.includes(searchTerm) || 
                       restaurantName.includes(searchTerm) || 
                       restaurantInfo.includes(searchTerm);
        
        if (isMatch) {
            card.style.display = 'flex';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (noResults) {
        noResults.style.display = hasResults ? 'none' : 'block';
    }
}

// Filter by region
function filterByRegion(region) {
    const golfCoursesGrid = document.getElementById('golfCoursesGrid');
    const restaurantListSection = document.getElementById('restaurantList');
    const golfCourseCards = document.querySelectorAll('.golf-course-card');
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    let hasResults = false;

    // Show golf courses grid, hide restaurant list
    if (golfCoursesGrid) golfCoursesGrid.style.display = 'grid';
    if (restaurantListSection) restaurantListSection.style.display = 'none';

    // Filter golf course cards
    golfCourseCards.forEach(card => {
        if (region === 'all' || card.dataset.region === region) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Also filter restaurant cards (for backwards compatibility)
    restaurantCards.forEach(card => {
        if (region === 'all' || card.dataset.region === region) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (noResults) {
        noResults.style.display = hasResults ? 'none' : 'block';
    }
    
    // Clear search input when filtering by region
    if (searchInput) {
        searchInput.value = '';
    }
}

// Show all restaurants
function showAllRestaurants() {
    const cards = document.querySelectorAll('.restaurant-card');
    const golfCoursesGrid = document.getElementById('golfCoursesGrid');
    const restaurantListSection = document.getElementById('restaurantList');
    
    // Show golf courses grid if it exists
    if (golfCoursesGrid) golfCoursesGrid.style.display = 'grid';
    if (restaurantListSection) restaurantListSection.style.display = 'none';
    
    cards.forEach(card => {
        card.style.display = 'flex';
    });
    
    if (noResults) {
        noResults.style.display = 'none';
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images (if needed in the future)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    // Observe all images
    document.querySelectorAll('.restaurant-image img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Load saved golf courses from localStorage
function loadSavedGolfCourses() {
    const golfCoursesGrid = document.getElementById('golfCoursesGrid');
    if (!golfCoursesGrid) return;
    
    const savedCourses = JSON.parse(localStorage.getItem('golfCourses') || '[]');
    
    savedCourses.forEach(course => {
        const fileName = course.name.toLowerCase()
            .replace(/cc/gi, '-cc')
            .replace(/골프장/g, '-golf')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '') + '.html';
            
        const restaurantList = course.restaurants.map(r => 
            `<li>${r.name} - ${r.menu}</li>`
        ).join('');
        
        const cardHtml = `
            <div class="golf-course-card" data-region="${course.region}" onclick="location.href='${fileName}'">
                <div class="golf-course-header">
                    <h3 class="golf-course-name">${course.name}</h3>
                    <span class="golf-course-location">${course.location}</span>
                </div>
                <div class="golf-course-preview">
                    <p class="preview-title">추천 맛집 ${course.restaurants.length}곳</p>
                    <ul class="preview-list">
                        ${restaurantList}
                    </ul>
                </div>
                <a href="${fileName}" class="view-detail-btn">맛집 자세히 보기</a>
            </div>
        `;
        
        // 기존 카드 앞에 추가
        const existingCards = golfCoursesGrid.querySelectorAll('.golf-course-card');
        if (existingCards.length > 0) {
            existingCards[0].insertAdjacentHTML('beforebegin', cardHtml);
        } else {
            golfCoursesGrid.insertAdjacentHTML('beforeend', cardHtml);
        }
    });
    
    // golfRestaurantData에도 추가
    savedCourses.forEach(course => {
        if (!golfRestaurantData[course.region]) {
            golfRestaurantData[course.region] = [];
        }
        golfRestaurantData[course.region].push({
            name: course.name,
            keywords: [course.name.toLowerCase(), course.name.replace(/\s+/g, '')]
        });
    });
}