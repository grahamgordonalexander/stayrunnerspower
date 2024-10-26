// src/public/static/js/login.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Show error messages
  const showError = (element, message) => {
    const errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error')) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  };

  // Clear error messages
  const clearError = (element) => {
    const errorDiv = element.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error')) {
      errorDiv.style.display = 'none';
    }
  };

  // Email validation
  emailInput.addEventListener('input', () => {
    const email = emailInput.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(email)) {
      showError(emailInput, 'Please enter a valid email address');
    } else {
      clearError(emailInput);
    }
  });

  // Password validation
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    
    if (password.length < 8) {
      showError(passwordInput, 'Password must be at least 8 characters');
    } else {
      clearError(passwordInput);
    }
  });

  // Form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        const error = await response.json();
        alert(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  });
});
