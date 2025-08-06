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
    
    // Initialize Princess CC data if not exists
    initializePrincessCC();
    
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
            // Redirect to Princess CC page using dynamic system
            window.location.href = 'golf-detail.html?id=princesscc';
            return;
        }
        
        // Check if golf course exists in localStorage
        const golfCourses = JSON.parse(localStorage.getItem('golfCourses') || '[]');
        const savedCourse = golfCourses.find(course => course.name === matchedCourse);
        
        if (savedCourse) {
            // Generate ID for the golf course
            const courseId = savedCourse.name.toLowerCase()
                .replace(/cc/gi, 'cc')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            window.location.href = `golf-detail.html?id=${courseId}`;
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

// Initialize Princess CC data
function initializePrincessCC() {
    const golfCourses = JSON.parse(localStorage.getItem('golfCourses') || '[]');
    
    // Check if Princess CC already exists
    const exists = golfCourses.find(course => course.name === '프린세스CC');
    
    if (!exists) {
        const princessCCData = {
            name: '프린세스CC',
            region: 'chungcheong',
            location: '충남 천안시',
            restaurants: [
                { name: '광덕산 옛골가든', menu: '자연산버섯전골, 능이백숙' },
                { name: '오성갈비', menu: '돼지갈비' },
                { name: '하늘아래토브', menu: '한방백숙, 청국장' }
            ],
            htmlContent: `<!-- 스타일 -->
<style>
  /* 공통 스타일 */
  .restaurant-list {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0;
    box-sizing: border-box;
  }

  .restaurant-item {
    display: flex;
    width: 100%;
    max-width: 800px;
    border: 1px solid #228B22;
    border-radius: 15px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    height: 200px;
    position: relative;
    margin: 0 auto;
  }

  .restaurant-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .restaurant-image-container {
    width: 200px;
    min-width: 200px;
    height: 200px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .restaurant-image {
    width: 160px;
    height: 160px;
    overflow: hidden;
    border-radius: 8px;
  }

  .restaurant-image img {
    width: 160px !important;
    height: 160px !important;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .restaurant-info {
    padding: 20px 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 200px;
    position: relative;
  }

  .restaurant-title {
    font-size: 17px;
    font-weight: bold;
    margin: 0 0 10px 0;
    font-family: inherit;
    color: #228B22;
    background: none;
    display: block;
    line-height: 1.2;
  }

  .info-row {
    display: flex;
    margin: 2px 0;
    line-height: 1.4;
  }

  .info-label {
    font-weight: bold;
    width: auto;
    min-width: auto;
    font-size: 13px;
    text-align: left;
    margin-right: 4px;
  }

  .info-content {
    font-size: 13px;
    text-align: left;
    flex: 1;
  }

  .visit-btn-container {
    margin-top: 5px;
    text-align: right;
  }

  .visit-btn {
    width: 100px;
    height: 32px;
    border-radius: 16px;
    background-color: #228B22;
    color: white;
    border: none;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }

  .visit-btn:hover {
    background-color: #1a6b1a;
    transform: scale(1.05);
  }

  .title-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .restaurant-image a {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  /* 모바일 스타일 */
  @media (max-width: 768px) {
    .restaurant-item {
      width: calc(100% - 20px);
      max-width: calc(100% - 20px);
      height: 200px;
      margin: 0 10px;
    }
    
    .restaurant-image-container {
      width: 160px;
      min-width: 160px;
      height: 200px;
      padding: 20px 10px 20px 15px;
    }
    
    .restaurant-image {
      width: 120px;
      height: 120px;
    }
    
    .restaurant-info {
      padding: 15px 10px;
      height: 200px;
    }
    
    .restaurant-image img {
      width: 120px !important;
      height: 120px !important;
      object-fit: cover;
      object-position: center;
    }
    
    .restaurant-title {
      font-size: 16px;
      margin: 0 0 8px 0;
    }
    
    .info-label {
      font-size: 12px;
    }
    
    .info-content {
      font-size: 12px;
    }
    
    .visit-btn {
      width: 80px;
      height: 30px;
      font-size: 13px;
    }
  }
</style>

<!-- 제목 & 소개글 -->
<h2 data-ke-size="size26">프린세스CC 맛집 근처 주변 추천 3곳, 아침, 점심 가능한 곳!</h2>
<p data-ke-size="size16">프린세스CC 맛집 근처 주변 맛집으로 라운딩 전 완벽한 체력 충전! 골프 라운딩을 하기 전후에 식사를 안하면 정말 18홀 동안 너무 힘들어요. 골프를 즐기는 것도 중요하지만 체력의 안배는 골프의 가장 중요한 사항이라는 것 알고계시나요? 여러분의 스코어와 건강을 위해 맛집 추천을 드립니다.</p>
<br>
<!-- 맛집 목록 -->
<div class="restaurant-list">
  <!-- 광덕산 옛골가든 -->
  <div class="restaurant-item">
    <div class="restaurant-image-container">
      <div class="restaurant-image">
        <a href="https://naver.me/5uIRbvKb" rel="noopener">
          <img src="https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA4MDVfMTA1%2FMDAxNzIyODMxMjcwNDQ3.NHwL1lG2PSdPRYUiNSCZAV5wro7ndczwMlEmOzYg7e4g.5m2BgEv7U9X_CxAnN1EuinSGhHsHy7mDGVQ1y3sMQncg.JPEG%2F20240805_114951.jpg%3Ftype%3Dw1500_60_sharpen" alt="광덕산 옛골가든" />
        </a>
      </div>
    </div>
    <div class="restaurant-info">
      <a href="https://naver.me/5uIRbvKb" class="title-link" rel="noopener">
        <div class="restaurant-title">광덕산 옛골가든</div>
      </a>
      <div class="info-row">
        <div class="info-label">대표 메뉴:</div>
        <div class="info-content">자연산버섯전골, 능이백숙</div>
      </div>
      <div class="info-row">
        <div class="info-label">주소:</div>
        <div class="info-content">광덕면 보산원1길 27</div>
      </div>
      <div class="info-row">
        <div class="info-label">전화:</div>
        <div class="info-content">0507-1361-4870</div>
      </div>
      <div class="info-row">
        <div class="info-label">설명:</div>
        <div class="info-content">맛있는 버섯전골의 담백한 맛.</div>
      </div>
      <div class="visit-btn-container">
        <a href="https://naver.me/5uIRbvKb" rel="noopener">
          <button class="visit-btn">바로가기</button>
        </a>
      </div>
    </div>
  </div>

  <!-- 오성갈비 -->
  <div class="restaurant-item">
    <div class="restaurant-image-container">
      <div class="restaurant-image">
        <a href="https://naver.me/FA2l7Cwe" rel="noopener">
          <img src="https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210516_4%2F1621153790186LsbDD_JPEG%2Fuk1VABxQbaZP6tysyBpvw9A4.jpg" alt="오성갈비" />
        </a>
      </div>
    </div>
    <div class="restaurant-info">
      <a href="https://naver.me/FA2l7Cwe" class="title-link" rel="noopener">
        <div class="restaurant-title">오성갈비</div>
      </a>
      <div class="info-row">
        <div class="info-label">대표 메뉴:</div>
        <div class="info-content">돼지갈비</div>
      </div>
      <div class="info-row">
        <div class="info-label">주소:</div>
        <div class="info-content">광덕면 광덕로 228</div>
      </div>
      <div class="info-row">
        <div class="info-label">전화:</div>
        <div class="info-content">041-566-1999</div>
      </div>
      <div class="info-row">
        <div class="info-label">설명:</div>
        <div class="info-content">부드럽고 맛있는 돼지갈비 전문점.</div>
      </div>
      <div class="visit-btn-container">
        <a href="https://naver.me/FA2l7Cwe" rel="noopener">
          <button class="visit-btn">바로가기</button>
        </a>
      </div>
    </div>
  </div>

  <!-- 하늘아래토브 -->
  <div class="restaurant-item">
    <div class="restaurant-image-container">
      <div class="restaurant-image">
        <a href="https://naver.me/GpCRhXSd" rel="noopener">
          <img src="https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyMjExMjNfNDgg%2FMDAxNjY5MTc4MTI1NDIw.OAsUAuOgRT28LU5UlDTl2WhNPAxO5ZrqSU-X-7t6gsQg.gYSQUapdRDgdwGu797hbO2J5tDMxPtp9r2wmNGE9dMcg.JPEG%2FE492DDD1-6208-4783-A96F-E07993F9FB74.jpeg%3Ftype%3Dw1500_60_sharpen" alt="하늘아래토브" />
        </a>
      </div>
    </div>
    <div class="restaurant-info">
      <a href="https://naver.me/GpCRhXSd" class="title-link" rel="noopener">
        <div class="restaurant-title">하늘아래토브</div>
      </a>
      <div class="info-row">
        <div class="info-label">대표 메뉴:</div>
        <div class="info-content">한방백숙, 청국장</div>
      </div>
      <div class="info-row">
        <div class="info-label">주소:</div>
        <div class="info-content">정안면 차령고개로 140-19</div>
      </div>
      <div class="info-row">
        <div class="info-label">전화:</div>
        <div class="info-content">041-858-8796</div>
      </div>
      <div class="info-row">
        <div class="info-label">설명:</div>
        <div class="info-content">싱싱한 재료로 만든 맛있는 한식.</div>
      </div>
      <div class="visit-btn-container">
        <a href="https://naver.me/GpCRhXSd" rel="noopener">
          <button class="visit-btn">바로가기</button>
        </a>
      </div>
    </div>
  </div>
</div>

<!-- 마무리 안내 -->
<p data-ke-size="size16">&nbsp;</p>
<div style="background-color: #f0f8f0; border: 2px solid #228B22; border-radius: 10px; padding: 20px; margin: 30px 0; box-shadow: 0 4px 8px rgba(34, 139, 34, 0.15);">
  <p style="font-size: 1.2em; color: #228b22; margin-bottom: 10px; font-weight: bold; text-align: center;" data-ke-size="size16">⛳ 골프 라운딩 팁 ⛳</p>
  <p style="font-size: 1.1em; line-height: 1.5; color: #333; text-align: center;" data-ke-size="size16">프린세스CC에서 완벽한 라운딩을 즐기기 위해서는 체력 관리가 필수입니다. 위에 소개된 맛집에서 영양가 있는 식사로 에너지를 충전하고, 수분 섭취도 잊지 마세요. 긍정적인 마인드셋과 든든한 한 끼는 스코어를 개선하는 비결입니다. 멋진 자연 속에서 여유로운 마음으로 즐기다 보면 어느새 숨겨진 실력이 발휘될 것입니다. 오늘도 행복한 골프 라이프 되세요!</p>
</div>

<!-- 태그 -->
프린세스CC, 천안 맛집, 골프장 근처 맛집, 버섯전골, 돼지갈비, 한방백숙`
        };
        
        golfCourses.push(princessCCData);
        localStorage.setItem('golfCourses', JSON.stringify(golfCourses));
    }
}

// Load saved golf courses from localStorage and JSON files
async function loadSavedGolfCourses() {
    const golfCoursesGrid = document.getElementById('golfCoursesGrid');
    if (!golfCoursesGrid) return;
    
    try {
        // JSON 파일에서 골프장 목록 로드
        const response = await fetch('golf-courses/golf-courses-list.json');
        
        if (response.ok) {
            const data = await response.json();
            
            // 각 골프장에 대해 카드 생성
            for (const courseInfo of data.courses) {
                // 골프장 상세 정보 로드
                const detailResponse = await fetch(`golf-courses/${courseInfo.id}.json`);
                if (detailResponse.ok) {
                    const courseData = await detailResponse.json();
                    
                    const restaurantList = courseData.restaurants.slice(0, 3).map(r => 
                        `<li>${r.name} - ${r.menu}</li>`
                    ).join('');
                    
                    const cardHtml = `
                        <div class="golf-course-card" data-region="${courseData.region}" onclick="location.href='golf-detail.html?id=${courseInfo.id}'">
                            <div class="golf-course-header">
                                <h3 class="golf-course-name">${courseData.name}</h3>
                                <span class="golf-course-location">${courseData.location}</span>
                            </div>
                            <div class="golf-course-preview">
                                <p class="preview-title">추천 맛집 ${courseData.restaurants.length}곳</p>
                                <ul class="preview-list">
                                    ${restaurantList}
                                </ul>
                            </div>
                            <a href="golf-detail.html?id=${courseInfo.id}" class="view-detail-btn">맛집 자세히 보기</a>
                        </div>
                    `;
                    
                    // 기존 카드 앞에 추가
                    const existingCards = golfCoursesGrid.querySelectorAll('.golf-course-card');
                    if (existingCards.length > 0) {
                        existingCards[0].insertAdjacentHTML('beforebegin', cardHtml);
                    } else {
                        golfCoursesGrid.insertAdjacentHTML('beforeend', cardHtml);
                    }
                    
                    // golfRestaurantData에도 추가
                    if (!golfRestaurantData[courseData.region]) {
                        golfRestaurantData[courseData.region] = [];
                    }
                    golfRestaurantData[courseData.region].push({
                        name: courseData.name,
                        keywords: [courseData.name.toLowerCase(), courseData.name.replace(/\s+/g, '')]
                    });
                }
            }
        }
    } catch (error) {
        console.log('JSON 파일 로드 실패, localStorage 사용:', error);
        
        // JSON 파일이 없으면 기존 localStorage 방식 사용
        const savedCourses = JSON.parse(localStorage.getItem('golfCourses') || '[]');
        
        savedCourses.forEach(course => {
            const restaurantList = course.restaurants.map(r => 
                `<li>${r.name} - ${r.menu}</li>`
            ).join('');
            
            const courseId = course.name.toLowerCase()
                .replace(/cc/gi, 'cc')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
                
            const cardHtml = `
                <div class="golf-course-card" data-region="${course.region}" onclick="location.href='golf-detail.html?id=${courseId}'">
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
                    <a href="golf-detail.html?id=${courseId}" class="view-detail-btn">맛집 자세히 보기</a>
                </div>
            `;
            
            // 기존 카드 앞에 추가
            const existingCards = golfCoursesGrid.querySelectorAll('.golf-course-card');
            if (existingCards.length > 0) {
                existingCards[0].insertAdjacentHTML('beforebegin', cardHtml);
            } else {
                golfCoursesGrid.insertAdjacentHTML('beforeend', cardHtml);
            }
            
            // golfRestaurantData에도 추가
            if (!golfRestaurantData[course.region]) {
                golfRestaurantData[course.region] = [];
            }
            golfRestaurantData[course.region].push({
                name: course.name,
                keywords: [course.name.toLowerCase(), course.name.replace(/\s+/g, '')]
            });
        });
    }
}