


// Function to toggle the mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('open');

    // Optional: Close all submenus when the main menu is closed
    if (!mobileMenu.classList.contains('open')) {
        closeAllSubmenus();
    }
}

// Function to close all submenus and reset icons
function closeAllSubmenus() {
    document.querySelectorAll('.mobile-nav-menu .submenu').forEach(submenu => {
        submenu.style.maxHeight = '0px';
        const icon = submenu.previousElementSibling.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        }
    });
}

// Function to toggle submenus with a click event
function toggleSubMenu(event) {
    // Prevent the default link behavior
    event.preventDefault();

    // Use event.currentTarget to reliably get the <a> tag
    const menuItem = event.currentTarget;
    const submenu = menuItem.nextElementSibling;
    const icon = menuItem.querySelector('i');

    // Guard clause: do nothing if the submenu or icon is not found
    if (!submenu || !icon) {
        return;
    }

    // Check if the current submenu is already open
    const isSubmenuOpen = submenu.style.maxHeight !== '0px';

    if (isSubmenuOpen) {
        // If it's open, close it
        submenu.style.maxHeight = '0px';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    } else {
        // If it's closed, first close all other open submenus
        closeAllSubmenus();

        // Then open the current submenu with a smooth sliding effect
        submenu.style.maxHeight = `${submenu.scrollHeight}px`;
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    }
}

// Close the mobile menu when clicking outside of it
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const gridIcon = document.querySelector('.grid-icon');

    // Check if the click is outside the menu AND outside the grid icon
    if (
        !mobileMenu.contains(event.target) &&
        !gridIcon.contains(event.target) &&
        mobileMenu.classList.contains('open')
    ) {
        mobileMenu.classList.remove('open');
        closeAllSubmenus();
    }
});

// Initialize menu on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update grid icon to the requested style
    const gridIcon = document.querySelector('.grid-icon i');
    if (gridIcon) {
        // Change from fa-th-large or other to fa-th
        gridIcon.classList.remove('fa-th-large'); // Remove old class if present
        gridIcon.classList.remove('fa-grip-lines'); // Remove old class if present
        gridIcon.classList.add('fa-th'); // Add the new class
    }

    // Remove the inline `onclick` attributes from the HTML
    // and add event listeners programmatically for better practice
    const menuItems = document.querySelectorAll('.mobile-nav-menu > li > a');
    menuItems.forEach(item => {
        // Check if the item has a submenu
        if (item.nextElementSibling && item.nextElementSibling.classList.contains('submenu')) {
            // Remove the inline onclick attribute to avoid double-firing
            item.removeAttribute('onclick');
            // Add a click event listener
            item.addEventListener('click', toggleSubMenu);
        }
    });

    // Initialize submenu styles (already in your CSS, but good to double-check)
    const submenus = document.querySelectorAll('.mobile-nav-menu .submenu');
    submenus.forEach(submenu => {
        submenu.style.maxHeight = '0px';
    });
});

// Close mobile menu when a submenu item is clicked
const submenuLinks = document.querySelectorAll('.mobile-nav-menu .submenu a');
submenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.remove('open');
        closeAllSubmenus();
    });
});
