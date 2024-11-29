
let test;
const user_token = '9fc0fe536ea09fed645f9f791fc15e65';
let categories = {}; 


    
//       localStorage.setItem('productResponse', JSON.stringify(data));  
// Handle Fetch All Categories Button
async function fetchdata() {
    try {
        const response = await fetch('http://79.175.177.113:21800/Categories/get_categories_tree/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json; charset=utf-8",
                'authorization': user_token,
            },
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response contains valid categories data
        if (data && data.data && data.data['Saleman_bot']) {
            test = data; 
            categories = data.data['Saleman_bot']; 
            console.log('Categories Retrieved:', categories);

            renderCategories(); 
        } else {
            throw new Error('Invalid data format: "Saleman_bot" not found in the response.');
        }

    } catch (error) {
        // Log and display the error to the user
        console.error('Error Getting categories:', error);
        alert('Failed to load categories: ' + error.message);
    }
}
let categoryPath = [];
let categoriesToRender = categories; // Initially set categories to 'Saleman_bot'
let searchQuery = ''; // To store the search query

// Set to track unique category IDs and prevent duplication
let seen = new Set();
// Recursive function to search through all categories and subcategories
function searchAllCategories(categories, query) {
    let results = [];
    categories.forEach(category => {
        if (category.name_fa.toLowerCase().includes(query.toLowerCase()) && !seen.has(category._id)) {
            results.push(category);
            seen.add(category._id);
        }

        Object.keys(category).forEach(key => {
            if (key.startsWith('level_') && Array.isArray(category[key])) {
                category[key].forEach(subCategory => {
                    results = results.concat(searchAllCategories([subCategory], query)); // Recursively search subcategories
                });
            }
        });
    });

    return results;
}

