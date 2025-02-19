const productTableContainer = document.getElementById("TableBody");
const info_container = document.getElementById("info_container");

let pageNumber = document.getElementById('pageNumber').value;
let itemsPerPage = document.getElementById('itemsPerPage').value;
let productData = JSON.parse(sessionStorage.getItem('productResponse'));
let name = productData.category_name_fa;
let nameqwe = productData.category_name_fa;
let is_all = productData.category_name_fa.all;
let slug_fa = productData.slug_fa;


let page_size = 10;
let page_num = 1;
let test;

const pagenum = document.getElementById('PageNumber')


function closeinfopopup() {
    document.getElementById('mainContent').classList.remove('pointer-events-none')

    document.getElementById('mainContent').classList.remove('opacity-20')
    document.getElementById('baseInfoContainer').classList.add('hidden')



}
pagenum.addEventListener('click', function () {
    document.getElementById('paginatecontainer').classList.remove('hidden')
    document.getElementById('mainContent').classList.add('hidden')


})

document.getElementById('pagibutton').addEventListener('click', function (event) {
    showLoader(async function () {

        try {



            document.getElementById('paginatecontainer').classList.add('hidden')
            document.getElementById('mainContent').classList.remove('hidden')

            if (document.getElementById('pageNumber').value > 0) {
                page_num = parseInt(document.getElementById('pageNumber').value)
            } else {
                page_num = 1
            }

            if (document.getElementById('pageNumber').value > 0) {
                page_size = parseInt(document.getElementById('itemsPerPage').value)
            } else {
                page_size = 10
            }




            pagenum.innerHTML = page_num
            if (page_num == 1) {
                document.getElementById('PrevPageButton').classList.add('hidden')
            } else {
                document.getElementById('PrevPageButton').classList.remove('hidden')
            }



            if (page_num == total_pages) {
                document.getElementById('NextPageButton').classList.add('hidden')
            } else {
                document.getElementById('NextPageButton').classList.remove('hidden')
            }



            console.log(JSON.stringify({
                "category_name_fa": nameqwe,
                "page": page_num,
                "page_limit": page_size
            }));

            if (search_state) {
                
                await findproducts(searchBar.value, page_num, page_size);


            } else {


                const response = await fetch('http://79.175.177.113:21800/Products/get_products_paginated/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept-Version": 1,
                        'Accept': "application/json",
                        "Access-Control-Allow-Origin": "*",
                        'authorization': user_token,
                    },
                    body: JSON.stringify({
                        "category_name_fa": nameqwe,
                        "page": page_num,
                        "page_limit": page_size,
                        "all_products": is_all
                    })
                });
    
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
    
                const data = await response.json();
    
                if (data) {
                    console.log(data);
    
                    updateui(data);
                }

            }

           



        } catch (error) {
            // Log and display the error to the user
            console.error('Error Getting products:', error);
            alert('Failed to load products: ' + error.message);
        }
    })
}


);

