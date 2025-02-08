function llm_analysis(name , slug){
    data = {
        'name_fa' : name ,
        'slug' : slug 
    }

    sessionStorage.setItem('categorydata', JSON.stringify(data));

    window.location.href = './llm_tags.html'
}

async function fetchdata() {
    try {
        if (JSON.parse(sessionStorage.getItem('categoryall'))) {
            const data =JSON.parse(sessionStorage.getItem('categoryall'))
            renderCategoryDropdown(data);  
        } else {
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
        console.log('Fetched Data:', data);

        // Check if the response contains valid categories data
        if (data && data.data && data.data['Saleman_bot']) {
            
            sessionStorage.setItem('categoryall', JSON.stringify(data));
            renderCategoryDropdown(data);  
        } else {
            throw new Error('Invalid data format: "Saleman_bot" not found in the response.');
        }
    }

    } catch (error) {
        // Log and display the error to the user
        console.error('Error Getting categories:', error);
        alert('Failed to load categories: ' + error.message);
    }

}



    // Get the select element by its ID
    const selectElement = document.getElementById('category');

    let selectedOptionId = '675ec5272c0c13458ebea1fd'
    let selectedOptionname = 'زیبایی و بهداشت'

    // Add an event listener to detect changes in selection
    selectElement.addEventListener('change', function() {
      // Get the selected option element
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      
      // Retrieve the id of the selected option
      selectedOptionId = selectedOption.id;
      selectedOptionname = selectedOption.value;

      
      // Log the id to the console (or use it as needed)
      console.log('Selected option id:', selectedOptionId);
    });

function gotobrand() {


    data = {
        'name_fa' : selectedOptionname,
        '_id' : selectedOptionId
    }

    sessionStorage.setItem('brand_cat', JSON.stringify(data));

    window.location.href = 'brand_cat.html'

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
            option.value = mainCategory.name_fa;
            option.id = mainCategory._id; 
           
            option.innerHTML = mainCategory.name_fa; // Set display name to the category's name in Farsi
            categoryDropdown.appendChild(option);
        });
    });

    console.log(sessionStorage.getItem('lastselectedcategory'))
    
    
    if (sessionStorage.getItem('lastselectedcategory')){
        currentCategory = JSON.parse(sessionStorage.getItem('lastselectedcategory')).c_value
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
        sessionStorage.setItem('lastselectedcategory', JSON.stringify(c_data));
        currentCategory = JSON.parse(sessionStorage.getItem('lastselectedcategory')).c_value
        console.log('change:' , currentCategory)

        renderTable(responseData);
    });

    let c_data = {
        'c_value' : currentCategory
    }

    sessionStorage.setItem('lastselectedcategory', JSON.stringify(c_data));

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
    console.log(subcategories.some(sub => sub.level_3) );

    
    
// Render the header row based on the subcategory levels (dynamic number of columns)
categoryTableHeader.innerHTML = `
    <th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 2</th>
    ${subcategories.some(sub => sub.level_3?.length) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 3</th>' : ''}
    ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.length)) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 4</th>' : ''}
    ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.some(l4 => l4.level_5?.length))) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 5</th>' : ''}
    ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.some(l4 => l4.level_5?.some(l5 => l5.level_6?.length)))) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 6</th>' : ''}
    ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.some(l4 => l4.level_5?.some(l5 => l5.level_6?.some(l6 => l6.level_7?.length))))) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 7</th>' : ''}
    ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.some(l4 => l4.level_5?.some(l5 => l5.level_6?.some(l6 => l6.level_7?.some(l7 => l7.level_8?.length)))))) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 8</th>' : ''}
    ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.some(l4 => l4.level_5?.some(l5 => l5.level_6?.some(l6 => l6.level_7?.some(l7 => l7.level_8?.some(l8 => l8.level_9?.length))))))) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 9</th>' : ''}
    ${subcategories.some(sub => sub.level_3?.some(l3 => l3.level_4?.some(l4 => l4.level_5?.some(l5 => l5.level_6?.some(l6 => l6.level_7?.some(l7 => l7.level_8?.some(l8 => l8.level_9?.some(l9 => l9.level_10?.length)))))))) ? '<th class="py-2 px-4 text-left text-lg font-medium text-center">سطح 10</th>' : ''}
`;

