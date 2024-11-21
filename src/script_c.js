


        // // API URLs
        // const apiUrlCreate = 'http://49.175.177.113:21800/api/category/create';  // Replace with actual endpoint
        // const apiUrlGetCategories = 'http://49.175.177.113:21800/api/category/get-categories';  // Replace with actual endpoint
        // const apiUrlGetCategoryByName = 'http://49.175.177.113:21800/api/category/get-category-by-name';  // Replace with actual endpoint

        // // Form Elements
        // const createCategoryForm = document.getElementById('createCategoryForm');
        // const fetchCategoriesBtn = document.getElementById('fetchCategoriesBtn');
        // const searchCategoryForm = document.getElementById('searchCategoryForm');
        // const categoriesList = document.getElementById('categoriesList');

        // // Handle Create Category Form Submission
        // createCategoryForm.addEventListener('submit', async (e) => {
        //     e.preventDefault();

        //     const name = document.getElementById('categoryName').value;
        //     const description = document.getElementById('categoryDescription').value;

        //     try {
        //         const response = await fetch(apiUrlCreate, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify({ name, description })
        //         });

        //         if (response.ok) {
        //             alert('Category created successfully!');
        //             createCategoryForm.reset();
        //         } else {
        //             alert('Failed to create category');
        //         }
        //     } catch (error) {
        //         console.error('Error:', error);
        //         alert('An error occurred');
        //     }
        // });

        // // Handle Fetch All Categories Button
        // fetchCategoriesBtn.addEventListener('click', async () => {
        //     try {
        //         const response = await fetch(apiUrlGetCategories);
        //         const categories = await response.json();

        //         // Clear previous list
        //         categoriesList.innerHTML = '';

        //         if (Array.isArray(categories) && categories.length > 0) {
        //             categories.forEach(category => {
        //                 const categoryDiv = document.createElement('div');
        //                 categoryDiv.classList.add('p-4', 'bg-white', 'shadow-md', 'rounded-md', 'border', 'border-gray-200');
        //                 categoryDiv.innerHTML = `
        //                     <h3 class="font-semibold text-xl text-gray-700">${category.name}</h3>
        //                     <p class="text-gray-600">${category.description}</p>
        //                 `;
        //                 categoriesList.appendChild(categoryDiv);
        //             });
        //         } else {
        //             categoriesList.innerHTML = '<p class="text-gray-500">No categories available.</p>';
        //         }
        //     } catch (error) {
        //         console.error('Error:', error);
        //         alert('Failed to fetch categories');
        //     }
        // });

        // // Handle Search Category by Name Form
        // searchCategoryForm.addEventListener('submit', async (e) => {
        //     e.preventDefault();

        //     const categoryName = document.getElementById('searchName').value;

        //     try {
        //         const response = await fetch(`${apiUrlGetCategoryByName}?name=${categoryName}`);
        //         const category = await response.json();

        //         // Clear previous list
        //         categoriesList.innerHTML = '';

        //         if (category && category.name) {
        //             const categoryDiv = document.createElement('div');
        //             categoryDiv.classList.add('p-4', 'bg-white', 'shadow-md', 'rounded-md', 'border', 'border-gray-200');
        //             categoryDiv.innerHTML = `
        //                 <h3 class="font-semibold text-xl text-gray-700">${category.name}</h3>
        //                 <p class="text-gray-600">${category.description}</p>
        //             `;
        //             categoriesList.appendChild(categoryDiv);
        //         } else {
        //             categoriesList.innerHTML = '<p class="text-gray-500">No category found.</p>';
        //         }
        //     } catch (error) {
        //         console.error('Error:', error);
        //         alert('Failed to search for category');
        //     }
        // });


//         // Sample data to mock API responses
// const sampleCategories = [
//     { id: 1, name: 'Technology', description: 'All things tech related' },
//     { id: 2, name: 'Science', description: 'Scientific discoveries and research' },
//     { id: 3, name: 'Health', description: 'Topics related to health and wellness' },
// ];

// // Form Elements
// const createCategoryForm = document.getElementById('createCategoryForm');
// const fetchCategoriesBtn = document.getElementById('fetchCategoriesBtn');
// const searchCategoryForm = document.getElementById('searchCategoryForm');
// const categoriesList = document.getElementById('categoriesList');

// // Handle Create Category Form Submission
// createCategoryForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const name = document.getElementById('categoryName').value;
//     const description = document.getElementById('categoryDescription').value;

//     // Simulate adding a new category to the list
//     const newCategory = { id: sampleCategories.length + 1, name, description };
//     sampleCategories.push(newCategory);

//     alert('Category created successfully!');
//     createCategoryForm.reset();
// });

// // Handle Fetch All Categories Button
// fetchCategoriesBtn.addEventListener('click', () => {
//     // Simulating API response by using the sampleCategories array
//     categoriesList.innerHTML = ''; // Clear previous list

