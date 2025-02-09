// Global variables
let page_number = 1;
let searchQuery = ""; // current search string (empty for original data)

// Loader function (shows an overlay with a spinner during async operations)
function showLoader(asyncOperation) {
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
  asyncOperation().finally(() => {
    overlay.remove();
  });
}

// Load initial table on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  showLoader(async function () {
    await update_table();
  });
});

// Update table function: Accepts an optional page and query.
// When a query is provided it sends a search request; otherwise, it loads the original data.
async function update_table(page, query = "") {
  if (page) {
    page_number = page;
  }
  console.log("Page:", page_number, "Search query:", query);

  const tableBody = document.getElementById("TableBody");
  tableBody.innerHTML = '';
  document.getElementById('loading').classList.remove('hidden');

  // Choose endpoint based on whether a search query is provided.
  let endpoint = query
    ? 'http://79.175.177.113:21800/Brands/search_brands_by_category_id/'
    : 'http://79.175.177.113:21800/ShoppingMall/list_shopping_malls/';

  const bodyData = {};
  if (query) {
    bodyData.search = query;
  }

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      "Accept-Version": 1,
      'Accept': "application/json",
      'Authorization': user_token,
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('mainContent').classList.remove('hidden');
      document.getElementById('loading').classList.add('hidden');
      console.log(data, 'data');

      const tableBody = document.getElementById("TableBody");
      tableBody.innerHTML = '';
      data.data.forEach(item => {
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
        nameCell.textContent = item.mall_name;
        row.appendChild(nameCell);

        // Brand Name in Farsi
        const farsiCell = document.createElement("td");
        farsiCell.className = "px-6 py-4";
        farsiCell.textContent = item.mall_name_fa;
        row.appendChild(farsiCell);

        

        // website Rank
        const rankCell = document.createElement("td");
        rankCell.className = "px-6 py-4";
        rankCell.textContent = item.mall_website;
        row.appendChild(rankCell);

        // Action cell with individual update buttons
        const actionCell = document.createElement("td");
        actionCell.className = "px-6 py-4 flex gap-2";
        const descButton = document.createElement("span");
        descButton.className = "w-full p-2 rounded-xl bg-blue-200 hover:bg-blue-500 cursor-pointer transition duration-300";
        descButton.textContent = "درج توضیحات";
        descButton.onclick = function () {
          Open_info_modal(item.brand_id);
        };


        actionCell.appendChild(descButton);
       
        row.appendChild(actionCell);

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Error fetching data:", error));

  // Code for select-all and individual checkbox state handling.
  const yellowButton = document.createElement("button");
  yellowButton.textContent = "همه انتخاب شدند";
  yellowButton.style.backgroundColor = "yellow";
  yellowButton.style.display = "none";
  yellowButton.style.position = "fixed";
  yellowButton.style.bottom = "20px";
  yellowButton.style.right = "20px";

  const greenButton = document.createElement("button");
  greenButton.textContent = "انتخاب‌های جداگانه";
  greenButton.style.backgroundColor = "green";
  greenButton.style.color = "white";
  greenButton.style.display = "none";
  greenButton.style.position = "fixed";
  greenButton.style.bottom = "20px";
  greenButton.style.right = "20px";

  const selectAllButton = document.getElementById("selectAllButton");
  selectAllButton.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    if (!allChecked) {
      showYellowButton();
    } else {
      hideYellowButton();
    }
    hideGreenButton();
  });

  function individualCheckboxChanged(event) {
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox");
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    if (checkedCount > 0 && checkedCount < checkboxes.length) {
      showGreenButton();
      hideYellowButton();
    } else if (checkedCount === checkboxes.length) {
      showYellowButton();
      hideGreenButton();
    } else {
      hideGreenButton();
      hideYellowButton();
    }
  }

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
}

// Update functions for individual item updates.
// These functions accept an optional new value for batch updates.
async function push_info(id, newDescription) {
  try {
    const description = newDescription || document.getElementById('category_info_input').value;
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
        "mall_id": id,
        "description": description
      })
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function push_p(id, newPriority) {
  try {
    const priority = newPriority || document.getElementById('category_p_input').value;
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
        "priority": priority
      })
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(error);
  }
}

// Pagination controls (next/prev buttons)
const perv_page_button = document.getElementById('prev_page');
const next_page_button = document.getElementById('next_page');
const page_show = document.getElementById('show_page_number');

page_show.innerHTML = page_number;

next_page_button.addEventListener('click', () => {
  page_number += 1;
  page_show.innerHTML = page_number;
  showLoader(async () => {
    await update_table(page_number, searchQuery);
  });
  if (page_number > 1) {
    perv_page_button.classList.remove('hidden');
  }
});

