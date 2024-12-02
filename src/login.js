const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const popup = document.getElementById('popup');

    loginBtn.addEventListener('click', () => {
      loginForm.parentElement.classList.remove('hidden', 'fade-in');
      registerForm.parentElement.classList.add('hidden');
      setTimeout(() => loginForm.parentElement.classList.add('fade-in'), 10);
      loginBtn.classList.add('text-teal-500', 'font-bold');
      loginBtn.classList.remove('text-gray-500');
      registerBtn.classList.remove('text-teal-500', 'font-bold');
      registerBtn.classList.add('text-gray-500');
    });

    registerBtn.addEventListener('click', () => {
      registerForm.parentElement.classList.remove('hidden', 'fade-in');
      loginForm.parentElement.classList.add('hidden');
      setTimeout(() => registerForm.parentElement.classList.add('fade-in'), 10);
      registerBtn.classList.add('text-teal-500', 'font-bold');
      registerBtn.classList.remove('text-gray-500');
      loginBtn.classList.remove('text-teal-500', 'font-bold');
      loginBtn.classList.add('text-gray-500');
    });

    async function handleSubmit(event, form, url, successMessage, errorMessage) {
      event.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (response.return) {
          showPopup(successMessage, 'success');
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        showPopup(errorMessage, 'error');
        console.error('Error:', error);
      }
    }

    function showPopup(message, type) {
      popup.textContent = message;
      popup.className = `popup ${type}`;
      popup.classList.remove('hidden');
      setTimeout(() => {
        popup.classList.add('hidden');
      }, 3000);
    }

    loginForm.addEventListener('submit', (event) => handleSubmit(event, loginForm, loginForm, 'http://79.175.177.113:21800/User/GetUserToken/', 'Login successful!', 'Login failed!'));
    registerForm.addEventListener('submit', (event) => handleSubmit(event, registerForm, 'http://79.175.177.113:21800/User/ServiceRegister/', 'Registration successful!', 'Registration failed!'));