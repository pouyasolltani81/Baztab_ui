// // Simulated data (you'd replace this with the actual API response)
// const data = {
//   "return": true,
//   "message": "Ok",
//   "data": {
//     "next_page": "?pageLimit=10&page=2",
//     "prev_page": "?pageLimit=10&page=1",
//     "page": 1,
//     "showing": 10,
//     "total_count": 1909,
//     "result": [
//       {
//         "_id": "67358d34fd1372fc4a6d61ae",
//         "product_name_fa": "کرم پودر میستار شماره 102 حجم 40 میلی لیتر",
//         "is_available": true,
//         "scrape_url": "https://www.digikala.com/product/dkp-7625033"
//       },
//       {
//         "_id": "67358e77fd1372fc4a6d61b4",
//         "product_name_fa": "کرم پودر استودیو میکاپ مدل Perfecting Finish شماره 05 حجم 30 میلی لیتر",
//         "is_available": true,
//         "scrape_url": "https://www.digikala.com/product/dkp-1167547"
//       },
//       // Add more products if needed
//     ]
//   }
// };

// // Set page number, product name, and product count
// document.getElementById("pageNumber").textContent = `Page: ${data.data.page}`;
// document.getElementById("productName").textContent = `Product List`;
// document.getElementById("productCount").textContent = `Displaying: ${data.data.showing} of ${data.data.total_count}`;

// // Function to generate random prices
// function getRandomPrice() {
//   const min = 50000; // Min price
//   const max = 500000; // Max price
//   return (Math.random() * (max - min) + min).toFixed(2); // Random price between min and max
// }

// // Function to create product cards
// function createProductCards(products) {
//   const productCardsContainer = document.getElementById("productCards");
//   productCardsContainer.innerHTML = ''; // Clear previous content

//   products.forEach(product => {
//     // Create a product card element
//     const card = document.createElement("div");
//     card.className = "bg-white shadow-md rounded-lg p-4 border";

//     // Availability status
//     const availability = document.createElement("div");
//     availability.className = "mb-2";
//     availability.innerHTML = `<span class="text-sm ${product.is_available ? 'text-green-600' : 'text-red-600'}">${product.is_available ? 'Available' : 'Out of Stock'}</span>`;
    
//     // Product name
//     const productName = document.createElement("h3");
//     productName.className = "text-md font-semibold text-gray-800 mb-2";
//     productName.textContent = product.product_name_fa;

//     // Product ID
//     const productId = document.createElement("p");
//     productId.className = "text-sm text-gray-500 mb-2";
//     productId.textContent = `ID: ${product._id}`;

//     // Scraped URL
//     const productUrl = document.createElement("p");
//     productUrl.className = "text-sm text-gray-400 mb-2";
//     productUrl.innerHTML = `Scrapped URL: <a href="${product.scrape_url}" target="_blank" class="text-blue-500 hover:text-blue-700">${product.scrape_url}</a>`;

//     // Price (Random)
//     const price = document.createElement("p");
//     price.className = "text-lg font-semibold text-gray-800 mb-4";
//     price.textContent = `Price: $${getRandomPrice()}`;

//     // Action buttons
//     const buttonsContainer = document.createElement("div");
//     buttonsContainer.className = "flex justify-between items-center";

//     // Update Product Button
//     const updateButton = document.createElement("button");
//     updateButton.className = "text-teal-600 hover:text-teal-800 text-sm px-3 py-1 border border-teal-600 rounded-md";
//     updateButton.textContent = "Update Product";

//     // See Full Detail Button
//     const detailButton = document.createElement("button");
//     detailButton.className = "text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded-md";
//     detailButton.textContent = "See Full Detail";

//     // Append elements to card
//     buttonsContainer.appendChild(updateButton);
//     buttonsContainer.appendChild(detailButton);
    
