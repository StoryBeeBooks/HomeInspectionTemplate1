/**
 * TO Inspect Ltd. - Main JavaScript
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
    
    // Determine the correct path based on page location
    const basePath = getBasePath();
    const fullPath = basePath + componentPath;
    
    fetch(fullPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Update relative paths in the loaded HTML
            const updatedHtml = updatePaths(html, basePath);
            placeholder.innerHTML = updatedHtml;
            
            // Initialize navigation after header is loaded
            if (placeholderId === 'header-placeholder') {
                initNavigation();
                setActiveNavLink();
            }
        })
        .catch(error => {
            console.error(`Error loading ${componentPath}:`, error);
            placeholder.innerHTML = `<p style="color: red; padding: 20px;">Error loading component. Please refresh the page.</p>`;
        });
}

/**
 * Get the base path based on current page location
 * @returns {string} Base path to root
 */
function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    
    // Check if we're in a subdirectory (like /chinese/)
    if (path.includes('/chinese/') || path.includes('\\chinese\\')) {
        return '../';
    }
    
    return '';
}

/**
 * Update relative paths in HTML content
 * @param {string} html - HTML content
 * @param {string} basePath - Base path to prepend
 * @returns {string} Updated HTML
 */
function updatePaths(html, basePath) {
    if (!basePath) return html;
    
    // Update href and src attributes that don't start with http, #, or javascript:
    return html
        .replace(/href="(?!http|#|javascript:|mailto:|tel:)([^"]+)"/g, `href="${basePath}$1"`)
        .replace(/src="(?!http|data:)([^"]+)"/g, `src="${basePath}$1"`);
}

/**
 * Initialize mobile navigation toggle
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');
    
    if (navToggle && navMenu) {
        // Remove any existing overlays first to prevent duplicates
        const existingOverlays = document.querySelectorAll('.menu-overlay');
        existingOverlays.forEach(el => el.remove());
        
        // Create single overlay element
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        
        // Function to close menu
        function closeMenu() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Function to open menu
        function openMenu() {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Toggle menu on hamburger button click
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu on X button click
        if (navClose) {
            navClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
        
        // Handle link clicks - close menu but allow navigation
        const navLinks = navMenu.querySelectorAll('.navbar__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't prevent default - allow the link to work
                closeMenu();
            });
        });
        
        // Handle button clicks separately
        const navBtns = navMenu.querySelectorAll('.navbar__actions .btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Don't prevent default - allow the link to work
                closeMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
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
