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

let currentPage = 1;    // Initialize currentPage to 1
let itemsPerPage = 10;  // Set default items per page
let totalProducts = 0;  // Initialize totalProducts
let totalPages = 0;     // Initialize totalPages
let searchQuery = '';   // Global search query
let sortType = 'name';  // Default sort type (by name)
let sortOrder = 'asc';  // Default sort order (ascending)

let user_token = 'your_token_here'; // Replace with actual user token

// Function to fetch product data from the API
function fetchProductData(page, limit, search, sortType, sortOrder) {
  const data = {
    category_name_fa: 'کرم پودر', // Example category, replace as needed
    page: page,
    page_limit: limit,
    search: search,
    sort_type: sortType,
    sort_order: sortOrder
  };

  return fetch('http://79.175.177.113:21800/Products/get_products_paginated/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Version': 1,
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
      'authorization': user_token
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    totalProducts = data.data.total_count;
    totalPages = Math.ceil(totalProducts / itemsPerPage);
    return data;
  })
  .catch(error => {
    console.error('Error fetching products:', error);
    alert('Error fetching products');
  });
}

// Function to update the page UI based on current page and items per page
function updatePageUI() {
  fetchProductData(currentPage, itemsPerPage, searchQuery, sortType, sortOrder)
    .then(data => {
      // Update product count and page number UI
      pageNumberElement.textContent = `صفحه: ${currentPage}`;
      productCountElement.textContent = `نمایش صفحه: ${itemsPerPage} از ${totalProducts}`;
  
      // Disable prev/next buttons if at the beginning/end
      prevPageButton.disabled = currentPage === 1;
      nextPageButton.disabled = currentPage === totalPages;
  
      // Create product cards
      createProductCards(data.data.result);
    });
}

// Function to create product cards
function createProductCards(products) {
  productCardsContainer.innerHTML = ''; // Clear previous cards

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "bg-white shadow-lg rounded-lg p-6 border transition-transform transform hover:scale-105 hover:shadow-2xl";

    // Availability
    const availability = document.createElement("div");
    availability.className = "mb-2";
    availability.innerHTML = `<span class="text-sm ${product.is_available ? 'text-green-600' : 'text-red-600'} font-semibold">${product.is_available ? 'موجود' : 'تمام شده'}</span>`;

    // Product Name
    const productName = document.createElement("h3");
    productName.className = "text-md font-semibold text-gray-800 mb-2";
    productName.textContent = product.product_name_fa;

    // Product ID
    const productId = document.createElement("p");
    productId.className = "text-sm text-gray-500 mb-2";
    productId.textContent = `شناسه: ${product._id}`;

    // Scrape URL
    const productUrl = document.createElement("p");
    productUrl.className = "text-sm text-gray-400 mb-2";
    productUrl.innerHTML = `URL استخراج شده: <a href="${product.scrape_url}" target="_blank" class="text-blue-500 hover:text-blue-700">${product.scrape_url}</a>`;

    // Price (Average Price)
    const price = document.createElement("p");
    price.className = "text-lg font-semibold text-gray-800 mb-4";
    if (product.price_stat && product.price_stat.avg) {
      price.textContent = `قیمت: تومان${(parseFloat(product.price_stat.avg) / 100).toFixed(2)}`;
    } else {
      price.textContent = "قیمت: موجود نیست";
    }

    // Action Buttons
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex justify-between items-center mt-4 gap-4";

    const updateButton = document.createElement("button");
    updateButton.className = "text-teal-600 hover:text-teal-800 text-sm px-4 py-2 border border-teal-600 rounded-md transition-all duration-200";
    updateButton.textContent = "به‌روزرسانی محصول";

    const detailButton = document.createElement("button");
    detailButton.className = "text-blue-600 hover:text-blue-800 text-sm px-4 py-2 border border-blue-600 rounded-md transition-all duration-200";
    detailButton.textContent = "مشاهده جزئیات کامل";

    buttonsContainer.appendChild(updateButton);
    buttonsContainer.appendChild(detailButton);

    card.appendChild(availability);
    card.appendChild(productName);
    card.appendChild(productId);
    card.appendChild(productUrl);
    card.appendChild(price);
    card.appendChild(buttonsContainer);

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

// Call updatePageUI when the page loads
window.onload = updatePageUI;
