const productTableContainer = document.getElementById("TableBody");
const info_container = document.getElementById("info_container");


let test



async function GetProduct(){

//     try {
//         const response = await fetch('./products.json');        
//         const data = response.json();
//          // Check if the response was successful (status code 2xx)
//         if (!response.ok) {
//             throw new Error(`Error: ${response.status} ${response.statusText}`);
//         }
//         test = response
//         console.log(data);
//         updateui(data);
//     }
//   catch (err){
//     console.error('Error fetching initial data:', err);  
//     // document.getElementById('mainContent').classList.remove('hidden'); 
//   }

updateui(productss)

}



function updateui(data) {

    let products = data.data.result ;
    createProductTable(products);

}





function createProductTable(products) {
    productTableContainer.innerHTML = ''; // پاک کردن کارت‌های قبلی
  
    products.forEach(product => {
      const row = document.createElement("tr");
      row.className = "border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600";
      row.id = `TB${product._id}`

       // Checkbox for selecting the row
        const checkbox = document.createElement("td");
        checkbox.className = "whitespace-nowrap px-6 py-4";
        checkbox.innerHTML = `<input type="checkbox" class="row-checkbox">`
  
      // وضعیت موجودی
      const availability = document.createElement("td");
      availability.className = "whitespace-nowrap  px-6 py-4";
      availability.innerHTML = `<span class="text-sm ${product.is_available ? 'text-green-600' : 'text-red-600'} font-semibold">${product.is_available ? 'موجود' : 'تمام شده'}</span>`;
  
      // نام محصول
      const productName = document.createElement("td");
      productName.className = "bwhitespace-nowrap  px-6 py-4";
      productName.textContent = product.product_name_fa;
  
      // شناسه محصول
      const productId = document.createElement("td");
      productId.className = "borwhitespace-nowrap  px-6 py-4";
      productId.dir = 'rtl'
      productId.textContent = `شناسه: ${product._id}`;
  
      // URL استخراج شده
      const productUrl = document.createElement("td");
      productUrl.className = "bowhitespace-nowrap  px-6 py-4";
      productUrl.dir = 'rtl'
      productUrl.innerHTML = `URL استخراج شده: <a href="${product.scrape_url}" target="_blank" class="text-blue-500 hover:text-blue-700">${product.scrape_url}</a>`;
  
      // قیمت (میانگین قیمت)، چک کردن اینکه price_stat موجود باشد
      const price = document.createElement("td");
      price.className = "border-whitespace-nowrap  px-6 py-4";
      if (product.price_stat && product.price_stat.avg) {
        price.textContent = `قیمت: ${(product.price_stat.avg/10).toLocaleString()} تومان `; 
      } else {
        price.textContent = "قیمت: موجود نیست"; // در صورت نبود قیمت
      }
  
      // نام مرکز خرید
      const brandName = document.createElement("td");
      brandName.className = "bowhitespace-nowrap  px-6 py-4";
      brandName.textContent = 'دیجی کالا';
  
      // drop down
      const dropdown = document.createElement("td");
      dropdown.className = "whitespace-nowrap  px-6 py-4";
      dropdown.innerHTML = `
        <div class="relative inline-block text-left">
                        <div>
                          <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true" onclick="ToggleDropDown('${product._id}')" ">
                            Options
                            <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                              <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      
                        <!--
                          Dropdown menu, show/hide based on menu state.
                      
                          Entering: "transition ease-out duration-100"
                            From: "transform opacity-0 scale-95"
                            To: "transform opacity-100 scale-100"
                          Leaving: "transition ease-in duration-75"
                            From: "transform opacity-100 scale-100"
                            To: "transform opacity-0 scale-95"
                        -->
                        <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none hidden" id= 'M${product._id}' role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                          <div class="py-1 " role="none" >
                            <!-- Active: "bg-gray-100 text-gray-900 outline-none", Not Active: "text-gray-700" -->
                            <div class='block px-4 py-2 text-sm text-gray-700 flex justify-between hover:text-blue-700'>
                                 
                                <label class="relative inline-block w-14 h-7">
                                    <input type="checkbox" class="opacity-0 w-0 h-0 peer">
                                    <span class="absolute inset-0 cursor-pointer bg-gray-300 rounded-lg transition-all duration-400 ease-in-out shadow-inner peer-checked:bg-gray-800"></span>
                                    <span class="absolute left-1 bottom-1 h-5 w-1 rounded-sm bg-white transition-all duration-400 ease-in-out transform peer-checked:translate-x-10"></span>
                                </label>
                                
                                <div>جزئیات کالا</div>
                            </div>

                            <div class='block px-4 py-2 text-sm text-gray-700 flex justify-between hover:text-blue-700'>
                                <label class="relative inline-block w-14 h-7">
                                    <input type="checkbox" class="opacity-0 w-0 h-0 peer">
                                    <span class="absolute inset-0 cursor-pointer bg-gray-300 rounded-lg transition-all duration-400 ease-in-out shadow-inner peer-checked:bg-gray-800"></span>
                                    <span class="absolute left-1 bottom-1 h-5 w-1 rounded-sm bg-white transition-all duration-400 ease-in-out transform peer-checked:translate-x-10"></span>
                                </label>

                                <div>نظرات کاربران</div>

                                
                            </div>

                            <div class='block px-4 py-2 text-sm text-gray-700 flex justify-between hover:text-blue-700'>
                                <label class="relative inline-block w-14 h-7">
                                    <input type="checkbox" class="opacity-0 w-0 h-0 peer">
                                    <span class="absolute inset-0 cursor-pointer bg-gray-300 rounded-lg transition-all duration-400 ease-in-out shadow-inner peer-checked:bg-gray-800"></span>
                                    <span class="absolute left-1 bottom-1 h-5 w-1 rounded-sm bg-white transition-all duration-400 ease-in-out transform peer-checked:translate-x-10"></span>
                                </label>
                                
                                <div>ریز قیمت</div>

                            </div>


                            <div class='block px-4 py-2 text-sm text-gray-700 flex justify-between hover:text-blue-700'>
                                <label class="relative inline-block w-14 h-7">
                                    <input type="checkbox" class="opacity-0 w-0 h-0 peer">
                                    <span class="absolute inset-0 cursor-pointer bg-gray-300 rounded-lg transition-all duration-400 ease-in-out shadow-inner peer-checked:bg-gray-800"></span>
                                    <span class="absolute left-1 bottom-1 h-5 w-1 rounded-sm bg-white transition-all duration-400 ease-in-out transform peer-checked:translate-x-10"></span>
                                </label>
                                
                                <div>پرسش و پاسخ</div>

                            </div>
      
                          </div>

                          <div class="py-1 flex justify-center " role="none" >
                          
                            <a href="#" class="block px-4 py-2 text-base text-gray-700 hover:text-blue-700"  role="menuitem" tabindex="-1" id="menu-item-2">بروز رسانی</a>

                          </div>
                        </div>
                      </div>
                      
      `
  
      // Add click event listener to the row to delete other rows when selected 
      checkbox.addEventListener('click', () => { const allRows = document.querySelectorAll('tr'); const isSelected = row.classList.toggle('selected'); if (isSelected) { allRows.forEach((r, i) => { if (r !== row && i !== 0) { r.style.display = 'none'; } }); } else { allRows.forEach(r => r.style.display = ''); }});
      row.appendChild(checkbox);
      row.appendChild(productId);
      row.appendChild(productName);
      row.appendChild(price);
      row.appendChild(availability);
      row.appendChild(productUrl);
      row.appendChild(brandName);
      row.appendChild(dropdown);

  
      // افزودن کارت به بخش کارت‌های محصولات
      productTableContainer.appendChild(row);

      
    });
  }


  function ToggleDropDown(id) {
    const Menu = document.getElementById(`M${id}`);
    Menu.classList.toggle('hidden')
  }




  function CreateCard(){
    console.log();
    

  }


  function initializePage(){
    GetProduct()
  }


 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// drop downs