perv_page_button.addEventListener('click', () => {
  page_number -= 1;
  page_show.innerHTML = page_number;
  showLoader(async () => {
    await update_table(page_number, searchQuery);
  });
  if (page_number === 1) {
    perv_page_button.classList.add('hidden');
  }
});

// Pagination modal to jump to a specific page
document.getElementById('show_page_number').addEventListener('click', () => {
  open_pagination_modal();
});

async function open_pagination_modal() {
  const tabels = document.getElementById('brands_tabel');
  tabels.classList.add('opacity-20');
  const modal_container = document.getElementById('pagination_change_modal');
  modal_container.classList.remove('hidden');

  document.getElementById('close_pagination_modal').addEventListener('click', () => {
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  });

  document.getElementById('confirm_pagination_button').addEventListener('click', () => {
    // Read new page number and update the table with the current search query.
    (async function () {
      let newPage = parseInt(document.getElementById('pagination_input').value, 10);
      if (isNaN(newPage)) {
        newPage = 1;
      }
      page_show.innerHTML = newPage;
      if (newPage > 1) {
        perv_page_button.classList.remove('hidden');
      }
      showLoader(async () => {
        await update_table(newPage, searchQuery);
      });
      tabels.classList.remove('opacity-20');
      modal_container.classList.add('hidden');
    })();
  });
}

// Search and Refresh event listeners
document.getElementById('search_button').addEventListener('click', () => {
  searchQuery = document.getElementById('search_input').value.trim();
  page_number = 1; // Reset to page 1 for a new search
  showLoader(async () => {
    await update_table(page_number, searchQuery);
  });
});

document.getElementById('refresh_button').addEventListener('click', () => {
  searchQuery = "";
  document.getElementById('search_input').value = "";
  page_number = 1;
  showLoader(async () => {
    await update_table(page_number, searchQuery);
  });
});

// Batch update for selected items:
// Batch description update
document.getElementById('update_selected_desc').addEventListener('click', batchOpen_info_modal);
async function batchOpen_info_modal() {
  const checkboxes = document.querySelectorAll("#TableBody .row-checkbox:checked");
  if (checkboxes.length === 0) {
    alert("لطفا حداقل یک فروشگاه انتخاب کنید.");
    return;
  }
  const tabels = document.getElementById('brands_tabel');
  tabels.classList.add('opacity-20');
  const modal_container = document.getElementById('info_change_modal');
  modal_container.classList.remove('hidden');

  document.getElementById('confirm_info_button').onclick = async () => {
    const newInfo = document.getElementById('category_info_input').value;
    for (const checkbox of checkboxes) {
      const id = checkbox.dataset.id;
      await push_info(id, newInfo);
    }
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
    update_table(page_number, searchQuery);
  };

  document.getElementById('close_info_modal').onclick = () => {
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  };
}

// Batch rank update
document.getElementById('update_selected_rank').addEventListener('click', batchOpen_priority_modal);
async function batchOpen_priority_modal() {
  const checkboxes = document.querySelectorAll("#TableBody .row-checkbox:checked");
  if (checkboxes.length === 0) {
    alert("لطفا حداقل یک فروشگاه انتخاب کنید.");
    return;
  }
  const tabels = document.getElementById('brands_tabel');
  tabels.classList.add('opacity-20');
  const modal_container = document.getElementById('priority_change_modal');
  modal_container.classList.remove('hidden');

  document.getElementById('confirm_p_button').onclick = async () => {
    const newPriority = document.getElementById('category_p_input').value;
    for (const checkbox of checkboxes) {
      const id = checkbox.dataset.id;
      await push_p(id, newPriority);
    }
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
    update_table(page_number, searchQuery);
  };

  document.getElementById('close_p_modal').onclick = () => {
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  };
}

// Individual modal open functions (for single item updates)
function Open_info_modal(id) {
  const tabels = document.getElementById('brands_tabel');
  tabels.classList.add('opacity-20');
  const modal_container = document.getElementById('info_change_modal');
  modal_container.classList.remove('hidden');

  document.getElementById('confirm_info_button').onclick = () => {
    push_info(id);
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  };

  document.getElementById('close_info_modal').onclick = () => {
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  };
}

function Open_info_modal_p(id) {
  const tabels = document.getElementById('brands_tabel');
  tabels.classList.add('opacity-20');
  const modal_container = document.getElementById('priority_change_modal');
  modal_container.classList.remove('hidden');

  document.getElementById('confirm_p_button').onclick = () => {
    push_p(id);
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  };

  document.getElementById('close_p_modal').onclick = () => {
    tabels.classList.remove('opacity-20');
    modal_container.classList.add('hidden');
  };
}