//     card.appendChild(availability);
//     card.appendChild(productName);
//     card.appendChild(productId);
//     card.appendChild(productUrl);
//     card.appendChild(price);
//     card.appendChild(buttonsContainer);

//     // Append card to product cards container
//     productCardsContainer.appendChild(card);
//   });
// }

// // Call the function to generate cards
// createProductCards(data.data.result);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Simulated data structure
// let currentPage = 1;
// let itemsPerPage = 10;
// let totalProducts = 1909; // Total count of products (from your data)
// let totalPages = Math.ceil(totalProducts / itemsPerPage);

// // Global search and sort states
// let searchQuery = '';
// let sortType = 'name'; // Default sort type (by name)
// let sortOrder = 'asc'; // Default sort order (ascending)

// // Select elements
// const pageNumberElement = document.getElementById("pageNumber");
// const productNameElement = document.getElementById("productName");
// const productCountElement = document.getElementById("productCount");
// const productCardsContainer = document.getElementById("productCards");
// const prevPageButton = document.getElementById("prevPage");
// const nextPageButton = document.getElementById("nextPage");
// const itemsPerPageSelector = document.getElementById("itemsPerPage");
// const jumpToPageInput = document.getElementById("jumpToPage");
// const goToPageButton = document.getElementById("goToPage");
// const searchInput = document.getElementById("searchInput");
// const sortBySelect = document.getElementById("sortBySelect");
// const reverseSortButton = document.getElementById("reverseSortButton");

// // Function to update the page UI based on current page and items per page
// function updatePageUI() {
//   pageNumberElement.textContent = `Page: ${currentPage}`;
//   productCountElement.textContent = `Displaying: ${itemsPerPage} of ${totalProducts}`;

//   // Disable prev/next buttons if at the beginning/end
//   prevPageButton.disabled = currentPage === 1;
//   nextPageButton.disabled = currentPage === totalPages;

//   // Update the product list
//   fetchData(currentPage, itemsPerPage, searchQuery, sortType, sortOrder);
// }

// // Function to fetch data from a local JSON file
// async function fetchData(page, limit, search, type, order) {
//   try {
//     const response = await fetch('products.json'); // Path to your JSON file
//     const data = await response.json();

//     // Update total count and pages based on fetched data
//     totalProducts = data.data.total_count;
//     totalPages = Math.ceil(totalProducts / itemsPerPage);

//     // Filter and sort the data
//     let mockData = data.data.result;

//     // Apply search filter
//     if (search) {
//       mockData = mockData.filter(product => product.product_name_fa.toLowerCase().includes(search.toLowerCase()));
//     }

//     // Sort based on the current sort type and order
//     if (type === 'name') {
//       mockData.sort((a, b) => order === 'asc'
//         ? a.product_name_fa.localeCompare(b.product_name_fa)
//         : b.product_name_fa.localeCompare(a.product_name_fa));
//     } else if (type === 'price') {
//       mockData.sort((a, b) => order === 'asc'
//         ? a.price_stat.avg - b.price_stat.avg // Sorting by the average price
//         : b.price_stat.avg - a.price_stat.avg);
//     }

//     // Paginate results based on current page and items per page
//     mockData = mockData.slice((page - 1) * limit, page * limit);

//     // Display fetched products
//     createProductCards(mockData);

//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// }

// // Function to create product cards
// function createProductCards(products) {
//   productCardsContainer.innerHTML = ''; // Clear previous cards

//   products.forEach(product => {
//     const card = document.createElement("div");
//     card.className = "bg-white shadow-lg rounded-lg p-6 border transition-transform transform hover:scale-105 hover:shadow-2xl";

//     // Availability status
//     const availability = document.createElement("div");
//     availability.className = "mb-2";
//     availability.innerHTML = `<span class="text-sm ${product.is_available ? 'text-green-600' : 'text-red-600'} font-semibold">${product.is_available ? 'Available' : 'Out of Stock'}</span>`;

