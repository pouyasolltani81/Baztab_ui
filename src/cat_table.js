function llm_analysis(name , slug){
    data = {
        'name_fa' : name ,
        'slug' : slug 
    }

    localStorage.setItem('categorydata', JSON.stringify(data));

    window.location.href = './llm_tags.html'
}

async function fetchdata() {
    try {
        const response = await fetch('http://79.175.177.113:21800/Categories/get_categories_tree/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data); // Log the entire fetched data

        // Check if the response contains valid categories data
        if (data && data.data && data.data['Saleman_bot']) {
            renderCategoryDropdown(data);  // Pass the fetched data to the render function
        } else {
            throw new Error('Invalid data format: "Saleman_bot" not found in the response.');
        }

    } catch (error) {
        // Log and display the error to the user
        console.error('Error Getting categories:', error);
        alert('Failed to load categories: ' + error.message);
    }
}

let currentCategory = ""; // No initial category

// Render categories in the dropdown
function renderCategoryDropdown(responseData) {
    const categoryDropdown = document.getElementById('category');
    categoryDropdown.innerHTML = ''; // Clear previous options

    // Dynamically populate categories in the dropdown (only level 1 categories)
    const categories = Object.values(responseData.data);
    if (categories.length === 0) {
        console.log('No categories found'); // Log if no categories are found
    }

    categories.forEach(category => {
        console.log('Processing category:', category); // Log each category to debug
        Object.values(category).forEach(mainCategory => {
            console.log('Main category:', mainCategory); // Log the main category

            const option = document.createElement('option');
            option.value = mainCategory.name_fa; // Set value to the category's name in Farsi (e.g., زیبایی و سلامت)
            option.innerHTML = mainCategory.name_fa; // Set display name to the category's name in Farsi
            categoryDropdown.appendChild(option);
        });
    });

    console.log(localStorage.getItem('lastselectedcategory'))
    
    
    if (localStorage.getItem('lastselectedcategory')){
        currentCategory = JSON.parse(localStorage.getItem('lastselectedcategory')).c_value
        category.value = currentCategory

    }
    // Set the first category as the default selected category
    else if (categoryDropdown.options.length > 0) {
        currentCategory = categoryDropdown.options[0].value;
        console.log('Default category selected:', currentCategory);
    }

    // Trigger the table render when a category is selected
    categoryDropdown.addEventListener('change', (e) => {
        
        currentCategory = e.target.value;

        
        let c_data = {
            'c_value' : currentCategory
        }
        localStorage.setItem('lastselectedcategory', JSON.stringify(c_data));
        currentCategory = JSON.parse(localStorage.getItem('lastselectedcategory')).c_value
        console.log('change:' , currentCategory)

        renderTable(responseData);
    });

    let c_data = {
        'c_value' : currentCategory
    }

    localStorage.setItem('lastselectedcategory', JSON.stringify(c_data));

    console.log(currentCategory)


    // Initial render of the table with the first category
    renderTable(responseData);
}

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

    // Render the header row based on the subcategory levels (dynamic number of columns)
    categoryTableHeader.innerHTML = `
        <th class="py-2 px-4 text-left text-lg font-medium text-center">دسته بندی</th>
        <th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 2</th>
        ${subcategories.some(sub => sub.level_3) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 3</th>' : ''}
        ${subcategories.some(sub => sub.level_4) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 4</th>' : ''}
        ${subcategories.some(sub => sub.level_5) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 5</th>' : ''}
        ${subcategories.some(sub => sub.level_6) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 6</th>' : ''}
        ${subcategories.some(sub => sub.level_7) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 7</th>' : ''}
        ${subcategories.some(sub => sub.level_8) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 8</th>' : ''}
        ${subcategories.some(sub => sub.level_9) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 9</th>' : ''}
        ${subcategories.some(sub => sub.level_10) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 10</th>' : ''}
    `;

    // Render the rows for each subcategory
    subcategories.forEach(subcategory => {
        const level3Subcategories = subcategory.level_3 || [];
        const level4Subcategories = subcategory.level_4 || [];
        const level5Subcategories = subcategory.level_5 || [];
        const level6Subcategories = subcategory.level_6 || [];
        const level7Subcategories = subcategory.level_7 || [];
        const level8Subcategories = subcategory.level_8 || [];
        const level9Subcategories = subcategory.level_9 || [];
        const level10Subcategories = subcategory.level_10 || [];

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

// Recursive function to render subcategories dynamically for each level
function renderSubcategories(subcategories, level) {
    return subcategories.map(subcategory => {
        const isLastLevel = !subcategory[`level_${level + 1}`] || subcategory[`level_${level + 1}`].length === 0;

// ${isLastLevel ? `<button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${subcategory.name_fa}','${subcategory.slug_fa}')">لیست پروداکت ها</button>` : ''}
        
        const buttons = `
            <div class="flex space-x-2 mt-2 justify-evenly">
                <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm" onclick="gotocharts('${subcategory.name_fa}','${subcategory.slug_fa}')">اطلاعات بیشتر</button>
                
                 <button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${subcategory.name_fa}','${subcategory.slug_fa}')">لیست پروداکت ها</button>
                ${isLastLevel ? `<button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm p-4" onclick="llm_analysis('${subcategory.name_fa}','${subcategory.slug_fa}')">تحلیل هوش مصنوعی</button>` : ''}
            </div>
        `;
        return `
            <div class="category-card p-3 border border-gray-300 rounded-lg m-4">
                <div class="flex justify-between">
                    <p class="font-semibold text-sm">${subcategory.name_fa} (ID: ${subcategory._id})</p>
                    ${subcategory.updatedAt ? `<span class="text-xs text-gray-500 mt-2">آخرین بروزرسانی در : ${moment(subcategory.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500 mt-2">ایجاد شده در : ${moment(subcategory.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}
                </div>
                ${buttons}
                <div class='flex justify-evenly'>  
                    ${isLastLevel ? '<span class="text-xs text-gray-500 mt-2">آخرین سطح</span>' : ''}
                    ${subcategory.expert_approved ? `<span class="text-xs text-gray-500 mt-2">${subcategory.expert_approved}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// function renderTable(responseData) {
//     const categoryTableBody = document.getElementById('categoryTableBody');
//     const categoryTableHeader = document.getElementById('categoryTableHeader');
//     categoryTableBody.innerHTML = '';
//     categoryTableHeader.innerHTML = '';

//     // Find the selected top-level category by its name_fa (currentCategory)
//     let selectedCategory = null;

//     // Loop through the categories and check if the main category matches currentCategory
//     Object.values(responseData.data).forEach(category => {
//         Object.values(category).forEach(mainCategory => {
//             if (mainCategory.name_fa === currentCategory) {
//                 selectedCategory = mainCategory;
//             }
//         });
//     });

//     console.log('Selected Category:', selectedCategory); // Log the selected category

//     if (!selectedCategory) {
//         console.log('Category not found for', currentCategory); // Log if the selected category is not found
//         return; // If category not found, exit
//     }

//     const subcategories = selectedCategory.level_2 || []; // Get the second level subcategories

//     console.log('Subcategories:', subcategories); // Log subcategories for debugging

//     // Render the header row based on the subcategory levels (dynamic number of columns)
//     categoryTableHeader.innerHTML = `
//         <th class="py-2 px-4 text-left text-lg font-medium text-center">دسته بندی</th>
//         <th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 2</th>
//         ${subcategories.some(sub => sub.level_3) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 3</th>' : ''}
//         ${subcategories.some(sub => sub.level_4) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 4</th>' : ''}
//         ${subcategories.some(sub => sub.level_5) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 5</th>' : ''}
//         ${subcategories.some(sub => sub.level_6) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 6</th>' : ''}
//         ${subcategories.some(sub => sub.level_7) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 7</th>' : ''}
//         ${subcategories.some(sub => sub.level_8) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 8</th>' : ''}
//         ${subcategories.some(sub => sub.level_9) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 9</th>' : ''}
//         ${subcategories.some(sub => sub.level_10) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 10</th>' : ''}
//     `;

//     // Render the rows for each subcategory recursively
//     subcategories.forEach(subcategory => {
//         renderSubcategoryRow(subcategory, categoryTableBody, 2);
//     });
// }

// // Recursive function to render subcategories dynamically for each level
// function renderSubcategoryRow(subcategory, categoryTableBody, level) {
//     const subcategories = subcategory[`level_${level}`] || [];
//     const nextLevel = level + 1;

//     // Start the row for this level
//     let rowHtml = `
//         <tr class="border-b">
//             <td class="py-2 px-4 font-semibold text-md">${subcategory.name_fa}</td>
//     `;

//     // Add the columns for this level
//     rowHtml += `<td class="py-2 px-4">${renderSubcategories([subcategory], level)}</td>`;

//     // Add columns for deeper levels recursively
//     for (let i = level + 1; i <= 10; i++) {
//         if (subcategory[`level_${i}`]) {
//             rowHtml += `<td class="py-2 px-4">${renderSubcategories(subcategory[`level_${i}`], i)}</td>`;
//         } else {
//             rowHtml += `<td class="py-2 px-4"></td>`;  // Empty cell if no subcategories
//         }
//     }

//     rowHtml += `</tr>`;
//     categoryTableBody.innerHTML += rowHtml;

//     // If there are subcategories at the next level, call the function recursively
//     if (subcategories.length > 0) {
//         subcategories.forEach(sub => renderSubcategoryRow(sub, categoryTableBody, nextLevel));
//     }
// }

// // Function to render subcategories for each level, which will be called recursively
// function renderSubcategories(subcategories, level) {
//     return subcategories.map(subcategory => {
//         const isLastLevel = !subcategory[`level_${level + 1}`] || subcategory[`level_${level + 1}`].length === 0;

//         const buttons = `
//             <div class="flex space-x-2 mt-2 justify-evenly">
//                 <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm" onclick="gotocharts('${subcategory.name_fa}','${subcategory.slug_fa}')">اطلاعات بیشتر</button>
//                 ${isLastLevel ?  `<button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${subcategory.name_fa}','${subcategory.slug_fa}')">لیست پروداکت ها</button>` : ``}
//                 ${isLastLevel ?  `<button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm p-4" onclick="llm_analysis('${subcategory.name_fa}','${subcategory.slug_fa}')">تحلیل هوش مصنوعی</button>` : ``}
//             </div>
//         `;
        
//         return `
//             <div class="category-card p-3 border border-gray-300 rounded-lg m-4">
//                 <div class="flex justify-between">
//                     <p class="font-semibold text-sm">${subcategory.name_fa} (ID: ${subcategory._id})</p>
//                     ${subcategory.updatedAt ? `<span class="text-xs text-gray-500 mt-2">آخرین بروزرسانی در : ${moment(subcategory.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500 mt-2">ایجاد شده در : ${moment(subcategory.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}
//                 </div>
//                 ${buttons}
//                 ${isLastLevel ? '<span class="text-xs text-gray-500 mt-2">آخرین سطح</span>' : ''}
//             </div>
//         `;
//     }).join('');
// }

async function initialize_PAGE() {
    try {
        await fetchdata(); // Fetch data from the API
        console.log('Page Loaded and Data Fetched');
    } catch (error) {
        console.error('Error during data fetching: ' + error);
    }
}

function gotoproducts(name,slug) {
    console.log(name);
    
    const data = {
        category_name_fa: name,
        slug_fa: slug,
        all: false

      };

    localStorage.setItem('productResponse', JSON.stringify(data));  
    // localStorage.setItem('productResponse', JSON.stringify(name));  
    window.location.href = './product_table.html';
}

function gotocharts(name  , slug) {
    console.log(name);
    const data = {
        category_name_fa: name,
        slug_fa: slug,
      };

    localStorage.setItem('name_far', JSON.stringify(data));    
    window.location.href = './charts.html';
}



// Start loading and use `showLoader` to show the spinner
window.addEventListener('load', function() {
    showLoader(async function() {
        await initialize_PAGE();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
    });
});


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

   

    //  creat category functions 


    let parent = true

    document.getElementById('selectcategorytype_child').addEventListener('click' , () => {
        parent = false;
        document.getElementById('selectcategorytype_child').classList = 'border-2 border-teal-400 bg-teal-100 text-teal-600 font-semibold p-2 text-center rounded-lg cursor-pointer hover:shadow-lg transition'
        document.getElementById('selectcategorytype_parent').classList = 'border-2 border-gray-400 bg-gray-100 text-gray-600 font-semibold p-2 text-center rounded-lg cursor-pointer hover:shadow-lg transition'
        document.getElementById('parent_id_container').classList.remove('scale-y-0')

        document.getElementById('parent_id').value  = ''

    })



    document.getElementById('selectcategorytype_parent').addEventListener('click' , () => {
        parent = true;
        document.getElementById('selectcategorytype_parent').classList = 'border-2 border-teal-400 bg-teal-100 text-teal-600 font-semibold p-2 text-center rounded-lg cursor-pointer hover:shadow-lg transition'
        document.getElementById('selectcategorytype_child').classList = 'border-2 border-gray-400 bg-gray-100 text-gray-600 font-semibold p-2 text-center rounded-lg cursor-pointer hover:shadow-lg transition'
        document.getElementById('parent_id_container').classList.add('scale-y-0')
    
    })



    document.getElementById('creat_category_button').addEventListener('click' , () => {
        let parent_id = document.getElementById('parent_id').value  ? document.getElementById('parent_id').value  : ''
        let name = document.getElementById('name').value  ? document.getElementById('name').value  : ''
        let name_fa = document.getElementById('name_fa').value ? document.getElementById('name_fa').value  : ''

        CreateCategory(parent_id,name,name_fa)

    })


    document.getElementById('name_fa').addEventListener('input', function() {
        if  (document.getElementById('name_fa').value){
            document.getElementById('creat_category_button').classList.remove('opacity-0')
        } else {
            document.getElementById('creat_category_button').classList.add('opacity-0')
        }
    })


    async function CreateCategory(parent_id , name , name_fa) {
        try {
            const response = await fetch('http://79.175.177.113:21800/Categories/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    "Accept-Version": 1,
                    'Accept': "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'authorization': user_token,
                },
                body: {
                    "parent_id": parent_id,
                    "name": name,
                    "name_fa": name_fa
                }
            });

    
            // Check if the response was successful (status code 2xx)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            alert('دسته با موفقیت ایجاد شد')
    
    
        } catch (error) {
            // Log and display the error to the user
            console.error('Error creating categories:', error);
            alert('Failed to creat categories: ' + error.message);
        }
    }