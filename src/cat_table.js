const user_token = '9fc0fe536ea09fed645f9f791fc15e65';

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
    Object.values(responseData.data).forEach(category => {
        Object.values(category).forEach(mainCategory => {
            const option = document.createElement('option');
            option.value = mainCategory.name_fa; // Set value to the category's name in Farsi (e.g., زیبایی و سلامت)
            option.innerHTML = mainCategory.name_fa; // Set display name to the category's name in Farsi
            categoryDropdown.appendChild(option);
        });
    });

    // Set the first category as the default selected category
    if (categoryDropdown.options.length > 0) {
        currentCategory = categoryDropdown.options[0].value;
    }

    // Trigger the table render when a category is selected
    categoryDropdown.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        renderTable(responseData);
    });

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
    const selectedCategory = Object.values(responseData.data).find(category =>
        category.name_fa === currentCategory
    );

    if (!selectedCategory) return; // If category not found, exit

    const mainCategory = selectedCategory[currentCategory]; // Get the main category object
    const subcategories = mainCategory.level_2 || []; // Get the second level subcategories

    // Render the header row based on the subcategory levels (dynamic number of columns)
    categoryTableHeader.innerHTML = `
        <th class="py-2 px-4 text-left text-lg font-medium text-center">دسته بندی</th>
        <th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 2</th>
        ${subcategories.some(sub => sub.level_3) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 3</th>' : ''}
    `;

    // Render the rows for each subcategory
    subcategories.forEach(subcategory => {
        const level3Subcategories = subcategory.level_3 || [];
        categoryTableBody.innerHTML += `
            <tr class="border-b">
                <td class="py-2 px-4 font-semibold text-md">${currentCategory}</td>
                <td class="py-2 px-4">${renderSubcategories([subcategory], 2)}</td>
                ${level3Subcategories.length > 0 ? `<td class="py-2 px-4">${renderSubcategories(level3Subcategories, 3)}</td>` : ''}
            </tr>
        `;
    });
}

// Recursive function to render subcategories dynamically for each level
function renderSubcategories(subcategories, level) {
    return subcategories.map(subcategory => {
        const isLastLevel = !subcategory.level_3 || subcategory.level_3.length === 0;

        const buttons = `
            <div class="flex space-x-2 mt-2 justify-evenly">
                <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm">اطلاعات بیشتر</button>
                ${isLastLevel ?  `<button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick='gotoproducts("${subcategory.name_fa}")'>لیست پروداکت ها</button>` : ``}
            </div>
        `;
        return `
            <div class="category-card p-3 border border-gray-300 rounded-lg m-4">
                <div class="flex justify-between">
                    <p class="font-semibold text-sm">${subcategory.name_fa} (ID: ${subcategory._id})</p>
                    ${subcategory.updatedAt ? `<span class="text-xs text-gray-500 mt-2">آخرین بروزرسانی در : ${moment(subcategory.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500 mt-2">ایجاد شده در : ${moment(subcategory.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}
                </div>
                ${buttons}
                ${isLastLevel ? '<span class="text-xs text-gray-500 mt-2">آخرین سطح</span>' : ''}
            </div>
        `;
    }).join('');
}

async function initialize() {
    try {
        await fetchdata(); // Fetch data from the API
        console.log('Page Loaded and Data Fetched');
    } catch (error) {
        console.error('Error during data fetching: ' + error);
    }
}

function gotoproducts(name) {
    localStorage.setItem('productResponse', JSON.stringify(name));  
    window.location.href = './product_table.html';
}

// Start loading and use `showLoader` to show the spinner
window.addEventListener('load', function() {
    showLoader(async function() {
        await initialize();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
    });
});
