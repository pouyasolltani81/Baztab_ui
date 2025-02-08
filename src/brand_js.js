
document.addEventListener("DOMContentLoaded", () => {

    document.addEventListener("DOMContentLoaded", () => {
       
        const itemsPerPage = 20;
        let currentPage = 1;
        let totalItems = 0;
      
        // Show loader function
        function showLoader(callback) {
          // Implement your loader display logic here
          callback();
        }
      
        // Fetch data function
        async function fetchData(page) {
          showLoader(async function() {
            document.getElementById('brand_info_title').innerHTML = JSON.parse(sessionStorage.getItem('brand_cat')).name_fa;
      
            try {
              const response = await fetch('http://79.175.177.113:21800/Brands/get_brands_by_category_id/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  "Accept-Version": 1,
                  'Accept': "application/json",
                  'Authorization': user_token,
                },
                body: JSON.stringify({
                  "category_id": JSON.parse(sessionStorage.getItem('brand_cat'))._id,
                  "page": page,
                  "page_limit": itemsPerPage
                })
              });
      
              const data = await response.json();
              document.getElementById('mainContent').classList.remove('hidden'); // Show main content
      
              totalItems = data.data.totalItems; // Assuming the API returns total items count
              const totalPages = Math.ceil(totalItems / itemsPerPage);
      
              // Update page info
              document.getElementById('pageInfo').textContent = `صفحه ${page} از ${totalPages}`;
      
              // Update pagination buttons
              document.getElementById('prevPage').disabled = page === 1;
              document.getElementById('nextPage').disabled = page === totalPages;
      
              // Clear existing rows
              const tableBody = document.getElementById("TableBody");
              tableBody.innerHTML = '';
      
              // Populate table rows
              data.data.brands.forEach(item => {
                const row = document.createElement("tr");
                row.classList.add("text-gray-800", "text-lg");
      
                // Checkbox cell
                const checkboxCell = document.createElement("td");
                checkboxCell.className = "px-6 py-4";
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("row-checkbox");
                checkbox.dataset.id = item.brand_id;
                checkbox.addEventListener("change", individualCheckboxChanged);
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);
      
                // Brand ID
                const idCell = document.createElement("td");
                idCell.className = "px-6 py-4";
                idCell.textContent = item.brand_id;
                row.appendChild(idCell);
      
                // Brand Name
                const nameCell = document.createElement("td");
                nameCell.className = "px-6 py-4";
                nameCell.textContent = item.brand_name;
                row.appendChild(nameCell);
      
                // Brand Name in Farsi
                const farsiCell = document.createElement("td");
                farsiCell.className = "px-6 py-4";
                farsiCell.textContent = item.brand_name_fa;
                row.appendChild(farsiCell);
      
                // Brand Rank
                const rankCell = document.createElement("td");
                rankCell.className = "px-6 py-4";
                rankCell.textContent = item.brand_priority;
                row.appendChild(rankCell);
      
                // Action cell
                const actionCell = document.createElement("td");
                actionCell.className = "px-6 py-4 flex gap-2";
                const descButton = document.createElement("span");
                descButton.className = "w-full p-2 rounded-xl bg-blue-200 hover:bg-blue-500 cursor-pointer transition duration-300";
                descButton.textContent = "درج توضیحات";
                descButton.addEventListener("click", () => Open_info_modal(item.brand_id));
                actionCell.appendChild(descButton);
                row.appendChild(actionCell);
      
                tableBody.appendChild(row);
              });
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          });
        }
      
        // Event listeners for pagination buttons
        document.getElementById('prevPage').addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            fetchData(currentPage);
          }
        });
      
        document.getElementById('nextPage').addEventListener('click', () => {
          const totalPages = Math.ceil(totalItems / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            fetchData(currentPage);
          }
        });
      
        // Initial data fetch
        fetchData(currentPage);
      
        // Individual checkbox change handler
        function individualCheckboxChanged(event) {
          const checkboxes = document.querySelectorAll("#TableBody .row-checkbox");
          const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
      
          // If at least one is checked but not all, show green button
          if (checkedCount > 0 && checkedCount < checkboxes.length) {
            showGreenButton();
            hideYellowButton();
          }
          // If all are selected manually (or via select all), show yellow button
          else if (checkedCount === checkboxes.length) {
            showYellowButton();
            hideGreenButton();
          } else {
            // Hide both if none are selected
            hideGreenButton();
            hideYellowButton();
          }
        }
      
        // Helper functions to show/hide the buttons
        function showYellowButton() {
          yellowButton.style.display = "block";
        }
        function hideYellowButton() {
          yellowButton.style.display = "none";
        }
        function showGreenButton() {
          greenButton.style.display = "block";
        }
        function hideGreenButton() {
          greenButton.style.display = "none";
        }
      
        // Create the yellow and green buttons (initially hidden)
        const yellowButton = document.createElement("button");
        yellowButton.textContent = "همه انتخاب شدند";
        yellowButton.style.backgroundColor = "yellow";
        yellowButton.style.display = "none";
        yellowButton.style.position = "fixed";
        yellowButton.style.bottom = "20px";
        yellowButton.style.right = "20px";
        document.body.appendChild(yellowButton);
      
        const greenButton = document.createElement("button");
        greenButton.textContent = "انتخاب‌های جداگانه";
        greenButton.style.backgroundColor = "green";
        greenButton.style.color = "white";
        greenButton.style.display = "none";
        greenButton.style.position = "fixed";
        greenButton.style.bottom = "20px";
        greenButton.style.right = "20px";
        document.body.appendChild(greenButton);
      
      
//   document.body.appendChild(greenButton);

  // “Select All” functionality
  const selectAllButton = document.getElementById("selectAllButton");
  selectAllButton.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox");
    // Determine if all checkboxes are already selected
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    // Toggle all checkboxes
    checkboxes.forEach(cb => cb.checked = !allChecked);
    
    // When using "select all" show yellow button
    if (!allChecked) {
      showYellowButton();
    } else {
      hideYellowButton();
    }
    // Also hide the green button in this case
    hideGreenButton();
  });

  // Handler for individual checkbox changes
  function individualCheckboxChanged(event) {
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox");
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

    // If at least one is checked but not all, show green button
    if (checkedCount > 0 && checkedCount < checkboxes.length) {
      showGreenButton();
      hideYellowButton();
    }
    // If all are selected manually (or via select all), show yellow button
    else if (checkedCount === checkboxes.length) {
      showYellowButton();
      hideGreenButton();
    } else {
      // Hide both if none are selected
      hideGreenButton();
      hideYellowButton();
    }
  }

  // Helper functions to show/hide the buttons
  function showYellowButton() {
    yellowButton.style.display = "block";
  }
  function hideYellowButton() {
    yellowButton.style.display = "none";
  }
  function showGreenButton() {
    greenButton.style.display = "block";
  }
  function hideGreenButton() {
    greenButton.style.display = "none";
  }
});
});





async function Open_info_modal(id) {

    tabels = document.getElementById('brands_tabel')
    
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

            "brand_id": id,
            "description": document.getElementById('category_info_input').value

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