async function GetProduct(name_fa, page_num, page_size) {
    try {


        const response = await fetch('http://79.175.177.113:21800/Products/get_products_paginated/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
            body: JSON.stringify({
                "category_name_fa": name_fa,
                "page": page_num,
                "page_limit": page_size,
                "all_products": is_all

            })
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response contains valid categories data
        if (data) {
            console.log(data);

            updateui(data);  // Call the update UI function with the response data
        }

    } catch (error) {
        // Log and display the error to the user
        console.error('Error Getting products:', error);
        alert('Failed to load products: ' + error.message);
    }
}


async function findproducts(name_fa, page_num, page_size) {  // No need to pass "name" if it's not being used
    try {
        document.getElementById('pageNumber').value = page_num
        document.getElementById('itemsPerPage').value = page_size


        console.log(JSON.stringify({
            "name": '',
            "name_fa": name_fa,
            "page": page_num,
            "page_size": page_size
        }));

        const response = await fetch('http://79.175.177.113:21800/Products/search_product_by_name/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
            body: JSON.stringify({
                "name": '',
                "name_fa": name_fa,
                "page": 1,
                "page_size": 10
            })
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response contains valid product data
        if (data) {
            console.log(data);



            updateui(data);  // Call the update UI function with the response data
        }

    } catch (error) {
        // Log and display the error to the user
        console.error('Error searching products:', error);
        alert('Failed to search products: ' + error.message);
    }
}


let total_pages
function updateui(data) {



    // if (page_num == total_pages){
    //     document.getElementById('NextPageButton').classList.add('hidden')
    // } else {
    //     document.getElementById('NextPageButton').classList.remove('hidden')
    // }


    // if (page_num == 1){
    //     document.getElementById('PrevPageButton').classList.add('hidden')
    //   } else {
    //     document.getElementById('PrevPageButton').classList.remove('hidden')
    //   }



    let products = data.data.result;

    document.getElementById('totalpages').innerHTML = `کل صفحات: ${data.data.total_pages}`
    document.getElementById('totalcounts').innerHTML = `کل موارد: ${data.data.total_count} `

    total_pages = data.data.total_pages;

    console.log('test for ' , products , data);


    createProductTable(products);


    document.querySelectorAll('.peer').forEach(checkbox => { checkbox.addEventListener('change', event => { if (event.target.checked) { CreateCard(`${checkbox.id}`); } else { RemoveCard(`${checkbox.id}`); } }); });


    isloading = true;

}


function updateui_S(data) {


    let products = data.data.results;


    createProductTable(products);


    document.querySelectorAll('.peer').forEach(checkbox => { checkbox.addEventListener('change', event => { if (event.target.checked) { CreateCard(`${checkbox.id}`); } else { RemoveCard(`${checkbox.id}`); } }); });

}



// Get DOM elements
const searchBar = document.getElementById('searchBar');
const searchColumn = document.getElementById('searchColumn');
const tableBody = document.getElementById('TableBody');
const searchbutton = document.getElementById('SearchButton');
const refreshButton = document.getElementById('refreshButton');

let search_state = false

searchbutton.addEventListener('click', function () {
    showLoader(async function () {
        document.getElementById('mainContent').classList.add('hidden');
        search_state = true

        await findproducts(searchBar.value, page_num, page_size);
        document.getElementById('mainContent').classList.remove('hidden');
    });
});



refreshButton.addEventListener('click', function () {
    showLoader(async function () {
        document.getElementById('mainContent').classList.add('hidden'); // Show main content

        await GetProduct(productData.category_name_fa, page_num, page_size);
        search_state = false;
        searchBar.value = ''
        searchbutton.classList.add('hidden')
        refreshButton.classList.add('hidden')
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
    });
});



// Listen for input in the search bar
searchBar.addEventListener('input', function () {
    const query = searchBar.value.toLowerCase();
    console.log(query);

    const columnIndex = searchColumn.value;

    const rows = tableBody.getElementsByTagName('tr');
    if (columnIndex != 'all_C') {
        Array.from(rows).forEach(row => {
            // Collect all the cell data
            const cells = row.getElementsByTagName('td');

            let shouldDisplay = false;

            // Search logic depending on the selected column
            if (columnIndex === 'all') {
                searchbutton.classList.add('hidden')
                // Search all columns and their child elements
                for (let i = 0; i < cells.length; i++) {
                    // Check if any text within child elements of the cell matches
                    const cellText = getTextFromElement(cells[i]);
                    if (cellText.toLowerCase().includes(query)) {
                        shouldDisplay = true;
                        break;
                    }
                }
            } else if (columnIndex === 'all_C') {

                searchbutton.classList.remove('hidden')
                refreshButton.classList.remove('hidden')





            } else {
                // Search a specific column and its child elements
                searchbutton.classList.add('hidden')

                const cell = cells[columnIndex];
                console.log(columnIndex);

                if (cell) {
                    const cellText = getTextFromElement(cell);
                    if (cellText.toLowerCase().includes(query)) {
                        shouldDisplay = true;
                    }
                }
            }

            // Display or hide the row based on the search result
            row.style.display = shouldDisplay ? '' : 'none';
        });

    } else if (columnIndex === 'all_C') {

        if (query != '') {

            searchbutton.classList.remove('hidden')
            refreshButton.classList.remove('hidden')

        }
        else if ((query == '')) {
            console.log('works');

            searchbutton.classList.add('hidden')
        }



    }
});

// Helper function to get all text content from a cell, including its child elements
function getTextFromElement(element) {
    // Get the combined text of the element and its children
    return element.textContent || element.innerText || '';
}


// Arrays to store all products and checkboxes
let allProducts = [];
let allCheckboxes = [];
let allSelected = false; // Flag to track whether all items are selected

function selectAllItems(products, checkboxes) {
    if (allSelected) {
        // Deselect all items
        products.forEach((product, index) => {
            const checkbox = checkboxes[index];
            if (checkbox.querySelector("input").checked) {
                // Uncheck the checkbox
                checkbox.querySelector("input").checked = false;

                // Remove the product from selectedProducts
                selectedProducts = selectedProducts.filter(item => item.product_id !== product.product_info.product_id);
            }
        });
    } else {
        // Select all items
        products.forEach((product, index) => {
            const checkbox = checkboxes[index];
            if (!checkbox.querySelector("input").checked) {
                // Check the checkbox
                checkbox.querySelector("input").checked = true;

                // Add the product to selectedProducts
                selectedProducts.push({
                    mall_id: product.mall_info.mall_id,
                    product_id: product.product_info.product_id,
                    name: product.product_info.product_name_fa
                });
            }
        });
    }

    // Toggle the flag
    allSelected = !allSelected;

    // Update button visibility
    toggleChangeCategotyButtonVisibility();
    // toggleInfoButtonVisibility();
}

document.getElementById("selectAllButton").addEventListener("click", () => {
    selectAllItems(allProducts, allCheckboxes);
});


let addscroll = true
let selectedProducts
function createProductTable(products) {
    allProducts = [];
    allCheckboxes = [];
    if (addscroll) {
        console.log('works');

        productTableContainer.innerHTML = '';
    }

    console.log('product test');
    console.log(products);

    

    productTableContainer.innerHTML = '';

    addscroll = true
    console.log(products);

    selectedProducts = [];

    products.forEach(product => {
        const row = document.createElement("tr");
        row.className = "border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600";
        row.id = `TB${product._id}`;





        function generateStars(ratingValue) {
            const totalStars = 5;  // Total number of stars to display
            const fullStars = Math.floor((ratingValue / 100) * totalStars);  // Full stars based on rating
            const halfStars = (ratingValue % 100) / 100 * totalStars % 1 >= 0.5 ? 1 : 0;  // Half star logic
            const emptyStars = totalStars - fullStars - halfStars;  // Empty stars

            let starsHtml = '';

            // Add full stars
            for (let i = 0; i < fullStars; i++) {
                starsHtml += '<i class="fas fa-star"></i>';
            }

            // Add half star (if any)
            if (halfStars === 1) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>';
            }

            // Add empty stars
            for (let i = 0; i < emptyStars; i++) {
                starsHtml += '<i class="far fa-star"></i>';
            }

            return starsHtml;
        }



        // Product Info Cell
        const info = createTableCell(`
            <div class='flex flex-col'>
                <span class="text-gray-900 font-bold">شناسه: ${product.product_info.product_id}</span>
                <span class="text-gray-900 font-semibold">نام: ${product.product_info.product_name_fa}</span>
                ${product.product_info.price_stat ? `
                    <span class='flex gap-2 justify-center'>
                        <p class="text-gray-900 font-bold">قیمت :</p>
                        ${product.product_info.price_stat.avg ? `<span class="text-gray-900 font-bold">avg: ${(product.product_info.price_stat.avg / 10).toLocaleString()}</span>` : ''}
                        ${product.product_info.price_stat.min ? `<span class="text-gray-900 font-bold">min: ${(product.product_info.price_stat.min / 10).toLocaleString()}</span>` : ''}
                        ${product.product_info.price_stat.max ? `<span class="text-gray-900 font-bold">max: ${(product.product_info.price_stat.max / 10).toLocaleString()}</span>` : ''}
                        ${product.product_info.price_stat.variance ? `<span class="text-gray-900 font-bold">variance: ${(product.product_info.price_stat.variance / 10).toLocaleString()}</span>` : ''}
                    </span>
                ` : ''}
                
                <span class="text-gray-900 font-base">URL : <a class='text-blue-600' href='${product.product_info.scrape_url}'>${product.product_info.scrape_url}</a></span>
                 ${product.product_info.rate ? `
                <span class="text-gray-900 font-base">rate : ${generateStars(product.product_info.rate.ratingValue)} , rate count : ${product.product_info.rate.reviewCount} </span>
                    `: ''}
                <span class="text-gray-900 font-base">در دسترس بودن: <span class="${product.product_info.is_available ? 'text-green-700' : 'text-red-700'} font-base uppercase">${product.product_info.is_available}</span></span>
            </div>
        `);

        // Brand Info Cell

        // let obj = product.brand_info.brand_stat
        // const brandStatEntries = Object.entries(obj);*/
        // const resultString = brandStatEntries.map(([key, value]) => `${key} : ${value}`).join('<br/>');
        // <span class="text-gray-900 font-semibold">${resultString}</span>


        // const key = Object.keys(obj)[0];
        // const value = obj[key]; 
        // const resultString = `${key} : ${value}`;
        const brand = createTableCell(`
            <div class='flex flex-col gap-2'>
                <span class="text-gray-900 font-bold">نام برند: ${product.brand_info.brand_name}</span>
                <span class="text-gray-900 font-semibold">نام برند (فارسی): ${product.brand_info.brand_name_fa}</span>
                <span class="text-teal-900 font-semibold border rounded-md bg-teal-100 hover:bg-teal-500 border-teal-800 cursor-pointer " onclick="Open_Edit('${product.product_info.product_id}' , '${product.product_info.product_name_fa}')">تغییر دسته</span>
            </div>
        `);
        console.log('it is what it is');


        // Mall Info Cell
        const mall = createTableCell(`
            <div class='flex flex-col gap-2'>
                <span class="text-gray-900 font-bold">شناسه: ${product.mall_info.mall_id}</span>
                <span class="text-gray-900 font-semibold">نام: ${product.mall_info.mall_name}</span>
                <span class="text-gray-900 font-base">نام (فارسی): ${product.mall_info.mall_name}</span>
            </div>
        `);

        // Media Info Cell
        const media = createTableCell(`
            <div class='flex flex-col gap-2'>
                <img src="${product.media_info.primary_image}" width="100" height="100">
            </div>
        `);

        // Slug Cell (example: slug_fa is undefined, replace it with the actual value)
        const slug = createTableCell(`
            <div class='flex flex-col gap-2'>
                <span class="text-gray-900 font-bold">${product.product_info.category}</span>
            </div>
        `);

        // Availability Cell
        const availability = createTableCell(`
            <span class="text-sm ${product.is_available ? 'text-green-600' : 'text-red-600'} font-semibold">${product.is_available ? 'موجود' : 'تمام شده'}</span>
        `);

        // Product Name Cell
        const productName = createTableCell(product.product_name_fa);

        // Product ID Cell
        const productId = createTableCell(`
            <div dir="rtl">شناسه: ${product._id}</div>
        `);

        // Product URL Cell
        const productUrl = createTableCell(`
            <div dir="rtl">URL استخراج شده: <a href="${product.scrape_url}" target="_blank" class="text-blue-500 hover:text-blue-700">${product.scrape_url}</a></div>
        `);

        // Price Cell (handling missing price)
        const price = createTableCell(`
            <div>${product.price_stat && product.price_stat.avg ? `قیمت: ${(product.price_stat.avg / 10).toLocaleString()} تومان` : 'قیمت: موجود نیست'}</div>
        `);

        // Checkbox for row selection
        const checkbox = createTableCell(`<input type="checkbox" class="row-checkbox">`);
        checkbox.addEventListener('click', () => handleCheckboxClick(checkbox, product));
        // Add the checkbox element to the allCheckboxes array
        allCheckboxes.push(checkbox);
        allProducts.push(product);


        // Append Cells to Row
        row.appendChild(checkbox);
        row.appendChild(info);
        row.appendChild(brand);
        row.appendChild(mall);
        row.appendChild(media);
        row.appendChild(slug);
        // row.appendChild(availability);
        // row.appendChild(productName);
        // row.appendChild(productId);
        // row.appendChild(productUrl);
        // row.appendChild(price);

        // Append Row to Table
        productTableContainer.appendChild(row);
    });

    // Handle the "Show Info" button creation
    function handleCheckboxClick(checkbox, product) {
        const isSelected = checkbox.querySelector("input").checked;

        if (isSelected) {
            selectedProducts.push({
                mall_id: product.mall_info.mall_id,
                product_id: product.product_info.product_id,
                name: product.product_info.product_name_fa
            });
        } else {
            selectedProducts = selectedProducts.filter(item => item.product_id !== product.product_info.product_id);
        }

        toggleChangeCategotyButtonVisibility()

        toggleInfoButtonVisibility();
    }



    // Toggle visibility of "Show Info" button based on selection

    // Helper function to create table cells
    function createTableCell(innerHTML) {
        const cell = document.createElement("td");
        cell.className = "whitespace-nowrap px-6 py-4";
        cell.innerHTML = innerHTML;
        return cell;
    }
}


function toggleInfoButtonVisibility() {
    const infoButton = document.getElementById('Seeinfo');
    if (selectedProducts.length > 0 && infoButton.classList.contains('hidden')) {
        infoButton.classList.remove('hidden')

        infoButton.addEventListener('click', () => {
            sessionStorage.setItem('productsforinfo', JSON.stringify(selectedProducts));
            // sessionStorage.setItem('productResponse', JSON.stringify(name));  
            window.location.href = './product_info.html';
            console.log('Selected Products:', selectedProducts);
        });
    } else if (selectedProducts.length === 0) {
        infoButton.classList.add('hidden')


    }
}


// Toggle visibility of "Show Info" button based on selection
function toggleChangeCategotyButtonVisibility() {
    const ChangeButton = document.getElementById('SeeChange');
    if (selectedProducts.length > 0 && ChangeButton.classList.contains('hidden')) {
        ChangeButton.classList.remove('hidden')

        ChangeButton.addEventListener('click', () => {

            let ids = []
            // console.log(selectedProducts);
            for (let i = 0; i < selectedProducts.length; i++) {
                ids.push(selectedProducts[i].product_id)
            }

            // console.log(ids);

            Open_Edit_All(ids)

        });
    } else if (selectedProducts.length === 0) {
        ChangeButton.classList.add('hidden')


    }
}



function ToggleDropDown(id) {
    const Menu = document.getElementById(`M${id}`);
    Menu.classList.toggle('hidden')
}

let cards_info = { I: {}, R: {}, P: {}, Q: {} };
// Function to create a card with animation
// Function to create a card with animation
function CreateCard(id) {
    const thirdLetter = id.charAt(1); // Identify the third letter of the ID
    const cardInfo = cards_info[thirdLetter]; // Store card info for easy reference

    // Function to create a card with the given class and ID
    function createCardElement(cardId, colSpanClass) {
        const card = document.createElement("div");
        card.className = `bg-gradient-to-l from-slate-300 to-slate-100 text-slate-600 border border-slate-300 grid grid-col-2 justify-center p-4 m-4 gap-4 rounded-lg shadow-md ${colSpanClass} opacity-0 transition-all duration-500 ease-in-out transform scale-0`; // Initial opacity 0 and scale 0 for animation
        card.id = `C${cardId}`;
        card.innerHTML = `
            <div class="col-span-2 text-lg font-bold capitalize rounded-md">
                ID : C${cardId}
            </div>
            <div class="col-span-2  rounded-md">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore, reprehenderit. Ullam quod tenetur excepturi debitis laborum obcaecati asperiores aperiam soluta eius cupiditate! Nulla, consequuntur similique non ullam neque quibusdam assumenda.
            </div>
            <div class="col-span-1">
                pqwoepowekpoqkeok
            </div>
            <div>
                <label class="relative inline-block w-14 h-7">
                    <input type="checkbox" class="opacity-0 w-0 h-0 peer">
                    <span class="absolute inset-0 cursor-pointer bg-gray-300 rounded-lg transition-all duration-400 ease-in-out shadow-inner peer-checked:bg-gray-800"></span>
                    <span class="absolute left-1 bottom-1 h-5 w-1 rounded-sm bg-white transition-all duration-400 ease-in-out transform peer-checked:translate-x-10"></span>
                </label>
            </div>
        `;
        return card;
    }

    // If there are no cards, create the first one
    if (Object.keys(cardInfo).length === 0) {
        cardInfo[id] = true;
        const newCard = createCardElement(id, 'col-span-2');
        info_container.appendChild(newCard);

        // Animate the card into view
        setTimeout(() => newCard.classList.remove('opacity-0', 'scale-0'), 50);
    }
    // If there is one card, create a new one and move the existing card to col-span-2
    else if (Object.keys(cardInfo).length === 1) {
        let existingCardId = Object.keys(cardInfo)[0];
        let existingCard = document.getElementById(`C${existingCardId}`);

        existingCard.classList.toggle('col-span-2'); // Move existing card to col-span-2
        cardInfo[id] = true; // Add the new card info

        const newCard = createCardElement(id, 'col-span-1');
        info_container.appendChild(newCard);

        // Animate the card into view
        setTimeout(() => newCard.classList.remove('opacity-0', 'scale-0'), 50);

        existingCard.remove(); // Remove the existing card
        info_container.appendChild(existingCard); // Re-append the existing card
    }
    // If there are already two cards, alert the user and disable toggle
    else if (Object.keys(cardInfo).length === 2) {
        alert('NO MORE THAN TWO CARDS ALLOWED');

        // // Disable all toggles in the grid if there are more than two cards
        // const allToggles = document.querySelectorAll('input[type="checkbox"]');
        // allToggles.forEach(toggle => {
        //     toggle.disabled = true; // Disable toggles
        // });
    }
}

// Function to remove a card with animation and grid adjustment
function RemoveCard(id) {
    const thirdLetter = id.charAt(1);
    let R_Card = document.getElementById(`C${id}`);

    // Add fade-out animation to the card
    R_Card.classList.add('opacity-0', 'scale-90', 'transition-all', 'duration-500');

    // After the animation, remove the card and update the grid layout
    setTimeout(() => {
        // Remove the card info from the data structure
        delete cards_info[thirdLetter][id];

        // Remove the card element from the DOM
        R_Card.remove();

        // Check if there is exactly one card left in the grid for this section (thirdLetter)
        if (Object.keys(cards_info[thirdLetter]).length === 1) {
            // Find the remaining card ID
            let remainingCardId = Object.keys(cards_info[thirdLetter])[0];
            let remainingCard = document.getElementById(`C${remainingCardId}`);

            // If a card remains, update its layout to span the full grid (col-span-2)
            if (remainingCard) {
                remainingCard.classList.add('col-span-2');  // Make the remaining card take the full grid space

                // Animate the grid layout change
                remainingCard.classList.add('transition-all', 'duration-500', 'ease-in-out');
            }
        }
    }, 500); // Wait for the animation to finish before removing and updating the grid
}


document.getElementById('NextPageButton').addEventListener('click', async function () {
    let name = productData.category_name_fa

    page_num = page_num + 1
    pagenum.innerHTML = page_num
    if (page_num == 1) {
        document.getElementById('PrevPageButton').classList.add('hidden')
    } else {
        document.getElementById('PrevPageButton').classList.remove('hidden')
    }


    if (page_num == total_pages) {
        document.getElementById('NextPageButton').classList.add('hidden')
    } else {
        document.getElementById('NextPageButton').classList.remove('hidden')
    }

    showLoader(async function () {
        document.getElementById('mainContent').classList.add('hidden');
        await ChangePage(name, page_num, page_size)
        document.getElementById('mainContent').classList.remove('hidden');
    })

})

if (page_num == 1) {
    document.getElementById('PrevPageButton').classList.add('hidden')
}
document.getElementById('PrevPageButton').addEventListener('click', async function () {
    let name = productData.category_name_fa

    page_num = page_num - 1
    pagenum.innerHTML = page_num


    if (page_num == 1) {
        document.getElementById('PrevPageButton').classList.add('hidden')
    } else {
        document.getElementById('PrevPageButton').classList.remove('hidden')
    }

    if (page_num == total_pages) {
        document.getElementById('NextPageButton').classList.add('hidden')
    } else {
        document.getElementById('NextPageButton').classList.remove('hidden')
    }
    showLoader(async function () {
        document.getElementById('mainContent').classList.add('hidden');
        await ChangePage(name, page_num, page_size)
        document.getElementById('mainContent').classList.remove('hidden');
    })

})


async function ChangePage(name_fa, page, page_size) {
    try {

        if (search_state) {
            await findproducts(searchBar.value, page_num, page_size);
        } else {

            const response = await fetch('http://79.175.177.113:21800/Products/get_products_paginated/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept-Version": 1,
                    'Accept': "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'authorization': user_token,
                },
                body: JSON.stringify({
                    "category_name_fa": name_fa,
                    "page": page,
                    "page_limit": page_size,
                    "all_products": is_all

                })
            });


            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data) {
                console.log(data);

                updateui(data);
            }
        }

    } catch (error) {

        console.error('Error Getting products:', error);
        alert('Failed to load products: ' + error.message);
    }
}










