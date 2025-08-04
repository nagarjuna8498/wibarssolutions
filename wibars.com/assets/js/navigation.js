// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDropdowns();
    initializeMegaMenu();
    initializeActiveStates();
});

function initializeNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    
    // Add keyboard navigation support
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
    
    // Add ARIA attributes
    navLinks.forEach(link => {
        if (link.classList.contains('dropdown-toggle')) {
            link.setAttribute('aria-haspopup', 'true');
            link.setAttribute('aria-expanded', 'false');
        }
    });
}

function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        let closeTimeout;
        
        // Mouse events
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(closeTimeout);
            openDropdown(dropdown, toggle, menu);
        });
        
        dropdown.addEventListener('mouseleave', function() {
            closeTimeout = setTimeout(() => {
                closeDropdown(dropdown, toggle, menu);
            }, 100);
        });
        
        // Keyboard events
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(dropdown, toggle, menu);
            } else if (e.key === 'Escape') {
                closeDropdown(dropdown, toggle, menu);
            }
        });
        
        // Click events for mobile
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggleDropdown(dropdown, toggle, menu);
            }
        });
    });
}

function initializeMegaMenu() {
    const megaDropdowns = document.querySelectorAll('.mega-dropdown');
    
    megaDropdowns.forEach(megaDropdown => {
        const toggle = megaDropdown.querySelector('.dropdown-toggle');
        const menu = megaDropdown.querySelector('.mega-menu');
        
        if (!toggle || !menu) return;
        
        let closeTimeout;
        
        // Mouse events
        megaDropdown.addEventListener('mouseenter', function() {
            clearTimeout(closeTimeout);
            openMegaMenu(megaDropdown, toggle, menu);
        });
        
        megaDropdown.addEventListener('mouseleave', function() {
            closeTimeout = setTimeout(() => {
                closeMegaMenu(megaDropdown, toggle, menu);
            }, 100);
        });
        
        // Keyboard events
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMegaMenu(megaDropdown, toggle, menu);
            } else if (e.key === 'Escape') {
                closeMegaMenu(megaDropdown, toggle, menu);
            }
        });
        
        // Click events for mobile
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggleMegaMenu(megaDropdown, toggle, menu);
            }
        });
    });
}

function openDropdown(dropdown, toggle, menu) {
    menu.style.opacity = '1';
    menu.style.visibility = 'visible';
    menu.style.transform = 'translateY(0)';
    toggle.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('active');
}

function closeDropdown(dropdown, toggle, menu) {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
    toggle.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('active');
}

function toggleDropdown(dropdown, toggle, menu) {
    if (dropdown.classList.contains('active')) {
        closeDropdown(dropdown, toggle, menu);
    } else {
        openDropdown(dropdown, toggle, menu);
    }
}

function openMegaMenu(megaDropdown, toggle, menu) {
    menu.style.opacity = '1';
    menu.style.visibility = 'visible';
    menu.style.transform = 'translateY(0)';
    toggle.setAttribute('aria-expanded', 'true');
    megaDropdown.classList.add('active');
}

function closeMegaMenu(megaDropdown, toggle, menu) {
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
    toggle.setAttribute('aria-expanded', 'false');
    megaDropdown.classList.remove('active');
}

function toggleMegaMenu(megaDropdown, toggle, menu) {
    if (megaDropdown.classList.contains('active')) {
        closeMegaMenu(megaDropdown, toggle, menu);
    } else {
        openMegaMenu(megaDropdown, toggle, menu);
    }
}

function initializeActiveStates() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });
}

// Mobile navigation specific functions
function initializeMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileToggle || !mobileMenu) return;
    
    // Close menu when clicking on links
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Keyboard navigation for mobile menu
    mobileMenu.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
            mobileToggle.focus();
        }
    });
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileToggle) {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
    }
}

// Search functionality (if needed)
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchInput || !searchResults) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
    
    function performSearch(query) {
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        // Implement search logic here
        // This could search through page content, products, etc.
        const results = searchContent(query);
        displaySearchResults(results);
    }
    
    function searchContent(query) {
        // Simple content search implementation
        const searchableContent = [
            { title: 'AUVIT Framework', url: 'index.html#auvit', description: 'Advanced Unified Versatile Integration Technology' },
            { title: 'Products', url: 'products.html', description: 'Our comprehensive product suite' },
            { title: 'Solutions', url: 'solutions.html', description: 'Industry-specific solutions' },
            { title: 'Contact Us', url: 'contact.html', description: 'Get in touch with our team' }
        ];
        
        return searchableContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }
        
        const resultsHTML = results.map(result => `
            <div class="search-result">
                <a href="${result.url}">
                    <h4>${result.title}</h4>
                    <p>${result.description}</p>
                </a>
            </div>
        `).join('');
        
        searchResults.innerHTML = resultsHTML;
    }
}

// Breadcrumb functionality
function initializeBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    if (!breadcrumbContainer) return;
    
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part);
    
    let breadcrumbHTML = '<a href="index.html">Home</a>';
    
    pathParts.forEach((part, index) => {
        const pageName = part.replace('.html', '').replace(/[-_]/g, ' ');
        const capitalizedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        
        if (index === pathParts.length - 1) {
            breadcrumbHTML += ` <span class="separator">/</span> <span class="current">${capitalizedName}</span>`;
        } else {
            const url = pathParts.slice(0, index + 1).join('/');
            breadcrumbHTML += ` <span class="separator">/</span> <a href="${url}">${capitalizedName}</a>`;
        }
    });
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Initialize all navigation components
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileNavigation();
    initializeSearch();
    initializeBreadcrumbs();
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Reset dropdown states on resize
    const activeDropdowns = document.querySelectorAll('.dropdown.active, .mega-dropdown.active');
    activeDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
});