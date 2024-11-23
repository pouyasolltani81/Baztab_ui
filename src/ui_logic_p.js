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

    // Example of an asynchronous operation (fetching or simulating an API call)
    function pageInitialization() {
      return new Promise(resolve => {
        setTimeout(() => {
          // Simulate loading process (e.g., fetching data)
          resolve('Page Loaded');
        }, 2000); // Simulating a 2-second load time
      });
    }

    // Start loading and use `showLoader` to show the spinner
    window.addEventListener('load', function() {
      showLoader(async function() {
        await pageInitialization();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
      });
    });




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

    document.getElementById('closeRegisterModal').addEventListener('click', function() {
      document.getElementById('registerModal').classList.add('hidden');
    });

    // Back Button
    document.getElementById('BackToCategory').addEventListener('click', function() {
      window.location.href = "./index.html";
    });
    






//     document.getElementById('hamburgerMenuBtn').addEventListener('click', function() {
//   const mobileMenu = document.getElementById('mobileMenu');
//   const laptopAuth = document.getElementById('AUTH_BUTTONS_MAIN');

//   mobileMenu.classList.toggle('hidden'); // Toggle the visibility of the mobile menu
//   laptopAuth.classList.toggle('hidden'); // Toggle the visibility of the mobile menu

// });