//     // Product name
//     const productName = document.createElement("h3");
//     productName.className = "text-md font-semibold text-gray-800 mb-2";
//     productName.textContent = product.product_name_fa;

//     // Product ID
//     const productId = document.createElement("p");
//     productId.className = "text-sm text-gray-500 mb-2";
//     productId.textContent = `ID: ${product._id}`;

//     // Scraped URL
//     const productUrl = document.createElement("p");
//     productUrl.className = "text-sm text-gray-400 mb-2";
//     productUrl.innerHTML = `Scraped URL: <a href="${product.scrape_url}" target="_blank" class="text-blue-500 hover:text-blue-700">${product.scrape_url}</a>`;

//     // Price (from price_stat.avg)
//     const price = document.createElement("p");
//     price.className = "text-lg font-semibold text-gray-800 mb-4";
//     price.textContent = `Price: $${(product.price_stat.avg / 100).toFixed(2)}`; // Assuming price is in minor currency units (e.g., cents)

//     // Action buttons container
//     const buttonsContainer = document.createElement("div");
//     buttonsContainer.className = "flex justify-between items-center mt-4 gap-4";

//     // Update Product Button
//     const updateButton = document.createElement("button");
//     updateButton.className = "text-teal-600 hover:text-teal-800 text-sm px-4 py-2 border border-teal-600 rounded-md transition-all duration-200";
//     updateButton.textContent = "Update Product";

//     // See Full Detail Button
//     const detailButton = document.createElement("button");
//     detailButton.className = "text-blue-600 hover:text-blue-800 text-sm px-4 py-2 border border-blue-600 rounded-md transition-all duration-200";
//     detailButton.textContent = "See Full Detail";

//     // Append elements to the card
//     buttonsContainer.appendChild(updateButton);
//     buttonsContainer.appendChild(detailButton);

//     card.appendChild(availability);
//     card.appendChild(productName);
//     card.appendChild(productId);
//     card.appendChild(productUrl);
//     card.appendChild(price);
//     card.appendChild(buttonsContainer);

//     // Append the card to the product cards container
//     productCardsContainer.appendChild(card);
//   });
// }

// // Event listeners for pagination controls
// prevPageButton.addEventListener("click", () => {
//   if (currentPage > 1) {
//     currentPage--;
//     updatePageUI();
//   }
// });

// nextPageButton.addEventListener("click", () => {
//   if (currentPage < totalPages) {
//     currentPage++;
//     updatePageUI();
//   }
// });

// goToPageButton.addEventListener("click", () => {
//   const pageInput = parseInt(jumpToPageInput.value);
//   if (pageInput && pageInput > 0 && pageInput <= totalPages) {
//     currentPage = pageInput;
//     updatePageUI();
//   }
// });

// // Event listener for items per page selection
// itemsPerPageSelector.addEventListener("change", (e) => {
//   itemsPerPage = parseInt(e.target.value);
//   totalPages = Math.ceil(totalProducts / itemsPerPage);
//   currentPage = 1; // Reset to the first page when items per page changes
//   updatePageUI();
// });

// // Event listener for search input
// searchInput.addEventListener("input", () => {
//   searchQuery = searchInput.value;
//   currentPage = 1; // Reset to the first page when search query changes
//   updatePageUI();
// });

// // Event listener for sorting type selection (dropdown)
// sortBySelect.addEventListener("change", () => {
//   sortType = sortBySelect.value;
//   currentPage = 1; // Reset to the first page when sorting type changes
//   updatePageUI();
// });

// // Event listener for reverse sorting button click
// reverseSortButton.addEventListener("click", () => {
//   // Toggle sort order
//   sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
//   reverseSortButton.textContent = `Reverse Sort Order (${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})`; // Update button text
//   currentPage = 1; // Reset to the first page when sort order changes
//   updatePageUI();
// });

// // Initial page load
// updatePageUI();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Select elements
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