async function initializePage() {

    let name = productData.category_name_fa

    showLoader(async function () {
        await GetProduct(name, page_num, page_size);
        document.getElementById('mainContent').classList.remove('hidden');
        // document.getElementById('baseInfoContainer').classList.remove('hidden'); 

    });

}




window.addEventListener('load', function () {
    showLoader(async function () {
        await initializePage();
        document.getElementById('mainContent').classList.remove('hidden');
    });
});



// function onScrollToEnd() {
//     console.log('scrolllll');

//     addscroll = false
//     let name = productData.category_name_fa


//   if (total_pages != page_num) {

//       page_num = page_num + 1
//       pagenum.innerHTML = page_num

//       if (page_num == 1){
//         document.getElementById('PrevPageButton').classList.add('hidden')
//       } else {
//         document.getElementById('PrevPageButton').classList.remove('hidden')
//       }

//     //   showLoader(async function() {
//         // document.getElementById('mainContent').classList.add('opacity-20'); 
//          ChangePage(name , page_num , page_size)
//         // document.getElementById('mainContent').classList.remove('opacity-20');
//     // })

// }

// }

function isScrollable(el) {
    return (
        el &&
        (el.scrollHeight > el.offsetHeight || el.scrollWidth > el.offsetWidth) &&
        !overflowIsHidden(el)
    );
}

