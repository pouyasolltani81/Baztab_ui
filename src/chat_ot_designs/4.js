const chatBar = document.getElementById('chat-bar');
const chatLayout = document.getElementById('chat-layout');
const chatHistory = document.getElementById('chat-history');
const productGrid = document.getElementById('product-grid');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const startChatBtn = document.getElementById('start-chat-btn');


const products = [

    { name: 'کفش ورزشی', price: '$49.99', image: 'https://via.placeholder.com/150' },
    { name: 'گوشی هوشمند', price: '$699.99', image: 'https://via.placeholder.com/150' },
    { name: 'هدفون بلوتوثی', price: '$29.99', image: 'https://via.placeholder.com/150' }

];


async function sendMessage(userm) {
    const userMessage = userm;
    const apiKey = '115eaa30563d058ea78e4428d7af881031863d4cd48709f90a44bb9a97cbdfdf';
    const sessionId = 'test';

    const data_b = new URLSearchParams({
            message: userMessage , 
            APIKEY : apiKey,
            session_id: sessionId,
        });


    const response = await fetch('http://79.175.177.113:25300/assistant_lg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          
        },
        body: data_b,
        // mode: 'no-cors'
    });


    // const data = sendMessage_c(userMessage)

    const data = await response.json();
    console.log(data);

    return  data.response
    
}


startChatBtn.addEventListener('click', async () => {
    const userMessage = document.getElementById('chat-input').value;
    if (userMessage) {
        chatBar.classList.add('scale-0');
       
        const ai_message = await sendMessage(userMessage)
        
            chatBar.classList.add('hidden');
            chatLayout.classList.remove('hidden');
            chatLayout.classList.add('flex');  


            chatHistory.innerHTML = `<div class="flex justify-end space-x-2">
                                      <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-user mr-2"></i> ${userMessage}</p>
                                      </div>
                                    </div>`;
       

        
        chatHistory.innerHTML += `<div class="flex items-start space-x-2">
                                    <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                        <p dir='rtl'><i class="fas fa-check-circle mr-2"></i> ${ai_message} </p>
                                    </div>
                                  </div>`;
        setTimeout(() => {
            addProductCards();
        }, 1500); 
    }
});


sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (userMessage) {
        chatHistory.innerHTML += `<div class="flex justify-end space-x-2">
                                      <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-user mr-2"></i> ${userMessage}</p>
                                      </div>
                                    </div>`;
        userInput.value = '';
        
      
        const ai_message = await sendMessage(userMessage)
            chatHistory.innerHTML += `<div class="flex items-start space-x-2">
                                        <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                            <p dir='rtl'><i class="fas fa-check-circle mr-2"></i> ${ai_message}</p>
                                        </div>
                                      </div>`;
            addProductCards();
        
    }
});

function addProductCards() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = `<div class="bg-white p-4 shadow-lg rounded-lg border border-gray-300">
                                <img src="${product.image}" alt="تصویر محصول" class="w-full h-32 object-cover rounded-lg mb-2">
                                <h3 class="text-teal-600 font-semibold text-center">${product.name}</h3>
                                <p class="text-gray-600 text-center">${product.price}</p>
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
    const userMessage = userInput.value;
    if (userMessage) {
        chatHistory.innerHTML += `<div class="flex justify-end space-x-2">
                                      <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-user mr-2"></i> ${userMessage}</p>
                                      </div>
                                    </div>`;
        userInput.value = '';
        
      
        const ai_message = await sendMessage(userMessage)
            chatHistory.innerHTML += `<div class="flex items-start space-x-2">
                                        <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                            <p dir='rtl'><i class="fas fa-check-circle mr-2"></i> ${ai_message}</p>
                                        </div>
                                      </div>`;
            addProductCards();
        
    }
    });