// Fetch the JSON data from the local file (products.json)
function loadLocalJsonData() {
       
      const productData = JSON.parse(localStorage.getItem('productResponse'));
      console.log(productData);
      localJsonData = productData; 
      totalProducts = localJsonData.data.total_count; 
      totalPages = Math.ceil(totalProducts / itemsPerPage); 
      updatePageUI(); 
    
}

// Call the loadLocalJsonData function when the page loads
window.onload = loadLocalJsonData;

// Function to update the page UI based on current page and items per page
function updatePageUI() {
  if (!localJsonData.data) {
    return; // Prevent errors if data hasn't been loaded yet
  }

  pageNumberElement.textContent = `صفحه: ${currentPage}`;
  productCountElement.textContent = `نمایش صفحه: ${itemsPerPage} از ${totalProducts}`;

  // Disable prev/next buttons if at the beginning/end
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;

  // Update the product list from local data
  fetchLocalData(currentPage, itemsPerPage, searchQuery, sortType, sortOrder);
}

// Function to simulate fetching data from local JSON
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

goToPageButton.addEventListener("click", () => {
  const pageInput = parseInt(jumpToPageInput.value);
  if (pageInput && pageInput > 0 && pageInput <= totalPages) {
    currentPage = pageInput;
    updatePageUI();
  }
});

// Event listener for items per page selection
itemsPerPageSelector.addEventListener("change", (e) => {
  itemsPerPage = parseInt(e.target.value);
  totalPages = Math.ceil(totalProducts / itemsPerPage);
  currentPage = 1; // Reset to the first page when items per page changes
  updatePageUI();
});

// Event listener for search input
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  currentPage = 1; // Reset to the first page when search query changes
  updatePageUI();
});

// Event listener for sorting type selection (dropdown)
sortBySelect.addEventListener("change", () => {
  sortType = sortBySelect.value;
  currentPage = 1; // Reset to the first page when sorting type changes
  updatePageUI();
});

// Event listener for reverse sorting button click
reverseSortButton.addEventListener("click", () => {
  // Toggle sort order
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  reverseSortButton.textContent = `Reverse Sort Order (${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})`;
  updatePageUI();
});

// Initial page load
updatePageUI();



// // Language toggle logic
// let isPersian = false; // Track the current language

// function toggleLanguage() {
//   isPersian = !isPersian; // Switch language flag
  
//   // Update UI text based on language selection
//   document.getElementById("pageNumber").textContent = isPersian ? `صفحه: ${currentPage}` : `Page: ${currentPage}`;
//   document.getElementById("productName").textContent = isPersian ? "لیست محصولات" : "Product List";
//   document.getElementById("productCount").textContent = isPersian ? `نمایش: ${itemsPerPage} از ${totalProducts}` : `Displaying: ${itemsPerPage} of ${totalProducts}`;
  
//   // Change button text
//   document.getElementById("languageToggle").textContent = isPersian ? "Change Language" : "تغییر زبان";
  
//   // Update other dynamic content such as product names, availability, buttons, etc.
//   updateProductCardsLanguage();
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////
// function updateProductCardsLanguage() {
//   // Go through each product card and update the text
//   const productCards = document.querySelectorAll('.product-card');
//   productCards.forEach(card => {
//     const productName = card.querySelector('.product-name');
//     const availability = card.querySelector('.availability');
    
//     // Update based on language
//     if (isPersian) {
//       productName.textContent = productName.textContent.replace('Product', 'محصول');
//       availability.textContent = availability.textContent === 'Available' ? 'موجود' : 'ناموجود';
//     } else {
//       productName.textContent = productName.textContent.replace('محصول', 'Product');
//       availability.textContent = availability.textContent === 'موجود' ? 'Available' : 'Out of Stock';
//     }
//   });
// }

// // Event listener for the language toggle button
// document.getElementById("languageToggle").addEventListener("click", toggleLanguage);
