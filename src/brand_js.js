// فایل جاوااسکریپت برای مدیریت عملکرد صفحه

let page_number = 1;
let searchActive = false; // حالت جستجو یا حالت پیش‌فرض

// تابع نمایش لودر (spinner) بر اساس عملکرد async
function showLoader(asyncOperation) {
  // المان بارگذاری شما در HTML با id="loading" موجود است
  const loadingElem = document.getElementById("loading");
  loadingElem.style.display = "block";
  asyncOperation().finally(() => {
    loadingElem.style.display = "none";
  });
}

// رویداد DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  showLoader(async () => {
    await update_table();
  });

  // رویداد دکمه جستجو
  document.getElementById("search_button").addEventListener("click", () => {
    searchActive = true;
    page_number = 1;
    update_search_table(page_number);
    updatePaginationDisplay();
  });

  // دکمه بروزرسانی جستجو
  document.getElementById("search_refresh_button").addEventListener("click", () => {
    if (searchActive) {
      update_search_table(page_number);
    }
  });

  // دکمه‌های تغییر گروهی
  document.getElementById("bulk_search_desc_button").addEventListener("click", open_bulk_info_modal);
  document.getElementById("bulk_search_rank_button").addEventListener("click", open_bulk_priority_modal);

  // دکمه انتخاب همه (رفع مشکل انتخاب همه)
  document.getElementById("selectAllButton").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
  });

  // دکمه‌های صفحه‌بندی پایین
  document.getElementById("next_page").addEventListener("click", () => {
    page_number++;
    updatePaginationDisplay();
    showLoader(async () => {
      searchActive ? await update_search_table(page_number) : await update_table(page_number);
    });
  });

  document.getElementById("prev_page").addEventListener("click", () => {
    if (page_number > 1) {
      page_number--;
      updatePaginationDisplay();
      showLoader(async () => {
        searchActive ? await update_search_table(page_number) : await update_table(page_number);
      });
    }
  });

  // دکمه‌های صفحه‌بندی بالا (همگام با دکمه‌های پایین)
  document.getElementById("next_page_top").addEventListener("click", () => {
    page_number++;
    updatePaginationDisplay();
    showLoader(async () => {
      searchActive ? await update_search_table(page_number) : await update_table(page_number);
    });
  });

  document.getElementById("prev_page_top").addEventListener("click", () => {
    if (page_number > 1) {
      page_number--;
      updatePaginationDisplay();
      showLoader(async () => {
        searchActive ? await update_search_table(page_number) : await update_table(page_number);
      });
    }
  });

  // کلیک روی شماره صفحه برای باز کردن مودال صفحه‌بندی
  document.getElementById("show_page_number").addEventListener("click", open_pagination_modal);
  document.getElementById("show_page_number_top").addEventListener("click", open_pagination_modal);
});

// به‌روزرسانی نمایش شماره صفحه و دکمه‌های قبلی/بعدی
function updatePaginationDisplay() {
  document.getElementById("show_page_number").innerText = page_number;
  document.getElementById("show_page_number_top").innerText = page_number;
  if (page_number > 1) {
    document.getElementById("prev_page").classList.remove("hidden");
    document.getElementById("prev_page_top").classList.remove("hidden");
  } else {
    document.getElementById("prev_page").classList.add("hidden");
    document.getElementById("prev_page_top").classList.add("hidden");
  }
}