// Render the rows for each subcategory
subcategories.forEach(subcategory => {
    const level3Items = subcategory.level_3 || [];

    if (!level3Items.length) {
        categoryTableBody.innerHTML += `
            <tr>
                
                <td class="py-2 px-4"><div class="p-6  w-fit border-2">
                ${subcategory.name_fa || "N/A"}(ID : ${subcategory._id})
        <div class="flex justify-center gap-2 flex-col">

            <div class="flex gap-4 justify-center">${subcategory ? `<span class="text-xs text-gray-500">Expert approved : ${subcategory.expert_approved}   <span class="text-xs text-violet-500 cursor-pointer"  onclick="ChangeApprove('${subcategory.name_fa}' , '${subcategory.expert_approved}')">change</span></span>` : ''}${subcategory.updatedAt ? `<span class="text-xs text-gray-500">آخرین بروزرسانی در : ${moment(subcategory.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500">ایجاد شده در : ${moment(subcategory.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}</div>
            <div class="flex gap-4 justify-center">${subcategory.basic_info ? `<span class="text-xs text-gray-500 mt-2">Total items : ${subcategory.basic_info.total_product_count}</span>` : '0'}</span></div>llm_processing_products_count
            <div class="flex gap-4 justify-center">${subcategory.basic_info ? `<span class="text-xs text-gray-500 mt-2">In stock : ${subcategory.basic_info.in_stock_count}</span><span class="text-xs text-gray-500 mt-2">llm proccessing : ${subcategory.basic_info.llm_processing_products_count}</span>` : '0'}</span></div>

            <div></div>
            <div></div>

        </div>

        <div class="flex gap-2 justify-center">

            <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm" onclick="gotocharts('${subcategory.name_fa}','${subcategory.slug_fa}')">اطلاعات بیشتر</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${subcategory.name_fa}','${subcategory.slug_fa}')">لیست پروداکت ها</button>

        </div>

        <div class="flex gap-2 justify-center">

            
            <button class="px-3 py-1 bg-violet-500 text-white rounded-md text-sm p-4 mt-4" onclick="Open_info_modal('${subcategory._id}')">درج توضیحات</button>

        </div>
        
    </div></td>
            </tr>
        `;
    } else {
        level3Items.forEach(level3 => {
            const level4Items = level3.level_4 || [];
            if (!level4Items.length) {
                categoryTableBody.innerHTML += `
                    <tr>
                        
                        <td class="py-2 px-4"><div class="p-6  w-fit border-2">
                        ${subcategory.name_fa || "N/A"}(ID : ${subcategory._id})
        <div class="flex justify-center gap-2 flex-col">

            <div class="flex gap-4 justify-center">${subcategory ? `<span class="text-xs text-gray-500">Expert approved : ${subcategory.expert_approved}   <span class="text-xs text-violet-500 cursor-pointer"  onclick="ChangeApprove('${subcategory.name_fa}' , '${subcategory.expert_approved}')">change</span></span>` : ''}${subcategory.updatedAt ? `<span class="text-xs text-gray-500">آخرین بروزرسانی در : ${moment(subcategory.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500">ایجاد شده در : ${moment(subcategory.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}</div>
            <div class="flex gap-4 justify-center">${subcategory.basic_info ? `<span class="text-xs text-gray-500 mt-2">Total items : ${subcategory.basic_info.total_product_count}</span>` : '0'}</span></div>
            <div class="flex gap-4 justify-center">${subcategory.basic_info ? `<span class="text-xs text-gray-500 mt-2">In stock : ${subcategory.basic_info.in_stock_count}</span><span class="text-xs text-gray-500 mt-2">llm proccessing : ${subcategory.basic_info.llm_processing_products_count}</span>` : '0'}</div>

            <div></div>
            <div></div>

        </div>

        <div class="flex gap-2 justify-center">

            <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm" onclick="gotocharts('${subcategory.name_fa}','${subcategory.slug_fa}')">اطلاعات بیشتر</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${subcategory.name_fa}','${subcategory.slug_fa}')">لیست پروداکت ها</button>

        </div>

          <div class="flex gap-2 justify-center">

            
            <button class="px-3 py-1 bg-violet-500 text-white rounded-md text-sm p-4 mt-4" onclick="Open_info_modal('${subcategory._id}')">درج توضیحات</button>

        </div>
        
        
    </div></td>
                        <td class="py-2 px-4 "><div class="p-6  w-fit border-2">
                        ${level3.name_fa || "N/A"}(ID : ${level3._id})
        <div class="flex justify-center gap-2 flex-col">

            <div class="flex gap-4 justify-center">${level3 ? `<span class="text-xs text-gray-500">Expert approved : ${level3.expert_approved}   <span class="text-xs text-violet-500 cursor-pointer"  onclick="ChangeApprove('${level3.name_fa}' , '${level3.expert_approved}')">change</span></span>` : ''}${level3.updatedAt ? `<span class="text-xs text-gray-500">آخرین بروزرسانی در : ${moment(level3.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500">ایجاد شده در : ${moment(level3.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}</div>
            <div class="flex gap-4 justify-center">${level3.basic_info ? `<span class="text-xs text-gray-500 mt-2">Total items : ${level3.basic_info.total_product_count}</span>` : '0'}</span></div>
            <div class="flex gap-4 justify-center">${level3.basic_info ? `<span class="text-xs text-gray-500 mt-2">In stock : ${level3.basic_info.in_stock_count}</span><span class="text-xs text-gray-500 mt-2">llm proccessing : ${level3.basic_info.llm_processing_products_count}</span>` : '0'}</div>

            <div></div>
            <div></div>

        </div>

        <div class="flex gap-2 justify-center">

            <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm" onclick="gotocharts('${level3.name_fa}','${level3.slug_fa}')">اطلاعات بیشتر</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${level3.name_fa}','${level3.slug_fa}')">لیست پروداکت ها</button>

        </div>


        <div class="flex gap-2 justify-center">

            
            <button class="px-3 py-1 bg-violet-500 text-white rounded-md text-sm p-4 mt-4" onclick="Open_info_modal('${level3._id}')">درج توضیحات</button>

        </div>
        
        
    </div></td>
                        <td colspan="7" class="py-2 px-4 text-center">N/A</td>
                    </tr>
                `;
            } else {
                level4Items.forEach(level4 => {
                    
                    const level5Items = level4.level_5 || [];
                    const level6Items = level5Items.flatMap(l5 => l5.level_6 || []);
                    const level7Items = level6Items.flatMap(l6 => l6.level_7 || []);
                    const level8Items = level7Items.flatMap(l7 => l7.level_8 || []);
                    const level9Items = level8Items.flatMap(l8 => l8.level_9 || []);
                    const level10Items = level9Items.flatMap(l9 => l9.level_10 || []);


                    console.log(level5Items);

                    categoryTableBody.innerHTML += `
                        <tr>
                            
                            <td class="py-2 px-4"><div class="p-6  w-fit border-2">
                            ${subcategory.name_fa || "N/A"}(ID : ${subcategory._id})
        <div class="flex justify-center gap-2 flex-col">

            <div class="flex gap-4 justify-center">${subcategory ? `<span class="text-xs text-gray-500">Expert approved : ${subcategory.expert_approved}   <span class="text-xs text-violet-500 cursor-pointer"  onclick="ChangeApprove('${subcategory.name_fa}' , '${subcategory.expert_approved}')">change</span></span>` : ''}${subcategory.updatedAt ? `<span class="text-xs text-gray-500">آخرین بروزرسانی در : ${moment(subcategory.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500">ایجاد شده در : ${moment(subcategory.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}</div>
            <div class="flex gap-4 justify-center">${subcategory.basic_info ? `<span class="text-xs text-gray-500 mt-2">Total items : ${subcategory.basic_info.total_product_count}</span>` : '0'}</span></div>
            <div class="flex gap-4 justify-center">${subcategory.basic_info ? `<span class="text-xs text-gray-500 mt-2">In stock : ${subcategory.basic_info.in_stock_count}</span><span class="text-xs text-gray-500 mt-2">llm proccessing : ${subcategory.basic_info.llm_processing_products_count}</span>` : '0'}</div>

            <div></div>
            <div></div>

        </div>

        <div class="flex gap-2 justify-center">

            <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm" onclick="gotocharts('${subcategory.name_fa}','${subcategory.slug_fa}')">اطلاعات بیشتر</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${subcategory.name_fa}','${subcategory.slug_fa}')">لیست پروداکت ها</button>

        </div>

         <div class="flex gap-2 justify-center">

            
            <button class="px-3 py-1 bg-violet-500 text-white rounded-md text-sm p-4 mt-4" onclick="Open_info_modal('${subcategory._id}')">درج توضیحات</button>

        </div>
        
    </div></td>
                            <td class="py-2 px-4"><div class="p-6  w-fit border-2">
                            ${level3.name_fa || "N/A"}(ID : ${level3._id})
        <div class="flex justify-center gap-2 flex-col">

            <div class="flex gap-4 justify-center">${level3 ? `<span class="text-xs text-gray-500">Expert approved : ${level3.expert_approved}   <span class="text-xs text-violet-500 cursor-pointer"  onclick="ChangeApprove('${level3.name_fa}' , '${level3.expert_approved}')">change</span></span>` : ''}${level3.updatedAt ? `<span class="text-xs text-gray-500">آخرین بروزرسانی در : ${moment(level3.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500">ایجاد شده در : ${moment(level3.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}</div>
            <div class="flex gap-4 justify-center">${level3.basic_info ? `<span class="text-xs text-gray-500 mt-2">Total items : ${level3.basic_info.total_product_count}</span>` : '0'}</span></div>
            <div class="flex gap-4 justify-center">${level3.basic_info ? `<span class="text-xs text-gray-500 mt-2">In stock : ${level3.basic_info.in_stock_count}</span><span class="text-xs text-gray-500 mt-2">llm proccessing : ${level3.basic_info.llm_processing_products_count}</span>` : '0'}</div>

            <div></div>
            <div></div>

        </div>

        <div class="flex gap-2 justify-center">

            <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm" onclick="gotocharts('${level3.name_fa}','${level3.slug_fa}')">اطلاعات بیشتر</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${level3.name_fa}','${level3.slug_fa}')">لیست پروداکت ها</button>

        </div>

        <div class="flex gap-2 justify-center">

            
            <button class="px-3 py-1 bg-violet-500 text-white rounded-md text-sm p-4 mt-4" onclick="Open_info_modal('${level3._id}')">درج توضیحات</button>

        </div>
        
    </div></td>
                            <td class="py-2 px-4"><div><div class="p-6  w-fit border-2">
                            ${level4.name_fa || "N/A"}(ID : ${level4._id})
        <div class="flex justify-center gap-2 flex-col">

            <div class="flex gap-4 justify-center">${level4 ? `<span class="text-xs text-gray-500">Expert approved : ${level4.expert_approved}   <span class="text-xs text-violet-500 cursor-pointer"  onclick="ChangeApprove('${level4.name_fa}' , '${level4.expert_approved}')">change</span></span>` : ''}${level4.updatedAt ? `<span class="text-xs text-gray-500">آخرین بروزرسانی در : ${moment(level4.updatedAt).format('jYYYY/jMM/jDD HH:mm:ss')}</span>` : `<span class="text-xs text-gray-500">ایجاد شده در : ${moment(level4.created_at).format('jYYYY/jMM/jDD HH:mm:ss')}</span>`}</div>
            <div class="flex gap-4 justify-center">${level4.basic_info ? `<span class="text-xs text-gray-500 mt-2">Total items : ${level4.basic_info.total_product_count}</span>` : '0'}</span></div>
                        <div class="flex gap-4 justify-center">${level4.basic_info ? `<span class="text-xs text-gray-500 mt-2">In stock : ${level4.basic_info.in_stock_count}</span><span class="text-xs text-gray-500 mt-2">llm proccessing : ${level4.basic_info.llm_processing_products_count}</span>` : '0'}</div>

            <div></div>
            <div></div>

        </div>

        <div class="flex gap-2 justify-center">

            <button class="px-3 py-1 bg-teal-500 text-white rounded-md text-sm" onclick="gotocharts('${level4.name_fa}','${level4.slug_fa}')">اطلاعات بیشتر</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm p-4" onclick="gotoproducts('${level4.name_fa}','${level4.slug_fa}')">لیست پروداکت ها</button>

        </div>


        <div class="flex gap-2 justify-center">

            
            <button class="px-3 py-1 bg-violet-500 text-white rounded-md text-sm p-4 mt-4" onclick="Open_info_modal('${level4._id}')">درج توضیحات</button>

        </div>
        
    </div> </td>
                           
                        </tr>
                    `;
                });
            }
        });
    }
});



// <td class="py-2 px-4">${renderSubcategories(level5Items, 5)}</td>
// <td class="py-2 px-4">${renderSubcategories(level6Items, 6)}</td>
// <td class="py-2 px-4">${renderSubcategories(level7Items, 7)}</td>
// <td class="py-2 px-4">${renderSubcategories(level8Items, 8)}</td>
// <td class="py-2 px-4">${renderSubcategories(level9Items, 9)}</td>
// <td class="py-2 px-4">${renderSubcategories(level10Items, 10)}</td>
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
                <div class='flex justify-between'>  
                    ${isLastLevel ? '<span class="text-xs text-gray-500 mt-2">آخرین سطح</span>' : ''}
                    ${subcategory ? `<span class="text-xs text-gray-500 mt-2">Expert approved : ${subcategory.expert_approved}   <span class="text-xs text-violet-500 mt-2 cursor-pointer"  onclick="ChangeApprove('${subcategory.name_fa}' , '${subcategory.expert_approved}')">change</span></span>` : ''}
                    ${subcategory.basic_info ? `<span class="text-xs text-gray-500 mt-2">Total items : ${subcategory.basic_info.total_product_count}</span>` : ''}

                </div>
            </div>
        `;
    }).join('');
}



async function ChangeApprove(name_fa , approved) {

    binary_approve = 0

    if (approved) {

        binary_approve = 0
    
    } else {

        binary_approve = 1
    
    }

    try {
        const response = await fetch('http://79.175.177.113:21800/Categories/approve_llm_tags/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                'Authorization': user_token,
            },
            body: JSON.stringify({
                "name_fa": name_fa,
                "approve_state": binary_approve
            })
        });
    
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log('Fetched Data:', data);
        console.log('Approve State:', binary_approve);
    
        sessionStorage.removeItem('categoryall'); 
      
        window.location.reload(); 
    
    } catch (error) {
        console.error('Fetch Error:', error);
    }

     

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

    sessionStorage.setItem('productResponse', JSON.stringify(data));  
    // sessionStorage.setItem('productResponse', JSON.stringify(name));  
    window.location.href = './product_table.html';
}

function gotocharts(name  , slug) {
    console.log(name);
    const data = {
        category_name_fa: name,
        slug_fa: slug,
      };

    sessionStorage.setItem('name_far', JSON.stringify(data));    
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

            let data = await response.json()
            console.log(data);
            
            alert('دسته با موفقیت ایجاد شد')
    
    
        } catch (error) {
            // Log and display the error to the user
            console.error('Error creating categories:', error);
            alert('Failed to creat categories: ' + error.message);
        }
    }






    async function Open_info_modal(id) {

        tabels = document.getElementById('findCategoryContent')
        
        tabels.classList.add('opacity-20')

        modal_container = document.getElementById('info_change_modal')

        modal_container.classList.remove('hidden')

        close_button = document.getElementById('close_info_modal')

        close_button.addEventListener('click' , () => {

            tabels.classList.remove('opacity-20')
            modal_container.classList.add('hidden')
        })


        confirm_botton = document.getElementById('confirm_info_button')
        confirm_botton.addEventListener('click' , () => {
            push_info(id)

            tabels.classList.remove('opacity-20')
            modal_container.classList.add('hidden')

        })
       

        
    }


    async function push_info(id) {

        try {

            const response = await fetch('http://79.175.177.113:21800/Categories/update_category_usage_advices/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },

            body: JSON.stringify({

                "category_id": id,
                "advice": document.getElementById('category_info_input').value

                })

            });

            // Check if the response was successful (status code 2xx)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            // const data = await response.json();
            // console.log('New info :', data);
            
        } catch (error) {

            console.log(error);
            
            
        }
        
    }