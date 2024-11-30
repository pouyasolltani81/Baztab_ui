// Function to show loading overlay
    function showLoader(asyncOperation) {
      // Create and append the overlay with the spinner
      const overlay = document.createElement('div');
      overlay.classList.add('loading-overlay');
      overlay.innerHTML = `
        <div class="spinner">
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Perform the async operation and hide the loader when done
      asyncOperation().finally(() => {
        // Remove the overlay after the operation is done
        overlay.remove();
      });
    }

   



    // // Login Modal
    // document.getElementById('loginBtn').addEventListener('click', function() {
    //   document.getElementById('loginModal').classList.remove('hidden');
    // });

    // document.getElementById('closeLoginModal').addEventListener('click', function() {
    //   document.getElementById('loginModal').classList.add('hidden');
    // });

    // // Register Modal
    // document.getElementById('registerBtn').addEventListener('click', function() {
    //   document.getElementById('registerModal').classList.remove('hidden');
    // });

    // document.getElementById('closeRegisterModal').addEventListener('click', function() {
    //   document.getElementById('registerModal').classList.add('hidden');
    // });

    // // Back Button
    // document.getElementById('BackToCategory').addEventListener('click', function() {
    //   window.location.href = "./index.html";
    // });
    






//     document.getElementById('hamburgerMenuBtn').addEventListener('click', function() {
//   const mobileMenu = document.getElementById('mobileMenu');
//   const laptopAuth = document.getElementById('AUTH_BUTTONS_MAIN');

//   mobileMenu.classList.toggle('hidden'); // Toggle the visibility of the mobile menu
//   laptopAuth.classList.toggle('hidden'); // Toggle the visibility of the mobile menu

// });
