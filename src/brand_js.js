let page_number = 1;
let searchActive = false; // tracks if we are in search mode

// --- Utility: show a full-page loader overlay during async operations ---
function showLoader(asyncOperation) {
  const overlay = document.createElement('div');
  overlay.classList.add('loading-overlay', 'fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-30', 'z-50');
  overlay.innerHTML = `
    <div class="spinner flex space-x-1">
      <div class="spinner-segment w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      <div class="spinner-segment w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      <div class="spinner-segment w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  asyncOperation().finally(() => {
    overlay.remove();
  });
}

// --- Initial load & event listeners setup ---
document.addEventListener("DOMContentLoaded", () => {
  // Load initial table view (non-search)
  showLoader(async () => {
    await update_table();
  });

  // Set up search bar events (assume HTML elements with these IDs exist)
  document.getElementById('search_button').addEventListener('click', () => {
    searchActive = true;
    page_number = 1;
    update_search_table(page_number);
  });
  document.getElementById('search_refresh_button').addEventListener('click', () => {
    if (searchActive) {
      update_search_table(page_number);
    }
  });

  // Set up bulk action buttons for search view
  document.getElementById('bulk_search_desc_button').addEventListener('click', open_bulk_info_modal);
  document.getElementById('bulk_search_rank_button').addEventListener('click', open_bulk_priority_modal);

  // Pagination buttons (shared for both table and search)
  const next_page_button = document.getElementById('next_page');
  const perv_page_button = document.getElementById('prev_page');
  const page_show = document.getElementById('show_page_number');
  page_show.innerHTML = page_number;

  next_page_button.addEventListener('click', () => {
    page_number += 1;
    page_show.innerHTML = page_number;
    showLoader(async () => {
      if (searchActive) {
        await update_search_table(page_number);
      } else {
        await update_table(page_number);
      }
    });
    if (page_number > 1) {
      perv_page_button.classList.remove('hidden');
    }
  });

  perv_page_button.addEventListener('click', () => {
    page_number -= 1;
    page_show.innerHTML = page_number;
    showLoader(async () => {
      if (searchActive) {
        await update_search_table(page_number);
      } else {
        await update_table(page_number);
      }
    });
    if (page_number === 1) {
      perv_page_button.classList.add('hidden');
    }
  });

  // Allow clicking the page number to open a pagination modal (reuse your modal logic)
  document.getElementById('show_page_number').addEventListener('click', open_pagination_modal);
});

// --- Update table view (non-search) ---
async function update_table(page) {
  if (page) {
    page_number = page;
  }
  console.log("Table page:", page_number);

  // Set title from session storage (if needed)
  document.getElementById('brand_info_title').innerHTML = JSON.parse(sessionStorage.getItem('brand_cat')).name_fa;

  const tableBody = document.getElementById("TableBody");
  tableBody.innerHTML = '';
  document.getElementById('loading').classList.remove('hidden');

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
      "page": page_number,
      "page_limit": 10
    })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('mainContent').classList.remove('hidden');
      document.getElementById('loading').classList.add('hidden');
      console.log(data, 'data');

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

        // Brand state in Farsi
        const stateCell = document.createElement("td");
        stateCell.className = "px-6 py-4";
        stateCell.textContent = Object.keys(item.brand_stat).join(" ، ");
        row.appendChild(stateCell);

        // Brand Rank
        const rankCell = document.createElement("td");
        rankCell.className = "px-6 py-4";
        rankCell.textContent = item.brand_priority;
        row.appendChild(rankCell);

        // Action cell with individual modals for description and rank
        const actionCell = document.createElement("td");
        actionCell.className = "px-6 py-4 flex gap-2";
        const descButton = document.createElement("span");
        descButton.className = "w-full p-2 rounded-xl bg-blue-200 hover:bg-blue-500 cursor-pointer transition duration-300";
        descButton.onclick = function () {
          Open_info_modal(item.brand_id);
        };
        descButton.textContent = "درج توضیحات";
        const updateButton = document.createElement("span");
        updateButton.className = "w-full p-2 rounded-xl bg-teal-200 hover:bg-teal-500 cursor-pointer transition duration-300";
        updateButton.textContent = "بروز رسانی رتبه";
        updateButton.onclick = function () {
          Open_info_modal_p(item.brand_id);
        };
        actionCell.appendChild(descButton);
        actionCell.appendChild(updateButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Error fetching data:", error));

  // (Optional) update any “select all” or bulk button state if needed…
}

// --- Update search view (similar structure but using the search endpoint) ---
async function update_search_table(page) {
  if (page) {
    page_number = page;
  }
  const searchQuery = document.getElementById('search_input').value;
  console.log("Search page:", page_number, "query:", searchQuery);

  const tableBody = document.getElementById("TableBody");
  tableBody.innerHTML = '';
  document.getElementById('loading').classList.remove('hidden');

  fetch('http://79.175.177.113:21800/Brands/search_brands/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      "Accept-Version": 1,
      'Accept': "application/json",
      'Authorization': user_token,
    },
    body: JSON.stringify({
      "search_query": searchQuery,
      "page": page_number,
      "page_limit": 10
    })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('mainContent').classList.remove('hidden');
      document.getElementById('loading').classList.add('hidden');
      console.log(data, 'search data');

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

        // Brand state in Farsi
        const stateCell = document.createElement("td");
        stateCell.className = "px-6 py-4";
        stateCell.textContent = Object.keys(item.brand_stat).join(" ، ");
        row.appendChild(stateCell);

        // Brand Rank
        const rankCell = document.createElement("td");
        rankCell.className = "px-6 py-4";
        rankCell.textContent = item.brand_priority;
        row.appendChild(rankCell);

        // Action cell with individual update buttons
        const actionCell = document.createElement("td");
        actionCell.className = "px-6 py-4 flex gap-2";
        const descButton = document.createElement("span");
        descButton.className = "w-full p-2 rounded-xl bg-blue-200 hover:bg-blue-500 cursor-pointer transition duration-300";
        descButton.onclick = function () {
          Open_info_modal(item.brand_id);
        };
        descButton.textContent = "درج توضیحات";
        const updateButton = document.createElement("span");
        updateButton.className = "w-full p-2 rounded-xl bg-teal-200 hover:bg-teal-500 cursor-pointer transition duration-300";
        updateButton.textContent = "بروز رسانی رتبه";
        updateButton.onclick = function () {
          Open_info_modal_p(item.brand_id);
        };
        actionCell.appendChild(descButton);
        actionCell.appendChild(updateButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Error fetching search data:", error));
}

// --- Checkbox change handler (shared by both views) ---
function individualCheckboxChanged(event) {
  const checkboxes = document.querySelectorAll("#TableBody .row-checkbox");
  const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

  // For simplicity, you might decide to show/hide global bulk action buttons here.
  // (You can add your own logic to show separate bulk buttons for search vs. normal view if desired.)
}

// --- Bulk update modals for search (or even table view) ---
// Bulk description update
async function open_bulk_info_modal() {
  const table = document.getElementById('brands_tabel');
  table.classList.add('opacity-20');
  const modal = document.getElementById('bulk_info_change_modal');
  modal.classList.remove('hidden');

  document.getElementById('close_bulk_info_modal').addEventListener('click', () => {
    table.classList.remove('opacity-20');
    modal.classList.add('hidden');
  });

  document.getElementById('confirm_bulk_info_button').addEventListener('click', async () => {
    const newDesc = document.getElementById('bulk_category_info_input').value;
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox:checked");
    for (const cb of checkboxes) {
      const brandId = cb.dataset.id;
      await bulkPush_info(brandId, newDesc);
    }
    table.classList.remove('opacity-20');
    modal.classList.add('hidden');
    // Refresh the current view after bulk update
    if (searchActive) {
      update_search_table(page_number);
    } else {
      update_table(page_number);
    }
  });
}

async function bulkPush_info(brandId, description) {
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
        "brand_id": brandId,
        "description": description
      })
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}

// Bulk rank update
async function open_bulk_priority_modal() {
  const table = document.getElementById('brands_tabel');
  table.classList.add('opacity-20');
  const modal = document.getElementById('bulk_priority_change_modal');
  modal.classList.remove('hidden');

  document.getElementById('close_bulk_priority_modal').addEventListener('click', () => {
    table.classList.remove('opacity-20');
    modal.classList.add('hidden');
  });

  document.getElementById('confirm_bulk_priority_button').addEventListener('click', async () => {
    const newPriority = document.getElementById('bulk_category_p_input').value;
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox:checked");
    for (const cb of checkboxes) {
      const brandId = cb.dataset.id;
      await bulkPush_priority(brandId, newPriority);
    }
    table.classList.remove('opacity-20');
    modal.classList.add('hidden');
    if (searchActive) {
      update_search_table(page_number);
    } else {
      update_table(page_number);
    }
  });
}

async function bulkPush_priority(brandId, priority) {
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
        "brand_id": brandId,
        "priority": priority
      })
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}

// --- Existing individual modals (unchanged) ---
async function Open_info_modal(id) {
  const tabels = document.getElementById('brands_tabel');
  tabels.classList.add('opacity-20');
  const modal_container = document.getElementById('info_change_modal');
  modal_container.classList.remove('hidden');
  const close_button = document.getElementById('close_info_modal');
  close_button.addEventListener('click', () => {
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  });
  const confirm_botton = document.getElementById('confirm_info_button');
  confirm_botton.addEventListener('click', () => {
    push_info(id);
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  });
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
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function Open_info_modal_p(id) {
  const tabels = document.getElementById('brands_tabel');
  tabels.classList.add('opacity-20');
  const modal_container = document.getElementById('priority_change_modal');
  modal_container.classList.remove('hidden');
  const close_button = document.getElementById('close_p_modal');
  close_button.addEventListener('click', () => {
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  });
  const confirm_botton = document.getElementById('confirm_p_button');
  confirm_botton.addEventListener('click', () => {
    push_p(id);
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  });
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
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}

// --- Pagination modal (existing code) ---
async function open_pagination_modal() {
  const tabels = document.getElementById('brands_tabel');
  tabels.classList.add('opacity-20');
  const modal_container = document.getElementById('pagination_change_modal');
  modal_container.classList.remove('hidden');
  const close_button = document.getElementById('close_pagination_modal');
  close_button.addEventListener('click', () => {
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  });
  const confirm_botton = document.getElementById('confirm_pagination_button');
  confirm_botton.addEventListener('click', () => {
    push_info_pagination();
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  });
}

async function push_info_pagination() {
  try {
    let newPage = parseInt(document.getElementById('pagination_input').value, 10);
    if (isNaN(newPage)) {
      newPage = 1;
    }
    page_number = newPage;
    document.getElementById('show_page_number').innerHTML = page_number;
    if (page_number > 1) {
      document.getElementById('prev_page').classList.remove('hidden');
    }
    showLoader(async () => {
      if (searchActive) {
        await update_search_table(page_number);
      } else {
        await update_table(page_number);
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
