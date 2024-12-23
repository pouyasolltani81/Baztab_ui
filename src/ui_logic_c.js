

    // // Example of an asynchronous operation (fetching or simulating an API call)
    // function pageInitialization() {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       // Simulate loading process (e.g., fetching data)
    //       resolve('Page Loaded');
    //     }, 2000); // Simulating a 2-second load time
    //   });
    // }

    // // Start loading and use `showLoader` to show the spinner
    // window.addEventListener('load', function() {
    //   showLoader(async function() {
    //     await pageInitialization();  // Simulate page load logic
    //     document.getElementById('mainContent').classList.remove('hidden'); // Show main content
    //   });
    // });




// Toggle active tab (Create Category / Find Category)
    document.getElementById('createCategoryBtn').addEventListener('click', function() {
      document.getElementById('createCategoryContent').innerHTML = '';
      document.getElementById('second_container_for_create').innerHTML = `
  <!-- Create Category Section -->
  <div id="createCategoryContent" class="max-w-7xl mx-auto pt-20 px-6 scale-y-0 transition">

    <div id="createCategoryContent">
      <div class="flex gap-4">
        <h2 class="text-2xl font-semibold p-2">ایجاد دسته‌بندی</h2>
        <div class="border-2 border-teal-400 bg-teal-100 text-teal-600 font-semibold p-2 text-center rounded-lg cursor-pointer hover:shadow-lg transition" id="selectcategorytype_parent"> دسته والد</div>
        <div class="border-2 border-gray-400 bg-gray-100 text-gray-600 font-semibold p-2 text-center rounded-lg cursor-pointer hover:shadow-lg transition" id="selectcategorytype_child"> زیر دسته</div>

      </div>
      
      
      <!-- Create Category Form -->
      <form id="createCategoryForm" class="space-y-4">
        <div>
          <label for="name_fa" class="block text-gray-700 p-4">نام دسته‌بندی (فارسی)</label>
          <input type="text" id="name_fa" name="name_fa" class="w-full p-3 border rounded-lg" placeholder="نام فارسی دسته‌بندی" required>
        </div>
        
        <div>
          <label for="name" class="block text-gray-700 p-4">نام دسته‌بندی</label>
          <input type="text" id="name" name="name" class="w-full p-3 border rounded-lg" placeholder="نام دسته‌بندی" >
        </div>
        
        <div id="parent_id_container" class="scale-y-0 transition">
          <label for="parent_id" class="block text-gray-700 p-4">شناسه دسته‌بندی والد</label>
          <input type="text" id="parent_id" name="parent_id" class="w-full p-3 border rounded-lg" placeholder="شناسه دسته‌بندی والد " >
        </div>

        <div class="flex justify-center">
          <button type="button" id="creat_category_button" class="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 w-full opacity-0 transition">ایجاد دسته‌بندی</button>
        </div>
      </form>
    </div>

  </div>
  </div>`
      document.getElementById('second_container_for_create').classList.remove('scale-y-0');
      document.getElementById('findCategoryContent').classList.add('scale-y-0');
      document.getElementById('createCategoryBtn').classList.add('text-teal-600');
      document.getElementById('findCategoryBtn').classList.remove('text-teal-600');
    });

    document.getElementById('findCategoryBtn').addEventListener('click', function() {
      document.getElementById('second_container_for_create').innerHTML = ''
      document.getElementById('createCategoryContent').innerHTML = `
  <!-- Create Category Section -->
  <div id="createCategoryContent" class="max-w-7xl mx-auto pt-20 px-6 scale-y-0 transition">

    <div id="createCategoryContent">
      <div class="flex gap-4">
        <h2 class="text-2xl font-semibold p-2">ایجاد دسته‌بندی</h2>
        <div class="border-2 border-teal-400 bg-teal-100 text-teal-600 font-semibold p-2 text-center rounded-lg cursor-pointer hover:shadow-lg transition" id="selectcategorytype_parent"> دسته والد</div>
        <div class="border-2 border-gray-400 bg-gray-100 text-gray-600 font-semibold p-2 text-center rounded-lg cursor-pointer hover:shadow-lg transition" id="selectcategorytype_child"> زیر دسته</div>

      </div>
      
      
      <!-- Create Category Form -->
      <form id="createCategoryForm" class="space-y-4">
        <div>
          <label for="name_fa" class="block text-gray-700 p-4">نام دسته‌بندی (فارسی)</label>
          <input type="text" id="name_fa" name="name_fa" class="w-full p-3 border rounded-lg" placeholder="نام فارسی دسته‌بندی" required>
        </div>
        
        <div>
          <label for="name" class="block text-gray-700 p-4">نام دسته‌بندی</label>
          <input type="text" id="name" name="name" class="w-full p-3 border rounded-lg" placeholder="نام دسته‌بندی" >
        </div>
        
        <div id="parent_id_container" class="scale-y-0 transition">
          <label for="parent_id" class="block text-gray-700 p-4">شناسه دسته‌بندی والد</label>
          <input type="text" id="parent_id" name="parent_id" class="w-full p-3 border rounded-lg" placeholder="شناسه دسته‌بندی والد " >
        </div>

        <div class="flex justify-center">
          <button type="button" id="creat_category_button" class="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 w-full opacity-0 transition">ایجاد دسته‌بندی</button>
        </div>
      </form>
    </div>

  </div>
  </div>`
      document.getElementById('findCategoryContent').classList.remove('scale-y-0');
      document.getElementById('createCategoryContent').classList.add('scale-y-0');
      document.getElementById('findCategoryBtn').classList.add('text-teal-600');
      document.getElementById('createCategoryBtn').classList.remove('text-teal-600');
    });




// Toggle active tab (Create Category / Find Category)
    document.getElementById('createCategoryBtnMobile').addEventListener('click', function() {
      document.getElementById('createCategoryContent').classList.remove('scale-y-0');
      document.getElementById('findCategoryContent').classList.add('scale-y-0');
      document.getElementById('createCategoryBtnMobile').classList.add('text-teal-600');
      document.getElementById('findCategoryBtnMobile').classList.remove('text-teal-600');
    });

    document.getElementById('findCategoryBtnMobile').addEventListener('click', function() {
      document.getElementById('findCategoryContent').classList.remove('scale-y-0');
      document.getElementById('createCategoryContent').classList.add('scale-y-0');
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