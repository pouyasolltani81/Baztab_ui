const productTableContainer = document.getElementById("TableBody");
const info_container = document.getElementById("info_container");

let pageNumber = document.getElementById('pageNumber').value; 
let itemsPerPage = document.getElementById('itemsPerPage').value; 
let productData = JSON.parse(localStorage.getItem('productResponse'));
let name = productData.category_name_fa
let nameqwe = productData.category_name_fa

let slug_fa =  productData.slug_fa


let page_size = 10
let page_num = 1

const pagenum = document.getElementById('PageNumber')


let test

pagenum.addEventListener('click', function() {
  document.getElementById('paginatecontainer').classList.remove('hidden')
  document.getElementById('maincontent').classList.add('opacity-20')


})

document.getElementById('pagibutton').addEventListener('click',  function(event) {
  showLoader(async function() { 
    
    try {

        
      document.getElementById('paginatecontainer').classList.add('hidden')
      document.getElementById('maincontent').classList.remove('opacity-20')


      page_num = parseInt(document.getElementById('pageNumber').value)
      page_size = parseInt(document.getElementById('itemsPerPage').value)
    
      console.log(JSON.stringify({  
        "category_name_fa": nameqwe ,
        "page": page_num,
        "page_limit": page_size
    }));
      
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
              "category_name_fa": nameqwe ,
              "page": page_num,
              "page_limit": page_size
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

} catch (error) {
    // Log and display the error to the user
    console.error('Error Getting products:', error);
    alert('Failed to load products: ' + error.message);
}
   }) }
);

