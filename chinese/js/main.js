/**
 * TO Inspect Ltd. - Main JavaScript (Chinese Version)
 * Component Loader & Site Functionality
 */

// Component Loader - Loads header and footer into pages
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header-placeholder', 'components/header.html');
    loadComponent('footer-placeholder', 'components/footer.html');
});

/**
 * Load HTML component into placeholder element
 * @param {string} placeholderId - ID of the placeholder element
 * @param {string} componentPath - Path to the component HTML file
 */
function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    
    if (!placeholder) return;
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;
            
            // Initialize navigation after header is loaded
            if (placeholderId === 'header-placeholder') {
                initNavigation();
                setActiveNavLink();
            }
        })
        .catch(error => {
            console.error(`Error loading ${componentPath}:`, error);
            placeholder.innerHTML = `<p style="color: red; padding: 20px;">加载组件时出错，请刷新页面。</p>`;
        });
}

/**
 * Initialize mobile navigation toggle
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.navbar__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

/**
 * Set active class on current page's navigation link
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar__link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

/**
 * Form validation helper
 * @param {HTMLFormElement} form - Form element to validate
 * @returns {boolean} Whether form is valid
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

/**
 * Blog/Article filtering functionality
 * @param {string} category - Category to filter by
 */
function filterBlogPosts(category) {
    const posts = document.querySelectorAll('.blog-card');
    
    posts.forEach(post => {
        const postCategory = post.dataset.category;
        
        if (category === 'all' || postCategory === category) {
            post.style.display = 'block';
            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, 100);
        } else {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            setTimeout(() => {
                post.style.display = 'none';
            }, 300);
        }
    });
    
    // Update active filter button
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
}
