
const pageNumberElement = document.getElementById("pageNumber");
const productNameElement = document.getElementById("productName");
const productCountElement = document.getElementById("productCount");
const productCardsContainer = document.getElementById("productCards");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const itemsPerPageSelector = document.getElementById("itemsPerPage");
const jumpToPageInput = document.getElementById("jumpToPage");
const goToPageButton = document.getElementById("goToPage");
const searchInput = document.getElementById("searchInput");
const sortBySelect = document.getElementById("sortBySelect");
const reverseSortButton = document.getElementById("reverseSortButton");

let localJsonData = {}; // To hold the loaded JSON data
let currentPage = 1;    // Initialize currentPage to 1
let itemsPerPage = 10;  // Set default items per page
let totalProducts = 0;  // Initialize totalProducts
let totalPages = 0;     // Initialize totalPages
let searchQuery = '';   // Global search query
let sortType = 'name';  // Default sort type (by name)
let sortOrder = 'asc';  // Default sort order (ascending)

// Fetch the initial data from localStorage or use API to get it.
function loadLocalJsonData() {
  const productData = JSON.parse(localStorage.getItem('productResponse'));
  if (productData) {
    localJsonData = productData;
    totalProducts = localJsonData.data.total_count;
    totalPages = Math.ceil(totalProducts / itemsPerPage);
    updatePageUI();
  } else {
    // If no local data, fetch from API (for the initial load or first page)
    fetchInitialData();
  }
}

// Initial data fetch from API (for first load)
function fetchInitialData() {
  const data = {
    category_name_fa: 'کرم پودر', // Example category, replace as needed
    page: currentPage,
    page_limit: itemsPerPage,
  };

  fetch('http://79.175.177.113:21800/Products/get_products_paginated/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept-Version": 1,
      'Accept': "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
      'authorization': 'user_token_here', // Replace with actual user token
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('productResponse', JSON.stringify(data)); // Save to localStorage
    localJsonData = data;
    totalProducts = localJsonData.data.total_count;
    totalPages = Math.ceil(totalProducts / itemsPerPage);
    updatePageUI();
  })
  .catch(err => console.error('Error fetching initial data:', err));
}

// Call loadLocalJsonData when the page loads
window.onload = loadLocalJsonData;

// Function to update the page UI based on current page and items per page
function updatePageUI() {
  if (!localJsonData.data) return;

  pageNumberElement.textContent = `صفحه: ${currentPage}`;
  productCountElement.textContent = `نمایش صفحه: ${itemsPerPage} از ${totalProducts}`;

  // Disable prev/next buttons if at the beginning/end
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;

  // Update the product list from local data or API
  fetchLocalData(currentPage, itemsPerPage, searchQuery, sortType, sortOrder);
}

