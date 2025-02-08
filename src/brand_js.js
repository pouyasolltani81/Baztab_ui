
document.addEventListener("DOMContentLoaded", () => {

    showLoader(async function() {

       
    
 
     document.getElementById('brand_info_title').innerHTML = JSON.parse(sessionStorage.getItem('brand_cat')).name_fa;
     
  fetch('http://79.175.177.113:21800/Brands/get_brands_by_category_id/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                'Authorization': user_token,
            },
            body: JSON.stringify({
                "category_id": JSON.parse(sessionStorage.getItem('brand_cat'))._id,
                "page": 1,
                "page_limit": 20
              })
        }
    

    ).then(response => response.json())
    .then(data => {
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
        console.log(data, 'data');

       

      const tableBody = document.getElementById("TableBody");
      // Assuming data is an array of brand objects with properties id, name, farsiName, and rank
      data.data.brands.forEach(item => {
        console.log(item, 'thisthihst');
        
        const row = document.createElement("tr");
        row.classList.add("text-gray-800");
        row.classList.add("text-lg");


        // Checkbox cell
        const checkboxCell = document.createElement("td");
        checkboxCell.className = "px-6 py-4";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("row-checkbox");
        // Optional: set a data attribute if you need to reference the id later
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

        // Action cell (you can add your buttons or actions here)
        const actionCell = document.createElement("td");
        actionCell.className = "px-6 py-4 flex gap-2";
        const descButton = document.createElement("span");
        descButton.className = "w-full p-2 rounded-xl bg-blue-200 hover:bg-blue-500 cursor-pointer transition duration-300";
        descButton.onclick = function() {
            Open_info_modal(item.brand_id);
          };
          
          
        descButton.textContent = "درج توضیحات";
        const updateButton = document.createElement("span");
        updateButton.className = "w-full p-2 rounded-xl bg-teal-200 hover:bg-teal-500 cursor-pointer transition duration-300";
        updateButton.textContent = "بروز رسانی رتبه";
        updateButton.onclick = function() {
            Open_info_modal_p(item.brand_id);
          };
        actionCell.appendChild(descButton);
        actionCell.appendChild(updateButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Error fetching data:", error));

  // Create the yellow and green buttons (initially hidden)
  const yellowButton = document.createElement("button");
  yellowButton.textContent = "همه انتخاب شدند";
  yellowButton.style.backgroundColor = "yellow";
  yellowButton.style.display = "none";
  yellowButton.style.position = "fixed";
  yellowButton.style.bottom = "20px";
  yellowButton.style.right = "20px";
  yellowButton.style.display = false

//   document.body.appendChild(yellowButton);

  const greenButton = document.createElement("button");
  greenButton.textContent = "انتخاب‌های جداگانه";
  greenButton.style.backgroundColor = "green";
  greenButton.style.color = "white";
  greenButton.style.display = "none";
  greenButton.style.position = "fixed";
  greenButton.style.bottom = "20px";
  greenButton.style.right = "20px";
  greenButton.style.display = false

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







async function Open_info_modal_p(id) {

    tabels = document.getElementById('brands_tabel')
    
    tabels.classList.add('opacity-20')

    modal_container = document.getElementById('priority_change_modal')

    modal_container.classList.remove('hidden')

    close_button = document.getElementById('close_info_modal')

    close_button.addEventListener('click' , () => {

        tabels.classList.remove('opacity-20')
        modal_container.classList.add('hidden')
    })


    confirm_botton = document.getElementById('confirm_info_button')
    confirm_botton.addEventListener('click' , () => {
        push_p(id)

        tabels.classList.remove('opacity-20')
        modal_container.classList.add('hidden')

    })
   

    
}


async function push_p(id) {

    try {

        const response = await fetch('http://79.175.177.113:21800/Brands/update_brand_priority/', {
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
            "priority": document.getElementById('category_p_input').value

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





