// ========================================================================
// Optimized JavaScript for All Form Functionality
//
// This script handles:
// 1. Initializing event listeners for multiple forms on page load.
// 2. Custom form validation for required fields, email, and phone numbers.
// 3. Submitting form data to Web3Forms using the fetch API.
// 4. Providing consistent success and error notifications.
// 5. Handling URL parameters for pre-filling form data.
// 6. Formatting phone numbers as the user types.
// 7. Handling newsletter signup.
// ========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all form-related functionality
    initializeForms();
    initializeURLParameters();
    initializeFormValidationStyles();
    initializePhoneFormatting();
});

// Main function to find and initialize all forms
function initializeForms() {
    const forms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');

    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            handleFormSubmit(event, form);
        });

        // Add real-time validation to all inputs
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            input.addEventListener('input', function() {
                // Clear error messages as the user types
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                }
            });
        });
    });
}

// Handles the form submission process
async function handleFormSubmit(event, form) {
    event.preventDefault(); // Prevent default browser submission

    if (validateForm(form)) {
        await submitFormToWeb3Forms(form);
    }
}

// Submits the form data to the Web3Forms API
async function submitFormToWeb3Forms(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state and disable button
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            },
        });

        const data = await response.json();

        if (data.success) {
            showSuccessMessage('Thank you for your message! We\'ll get back to you soon.');
            form.reset(); // Reset form on successful submission
        } else {
            showErrorMessage(data.message || 'Sorry, there was an error sending your message. Please try again.');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showErrorMessage('A network error occurred. Please check your connection and try again.');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// ====================
// Validation Functions
// ====================

// Validates all fields in a given form
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    // Clear all previous errors
    form.querySelectorAll('.error-message').forEach(msg => msg.remove());
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Validates a single field
function validateField(field) {
    const value = field.value.trim();
    
    // Remove existing error for this specific field
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email format validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone format validation
    if (field.type === 'tel' && value) {
        // Simple regex to check for numbers and optional plus sign
        const cleanedValue = value.replace(/\D/g, '');
        const phoneRegex = /^\+?[\d\s-]{10,20}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

// Displays an error message below a form field
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 14px;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// ====================
// UI & Helper Functions
// ====================

// Pre-fills form fields based on URL parameters
function initializeURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const request = urlParams.get('request');
    
    if (request === 'demo') {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.value = 'demo';
        }
        
        const messageTextarea = document.getElementById('message');
        if (messageTextarea && !messageTextarea.value) {
            messageTextarea.value = 'I would like to request a demo of your AUVIT Framework and discuss how it can benefit our organization.';
        }
    }
}

// Adds dynamic validation styles to the document head
function initializeFormValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        .form-group input.valid,
        .form-group select.valid,
        .form-group textarea.valid {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
        }
        .error-message {
            animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .success-message {
            animation: slideInRight 0.3s ease;
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
}

// Displays a success notification
function showSuccessMessage(message) {
    const successDiv = createNotificationDiv('success-message', message, '#10b981');
    document.body.appendChild(successDiv);
    hideNotification(successDiv);
}

// Displays an error notification
function showErrorMessage(message) {
    const errorDiv = createNotificationDiv('error-message', message, '#ef4444');
    document.body.appendChild(errorDiv);
    hideNotification(errorDiv);
}

// Creates a floating notification element
function createNotificationDiv(className, message, bgColor) {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    return div;
}

// Hides a notification after a delay
function hideNotification(element) {
    setTimeout(() => {
        element.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(element)) {
                document.body.removeChild(element);
            }
        }, 300);
    }, 5000);
}

// ====================
// Other Form Logic
// ====================

// Handles phone number formatting on input
function initializePhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
}

function formatPhoneNumber(input) {
    const value = input.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
        if (value.length <= 3) {
            formattedValue = value;
        } else if (value.length <= 6) {
            formattedValue = `${value.slice(0, 3)} ${value.slice(3)}`;
        } else {
            formattedValue = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)}`;
        }
    }
    
    input.value = formattedValue;
}


// Request For Demo Button

function showDemoModal() {
      const existingModal = document.querySelector('.modal-overlay');
      if (existingModal) existingModal.remove();

      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>Request a Demo</h3>
            <button class="modal-close" onclick="closeModal()">×</button>
          </div>
        <form id="demo-form" action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="e9ee7e13-ef42-48c6-a786-3bfa6bb7a495">
  <div class="form-group">
    <label for="name">Your Name</label>
    <input type="text" name="name" id="name" placeholder="Your Name" required>
  </div>
  <div class="form-group">
    <label for="email">Your Email</label>
    <input type="email" name="email" id="email" placeholder="Your Email" required>
  </div>
  <div class="form-group">
    <label for="phone">Phone Number</label>
    <input type="tel" name="phone" id="phone" placeholder="Phone Number" required>
  </div>
  <div class="form-group">
    <label for="product">Select Product</label>
    <select name="product" id="product" required>
      <option value="">Select Product</option>
      <option value="discrete-manufacturing">Live Demo</option>
      <option value="profiteazy-accounting">Internship</option>
      <option value="profiteazy-microfinance">Web Development</option>
      <option value="profiteazy-supplier">Technical Support</option>
      <option value="profiteazy-workshop">Other</option>
    </select>
  </div>
  <div class="form-group">
    <label for="message">Tell us about your requirements</label>
    <textarea name="message" id="message" placeholder="Tell us about your requirements" rows="4"></textarea>
  </div>
  <button type="submit" class="submit-btn">Request Demo</button>
</form>
        </div>
      `;

      document.body.appendChild(modal);

    //   document.getElementById('demo-form').addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     alert('Demo request submitted successfully!');
    //     closeModal();
    //   });
    }



    function closeModal() {
      const modal = document.querySelector('.modal-overlay');
      if (modal) modal.remove();
    }
