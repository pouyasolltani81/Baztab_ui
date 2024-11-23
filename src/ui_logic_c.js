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




// Toggle active tab (Create Category / Find Category)
    document.getElementById('createCategoryBtn').addEventListener('click', function() {
      document.getElementById('createCategoryContent').classList.remove('hidden');
      document.getElementById('findCategoryContent').classList.add('hidden');
      document.getElementById('createCategoryBtn').classList.add('text-teal-600');
      document.getElementById('findCategoryBtn').classList.remove('text-teal-600');
    });

    document.getElementById('findCategoryBtn').addEventListener('click', function() {
      document.getElementById('findCategoryContent').classList.remove('hidden');
      document.getElementById('createCategoryContent').classList.add('hidden');
      document.getElementById('findCategoryBtn').classList.add('text-teal-600');
      document.getElementById('createCategoryBtn').classList.remove('text-teal-600');
    });




// Toggle active tab (Create Category / Find Category)
    document.getElementById('createCategoryBtnMobile').addEventListener('click', function() {
      document.getElementById('createCategoryContent').classList.remove('hidden');
      document.getElementById('findCategoryContent').classList.add('hidden');
      document.getElementById('createCategoryBtnMobile').classList.add('text-teal-600');
      document.getElementById('findCategoryBtnMobile').classList.remove('text-teal-600');
    });

    document.getElementById('findCategoryBtnMobile').addEventListener('click', function() {
      document.getElementById('findCategoryContent').classList.remove('hidden');
      document.getElementById('createCategoryContent').classList.add('hidden');
      document.getElementById('findCategoryBtnMobile').classList.add('text-teal-600');
      document.getElementById('createCategoryBtnMobile').classList.remove('text-teal-600');
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

    // document.getElementById('closeRegisterModal').addEventListener('click', function() {
    //   document.getElementById('registerModal').classList.add('hidden');
    // });

    
    // // Product Modal
    // document.getElementById('productBtn').addEventListener('click', function() {
    //   document.getElementById('productModal').classList.remove('hidden');
    // });

    // document.getElementById('closeProductModal').addEventListener('click', function() {
    //   document.getElementById('productModal').classList.add('hidden');
    // });


    
    document.getElementById('hamburgerMenuBtn').addEventListener('click', function() {
  const mobileMenu = document.getElementById('mobileMenu');
  const laptopAuth = document.getElementById('AUTH_BUTTONS_MAIN');

  mobileMenu.classList.toggle('hidden'); // Toggle the visibility of the mobile menu
  laptopAuth.classList.toggle('hidden'); // Toggle the visibility of the mobile menu

});