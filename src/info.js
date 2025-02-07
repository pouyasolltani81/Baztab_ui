const PriceContainer = document.getElementById('price_info_container')
const BaseInfoContainer = document.getElementById('base_info_container')
const ReviewContainer = document.getElementById('review_container')







function updatepriceui(data ,name) {
    // Extract the price info from the passed data
    let priceInfo = data.data[0].price_info;

    // Update the HTML content of the PriceContainer
    PriceContainer.innerHTML =    PriceContainer.innerHTML  + `
        <div class="w-full max-w-4xl border-2 border-teal-900 rounded-lg p-6 bg-white shadow-lg">
            <h2 class="text-2xl font-semibold text-teal-700 text-center mb-4">اطلاعات قیمت : ${name}</h2>

            <div class="text-gray-700 mb-4">
                <div>قیمت فروش: ${priceInfo.selling_price.toLocaleString()} ${priceInfo.price_currency}</div>
                <div>قیمت پیشنهادی: ${priceInfo.rrp_price.toLocaleString()} ${priceInfo.price_currency}</div>
                <div>حداکثر سفارش: ${priceInfo.order_limit}</div>
                <div>هزینه حمل و نقل: ${priceInfo.shipping_fee.toLocaleString()} ${priceInfo.price_currency}</div>
                <div>تخفیف: ${priceInfo.discount_percent}%</div>
            </div>
        </div>
    `;
}


function updateQuestionsUI(data, name) {
    // Extract question data from the provided data
    let questions = data.data;
    let questionsContainer = document.getElementById("QuestionsContainer");

    // Create HTML content for each question
    let questionsHTML = questions.map(question => {
        let answersHTML = question.answers.map(answer => {
            return `
            <div class="border-t border-teal-300 mt-2 pt-2">
                <div class="font-medium text-teal-700">پاسخ از ${answer.author_name}</div>
                <div class="text-gray-700">${answer.answer_body}</div>
                <div class="text-sm text-gray-500 mt-1">
                    <span>Likes: ${answer.reactions.like}</span> | 
                    <span>Dislikes: ${answer.reactions.dislike}</span>
                </div>
            </div>
            `;  
        }).join(''); // Join all answers for each question

        return `
        <div class="w-full max-w-4xl border-2 border-teal-900 rounded-lg p-6 bg-white shadow-lg mb-4">
            <h3 class="font-semibold text-teal-700">${question.questionBody}</h3>
            <div class="text-sm text-gray-500">سوال از ${question.author_name} | تاریخ انتشار: ${question.datePublished}</div>
            <div class="text-sm text-yellow-500 mt-2">⭐ ${question.stars} ستاره</div>

            ${answersHTML} <!-- Display answers -->

        </div>
        `;
    }).join('');

    // Add a container for the title (Product name) and Questions title
    questionsContainer.innerHTML = questionsContainer.innerHTML +  `
        <div class="w-full max-w-4xl border-2 border-teal-900 rounded-lg p-6 bg-white shadow-lg mb-4">
            <h2 class="text-3xl font-semibold text-teal-700 text-center mb-6">سوالات مربوط به محصول: ${name}</h2>
            <h3 class="text-xl font-semibold text-teal-700 text-center mb-4">سوالات کاربران</h3>

            ${questionsHTML} <!-- Display questions and answers -->
        </div>
    `;
}



function updatereviewui(data, name) {
    // Extract the reviews from the passed data
    let reviews = data.data;

    // Create the HTML content for the reviews
    let reviewContent = reviews.map(review => {
        return `
            <div class="p-4 border-2 border-teal-900 rounded-md bg-teal-50 mb-4">
                <div class="font-medium text-teal-700">نظر:</div>
                <div class="text-gray-800">${review.reviewBody}</div>

                <div class="mt-4 text-sm text-gray-600">
                    <div>نویسنده: ${review.author_name}</div>
                    <div>تاریخ: ${review.datePublished}</div>
                    <div>امتیاز: ${review.reviewRating.ratingValue} از ${review.reviewRating.bestRating}</div>
                </div>
            </div>
        `;
    }).join(""); // Join all review sections together into a single string

    // Update the HTML content of the ReviewContainer
    ReviewContainer.innerHTML = ReviewContainer.innerHTML + `
        <div class="w-full max-w-4xl border-2 border-teal-900 rounded-lg p-6 bg-white shadow-lg">
            <h2 class="text-2xl font-semibold text-teal-700 text-center mb-4">نظر کاربران : ${name}</h2>

            <div class="flex justify-between text-sm text-gray-600 mb-6">
                <!-- Updated Topk with an input field -->
                <div>
                    <label for="topk" class="mr-2">Topk:</label>
                    <input id="topk" type="number" value="10" min="1" class="w-16 p-1 border border-teal-300 rounded-md text-gray-700" onchange="updateTopk()">
                </div>
                <div>خلاصه کاربران: نظر مختصر</div>
            </div>

            <!-- Injecting the reviews dynamically -->
            ${reviewContent}
        </div>
    `;
}



async function Getpriceinfo(p_id,m_id , name) {

   try {
      
        const response = await fetch('http://79.175.177.113:21800/Products/get_product_pricing/', {
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
                "mall_id": m_id
              })
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data) {
          console.log(data);
          updatepriceui(data , name); 
        } 

    } catch (error) {
      
        console.error('Error searching products:', error);
        // alert('Failed to search products: ' + error.message);
    }
  
}




async function Getreivewinfo(p_id,m_id , name) {

   try {
      
        const response = await fetch('http://79.175.177.113:21800/Products/Reviews/get_reviews/', {
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
                "mall_id": m_id,
                "topk": 10
              })
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data) {
          console.log(data);
          updatereviewui(data , name); 
        } 

    } catch (error) {
      
        console.error('Error searching products:', error);
        // alert('Failed to search products: ' + error.message);
    }
  
}



async function Getquestioninfo(p_id,m_id , name) {

   try {
      
        const response = await fetch('http://79.175.177.113:21800/Products/Questions/get_questions/', {
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
                "mall_id": m_id,
                "topk": 10
              })
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data) {
          console.log(data);
          updateQuestionsUI(data , name); 
        } 

    } catch (error) {
      
        console.error('Error searching products:', error);
        // alert('Failed to search products: ' + error.message);
    }
  
}

async function page_initialize() {
  let products = JSON.parse(sessionStorage.getItem('productsforinfo'));
  console.log('1111',products);
  
  
   products.forEach(product => {
    console.log('22222',product);
    
    Getquestioninfo(product.product_id,product.mall_id, product.name)
    Getreivewinfo(product.product_id,product.mall_id, product.name)
    Getpriceinfo(product.product_id,product.mall_id , product.name)

   })
  
}

// Start loading and use `showLoader` to show the spinner
window.addEventListener('load', function() {
    showLoader(async function() {
        await page_initialize();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
    });
});