// تابع به‌روزرسانی جدول (حالت پیش‌فرض)
async function update_table(page) {
  if (page) {
    page_number = page;
  }
  const tableBody = document.getElementById("TableBody");
  tableBody.innerHTML = "";
  // فراخوانی API برای دریافت داده‌های برندها (به آدرس واقعی تغییر یابد)
  fetch("http://79.175.177.113:21800/Brands/get_brands_by_category_id/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Accept-Version": 1,
      Accept: "application/json",
      Authorization: user_token
    },
    body: JSON.stringify({
      category_id: JSON.parse(sessionStorage.getItem("brand_cat"))._id,
      page: page_number,
      page_limit: 10
    })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("mainContent").classList.remove("hidden");
      data.data.brands.forEach(item => {
        const row = document.createElement("tr");
        row.classList.add("text-gray-800", "text-lg");
        row.innerHTML = `
          <td class="px-6 py-4">
            <input type="checkbox" class="row-checkbox" data-id="${item.brand_id}" onchange="individualCheckboxChanged(event)">
          </td>
          <td class="px-6 py-4">${item.brand_id}</td>
          <td class="px-6 py-4">${item.brand_name}</td>
          <td class="px-6 py-4">${item.brand_name_fa}</td>
          <td class="px-6 py-4">${Object.keys(item.brand_stat).join(" ، ")}</td>
          <td class="px-6 py-4">${item.brand_priority}</td>
          <td class="px-6 py-4 flex gap-2">
            <span class="w-full p-2 rounded-xl bg-blue-200 hover:bg-blue-500 cursor-pointer transition duration-300" onclick="Open_info_modal(${item.brand_id})">
              درج توضیحات
            </span>
            <span class="w-full p-2 rounded-xl bg-teal-200 hover:bg-teal-500 cursor-pointer transition duration-300" onclick="Open_info_modal_p(${item.brand_id})">
              بروز رسانی رتبه
            </span>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("خطا در دریافت داده‌ها:", error));
}

// تابع به‌روزرسانی جدول جستجو
async function update_search_table(page) {
  if (page) {
    page_number = page;
  }
  const searchQuery = document.getElementById("search_input").value;
  const tableBody = document.getElementById("TableBody");
  tableBody.innerHTML = "";
  fetch("http://79.175.177.113:21800/Brands/search_brands/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Accept-Version": 1,
      Accept: "application/json",
      Authorization: user_token
    },
    body: JSON.stringify({
      search_query: searchQuery,
      page: page_number,
      page_limit: 10
    })
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("mainContent").classList.remove("hidden");
      data.data.brands.forEach(item => {
        const row = document.createElement("tr");
        row.classList.add("text-gray-800", "text-lg");
        row.innerHTML = `
          <td class="px-6 py-4">
            <input type="checkbox" class="row-checkbox" data-id="${item.brand_id}" onchange="individualCheckboxChanged(event)">
          </td>
          <td class="px-6 py-4">${item.brand_id}</td>
          <td class="px-6 py-4">${item.brand_name}</td>
          <td class="px-6 py-4">${item.brand_name_fa}</td>
          <td class="px-6 py-4">${Object.keys(item.brand_stat).join(" ، ")}</td>
          <td class="px-6 py-4">${item.brand_priority}</td>
          <td class="px-6 py-4 flex gap-2">
            <span class="w-full p-2 rounded-xl bg-blue-200 hover:bg-blue-500 cursor-pointer transition duration-300" onclick="Open_info_modal(${item.brand_id})">
              درج توضیحات
            </span>
            <span class="w-full p-2 rounded-xl bg-teal-200 hover:bg-teal-500 cursor-pointer transition duration-300" onclick="Open_info_modal_p(${item.brand_id})">
              بروز رسانی رتبه
            </span>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("خطا در دریافت داده‌های جستجو:", error));
}

// تابع تغییر وضعیت چک‌باکس‌های ردیف (می‌توانید منطق دلخواه خود را اضافه کنید)
function individualCheckboxChanged(event) {
  // منطق مربوط به تغییر وضعیت هر چک‌باکس
}

// مودال تغییر توضیحات فردی
async function Open_info_modal(id) {
  const tableElem = document.getElementById("brands_tabel");
  tableElem.classList.add("opacity-20");
  const modalElem = document.getElementById("info_change_modal");
  modalElem.classList.remove("hidden");
  document.getElementById("close_info_modal").addEventListener("click", () => {
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
  });
  document.getElementById("confirm_info_button").addEventListener("click", () => {
    push_info(id);
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
  });
}

// عملکرد تغییر توضیحات فردی (پیاده‌سازی واقعی را جایگزین کنید)
async function push_info(id) {
  console.log("به‌روزرسانی توضیحات برای برند", id);
  // فراخوانی API مربوطه
}

// مودال تغییر رتبه فردی
async function Open_info_modal_p(id) {
  const tableElem = document.getElementById("brands_tabel");
  tableElem.classList.add("opacity-20");
  const modalElem = document.getElementById("priority_change_modal");
  modalElem.classList.remove("hidden");
  document.getElementById("close_p_modal").addEventListener("click", () => {
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
  });
  document.getElementById("confirm_p_button").addEventListener("click", () => {
    push_p(id);
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
  });
}

// عملکرد تغییر رتبه فردی (پیاده‌سازی واقعی را جایگزین کنید)
async function push_p(id) {
  console.log("به‌روزرسانی رتبه برای برند", id);
  // فراخوانی API مربوطه
}

// مودال تغییر صفحه‌بندی
async function open_pagination_modal() {
  const tableElem = document.getElementById("brands_tabel");
  tableElem.classList.add("opacity-20");
  const modalElem = document.getElementById("pagination_change_modal");
  modalElem.classList.remove("hidden");
  document.getElementById("close_pagination_modal").addEventListener("click", () => {
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
  });
  document.getElementById("confirm_pagination_button").addEventListener("click", () => {
    push_info_pagination();
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
  });
}

// عملکرد تغییر صفحه‌بندی
async function push_info_pagination() {
  let newPage = parseInt(document.getElementById("pagination_input").value, 10);
  if (isNaN(newPage)) {
    newPage = 1;
  }
  page_number = newPage;
  updatePaginationDisplay();
  showLoader(async () => {
    searchActive ? await update_search_table(page_number) : await update_table(page_number);
  });
}

// مودال تغییر توضیحات گروهی
async function open_bulk_info_modal() {
  const tableElem = document.getElementById("brands_tabel");
  tableElem.classList.add("opacity-20");
  const modalElem = document.getElementById("bulk_info_change_modal");
  modalElem.classList.remove("hidden");
  document.getElementById("close_bulk_info_modal").addEventListener("click", () => {
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
  });
  document.getElementById("confirm_bulk_info_button").addEventListener("click", async () => {
    const newDesc = document.getElementById("bulk_category_info_input").value;
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox:checked");
    for (const cb of checkboxes) {
      const brandId = cb.dataset.id;
      await bulkPush_info(brandId, newDesc);
    }
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
    searchActive ? update_search_table(page_number) : update_table(page_number);
  });
}

async function bulkPush_info(brandId, description) {
  try {
    const response = await fetch("http://79.175.177.113:21800/Categories/update_category_usage_advices/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Version": 1,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: user_token
      },
      body: JSON.stringify({
        brand_id: brandId,
        description: description
      })
    });
    if (!response.ok) {
      throw new Error(`خطا: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}

// مودال تغییر رتبه گروهی
async function open_bulk_priority_modal() {
  const tableElem = document.getElementById("brands_tabel");
  tableElem.classList.add("opacity-20");
  const modalElem = document.getElementById("bulk_priority_change_modal");
  modalElem.classList.remove("hidden");
  document.getElementById("close_bulk_priority_modal").addEventListener("click", () => {
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
  });
  document.getElementById("confirm_bulk_priority_button").addEventListener("click", async () => {
    const newPriority = document.getElementById("bulk_category_p_input").value;
    const checkboxes = document.querySelectorAll("#TableBody .row-checkbox:checked");
    for (const cb of checkboxes) {
      const brandId = cb.dataset.id;
      await bulkPush_priority(brandId, newPriority);
    }
    tableElem.classList.remove("opacity-20");
    modalElem.classList.add("hidden");
    searchActive ? update_search_table(page_number) : update_table(page_number);
  });
}

async function bulkPush_priority(brandId, priority) {
  try {
    const response = await fetch("http://79.175.177.113:21800/Brands/update_brand_priority/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Version": 1,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: user_token
      },
      body: JSON.stringify({
        brand_id: brandId,
        priority: priority
      })
    });
    if (!response.ok) {
      throw new Error(`خطا: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}
