// دریافت داده‌های JSON
async function fetchData() {
    try {
        const response = await fetch('http://79.175.177.113:21800/ShoppingMall/get_saleman_mall_stat/', {
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
        if (data) {
            updateUI(data.data);  // Pass the fetched data to the render function
        } else {
            throw new Error('Invalid data format: "Saleman_bot" not found in the response.');
        }

    } catch (error) {
        // Log and display the error to the user
        console.error('Error Getting categories:', error);
        alert('Failed to load categories: ' + error.message);
    }
}

// بروزرسانی رابط کاربری با داده‌های دریافت شده
function updateUI(data) {
    // بروزرسانی بخش اندازه پایگاه داده
    document.getElementById('dbSizeSection').innerHTML = `
        <div class="bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-2xl font-semibold text-teal-600 text-center">اندازه کل</h2>
            <p class="text-xl font-bold text-blue-500 text-center">${data.db_size.total_size}</p>
        </div>
        <div class="bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-2xl font-semibold text-teal-600 text-center">اندازه ذخیره‌سازی</h2>
            <p class="text-xl font-bold text-blue-500 text-center">${data.db_size["Storage Size"]}</p>
        </div>
        <div class="bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-2xl font-semibold text-teal-600 text-center">اندازه شاخص</h2>
            <p class="text-xl font-bold text-blue-500 text-center">${data.db_size.index_size}</p>
        </div>
        <div class="bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-2xl font-semibold text-teal-600 text-center">اندازه داده‌ها</h2>
            <p class="text-xl font-bold text-blue-500 text-center">${data.db_size.data_size}</p>
        </div>
    `;

    // بروزرسانی جدول اندازه مجموعه‌ها
    let collectionRows = '';
    for (const [key, collection] of Object.entries(data.collection_size)) {
        collectionRows += `
            <tr class="bg-gray-50">
                <td class="py-2 px-4">${key}</td>
                <td class="py-2 px-4">${collection.storage_size}</td>
                <td class="py-2 px-4">${collection.physical_size_on_disk}</td>
                <td class="py-2 px-4">${collection.number_of_Documents}</td>
            </tr>
        `;
    }
    document.getElementById('collectionTable').innerHTML = `
        <table class="min-w-full table-auto">
            <thead class="bg-teal-600 text-white">
                <tr>
                    <th class="py-2 px-4 text-left">نام مجموعه</th>
                    <th class="py-2 px-4 text-left">اندازه ذخیره‌سازی</th>
                    <th class="py-2 px-4 text-left">اندازه فیزیکی</th>
                    <th class="py-2 px-4 text-left">تعداد اسناد</th>
                </tr>
            </thead>
            <tbody class="text-gray-800">
                ${collectionRows}
            </tbody>
        </table>
    `;

    // بروزرسانی داده‌های فرکانس
    document.getElementById('frequencyData').innerHTML = `
        <div class="bg-teal-100 p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-teal-600 text-center">تعداد کل محصولات</h3>
            <p class="text-2xl font-bold text-blue-500 text-center">${data.frequency.total_product_count}</p>
        </div>
        <div class="bg-teal-100 p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-teal-600 text-center">تعداد کل مراکز خرید</h3>
            <p class="text-2xl font-bold text-blue-500 text-center">${data.frequency.total_mall_count}</p>
        </div>
        <div class="bg-teal-100 p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-teal-600 text-center">تعداد کل برندها</h3>
            <p class="text-2xl font-bold text-blue-500 text-center">${data.frequency.total_brand_count}</p>
        </div>
    `;
}


// Start loading and use `showLoader` to show the spinner
window.addEventListener('load', function() {
    showLoader(async function() {
        await fetchData();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
    });
});