// Function to simulate fetching data from local JSON or API
function fetchLocalData(page, limit, search, type, order) {
  if (!localJsonData.data) return; // Prevent errors if data hasn't been loaded yet

  let products = localJsonData.data.result;

  // Apply search filter
  if (search) {
    products = products.filter(product =>
      product.product_name_fa.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort based on the current sort type and order
  if (type === 'name') {
    products.sort((a, b) => order === 'asc'
      ? a.product_name_fa.localeCompare(b.product_name_fa)
      : b.product_name_fa.localeCompare(a.product_name_fa));
  } else if (type === 'price') {
    products.sort((a, b) => order === 'asc'
      ? parseFloat(a.price_stat.avg) - parseFloat(b.price_stat.avg)
      : parseFloat(b.price_stat.avg) - parseFloat(a.price_stat.avg));
  }

  // Slice products to simulate pagination
  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + limit);

  createProductCards(paginatedProducts);
}

// Function to create product cards
function createProductCards(products) {
  productCardsContainer.innerHTML = ''; // پاک کردن کارت‌های قبلی

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "bg-white shadow-lg rounded-lg p-6 border transition-transform transform hover:scale-105 hover:shadow-2xl";

    // وضعیت موجودی
    const availability = document.createElement("div");
    availability.className = "mb-2";
    availability.innerHTML = `<span class="text-sm ${product.is_available ? 'text-green-600' : 'text-red-600'} font-semibold">${product.is_available ? 'موجود' : 'تمام شده'}</span>`;

    // نام محصول
    const productName = document.createElement("h3");
    productName.className = "text-md font-semibold text-gray-800 mb-2";
    productName.textContent = product.product_name_fa;

    // شناسه محصول
    const productId = document.createElement("p");
    productId.className = "text-sm text-gray-500 mb-2";
    productId.textContent = `شناسه: ${product._id}`;

    // URL استخراج شده
    const productUrl = document.createElement("p");
    productUrl.className = "text-sm text-gray-400 mb-2";
    productUrl.innerHTML = `URL استخراج شده: <a href="${product.scrape_url}" target="_blank" class="text-blue-500 hover:text-blue-700">${product.scrape_url}</a>`;

    // قیمت (میانگین قیمت)، چک کردن اینکه price_stat موجود باشد
    const price = document.createElement("p");
    price.className = "text-lg font-semibold text-gray-800 mb-4";
    if (product.price_stat && product.price_stat.avg) {
      price.textContent = `قیمت: تومان${(parseFloat(product.price_stat.avg) / 100).toFixed(2)}`; // نمایش قیمت به صورت عدد قالب‌بندی شده (تبدیل از عدد صحیح)
    } else {
      price.textContent = "قیمت: موجود نیست"; // در صورت نبود قیمت
    }

    // دکمه‌های عمل
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex justify-between items-center mt-4 gap-4";

    // دکمه به‌روزرسانی محصول
    const updateButton = document.createElement("button");
    updateButton.className = "text-teal-600 hover:text-teal-800 text-sm px-4 py-2 border border-teal-600 rounded-md transition-all duration-200";
    updateButton.textContent = "به‌روزرسانی محصول";

    // دکمه مشاهده جزئیات کامل
    const detailButton = document.createElement("button");
    detailButton.className = "text-blue-600 hover:text-blue-800 text-sm px-4 py-2 border border-blue-600 rounded-md transition-all duration-200";
    detailButton.textContent = "مشاهده جزئیات کامل";

    // افزودن دکمه‌ها به کارت
    buttonsContainer.appendChild(updateButton);
    buttonsContainer.appendChild(detailButton);

    card.appendChild(availability);
    card.appendChild(productName);
    card.appendChild(productId);
    card.appendChild(productUrl);
    card.appendChild(price);
    card.appendChild(buttonsContainer);

    // افزودن کارت به بخش کارت‌های محصولات
    productCardsContainer.appendChild(card);
  });
}

// Event listeners for pagination controls
prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updatePageUI();
  }
});

nextPageButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    updatePageUI();
  }
});

// Event listener for the items per page selector
itemsPerPageSelector.addEventListener("change", (e) => {
  itemsPerPage = parseInt(e.target.value);
  totalPages = Math.ceil(totalProducts / itemsPerPage);
  updatePageUI();
});

// Event listener for the "Jump to Page" functionality
goToPageButton.addEventListener("click", () => {
  const targetPage = parseInt(jumpToPageInput.value);
  if (targetPage >= 1 && targetPage <= totalPages) {
    currentPage = targetPage;
    updatePageUI();
  }
});

// Event listener for search input
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  updatePageUI();
});

// Event listener for sort selection
sortBySelect.addEventListener("change", (e) => {
  sortType = e.target.value;
  updatePageUI();
});

// Event listener for reverse sort button
reverseSortButton.addEventListener("click", () => {
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  updatePageUI();
});






/////////////////////////////////////////////////////////////////////////////////////////////////////