// Function to render categories
function renderCategories() {
    const categoryListContainer = document.getElementById('categoryList');
    const breadcrumbContainer = document.getElementById('breadcrumb');
    const goHigherBtn = document.getElementById('goHigherBtn');
    const searchInput = document.getElementById('searchInput');
    categoryListContainer.innerHTML = '';

   
    if (!categories || Object.keys(categories).length === 0) {
        console.error('No categories available to render');
        categoryListContainer.innerHTML = '<p class="text-gray-500">کتگوری ای وجود ندارد.</p>';
        return;
    }

    let breadcrumbHtml = 'کتگوری مورد نظر را انتخاب کنید';

    if (categoryPath.length > 0) {
        breadcrumbHtml = categoryPath.map(cat => cat.name_fa).join(' > ');
        const lastCategory = categoryPath[categoryPath.length - 1];

        Object.keys(lastCategory).forEach(key => {
            if (key.startsWith('level_') && Array.isArray(lastCategory[key])) {
                categoriesToRender = lastCategory[key];
            }
        });
    } else {
        if (!searchQuery) {
            categoriesToRender = Object.values(categories);
        }
    }

    if (searchQuery) {
        seen.clear();
        categoriesToRender = searchAllCategories(categoriesToRender, searchQuery);
    }

    breadcrumbContainer.innerHTML = breadcrumbHtml;

    if (Array.isArray(categoriesToRender) && categoriesToRender.length > 0) {
        categoriesToRender.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-all', 'duration-200');
            
            let subCategoryCount = 0;
            Object.keys(category).forEach(key => {
                if (key.startsWith('level_') && Array.isArray(category[key])) {
                    subCategoryCount += category[key].length;
                }
            });

            let persianDate_Create = moment(category.created_at).format('jYYYY/jMM/jDD HH:mm:ss');
            let persianDate_Update = moment(category.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss');

            categoryElement.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">سطح: ${category.level}</span>
                    <span class="text-sm text-gray-500">شناسه: ${category._id}</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mt-2">${category.name_fa}</h3>
                <div class="flex flex-col p-4" dir="ltr">
                    <span class="text-base text-gray-500 py-2">تاریخ ایجاد:</span>
                    <span class="text-base text-gray-500">${persianDate_Create}</span>
                    <span class="text-base text-gray-500 py-2">تاریخ اخرین تغییر:</span>
                    <span class="text-base text-gray-500"> ${persianDate_Update ? persianDate_Update : persianDate_Create}</span>
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <span class="text-sm text-gray-400">زیر دسته‌ها: ${subCategoryCount}</span>
                    ${categoryPath.length > 0 ? `<button class="text-gray-600 hover:text-gray-800" onclick="goHigher()">بازگشت به بالا</button>` : ''}
                    ${Object.keys(category).some(key => key.startsWith('level_') && Array.isArray(category[key])) ? 
                        `<button class="text-blue-600 hover:text-blue-800" onclick="goDeeper('${category.name_fa}', '${category._id}')">رفتن به عمق بیشتر</button>` : 
                        `<button class="text-teal-600 hover:text-teal-800" onclick="GoToProduct('${category.name_fa}')">دریافت محصولات</button>
                        <button class="text-blue-600 hover:text-teal-800" onclick="GoToCharts('${category.name_fa}', '${category.slug_fa}')">اطلاعات بیشتر</button>`

                    }
                </div>
            `;
            categoryListContainer.appendChild(categoryElement);
        });
    } else {
       
        categoryListContainer.innerHTML = '<p class="text-gray-500">در این سطح کتگوری ای با این نام وجود ندارد.</p>';
    }

    if (categoryPath.length === 0) {
        goHigherBtn.setAttribute('disabled', true);
        goHigherBtn.classList.add('cursor-not-allowed');
        goHigherBtn.classList.remove('hover:bg-blue-600');
        goHigherBtn.classList.remove('hover:text-white');
    } else {
        goHigherBtn.removeAttribute('disabled');
        goHigherBtn.classList.remove('cursor-not-allowed');
        goHigherBtn.classList.add('hover:bg-blue-600');
        goHigherBtn.classList.add('hover:text-white');
    }
}

// Handle Go Deeper (Level Down)
function goDeeper(categoryName, categoryId) {
  const lastCategory = categoryPath[categoryPath.length - 1];

  if (categoryPath.length === 0) {
    const category = categoriesToRender.find(c => c.name_fa === categoryName);
    categoryPath.push(category);
  } else {
    Object.keys(lastCategory).forEach(key => {
      if (key.startsWith('level_') && Array.isArray(lastCategory[key])) {
        const subCategory = lastCategory[key].find(c => c.name_fa === categoryName);
        if (subCategory) {
          categoryPath.push(subCategory);
        }
      }
    });
  }

  renderCategories();
}

// Handle Go Higher (Level Up)
function goHigher() {
  if (categoryPath.length === 0) {
    console.log("No category to go higher from.");
    return;
  }

  const lastCategory = categoryPath[categoryPath.length - 1];
  categoryPath.pop();

  // After popping, determine the categories to render at the previous level
  if (categoryPath.length === 0) {
    categoriesToRender = Object.values(categories);
  } else {
    const previousCategory = categoryPath[categoryPath.length - 1];

    Object.keys(previousCategory).forEach(key => {
      if (key.startsWith('level_') && Array.isArray(previousCategory[key])) {
        categoriesToRender = previousCategory[key];
      }
    });
  }

  renderCategories();
}

// Handle Search Input
function handleSearch(event) {
  searchQuery = event.target.value.trim(); 
  renderCategories(); 
}

// Initialize Search
document.getElementById('searchInput').addEventListener('input', handleSearch);


//Reset Button
document.getElementById('backToFirstLevelBtn').addEventListener('click', function() {
 
  categoryPath = [];
  categoriesToRender = Object.values(categories);
  renderCategories();
});

// function pageInitialization() {
//   return new Promise((resolve, reject) => {
//     // Wait for the DOM to be fully loaded
//         console.log('0')

//     document.addEventListener('DOMContentLoaded', async () => {
//       try {
//         console.log('1')
//         await fetchdata();; // Replace this with your actual fetch function
//         console.log('2')
        
//         // After the data is fetched, resolve the promise
//         resolve('Page Loaded and Data Fetched');
//       } catch (error) {
//         // If there was an error during the data fetch, reject the promise
//         reject('Error during data fetching: ' + error);
//       }
//     });
//   });
// }

function pageInitialization() {
  return new Promise(async (resolve, reject) => {
    try {
      // Wait for fetchAllData to complete (assuming fetchAllData() is asynchronous)
        console.log('0')

      await fetchdata(); // Replace with your actual fetch function
        console.log('1')

      // Once the data is fetched, resolve the promise
      resolve('Page Loaded and Data Fetched');
    } catch (error) {
      // In case fetchAllData() fails, reject the promise
      reject('Error during data fetching: ' + error);
    }
  });
}


    // Start loading and use `showLoader` to show the spinner
    window.addEventListener('load', function() {
      showLoader(async function() {
        await pageInitialization();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
      });
    });


// Initial Render

function GoToProduct(name) {
  
  document.getElementById('AproductModal').classList.remove('hidden');
  document.getElementById('Automated_product_name').innerText = name;

  
  document.querySelector('#AproductModal form').addEventListener('submit', function(event) {
    event.preventDefault();

    
    const productPage = document.getElementById('productPage').value || 1;  
    const productLimit = document.getElementById('productLimit').value || 10; 
    const category_name_fa = name;  
  
    const data = {
      category_name_fa: category_name_fa,
      page: parseInt(productPage) ,
      page_limit:   parseInt(productLimit)
    };
    // console.log(data)
    
      localStorage.setItem('productResponse', JSON.stringify(data));  
      document.getElementById('AproductModal').classList.add('hidden');
      // console.log(data)
      window.location.href = '/Products.html';

    // fetch('http://79.175.177.113:21800//Products/get_products_paginated/', {
    //   method: 'POST',
    //  headers: {
    //             'Content-Type': 'application/json',
    //             "Accept-Version": 1,
    //             'Accept': "application/json",
    //             "Access-Control-Allow-Origin": "*",
    //             "Content-Type": "application/json; charset=utf-8",
    //             'authorization': user_token,
    //         },
    //   body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(data => {
    
    //   localStorage.setItem('productResponse', JSON.stringify(data));  
    //   document.getElementById('AproductModal').classList.add('hidden');
    //   // console.log(data)
    //   window.location.href = '/Products.html';

    // })
    // .catch(error => {
    //   console.error('Error fetching products:', error);
    //   alert('Error fetching products');
    // });
  });

  document.getElementById('closeAProductModal').addEventListener('click', function() {
    document.getElementById('AproductModal').classList.add('hidden');
  });
}


  function GoToCharts(name, slug) {

     const data = {
            category_name_fa: name,
            slug_fa: slug,
          };
  
      localStorage.setItem('name_far', JSON.stringify(data));  
      
            
     

      // console.log(data)
      window.location.href = '/charts.html';

  };


document.getElementById('closeAProductModal').addEventListener('click', function() {
  document.getElementById('AproductModal').classList.add('hidden');
    });
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Handle category form submission
    document.getElementById('createCategoryForm').addEventListener('submit', function(event) {
      event.preventDefault();

      const name_fa = document.getElementById('name_fa').value;
      const name = document.getElementById('name').value;
      const parent_id = document.getElementById('parent_id').value;
          
      const data = {
        parent_id: parent_id,  // include parent_id as the first key
        name: name,            // name field
        name_fa: name_fa       // name_fa field
      };

      fetch('http://79.175.177.113:21800/Categories/create/', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json; charset=utf-8",
                'authorization': user_token,
            },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Category created:', data);
        alert('Category created successfully!');
        document.getElementById('createCategoryForm').reset();  
      })
      .catch(error => {
        console.error('Error creating category:', error);
        alert('Error creating category');
      });
    });