//     if (sampleCategories.length > 0) {
//         sampleCategories.forEach((category) => {
//             const categoryDiv = document.createElement('div');
//             categoryDiv.classList.add('p-4', 'bg-white', 'shadow-md', 'rounded-md', 'border', 'border-gray-200');
//             categoryDiv.innerHTML = `
//                 <h3 class="font-semibold text-xl text-gray-700">${category.name}</h3>
//                 <p class="text-gray-600">${category.description}</p>
//             `;
//             categoriesList.appendChild(categoryDiv);
//         });
//     } else {
//         categoriesList.innerHTML = '<p class="text-gray-500">No categories available.</p>';
//     }
// });

// // Handle Search Category by Name Form
// searchCategoryForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const categoryName = document.getElementById('searchName').value.toLowerCase();
//     const foundCategory = sampleCategories.find(
//         (category) => category.name.toLowerCase() === categoryName
//     );

//     // Clear previous list
//     categoriesList.innerHTML = '';

//     if (foundCategory) {
//         const categoryDiv = document.createElement('div');
//         categoryDiv.classList.add('p-4', 'bg-white', 'shadow-md', 'rounded-md', 'border', 'border-gray-200');
//         categoryDiv.innerHTML = `
//             <h3 class="font-semibold text-xl text-gray-700">${foundCategory.name}</h3>
//             <p class="text-gray-600">${foundCategory.description}</p>
//         `;
//         categoriesList.appendChild(categoryDiv);
//     } else {
//         categoriesList.innerHTML = '<p class="text-gray-500">No category found.</p>';
//     }
// });

const user_token = '9fc0fe536ea09fed645f9f791fc15e65'