// Render the table for categories and subcategories
function renderTable(responseData) {
  const categoryTableBody = document.getElementById('categoryTableBody');
  const categoryTableHeader = document.getElementById('categoryTableHeader');
  categoryTableBody.innerHTML = '';
  categoryTableHeader.innerHTML = '';

  // Find the selected top-level category by its name_fa (currentCategory)
  let selectedCategory = null;

  // Loop through the categories and check if the main category matches currentCategory
  Object.values(responseData.data).forEach(category => {
      Object.values(category).forEach(mainCategory => {
          if (mainCategory.name_fa === currentCategory) {
              selectedCategory = mainCategory;
          }
      });
  });

  console.log('Selected Category:', selectedCategory); // Log the selected category

  if (!selectedCategory) {
      console.log('Category not found for', currentCategory); // Log if the selected category is not found
      return; // If category not found, exit
  }

  const subcategories = selectedCategory.level_2 || []; // Get the second level subcategories

  console.log('Subcategories:', subcategories); // Log subcategories for debugging
  console.log(subcategories.some(sub => sub.level_3) );

  // Render the header row based on the subcategory levels (dynamic number of columns)
  categoryTableHeader.innerHTML = `
      <th class="py-2 px-4 text-left text-lg font-medium text-center">دسته بندی</th>
      <th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 2</th>
      ${subcategories.some(sub => sub.level_3) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 3</th>' : ''}
      ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.length)) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 4</th>' : ''}
      ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.some(l4 => l4.level_5?.length))) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 5</th>' : ''}
      ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.some(l4 => l4.level_5?.some(l5 => l5.level_6?.length)))) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 6</th>' : ''}
      ${subcategories.some(sub => sub.level_7) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 7</th>' : ''}
      ${subcategories.some(sub => sub.level_8) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 8</th>' : ''}
      ${subcategories.some(sub => sub.level_9) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 9</th>' : ''}
      ${subcategories.some(sub => sub.level_10) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 10</th>' : ''}
  `;

  // Render the rows for each subcategory
  subcategories.forEach(subcategory => {
      // Level 3
let level3Subcategories = subcategory.level_3 || [];
let level4Subcategories = [];
let level5Subcategories = [];
let level6Subcategories = [];

console.log("Level 3 Subcategories:", level3Subcategories);

// Process Level 3
level3Subcategories.forEach(level3 => {
  // Level 4
  if (level3?.level_4?.length) {
      level4Subcategories.push(...level3.level_4);
  }
});

console.log("Level 4 Subcategories:", level4Subcategories);

// Process Level 4
level4Subcategories.forEach(level4 => {
  // Level 5
  if (level4?.level_5?.length) {
      level5Subcategories.push(...level4.level_5);
  }
});

console.log("Level 5 Subcategories:", level5Subcategories);

// Process Level 5
level5Subcategories.forEach(level5 => {
  // Level 6
  if (level5?.level_6?.length) {
      level6Subcategories.push(...level5.level_6);
  }
});

console.log("Level 6 Subcategories:", level6Subcategories);

// Ensure variables are empty lists if levels are missing
if (!subcategory.level_3) {
  level3Subcategories = [];
  console.log("No Level 3 Subcategories. Created an empty list.");
}
if (!level4Subcategories.length) {
  level4Subcategories = [];
  console.log("No Level 4 Subcategories. Created an empty list.");
}
if (!level5Subcategories.length) {
  level5Subcategories = [];
  console.log("No Level 5 Subcategories. Created an empty list.");
}
if (!level6Subcategories.length) {
  level6Subcategories = [];
  console.log("No Level 6 Subcategories. Created an empty list.");
}

      const level7Subcategories = subcategory?.level_3?.level_4?.level_5?.level_6?.level_7 || [];
      const level8Subcategories = subcategory?.level_3?.level_4?.level_5?.level_6?.level_7?.level_8 || [];
      const level9Subcategories = subcategory?.level_3?.level_4?.level_5?.level_6?.level_7?.level_8?.level_9 || [];
      const level10Subcategories = subcategory?.level_3?.level_4?.level_5?.level_6?.level_7?.level_8?.level_9?.level_10 || [];
     
      console.log('testtttttttt' , level4Subcategories.length , level4Subcategories);
      
      categoryTableBody.innerHTML += `
          <tr class="border-b">
              <td class="py-2 px-4 font-semibold text-md">${currentCategory}</td>
              <td class="py-2 px-4">${renderSubcategories([subcategory], 2)}</td>
              ${level3Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level3Subcategories, 3)}</td>` : ''}
              ${level4Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level4Subcategories, 4)}</td>` : ''}
              ${level5Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level5Subcategories, 5)}</td>` : ''}
              ${level6Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level6Subcategories, 6)}</td>` : ''}
              ${level7Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level7Subcategories, 7)}</td>` : ''}
              ${level8Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level8Subcategories, 8)}</td>` : ''}
              ${level9Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level9Subcategories, 9)}</td>` : ''}
              ${level10Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level10Subcategories, 10)}</td>` : ''}
          </tr>
      `;
  });
}