const productss =  {
    "return": true,
    "message": "Ok",
    "data": {
      "next_page": "?pageLimit=10&page=2",
      "prev_page": "?pageLimit=10&page=1",
      "page": 1,
      "showing": 10,
      "total_count": 1909,
      "result": [
        {
          "_id": "67358d34fd1372fc4a6d61ae",
          "product_name": "",
          "product_name_fa": "کرم پودر میستار شماره 102 حجم 40 میلی لیتر",
          "is_available": true,
          "scrape_url": "https://www.digikala.com/product/dkp-7625033",
          "meta_data": {
            "brief_description": "خرید اینترنتی کرم پودر میستار شماره 102 حجم 40 میلی لیتر به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": ""
              }
            ],
            "properties_tags": [
              {
                "field_name": "شماره رنگ",
                "field_value": "102 "
              },
              {
                "field_name": "مشخصات محصول",
                "field_value": "حاوی SPF "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "پمپی "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "پمپی "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "روشن "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "متوسط "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 100,
              "reviewCount": 1
            },
            "colors": [],
            "product_tags": [
              {
                "tag_title": "کیفیت و کارایی",
                "number_of_comments": 1,
                "sentiment": {
                  "positive": 1,
                  "negative": 0,
                  "neutral": 0
                }
              }
            ]
          },
          "sku": "f1bef169e0bb9be0d13a7b255eeb6a4541342de3a4cd9b752b8dda3cbe7dfd7a",
          "mpn": "f1bef169e0bb9be0d13a7b255eeb6a4541342de3a4cd9b752b8dda3cbe7dfd7a",
          "price_stat": {
            "avg": 1949500,
            "variance": 0,
            "min": 1949500,
            "max": 1949500
          }
        },
        {
          "_id": "67358e77fd1372fc4a6d61b4",
          "product_name": "",
          "product_name_fa": "کرم پودر استودیو میکاپ مدل Perfecting Finish شماره 05 حجم 30 میلی لیتر",
          "is_available": true,
          "scrape_url": "https://www.digikala.com/product/dkp-1167547",
          "meta_data": {
            "brief_description": "خرید اینترنتی کرم پودر استودیو میکاپ مدل Perfecting Finish شماره 05 حجم 30 میلی لیتر به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "کرم پودر استودیو میکاپ مدل Perfecting Finish محصولی حرفه‌ای از برند مشهور Studiomakeup است. این کرم پودر با هر نوع پوستی تطابق داشته و استفاده از آن باعث می‌شود پوستی با جلایی ابریشمی داشته باشید. این محصول که به طور ویژه با سیلیکای کروی ساخته شده، با ایجاد خطای دید باعث می شود تا چین و چروکها محو و پوستی تازه و درخشان را برای شما به ارمغان آورد. برای استفاده از این محصول، قبل از استفاده آن‌را خوب تکان دهید. سپس با انگشتان، با یک برس کرم پودر یا اسفنج روی صورت بمالید. با ساختار پوشش‌دهی آن می‌توانید لایه‌هایی را اضافه نمایید تا به پوشش مطلوب دست یابید."
              }
            ],
            "properties_tags": [
              {
                "field_name": "حجم",
                "field_value": "30 میلی‌لیتر"
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "05 "
              },
              {
                "field_name": "سایر توضیحات",
                "field_value": "- ضد چروک\r\n- ضد آب\r\n- آبرسان و تامین کننده رطوبت لازم برای پوست\r\n- ماندگاری بالا\r\n- فاقد چربی\r\n- فاقد پارابن\r\n- پایه گیاهی\r\n- پوشانندگی بالا "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "شیشه "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "پمپی "
              },
              {
                "field_name": "صادر کننده مجوز",
                "field_value": "سازمان غذا و دارو "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "روشن "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "متوسط "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "گندمی "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "تیره "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "برنزه "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 32,
              "reviewCount": 3
            },
            "colors": [],
            "product_tags": []
          },
          "sku": "7d5629201f3563191233b8dc5330da160d2366880d804f095efac9e559823726",
          "mpn": "7d5629201f3563191233b8dc5330da160d2366880d804f095efac9e559823726",
          "price_stat": {
            "avg": 11960000,
            "variance": 0,
            "min": 11960000,
            "max": 11960000
          }
        },
        {
          "_id": "67358e7afd1372fc4a6d61b9",
          "product_name": "",
          "product_name_fa": "کرم پودر فرانسیس مدل Ultra HD شماره 505 حجم 30 میلی لیتر",
          "is_available": false,
          "scrape_url": "https://www.digikala.com/product/dkp-14508701",
          "meta_data": {
            "brief_description": "خرید اینترنتی کرم پودر فرانسیس مدل Ultra HD شماره 505 حجم 30 میلی لیتر به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "کرم پودر جدید فرانسیس  ULTRA  HD  HOllywood در 8 رنگ مات با پوشش دهی فوق العاده و بافتی سبک مخملی بادوام و ماندگار بالا برای استفاده روزانه مناسب انواع پوست است,این محصول با بافت سبک‌و‌پوشش فوق العاده عالی می تواند بهترین زیر ساز آرایش باشد."
              }
            ],
            "properties_tags": [
              {
                "field_name": "حجم",
                "field_value": "30 میلی‌لیتر"
              },
              {
                "field_name": "کشور مبدا برند",
                "field_value": "فرانسه "
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "505 "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "پمپی "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "شیشه "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "گندمی "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 80,
              "reviewCount": 1
            },
            "colors": [],
            "product_tags": [
              {
                "tag_title": "کیفیت و کارایی",
                "number_of_comments": 1,
                "sentiment": {
                  "positive": 1,
                  "negative": 0,
                  "neutral": 0
                }
              }
            ]
          },
          "sku": "37077afb71cbaf2bd6a90a787b114775fd82d71b85a232a86b7a8546c64cba93",
          "mpn": "37077afb71cbaf2bd6a90a787b114775fd82d71b85a232a86b7a8546c64cba93"
        },
        {
          "_id": "67358e7dfd1372fc4a6d61be",
          "product_name": "",
          "product_name_fa": "موس فلر مدل Silk Foundation شماره 602",
          "is_available": true,
          "scrape_url": "https://www.digikala.com/product/dkp-5376745",
          "meta_data": {
            "brief_description": "خرید اینترنتی موس فلر مدل Silk Foundation شماره 602 به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "این مدل از موس فلر بسیار طبیعی و بافتی سبک دارد و مناسب برای انواع پوست می‌باشد و برای مصرف روزانه مناسب بوده. این محصول نواقص چهره را به خوبی می‌پوشاند و پوست شما را صاف و یکدست می‌کند. موس فلر فاقد چربی بوده و ترشح سبوم را به خوبی کنترل می‌کند. این محصول برق ناشی از چربی پوست را از بین برده و پوست را مات و یکدست می‌کند.این محصول حاوی ترکیبات آبرسان است و پوست شما را نرم و لطیف می‌کند. موس فلر با تامین رطوبت مورد نیاز پوست از خشکی پوست به طور موثری جلوگیری می‌کند.آنچه این محصول را متمایز می‌کندبافت سبک و مخملی و همچنین ماندگاری بالا از نکات مثبت این محصول می‌باشد.افرادی که پوست چرب و مستعد آکنه دارند نیز می‌توانند بدون نگرانی از چرب شدن پوست و یا ایجاد جوش با خیالی آسوده از این محصول استفاده کنند. این موس  ماندگاری فوق‌العاده و پوشانندگی بالایی دارد و در عین حال طبیعی و  نچرال می باشد. به همین دلیل بعد از استفاده از این محصول احتیاجی به تثبیت کننده آرایش نخواهید داشت."
              }
            ],
            "properties_tags": [
              {
                "field_name": "حجم",
                "field_value": "18 میلی‌لیتر"
              },
              {
                "field_name": "راهنمای استفاده",
                "field_value": "مقدار کمی از مواد موس را روی پوست در چند نقطه از صورت ،تمیز و شسته شده خود مالیده (بهتر است اگه پوست خشکی دارید قبل از موس از کرم مرطوب کننده استفاده کنید و اگر پوست چرب دارید از پرایمر و یا آبرسان استفاده کنید نتیجه بهتری میگیرید )و توسط براش های مخصوص کرم پودر آن را بصورت یکدست پخش کنید تا کل صورتتان را بگیرد و فقط با مقدار کمی بسیار نتیجه مطلوبی خواهید گرفت. "
              },
              {
                "field_name": "کشور مبدا برند",
                "field_value": "ایران "
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "602 "
              },
              {
                "field_name": "شماره مجوز",
                "field_value": "56/23714 "
              },
              {
                "field_name": "میزان SPF",
                "field_value": "20 "
              },
              {
                "field_name": "مشخصات محصول",
                "field_value": "حاوی SPF "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "شیشه "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "کاسه‌ای "
              },
              {
                "field_name": "صادر کننده مجوز",
                "field_value": "سازمان غذا و دارو "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "ضد پیری "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "آبرسان "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "ضد آب "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "روشن "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "متوسط "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "گندمی "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 100,
              "reviewCount": 1
            },
            "colors": [],
            "product_tags": [
              {
                "tag_title": "کیفیت و کارایی",
                "number_of_comments": 1,
                "sentiment": {
                  "positive": 1,
                  "negative": 0,
                  "neutral": 0
                }
              }
            ]
          },
          "sku": "95cbf3c149beebfd75df0348292f91f74e33df3e8a5dd97d2d3fdd7a584bd5f5",
          "mpn": "95cbf3c149beebfd75df0348292f91f74e33df3e8a5dd97d2d3fdd7a584bd5f5",
          "price_stat": {
            "avg": 5924000,
            "variance": 0,
            "min": 5924000,
            "max": 5924000
          }
        },
        {
          "_id": "67358e80fd1372fc4a6d61c3",
          "product_name": "کرم پودر لورینت مدل Visible Lift شماره F4",
          "product_name_fa": "کرم پودر لورینت مدل Visible Lift شماره F4",
          "is_available": true,
          "scrape_url": "https://www.digikala.com/product/dkp-676111",
          "meta_data": {
            "brief_description": "خرید اینترنتی کرم پودر لورینت مدل Visible Lift شماره F4 به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "کرم پودر لورینت&nbsp;حاوی عصاره سلولهای بنیادی سیب و همچنین پوشش دهی فوق العاده بالا&nbsp;می باشد که این پوشش پرتوهای نور با زوایای مختلف را منحرف نموده و چروک ها را ملایم جلوه می دهد و پایه آرایشی سحرآمیزی را برای ساعت ها فراهم می نماید.این کرم پودر حاوی موادی به نام فیلترهای ضد اشعه UV می باشند که اشعه های مضر فرابنفش خورشیدی را از طریق جذب نور و انعکاس آن تضعیف کرده و مانع از آسیب رساندن آن به پوست می گردد.میزان کارایی یک محصول ضد آفتاب با استفاده از عددی به نام SPF نشان داده می&zwnj;شود که &lrm;مفهوم عدد SPF، افزایش مقاومت پوست در برابر قرمز شدن در صورت استفاده از فرآورده ضد آفتاب است.برای مثال اگر پوست بدن شما بدون استفاده از فرآورده ضد آفتاب ،پس از ده دقیقه قرمز شود با استفاده از فرآورده ضد آفتاب با SPF= 15 پس از 150 دقیقه قرمز خواهد شد. همچنین SPF 15 برای بیش تر از 99 درصد مردم جهان مناسب است.شرکت لورینت با استفاده از بهترین مواد اولیه اقدام به تولید کرم ضد آفتاب کرده است که در کنار مراقبت از اشعه های مضر پوست ؛ باعث شادابی و رطوبت پوست شما می شود."
              }
            ],
            "properties_tags": [
              {
                "field_name": "حجم",
                "field_value": "35 میلی‌لیتر"
              },
              {
                "field_name": "کشور مبدا برند",
                "field_value": "ایران "
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "F4 "
              },
              {
                "field_name": "شماره مجوز",
                "field_value": "56/15205 "
              },
              {
                "field_name": "میزان SPF",
                "field_value": "15 "
              },
              {
                "field_name": "سایر توضیحات",
                "field_value": "-درمان پیری پوست\r\n-ترمیم کننده سلولهای مرده پوست\r\n-ضد چروک و آنتی اکسیدان\r\n-دارای بافت نرم و سبک\r\n-پوشش دهی فوق العاده بالا\r\n-ماندگاری طولانی مدت\r\n "
              },
              {
                "field_name": "مشخصات محصول",
                "field_value": "حاوی SPF "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "پلاستیک "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "تیوبی "
              },
              {
                "field_name": "صادر کننده مجوز",
                "field_value": "سازمان غذا و دارو "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "روشن "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "متوسط "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "گندمی "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 85.27810650887574,
              "reviewCount": 169
            },
            "colors": [],
            "product_tags": [
              {
                "tag_title": "قیمت و ارزش خرید",
                "number_of_comments": 12,
                "sentiment": {
                  "positive": 12,
                  "negative": 0,
                  "neutral": 0
                }
              },
              {
                "tag_title": "کیفیت و کارایی",
                "number_of_comments": 58,
                "sentiment": {
                  "positive": 52,
                  "negative": 6,
                  "neutral": 0
                }
              },
              {
                "tag_title": "تاریخ تولید یا مصرف",
                "number_of_comments": 3,
                "sentiment": {
                  "positive": 2,
                  "negative": 1,
                  "neutral": 0
                }
              },
              {
                "tag_title": "شباهت یا مغایرت",
                "number_of_comments": 1,
                "sentiment": {
                  "positive": 0,
                  "negative": 1,
                  "neutral": 0
                }
              }
            ]
          },
          "sku": "615d9c3ea8e4f63089b97fc3e0ff071ea30f7a44606bb2e6a86bb4ecba8e3732",
          "mpn": "615d9c3ea8e4f63089b97fc3e0ff071ea30f7a44606bb2e6a86bb4ecba8e3732",
          "price_stat": {
            "avg": 1548000,
            "variance": 0,
            "min": 1548000,
            "max": 1548000
          }
        },
        {
          "_id": "67358e83fd1372fc4a6d61c7",
          "product_name": "",
          "product_name_fa": "کرم فشرده مروان خیر شماره 19",
          "is_available": false,
          "scrape_url": "https://www.digikala.com/product/dkp-4565500",
          "meta_data": {
            "brief_description": "خرید اینترنتی کرم فشرده مروان خیر شماره 19 به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "کرم پودر نیمه جامد یا فون چرب مروان خیر محصولی حرفه ای برای سینما و سالن های گریم با ماندگاری بالا ، مناسب جهت پوشاندن و محو کردن اثر تتو های قبلی و ناخواسته ،جای جوش و لک های صورت و بدن،کبودی دور چشم و جای زخم می باشد. این محصول با انواع پوست سازگار است و هیچ گونه آسیبی به آن نمی رساند.و از بهترین مواد طبیعی و معدنی تشکیل گردیده است."
              }
            ],
            "properties_tags": [
              {
                "field_name": "حجم",
                "field_value": "50 میلی‌لیتر"
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "19 "
              },
              {
                "field_name": "ترکیبات",
                "field_value": "بدون چربی "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "پلاستیک "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "پالتی "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "روشن "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "متوسط "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "گندمی "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 80,
              "reviewCount": 3
            },
            "colors": [],
            "product_tags": [
              {
                "tag_title": "قیمت و ارزش خرید",
                "number_of_comments": 1,
                "sentiment": {
                  "positive": 1,
                  "negative": 0,
                  "neutral": 0
                }
              }
            ]
          },
          "sku": "8d112879bdf2144468e0c68d155def0084d7e7622ef152232d95986c6c10915c",
          "mpn": "8d112879bdf2144468e0c68d155def0084d7e7622ef152232d95986c6c10915c"
        },
        {
          "_id": "67358e87fd1372fc4a6d61cc",
          "product_name": "",
          "product_name_fa": "کرم پودر پارس پلادیس شماره 102 حجم 40 میلی لیتر",
          "is_available": true,
          "scrape_url": "https://www.digikala.com/product/dkp-7994232",
          "meta_data": {
            "brief_description": "خرید اینترنتی کرم پودر پارس پلادیس شماره 102 حجم 40 میلی لیتر به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "کرم پودر یکی از اصلی ترین مواد آرایشی میباشد که به عنوان زیرسازی روی پوست محسوب می شود. یک کرم پودر خوب می تواند براحتی لکه ها و جوش های روی پوست را بپوشاند و پوست را روشن و شفاف کند، و به پوست شادابی و طراوت خاصی ببخشد.\r\nکرمپودر تیوپی پلادیس محصولی فوق العاده با پوشش‌دهی عالی و یکدست، دوام و ماندگاری بسیار بالایی دارد. این محصول کاملا طبیعی، بدون اسانس فاقد چربی و حاوی ویتامین E برای حفظ رطوبت و تقویت پوست می‌باشد."
              }
            ],
            "properties_tags": [
              {
                "field_name": "حجم",
                "field_value": "40 میلی‌لیتر"
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "102 "
              },
              {
                "field_name": "مشخصات محصول",
                "field_value": "دارای ویتامین "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "تیوبی "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "تیوبی "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "روشن "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 80,
              "reviewCount": 54
            },
            "colors": [],
            "product_tags": [
              {
                "tag_title": "قیمت و ارزش خرید",
                "number_of_comments": 3,
                "sentiment": {
                  "positive": 3,
                  "negative": 0,
                  "neutral": 0
                }
              },
              {
                "tag_title": "کیفیت و کارایی",
                "number_of_comments": 28,
                "sentiment": {
                  "positive": 27,
                  "negative": 1,
                  "neutral": 0
                }
              }
            ]
          },
          "sku": "4c6a256d9ed9971cf0edd8dbfce2501309d81a5c43187791931dbd24ec9e2510",
          "mpn": "4c6a256d9ed9971cf0edd8dbfce2501309d81a5c43187791931dbd24ec9e2510",
          "price_stat": {
            "avg": 1700000,
            "variance": 0,
            "min": 1700000,
            "max": 1700000
          }
        },
        {
          "_id": "67358e8afd1372fc4a6d61d0",
          "product_name": "",
          "product_name_fa": "کرم پودر پلادیس شماره 102 حجم 40 میلی لیتر",
          "is_available": false,
          "scrape_url": "https://www.digikala.com/product/dkp-1428655",
          "meta_data": {
            "brief_description": "خرید اینترنتی کرم پودر پلادیس شماره 102 حجم 40 میلی لیتر به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "کرم پودر یکی از اصلیترین مواد آرایشی و به عنوان زیرسازی روی پوست محسوب می شود. یک کرم پودر خوب می تواند براحتی لکه ها و جوش های روی پوست را بپوشاند و پوست را روشن و شفاف کند، در نتیجه به پوست شادابی و طراوت خاصی ببخشد. \r\nکرم پودر تیوپی Peladis محصولی فوق العاده با پوشش‌دهی عالی و یکدست، دوام و ماندگاری بسیار بالا است. این محصول کاملا طبیعی، بدون اسانس و حاوی ویتامین E برای حفظ رطوبت و تقویت پوست می‌باشد. این محصول ساخت کشور ایران است که توسط مواد اولیه اروپایی تولید می‌شود. کرم پودر Peladis دارای خاصیت ضد التهابی و ضد حساسیت برای پوست‌های حساس بوده و آبرسان پوست می‌باشد. با استفاده از این محصول احساس لطافت و نرمی را بر روی پوست خود احساس کنید. همچنین این محصول Oil-Free میباشد."
              }
            ],
            "properties_tags": [
              {
                "field_name": "حجم",
                "field_value": "40 میلی‌لیتر"
              },
              {
                "field_name": "کشور مبدا برند",
                "field_value": "ایران "
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "102 "
              },
              {
                "field_name": "شماره مجوز",
                "field_value": "1802-3225772 "
              },
              {
                "field_name": "سایر توضیحات",
                "field_value": "پوشش‌دهی کامل پوست به صورت کاملا طبیعی\r\nماندگاری طولانی مدت و سازگار با انواع پوست\r\nداشتن تناژ طبیعی\r\nضد حساسیت و مناسب برای پوست‌های حساس\r\nOil-Free\r\nفاقد پارابن\r\nآبرسان پوست\r\nاحساس لطافت و نرمی و عدم احساس سنگینی روی پوست\r\nبدون اسانس\r\nمحفظه نگهدارنده از جنس پلاستیک\r\nمناسب برای افراد حرفه‌ای\r\nمورد تایید متخصصان پوست "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "پلاستیک "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "تیوبی "
              },
              {
                "field_name": "صادر کننده مجوز",
                "field_value": "سازمان غذا و دارو "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "آبرسان "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "روشن "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "متوسط "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 86.06060606060606,
              "reviewCount": 33
            },
            "colors": [],
            "product_tags": [
              {
                "tag_title": "قیمت و ارزش خرید",
                "number_of_comments": 4,
                "sentiment": {
                  "positive": 4,
                  "negative": 0,
                  "neutral": 0
                }
              },
              {
                "tag_title": "کیفیت و کارایی",
                "number_of_comments": 24,
                "sentiment": {
                  "positive": 21,
                  "negative": 3,
                  "neutral": 0
                }
              },
              {
                "tag_title": "تاریخ تولید یا مصرف",
                "number_of_comments": 1,
                "sentiment": {
                  "positive": 1,
                  "negative": 1,
                  "neutral": 0
                }
              },
              {
                "tag_title": "شباهت یا مغایرت",
                "number_of_comments": 1,
                "sentiment": {
                  "positive": 1,
                  "negative": 1,
                  "neutral": 0
                }
              }
            ]
          },
          "sku": "f63ca4107d77dc2efa638ed4550be6bbeef3dc925f2400516317e8fb3590f59c",
          "mpn": "f63ca4107d77dc2efa638ed4550be6bbeef3dc925f2400516317e8fb3590f59c"
        },
        {
          "_id": "67358e8dfd1372fc4a6d61d5",
          "product_name": "",
          "product_name_fa": "موس پروکسی مدل 301 مجموعه 2 عددی",
          "is_available": false,
          "scrape_url": "https://www.digikala.com/product/dkp-9567837",
          "meta_data": {
            "brief_description": "خرید اینترنتی موس پروکسی مدل 301 مجموعه 2 عددی به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "کرم پودر فشرده موس به گفته کارشناسان ، تحولی اساسی در دنیای آرایشی و زیبایی است موس بهترین راه حل برای داشتن پوستی کاملا یکدست، صاف و همچنین مات است. موس فشرده پروکسی حالتی بین جامد و مایع دارد و برای پوستهای نرمال تا چرب و همچنین پوست های حساس مناسب است. روغن جوجوبای موجود در این موس باعث میشود که پوست را نرم و مرطوب کند.با استفاده از این موس پوست شما برای یک آرایش بی نقص و بدون ماسیدگی فراهم میشود و هیچ اثری از براقی در پوست خود را نمی یابید و بسیار بر روی پوست سبک است و باعث خستگی پوست شما نمیشود. همچنین مواد تشکیل دهنده این موس روزنه های پوست را نمی پوشاند و باعث میشود همیشه پوست شما به راحتی نفس بکشد."
              }
            ],
            "properties_tags": [
              {
                "field_name": "راهنمای استفاده",
                "field_value": "برای پوشش کامل کافی است مقداری از این موس را با زدن خیلی خفیف انگشتانتان روی صورت پخش کنید . "
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "301 "
              },
              {
                "field_name": "شماره مجوز",
                "field_value": "56/16011 "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "شیشه "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "شیشه "
              },
              {
                "field_name": "صادر کننده مجوز",
                "field_value": "سازمان غذا و دارو "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "متوسط "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 80,
              "reviewCount": 2
            },
            "colors": [],
            "product_tags": [
              {
                "tag_title": "کیفیت و کارایی",
                "number_of_comments": 1,
                "sentiment": {
                  "positive": 1,
                  "negative": 0,
                  "neutral": 0
                }
              }
            ]
          },
          "sku": "02d668aa2df8d80a7bfec5478175759c04b0806a5a4253c6f03435cfef117725",
          "mpn": "02d668aa2df8d80a7bfec5478175759c04b0806a5a4253c6f03435cfef117725"
        },
        {
          "_id": "67358e90fd1372fc4a6d61da",
          "product_name": "",
          "product_name_fa": "کرم پودر اشتون شماره GF40 حجم 30 میلی لیتر",
          "is_available": true,
          "scrape_url": "https://www.digikala.com/product/dkp-17069793",
          "meta_data": {
            "brief_description": "خرید اینترنتی کرم پودر اشتون شماره GF40 حجم 30 میلی لیتر به همراه مقایسه، بررسی مشخصات و لیست قیمت امروز در فروشگاه اینترنتی دیجی‌کالا",
            "long_description": [
              {
                "name": "معرفی",
                "content": "این محصول با فرمولاسیون انحصاری و خاص خود که بر پایه آب می باشد، بسیار سبک و مخملی بوده، موجب تنفس و اکسیژن رسانی پوست می شود و جلوه ای کاملا طبیعی به صورت می دهد. همچنین دارای فیلترهای محافظتی با SPF 30 می باشد که همانند یک کرم ضد آفتاب، پوست را در مقابل اشعه مضر آفتاب محافظت می نماید.\n\nاستفاده از مواد اکتیو در فرمولاسیون این محصول مانند عصاره دانه کرنبری به عنوان یک آنتی اکسیدان قوی و طبیعی موجب کلاژن سازی و تاخیر در روند پیری پوست می گردد؛ همچنین هیالورونیک اسید و ویتامین E موجود در محصول به آبرسانی، جوانسازی و شادابی پوست کمک نموده و از ایجاد چین و چروک جلوگیری می نماید. ماندگاری طولانی و پوشش بالا و یکنواخت از دیگر ویژگی های این محصول می باشد."
              }
            ],
            "properties_tags": [
              {
                "field_name": "تنالیته رنگ",
                "field_value": "متوسط "
              },
              {
                "field_name": "ویژگی های سازگاری با محیط زیست",
                "field_value": "بدون تست حیوانی "
              },
              {
                "field_name": "نوع کرم پودر",
                "field_value": "مایع "
              },
              {
                "field_name": "سازگار با پوست‌‌های",
                "field_value": "همه انواع پوست "
              },
              {
                "field_name": "حجم",
                "field_value": "30 میلی‌لیتر"
              },
              {
                "field_name": "راهنمای استفاده",
                "field_value": "قبل از استفاده حتما تکان داده شود "
              },
              {
                "field_name": "کشور مبدا برند",
                "field_value": "ایران "
              },
              {
                "field_name": "شماره رنگ",
                "field_value": "GF40 "
              },
              {
                "field_name": "میزان SPF",
                "field_value": "30 "
              },
              {
                "field_name": "سایر توضیحات",
                "field_value": "فرمولاسیونی بر پایه آب\nپوشش‌دهی فوق‌العاده\nدارای SPF 30 جهت محافظت پوست در برابر اشعه UV\nآبرسان و کلاژن ساز\nبافت بسیار سبک، مخملی و مات\nضد چروک و پیری پوست\nمناسب برای انواع پوست و استفاده روزانه\nحاوی عصاره دانه کرنبری جهت پیشگیری از چروک و پیری پوست\nحاوی هیالورونیک اسید، به همراه ویتامین E جهت محافظت و رطوبت رسانی فوق العاده به پوست\nپوشش یکدست و یکنواخت\n16 ساعت ماندگاری\nوگن و فاقد پارابن\nعدم ایجاد حساسیت، التهاب و خارش پوست\nفرموله شده در ایتالیا "
              },
              {
                "field_name": "مشخصات محصول",
                "field_value": "حاوی SPF "
              },
              {
                "field_name": "ترکیبات",
                "field_value": "بدون پارابن "
              },
              {
                "field_name": "جنس محفظه",
                "field_value": "شیشه "
              },
              {
                "field_name": "نوع محفظه",
                "field_value": "پمپی "
              },
              {
                "field_name": "صادر کننده مجوز",
                "field_value": "سازمان غذا و دارو "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "کوچک کننده منافذ باز پوست "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "ضد پیری "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "ضد چروک "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "روزانه "
              },
              {
                "field_name": "ویژگی‌ها",
                "field_value": "ماندگاری بالا "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "گندمی "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "تیره "
              },
              {
                "field_name": "مناسب برای رنگ پوست",
                "field_value": "برنزه "
              }
            ],
            "aggregate_rating": {
              "ratingValue": 0,
              "reviewCount": 0
            },
            "colors": [],
            "product_tags": []
          },
          "sku": "12dcfee5ab42be156fa1541a603a48bd6db03880a3a37e58e2d176e3008a71f0",
          "mpn": "12dcfee5ab42be156fa1541a603a48bd6db03880a3a37e58e2d176e3008a71f0",
          "price_stat": {
            "avg": 6930000,
            "variance": 0,
            "min": 6930000,
            "max": 6930000
          }
        }
      ]
    }
  }





  

  initializePage()