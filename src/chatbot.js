const chatBar = document.getElementById('chat-bar');
const chatLayout = document.getElementById('chat-layout');
const chatHistory = document.getElementById('chat-history');
const productGrid = document.getElementById('product-grid');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const newButton = document.getElementById('new-btn');
let user_token = '8ff3960bbd957b7e663b16467400bba2';
let m_n =0;
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let token = generateString(10)
const startChatBtn = document.getElementById('start-chat-btn');


let all_products = [

    { name: 'کفش ورزشی', price: '$49.99', image: 'https://via.placeholder.com/150' },
    { name: 'گوشی هوشمند', price: '$699.99', image: 'https://via.placeholder.com/150' },
    { name: 'هدفون بلوتوثی', price: '$29.99', image: 'https://via.placeholder.com/150' }

];


async function sendMessage(userm , token) {
    const userMessage = userm;
    const apiKey = '115eaa30563d058ea78e4428d7af881031863d4cd48709f90a44bb9a97cbdfdf';
    const sessionId = token;


    const response = await fetch('http://79.175.177.113:21800/AIAnalyze/semantic_search/', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
         body: JSON.stringify({  // Convert the body object to a JSON string
                    
                "query":userMessage ,
                "session_id": sessionId

            }),
        // mode: 'no-cors'
    });


    // const data = sendMessage_c(userMessage)

    const data = await response.json();
    console.log(data);
    fetchAllProducts(data.data.product_list)
    console.log('booo',all_products);
    

    return  data.data.response
    
}





async function fetchProductById(id) {

    try {

         const response = await fetch('http://79.175.177.113:21800/Products/search_product_by_id/', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
         body: JSON.stringify({

            "id": id
            
            }),
                    // mode: 'no-cors'
    });


    // const data = sendMessage_c(userMessage)

    

        if (!response.ok) {

            throw new Error(`Error fetching product with ID ${id}: ${response.status}`);

        }

        const productData = await response.json();

       

        return productData.data; // Return the fetched product data

    } catch (error) {

        console.error(error);

    }

}


// Function to fetch data for all product IDs

async function fetchAllProducts(ids) {
    console.log(ids);
    

    const productPromises = ids.map(id => fetchProductById(id)); // Create an array of promises

    try {
        console.log('yes');
        
        const products = await Promise.all(productPromises); // Wait for all promises to resolve

        console.log(products); 
       all_products = products

    } catch (error) {
        console.log('no');


        console.error('Error fetching products:', error);

    }

}


async function getProduct(ids) {
    
    const idsString = ids;
    const idsArray = idsString.split(',').map(id => id.trim());

    console.log(idsArray);

    const response = await fetch('http://79.175.177.113:21800/Products/search_product_by_id/', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
         body: JSON.stringify({

            "id": "67358ee0fd1372fc4a6d624b"
            
            }),
                    // mode: 'no-cors'
    });


    // const data = sendMessage_c(userMessage)

    const data = await response.json();
    console.log(data);

    return  data.data.response
    
}


startChatBtn.addEventListener('click', async () => {
    const userMessage = document.getElementById('chat-input').value;
    if (userMessage) {
        chatBar.classList.add('scale-0');

        // Show typing animation
        const typingAnimation = `<div id="typing" class="flex items-start space-x-2">
                                      <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-spinner fa-spin mr-2"></i> در حال تایپ...</p>
                                      </div>
                                  </div>`;
        chatHistory.innerHTML += typingAnimation;

        const ai_message = await sendMessage(userMessage);
        
        // Hide input area and show chat layout
        chatBar.classList.add('hidden');
        chatLayout.classList.remove('hidden');
        chatLayout.classList.add('flex');

        // Display the user's message
        chatHistory.innerHTML = `<div class="flex justify-end space-x-2">
                                      <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-user mr-2"></i> ${userMessage}</p>
                                      </div>
                                  </div>`;

        // Remove typing animation
        const typingElement = document.getElementById('typing');
        if (typingElement) {
            typingElement.remove();
        }

        // Typing effect for AI message
        const aiMessageElement = document.createElement('div');
        aiMessageElement.classList.add('flex', 'items-start', 'space-x-2');
        aiMessageElement.innerHTML = `<div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-check-circle mr-2"></i> <span id="aiMessageContent"></span></p>
                                      </div>`;
        chatHistory.appendChild(aiMessageElement);

        const aiMessageContent = document.getElementById('aiMessageContent');
        let index = 0;
        const typingSpeed = 10; // Adjust typing speed (in milliseconds)

        function typeMessage() {
            if (index < ai_message.length) {
                aiMessageContent.textContent += ai_message[index];
                index++;
                setTimeout(typeMessage, typingSpeed);
            } else {
                setTimeout(() => {
                    addProductCards(all_products);
                }, 1500); 
            }
        }

        typeMessage();
    }
});



sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (userMessage) {
        m_n += 1 ;
        // Display the user's message
        chatHistory.innerHTML += `<div class="flex justify-end space-x-2">
                                      <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-user mr-2"></i> ${userMessage}</p>
                                      </div>
                                  </div>`;
        userInput.value = '';

        // Show typing animation
        const typingAnimation = `<div id="typing" class="flex items-start space-x-2">
                                      <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-spinner fa-spin mr-2"></i> در حال تایپ...</p>
                                      </div>
                                  </div>`;
        chatHistory.innerHTML += typingAnimation;

        // Wait for AI message
        const ai_message = await sendMessage(userMessage);

        // Remove typing animation
        const typingElement = document.getElementById('typing');
        if (typingElement) {
            typingElement.remove();
        }

        // Typing effect for AI message
        const aiMessageElement = document.createElement('div');
        aiMessageElement.classList.add('flex', 'items-start', 'space-x-2');
        aiMessageElement.innerHTML = `<div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-check-circle mr-2"></i> <span id="aiMessageContent${m_n}"></span></p>
                                      </div>`;
        chatHistory.appendChild(aiMessageElement);

        const aiMessageContent = document.getElementById(`aiMessageContent${m_n}`);
        let index = 0;
        const typingSpeed = 10; // Adjust typing speed (in milliseconds)

        function typeMessage() {
            if (index < ai_message.length) {
                aiMessageContent.textContent += ai_message[index];
                index++;
                setTimeout(typeMessage, typingSpeed);
            } else {
                addProductCards(all_products);
            }
        }

        typeMessage();
    }
});


function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

newButton.addEventListener('click'  ,() => {

    token = generateString(10)
    m_n =0

    chatHistory.innerHTML = '' 

})


                                // <img src="${product.image}" alt="تصویر محصول" class="w-full h-32 object-cover rounded-lg mb-2">

function addProductCards(products) {
    console.log(products);
    
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = `<div class="bg-white p-4 shadow-lg rounded-lg border border-gray-300">
                                <h3 class="text-teal-600 font-semibold text-center">${product.product_name_fa}</h3>
                                <p class="text-gray-600 text-center">${(product.price_stat.avg/10).toLocaleString()} تومان</p>
                                <button class="bg-teal-500 text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-teal-400 transition duration-200">
                                    <i class="fas fa-cart-plus mr-2"></i> افزودن به سبد خرید
                                </button>
                              </div>`;
        productGrid.innerHTML += productCard;
    });
}



function backAndReload() {

let previousPage = document.referrer; 
console.log(previousPage);



window.location.href = previousPage; 
}


document.addEventListener('keydown', function(event) {
if (event.key === 'Escape') {
backAndReload()
}
});


document.addEventListener('keydown',async function(event) {
    if (event.key === 'Enter') {
        const userMessage = userInput.value;
        if (userMessage) {
            m_n += 1;
            // Display the user's message
            chatHistory.innerHTML += `<div class="flex justify-end space-x-2">
                                          <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
                                              <p dir='rtl'><i class="fas fa-user mr-2"></i> ${userMessage}</p>
                                          </div>
                                      </div>`;
            userInput.value = '';
    
            // Show typing animation
            const typingAnimation = `<div id="typing" class="flex items-start space-x-2">
                                          <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                              <p dir='rtl'><i class="fas fa-spinner fa-spin mr-2"></i> در حال تایپ...</p>
                                          </div>
                                      </div>`;
            chatHistory.innerHTML += typingAnimation;
    
            // Wait for AI message
            const ai_message = await sendMessage(userMessage);
    
            // Remove typing animation
            const typingElement = document.getElementById('typing');
            if (typingElement) {
                typingElement.remove();
            }
    
            // Typing effect for AI message
            const aiMessageElement = document.createElement('div');
            aiMessageElement.classList.add('flex', 'items-start', 'space-x-2');
            aiMessageElement.innerHTML = `<div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                              <p dir='rtl'><i class="fas fa-check-circle mr-2"></i> <span id="aiMessageContent${m_n}"></span></p>
                                          </div>`;
            chatHistory.appendChild(aiMessageElement);
    
            const aiMessageContent = document.getElementById(`aiMessageContent${m_n}`);
            let index = 0;
            const typingSpeed = 10; // Adjust typing speed (in milliseconds)
    
            function typeMessage() {
                if (index < ai_message.length) {
                    aiMessageContent.textContent += ai_message[index];
                    index++;
                    setTimeout(typeMessage, typingSpeed);
                } else {
                    addProductCards(all_products);
                }
            }
    
            typeMessage();
        }
}
    });