async function GetProduct(name_fa , page_num , page_size) {
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
            body: JSON.stringify({  // Convert the body object to a JSON string
                "category_name_fa": name_fa,
                "page": page_num,
                "page_limit": page_size
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


async function findproducts(name_fa , page_num , page_size) {  // No need to pass "name" if it's not being used
    try {
      document.getElementById('pageNumber').value = page_num
      document.getElementById('itemsPerPage').value = page_size


      console.log(JSON.stringify({  // Convert the body object to a JSON string
        "name": '',  // If you don't need "name", remove it
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
            body: JSON.stringify({  // Convert the body object to a JSON string
                "name": '',  // If you don't need "name", remove it
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

          updateui_S(data);  // Call the update UI function with the response data
        } 

    } catch (error) {
        // Log and display the error to the user
        console.error('Error searching products:', error);
        alert('Failed to search products: ' + error.message);
    }
}

function updateui(data) {
    

    let products = data.data.result ;
    
    
    createProductTable(products);
    

    document.querySelectorAll('.peer').forEach(checkbox => { checkbox.addEventListener('change', event => { if (event.target.checked) { CreateCard(`${checkbox.id}`); } else { RemoveCard(`${checkbox.id}`); } }); });

}


function updateui_S(data) {
    

  let products = data.data.results ;
  
  
  createProductTable(products);
  

  document.querySelectorAll('.peer').forEach(checkbox => { checkbox.addEventListener('change', event => { if (event.target.checked) { CreateCard(`${checkbox.id}`); } else { RemoveCard(`${checkbox.id}`); } }); });

}



// Get DOM elements
const searchBar = document.getElementById('searchBar');
const searchColumn = document.getElementById('searchColumn');
const tableBody = document.getElementById('TableBody');
const searchbutton = document.getElementById('SearchButton');
const refreshButton = document.getElementById('refreshButton');

        

searchbutton.addEventListener('click', function() {
  showLoader(async function() {
      document.getElementById('mainContent').classList.add('hidden'); 

      await findproducts(searchBar.value , page_num , page_size);  
      document.getElementById('mainContent').classList.remove('hidden'); 
  });
});
  

 
refreshButton.addEventListener('click', function() {
  showLoader(async function() {
      document.getElementById('mainContent').classList.add('hidden'); // Show main content

      await GetProduct(productData.category_name_fa , page_num , page_size);
      refreshButton.classList.add('hidden') 
      document.getElementById('mainContent').classList.remove('hidden'); // Show main content
  });
});
  


        // Listen for input in the search bar
        searchBar.addEventListener('input', function() {
            const query = searchBar.value.toLowerCase();
            console.log(query);
            
            const columnIndex = searchColumn.value;

            const rows = tableBody.getElementsByTagName('tr');
            if(columnIndex != 'all_C'){
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

                  
                  
                  
                  
                } else
                
                {
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

            if (query !='' ) {

            searchbutton.classList.remove('hidden')
            refreshButton.classList.remove('hidden')

            }
            else if ((query =='' )){
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
function createProductTable(products) {
  productTableContainer.innerHTML = ''; 
  console.log(products);

  products.forEach(product => {
    const row = document.createElement("tr");
    row.className = "border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600";
    row.id = `TB${product._id}`;

    // Product info
    const info = document.createElement("td");
    info.className = "bwhitespace-nowrap px-6 py-4";
    info.innerHTML = `
      <div class='flex flex-col'>
        <span class="text-gray-900 font-bold">شناسه: ${product.product_info.product_id}</span>
        <span class="text-gray-900 font-semibold">نام: ${product.product_info.product_name_fa}</span>
        ${product.product_info.price_stat ? `<span class='flex gap-2 justify-center'>
          <p class="text-gray-900 font-bold">قیمت :</p>
          <span class="text-gray-900 font-bold">avg: ${product.product_info.price_stat.avg}</span>
          <span class="text-gray-900 font-bold">min: ${product.product_info.price_stat.min}</span>
          <span class="text-gray-900 font-bold">max: ${product.product_info.price_stat.max}</span>
          <span class="text-gray-900 font-bold">variance: ${product.product_info.price_stat.variance}</span>
        </span>` : ''}
        <span class="text-gray-900 font-base">URL : <a class='text-blue-600' href='${product.product_info.scrape_url}'>${product.product_info.scrape_url}</a></span>
        <span class="text-gray-900 font-base">در دسترس بودن: <span class="${product.product_info.is_available ? 'text-green-700' : 'text-red-700'} font-base uppercase">${product.product_info.is_available}</span>
      </div>`;

    // Add other product details as before...
    const brand = document.createElement("td");
    brand.className = "bwhitespace-nowrap px-6 py-4";
    brand.innerHTML = `<div class='flex flex-col'>
      <span class="text-gray-900 font-bold">نام برند: ${product.brand_info.brand_name}</span>
      <span class="text-gray-900 font-semibold">نام برند (فارسی): ${product.brand_info.brand_name_fa}</span>
    </div>`;

    const mall = document.createElement("td");
    mall.className = "bwhitespace-nowrap px-6 py-4";
    mall.innerHTML = `<div class='flex flex-col'>
      <span class="text-gray-900 font-bold">شناسه: ${product.mall_info.mall_id}</span>
      <span class="text-gray-900 font-semibold">نام: ${product.mall_info.mall_name}</span>
      <span class="text-gray-900 font-base">نام (فارسی): ${product.mall_info.mall_name}</span>
    </div>`;

    const media = document.createElement("td");
    media.className = "bwhitespace-nowrap px-6 py-4";
    media.innerHTML = `<div class='flex flex-col'>
      <img src="${product.media_info.primary_image}" width="100" height="100">
    </div>`;

    // Add the checkbox cell
    const checkbox = document.createElement("td");
    checkbox.className = "whitespace-nowrap px-6 py-4";
    checkbox.innerHTML = `<input type="checkbox" class="row-checkbox">`;

    // Add Availability, Name, Product ID, URL, etc.
    const availability = document.createElement("td");
    availability.className = "whitespace-nowrap  px-6 py-4";
    availability.innerHTML = `<span class="text-sm ${product.is_available ? 'text-green-600' : 'text-red-600'} font-semibold">${product.is_available ? 'موجود' : 'تمام شده'}</span>`;

    const productName = document.createElement("td");
    productName.className = "bwhitespace-nowrap  px-6 py-4";
    productName.textContent = product.product_name_fa;

    const productId = document.createElement("td");
    productId.className = "bwhitespace-nowrap  px-6 py-4";
    productId.textContent = `شناسه: ${product._id}`;

    const productUrl = document.createElement("td");
    productUrl.className = "bwhitespace-nowrap  px-6 py-4";
    productUrl.innerHTML = `URL استخراج شده: <a href="${product.scrape_url}" target="_blank" class="text-blue-500 hover:text-blue-700">${product.scrape_url}</a>`;

    const price = document.createElement("td");
    price.className = "border-whitespace-nowrap  px-6 py-4";
    if (product.price_stat && product.price_stat.avg) {
      price.textContent = `قیمت: ${(product.price_stat.avg / 10).toLocaleString()} تومان`; 
    } else {
      price.textContent = "قیمت: موجود نیست";
    }

    const brandName = document.createElement("td");
    brandName.className = "bwhitespace-nowrap  px-6 py-4";
    brandName.textContent = 'دیجی کالا';

    // Insert cells into the row
    row.appendChild(info);
    row.appendChild(brand);
    row.appendChild(mall);
    row.appendChild(media);
    row.appendChild(price);
    row.appendChild(productId);
    row.appendChild(availability);
    row.appendChild(productName);
    row.appendChild(productUrl);

    // Create the event listener for the checkbox
    checkbox.addEventListener('click', () => {
      const allRows = document.querySelectorAll('tr'); 
      const isSelected = row.classList.toggle('selected'); 
      if (isSelected) { 
        // Hide other rows
        allRows.forEach((r, i) => { 
          if (r !== row && i !== 0) { 
            r.style.display = 'none'; 
          } 
        });

        // Add "Add More Products" button if not already present
        if (!row.querySelector('.add-more-btn')) {
          const addButton = document.createElement('button');
          addButton.textContent = 'Add More Products';
          addButton.classList.add('add-more-btn');
          row.insertAdjacentElement('afterend', addButton);

          addButton.addEventListener('click', () => {
            // Show all rows and remove the button
            allRows.forEach(r => r.style.display = '');
            addButton.remove();  // Remove the button
          });
        }
      } else { 
        // Show all rows again if deselected
        allRows.forEach(r => r.style.display = '');
        // Remove the "Add More Products" button if it's there
        const addButton = row.querySelector('.add-more-btn');
        if (addButton) {
          addButton.remove();
        }
      }
    });

    // Append the row to the container
    productTableContainer.appendChild(row);
  });
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


document.getElementById('NextPageButton').addEventListener('click' , async function() {
let name = productData.category_name_fa
  
  page_num = page_num + 1
  pagenum.innerHTML = page_num
  if (page_num == 1){
    document.getElementById('PrevPageButton').classList.add('hidden')
  } else {
    document.getElementById('PrevPageButton').classList.remove('hidden')
  }
  showLoader(async function() {
    document.getElementById('mainContent').classList.add('hidden'); 
    await ChangePage(name , page_num , page_size)
    document.getElementById('mainContent').classList.remove('hidden');
})

})

if (page_num == 1){
  document.getElementById('PrevPageButton').classList.add('hidden')
}
document.getElementById('PrevPageButton').addEventListener('click' , async function() {
let name = productData.category_name_fa
  
  page_num = page_num - 1
  pagenum.innerHTML = page_num


  if (page_num == 1){
    document.getElementById('PrevPageButton').classList.add('hidden')
  } else {
    document.getElementById('PrevPageButton').classList.remove('hidden')
  }
  showLoader(async function() {
    document.getElementById('mainContent').classList.add('hidden'); 
    await ChangePage(name , page_num , page_size)
    document.getElementById('mainContent').classList.remove('hidden');
})

})


async function ChangePage(name_fa , page, page_size)  {
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
        body: JSON.stringify({  // Convert the body object to a JSON string
            "category_name_fa": name_fa,
            "page": page,
            "page_limit": page_size
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










  async function initializePage(){
    
let name = productData.category_name_fa
    
   showLoader(async function() {
    await GetProduct(name , page_num , page_size);  // Simulate page load logic
    document.getElementById('mainContent').classList.remove('hidden'); // Show main content
});
    
  }


 

// Start loading and use `showLoader` to show the spinner
window.addEventListener('load', function() {
  showLoader(async function() {
      await initializePage();  // Simulate page load logic
      document.getElementById('mainContent').classList.remove('hidden'); // Show main content
  });
});
  