// //  Sample Data with Multiple Level 1 Categories
//  const categories = {
//       "Saleman_bot": {
//       "زیبایی و سلامت": {
//         "_id": "67358d34fd1372fc4a6d61a8",
//         "name": "",
//         "name_fa": "زیبایی و سلامت",
//         "parent_id": null,
//         "slug": "",
//         "slug_fa": "زیبایی-و-سلامت",
//         "level": 1,
//         "created_at": "2024-11-14T05:40:04.262",
//         "level_2": [
//           {
//             "_id": "67358d34fd1372fc4a6d61a9",
//             "name": "",
//             "name_fa": "لوازم آرایشی",
//             "parent_id": "67358d34fd1372fc4a6d61a8",
//             "slug": " > ",
//             "slug_fa": "لوازم-آرایشی < زیبایی-و-سلامت",
//             "level": 2,
//             "created_at": "2024-11-14T05:40:04.266",
//             "level_3": [
//               {
//                 "_id": "67358d34fd1372fc4a6d61aa",
//                 "name": "",
//                 "name_fa": "کرم پودر",
//                 "parent_id": "67358d34fd1372fc4a6d61a9",
//                 "slug": " >  > ",
//                 "slug_fa": "کرم-پودر < لوازم-آرایشی < زیبایی-و-سلامت",
//                 "level": 3,
//                 "created_at": "2024-11-14T05:40:04.267",
//                 "updatedAt": "2024-11-20T07:14:28.529"
//               },
//               {
//                 "_id": "673839a3fd1372fc4a6d9518",
//                 "name": "",
//                 "name_fa": "پنکک",
//                 "parent_id": "67358d34fd1372fc4a6d61a9",
//                 "slug": " >  > ",
//                 "slug_fa": "پنکک < لوازم-آرایشی < زیبایی-و-سلامت",
//                 "level": 3,
//                 "created_at": "2024-11-16T06:20:19.766",
//                 "updatedAt": "2024-11-20T07:14:33.175"
//               },
//               {
//                 "_id": "6739e5ddfd1372fc4a6db9b1",
//                 "name": "",
//                 "name_fa": "کانسیلر",
//                 "parent_id": "67358d34fd1372fc4a6d61a9",
//                 "slug": " >  > ",
//                 "slug_fa": "کانسیلر < لوازم-آرایشی < زیبایی-و-سلامت",
//                 "level": 3,
//                 "created_at": "2024-11-17T12:47:25.775",
//                 "updatedAt": "2024-11-20T07:14:35.383"
//               }
//             ]
//           }
//         ]
//       }
//     }
//     };

    
        // Handle Fetch All Categories Button
        async function fetchdata(){
            try {
                const response = await fetch('http://79.175.177.113:21800/Categories/get_categories_tree/', {
                                        method: 'POST',
                                        headers: {
                                        'Content-Type': 'application/json',
                                        "Accept-Version": 1,
                                        'Accept': "application/json",
                                        "Access-Control-Allow-Origin": "*",
                                        "Content-Type": "application/json; charset=utf-8",
                                        'authorization' : user_token , 
                                        },
                                        // body: JSON.stringify({})
                                })
                                .then(response => response)
                                .then(data => {
                                        console.log('Category Retrived:', data);
                                        test = data;
                                })
                                .catch(error => {
                                        console.error('Error Getting category:', error);
                                        alert('Error Getting category');
                                });
                                

                const categories = await response;

                // Clear previous list
                categoriesList.innerHTML = '';

                if (Array.isArray(categories) && categories.length > 0) {
                    categories.forEach(category => {
                        const categoryDiv = document.createElement('div');
                        categoryDiv.classList.add('p-4', 'bg-white', 'shadow-md', 'rounded-md', 'border', 'border-gray-200');
                        categoryDiv.innerHTML = `
                            <h3 class="font-semibold text-xl text-gray-700">${category.name}</h3>
                            <p class="text-gray-600">${category.description}</p>
                        `;
                        categoriesList.appendChild(categoryDiv);
                    });
                } else {
                    categoriesList.innerHTML = '<p class="text-gray-500">No categories available.</p>';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to fetch categories');
            }
        };
let categoryPath = [];
let categoriesToRender = categories.data['Saleman_bot']; // Starting point for level 1 categories
let searchQuery = ''; // To store the search query

// Set to track unique category IDs and prevent duplication
let seen = new Set();

// Recursive function to search through all categories and subcategories (dynamic levels)
function searchAllCategories(categories, query) {
  let results = [];

  categories.forEach(category => {
    // Check if category matches the search query and hasn't been added before (by unique ID)
    if (category.name_fa.toLowerCase().includes(query.toLowerCase()) && !seen.has(category._id)) {
      results.push(category);
      seen.add(category._id); // Mark this category as seen
    }

    // Dynamically check for subcategories at any level (level_2, level_3, etc.)
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

// Function to render categories based on the current path
function renderCategories() {
  const categoryListContainer = document.getElementById('categoryList');
  const breadcrumbContainer = document.getElementById('breadcrumb');
  const goHigherBtn = document.getElementById('goHigherBtn');
  const searchInput = document.getElementById('searchInput');
  categoryListContainer.innerHTML = '';

  let breadcrumbHtml = 'کتگوری مورد نظر را انتخاب کنید';

  if (categoryPath.length > 0) {
    breadcrumbHtml = categoryPath.map(cat => cat.name_fa).join(' > ');
    const lastCategory = categoryPath[categoryPath.length - 1];

    // Dynamically determine categories to render based on the last level in the breadcrumb path
    Object.keys(lastCategory).forEach(key => {
      if (key.startsWith('level_') && Array.isArray(lastCategory[key])) {
        categoriesToRender = lastCategory[key];
      }
    });
  } else {
    // If search query is empty, render only top-level categories
    if (!searchQuery) {
      categoriesToRender = Object.values(categories['Saleman_bot']);
    }
  }

  // Filter categories based on the search query (case insensitive)
  if (searchQuery) {
    // Reset the seen set before each search to avoid persisting previous results
    seen.clear();
    categoriesToRender = searchAllCategories(categoriesToRender, searchQuery);
  }

  breadcrumbContainer.innerHTML = breadcrumbHtml;

  // Ensure categoriesToRender is an array before calling .forEach
  if (Array.isArray(categoriesToRender)) {
    categoriesToRender.forEach(category => {
      const categoryElement = document.createElement('div');
      categoryElement.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-all', 'duration-200');
      
      // Count the number of subcategories
      let subCategoryCount = 0;
      Object.keys(category).forEach(key => {
        if (key.startsWith('level_') && Array.isArray(category[key])) {
          subCategoryCount += category[key].length;
        }
      });

      // Convert to Persian (Jalaali) date
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
            `<button class="text-blue-600 hover:text-blue-800" onclick="goDeeper('${category.name_fa}', '${category._id}')">رفتن به عمق بیشتر</button>` : `<button class="text-teal-600 hover:text-teal-800" onclick="GoToProduct('${category.name_fa}')">دریافت محصولات</button>`}
        </div>
      `;
      categoryListContainer.appendChild(categoryElement);
    });
  }

  // Show or hide Go Higher button
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
    categoriesToRender = Object.values(categories['Saleman_bot']);
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
  searchQuery = event.target.value.trim(); // Capture the search input
  renderCategories(); // Re-render categories based on the updated search query
}

// Initialize Search
document.getElementById('searchInput').addEventListener('input', handleSearch);


//Reset Button
document.getElementById('backToFirstLevelBtn').addEventListener('click', function() {
  // Reset the category path to the first level (empty path)
  categoryPath = [];

  // Set categoriesToRender to top-level categories
  categoriesToRender = Object.values(categories['Saleman_bot']);

  // Re-render the categories
  renderCategories();
});


// Initial Render
renderCategories();

function GoToProduct(name){
  document.getElementById('AproductModal').classList.remove('hidden');
  document.getElementById('Automated_product_name').innerText = name;
}

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
        name_fa,
        name,
        parent_id
      };

      fetch('https://your-api-endpoint.com/create-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Category created:', data);
        alert('Category created successfully!');
        document.getElementById('createCategoryForm').reset();  // Reset the form
      })
      .catch(error => {
        console.error('Error creating category:', error);
        alert('Error creating category');
      });
    });
