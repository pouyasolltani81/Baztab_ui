const user_token = '9fc0fe536ea09fed645f9f791fc15e65';
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
    currentPage = localJsonData.page;
    itemsPerPage = localJsonData.page_limit
    // totalPages = Math.ceil(totalProducts / itemsPerPage);
    // If no local data, fetch from API (for the initial load or first page)
    console.log(localJsonData)
    fetchInitialData(localJsonData);
  }
}


function navigationdata(page_n,limit){

   const productData = JSON.parse(localStorage.getItem('productResponse'));
    let data = {
      category_name_fa: productData.category_name_fa,
      page: page_n,
      page_limit: limit
    };
   
  fetchInitialData(data);
}
// Initial data fetch from API (for first load)
async function fetchInitialData(data) {
  showLoader(async function() {
        await pageInitialization();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
      });
      
  await fetch('http://79.175.177.113:21800/Products/get_products_paginated/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Accept-Version": 1,
      'Accept': "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
      'authorization': user_token, 
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
 
    localJsonData = data;
    totalProducts = localJsonData.data.total_count;
    console.log(localJsonData)
    totalPages = Math.ceil(totalProducts / itemsPerPage);
    updatePageUI();
  })
  .catch(err => console.error('Error fetching initial data:', err));
}


// Simulate the loading process with a 2-second delay
function pageInitialization() {
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate a 2-second load time (e.g., fetching data)
      resolve('Page Loaded');
    }, 2000);
  });
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
  // console.log(products)

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
  const startIndex = (1 - 1) * limit;
  // console.log(startIndex , page)
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
    navigationdata(currentPage,itemsPerPage);
  }
});

nextPageButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
      navigationdata(currentPage,itemsPerPage);

  }
});

// Event listener for the items per page selector
itemsPerPageSelector.addEventListener("change", (e) => {
  itemsPerPage = parseInt(e.target.value);
  totalPages = Math.ceil(totalProducts / itemsPerPage);
  navigationdata(currentPage,itemsPerPage);

});

// Event listener for the "Jump to Page" functionality
goToPageButton.addEventListener("click", () => {
  const targetPage = parseInt(jumpToPageInput.value);
  if (targetPage >= 1 && targetPage <= totalPages) {
    currentPage = targetPage;
    navigationdata(currentPage,itemsPerPage);

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