function overflowIsHidden(node) {
    var style = getComputedStyle(node);
    return (
        style.overflow === 'hidden' ||
        style.overflowX === 'hidden' ||
        style.overflowY === 'hidden'
    );
}



// let timeout;
let isloading = false;
// window.addEventListener('scroll', function() {
//     if (isScrollable(document.querySelector('body'))){
//     if (isloading) {
//         // clearTimeout(timeout);
//         // timeout = setTimeout(function() {
//             if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
//                 isloading = false

//                 onScrollToEnd();  // Call the function to execute at the end
//             }
//         // }, 100);  // Delay in ms before the function runs after the user stops scrolling
//     }
// }
// });


function Close_pagination() {
    document.getElementById('paginatecontainer').classList.add('hidden')
    document.getElementById('mainContent').classList.remove('hidden')
}

function Close_Edit() {
    document.getElementById('Edit_category').classList.add('hidden')
    document.getElementById('mainContent').classList.remove('hidden')
}

async function Open_Edit(p_id, p_name) {
    document.getElementById('Edit_category').classList.remove('hidden')
    document.getElementById('change_p').innerHTML = p_name

    document.getElementById('mainContent').classList.add('hidden')
    document.getElementById('Edit_button').addEventListener('click', async () => {
        await Apply_Edit(p_id, document.getElementById('CNumber').value)
        window.location.href = window.location.href;
    })
}


async function Open_Edit_All(p_id) {
    document.getElementById('Edit_category').classList.remove('hidden')
    document.getElementById('change_p').innerHTML = 'دستبندی  جدید  را  وارد  کنید '
    document.getElementById('mainContent').classList.add('hidden')
    document.getElementById('Edit_button').addEventListener('click', async () => {

        const Update_category = document.getElementById('CNumber').value
        let i = 0
        for (i; i < p_id.length; i++) {

            await Apply_Edit(p_id[i], Update_category)

        }

        console.log(i);
        if (i == p_id.length) {

            window.location.href = window.location.href;

        }


    })
}



async function Apply_Edit(p_id, c_id) {
    try {


        const response = await fetch('http://79.175.177.113:21800/Products/update_product_category/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
            body: JSON.stringify({
                "product_id": p_id,
                "new_category_id": c_id
            })
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response contains valid categories data
        if (data) {
            console.log(data);


        }

    } catch (error) {
        // Log and display the error to the user
        console.error('Error changing category:', error);
        alert('Failed to changing category: ' + error.message);
    }
}


