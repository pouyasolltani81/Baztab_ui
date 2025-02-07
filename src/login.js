const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const failed = document.getElementById('failed');
const success = document.getElementById('success');
const S_title = document.getElementById('S_title');
const S_message = document.getElementById('S_message');
const F_title = document.getElementById('F_title');
const F_message = document.getElementById('F_message');
const logincon = document.getElementById('form-container')

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

async function handleSubmit(event, form, url ,type) {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    logincon.classList.add('hidden')
    if (result.return){
        success.classList.remove('hidden');
       
        if (type == 'login'){
            S_title.innerHTML = "ورود"
            // document.getElementById('S_retry').classList.add('hidden')

            const data2 = {
                user_token: result.user_token,
                username: result.username ,
                
            };
            console.log(data2)
            
            sessionStorage.setItem('user_data', JSON.stringify(data2));  
            window.location.href = '/category.html';

        } else {
            S_title.innerHTML = 'ثبت‌نام'
            // document.getElementById('S_retry').classList.remove('hidden')
        }

        S_message.innerHTML = result.message
         
    } else {
        failed.classList.remove('hidden');

        if (type == 'login'){
            F_title.innerHTML = "ورود"
        } else {
            F_title.innerHTML = 'ثبت‌نام'
        }

        F_message.innerHTML = result.error
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

function closepopup(type) {
    if (type == 'S') {
        logincon.classList.remove('hidden')
        success.classList.add('hidden');

    } else {
        failed.classList.add('hidden');
        logincon.classList.remove('hidden');
    }
}

loginForm.addEventListener('submit', (event) => handleSubmit(event, loginForm, 'http://79.175.177.113:21800/User/GetUserToken/','login'));
registerForm.addEventListener('submit', (event) => handleSubmit(event, registerForm, 'http://79.175.177.113:21800/User/ServiceRegister/','register'));
