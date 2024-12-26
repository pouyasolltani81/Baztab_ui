async function getPreChat(season_id) {
    try {
        chatBar.classList.add('scale-0');
        document.getElementById('loading_2').classList.remove('hidden')

        const response = await fetch('http://79.175.177.113:21800/Categories/get_categories_tree/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
            body : {
                'season_id' : season_id
            }
        });

        document.getElementById('loading_2').classList.add('hidden')


        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data); // Log the entire fetched data

        // Check if the response contains valid categories data
        if (data) {
            reLoadChat(data);  // Pass the fetched data to the render function
        } else {
            throw new Error('Invalid data');
        }

    } catch (error) {
        // Log and display the error to the user
        console.error('Error Getting categories:', error);
        alert('Failed to load categories: ' + error.message);
    }
}

function reLoadChat(data) {

    data = data.data
    chatBar.classList.add('hidden');
    chatLayout.classList.remove('hidden');
    chatLayout.classList.add('flex');
    

}






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

const startChatBtn = document.getElementById('start-chat-btn');


let all_products = [

    { name: 'کفش ورزشی', price: '$49.99', image: 'https://via.placeholder.com/150' },
    { name: 'گوشی هوشمند', price: '$699.99', image: 'https://via.placeholder.com/150' },
    { name: 'هدفون بلوتوثی', price: '$29.99', image: 'https://via.placeholder.com/150' }

];


async function sendMessage(userm , token_c , raiting = 0) {
    const userMessage = userm;
    const apiKey = '115eaa30563d058ea78e4428d7af881031863d4cd48709f90a44bb9a97cbdfdf';
    console.log(token_c);
    const sessionId = token_c;


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
                "session_id": sessionId,
                "rate": raiting

            }),
        // mode: 'no-cors'
    });


    // const data = sendMessage_c(userMessage)

    const data = await response.json();
    console.log(data);
    if (data.data.response[0] == '{'){
        
        try {
        data.data = JSON.parse(data.data.response)
        console.log(data);
        } catch (error) {
            console.log(error.message);
        }

        
    }
    if (data.data.product_list){
        await fetchAllProducts(data.data.product_list)
    }

    console.log('booo',all_products);
    

    return  data.data
    
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
    

    const productPromises = ids.map(id => fetchProductById(id)); 

    try {
        console.log('yes');
        
        const products = await Promise.all(productPromises); 

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
        document.getElementById('loading_2').classList.remove('hidden')

        const massages =await sendMessage(userMessage , token)
        const ai_message = massages.response;
        const meta_data = massages.metadata;
        update_meta(meta_data)

        console.log(meta_data);
        
        document.getElementById('loading_2').classList.add('hidden')

        
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
                }, 10); 
            }
        }

        typeMessage();
    }
});



// Function to update the metadata dynamically
    function update_meta(metadata) {
      const container = document.getElementById("metadata-container");
      const selectedTagsContainer = document.getElementById("selected-tags-container");
      const messageElement = document.getElementById("message");

      // Clear old metadata and selected tags
      container.innerHTML = "";
      selectedTagsContainer.innerHTML = "";
      messageElement.textContent = "";

      console.log(metadata);
      
      // Loop through metadata and create tags for each category
      for (const [key, values] of Object.entries(metadata)) {
        const section = document.createElement("div");
        section.classList.add("space-y-4");

        // Create category title
        const title = document.createElement("h3");
        title.textContent = key;
        title.classList.add("text-xl", "font-semibold", "text-gray-700");
        section.appendChild(title);

        // Clean up the key to use as a valid class name (remove spaces)
        const sanitizedKey = key.replace(/\s+/g, "_");

        // Create tags for the available values
        if (values.length > 0) {
          const tagsContainer = document.createElement("div");
          tagsContainer.classList.add("flex", "flex-wrap", "gap-2");

          values.forEach(value => {
            const tag = document.createElement("span");
            tag.textContent = value;
            tag.classList.add("px-4", "py-2", "bg-blue-100", "text-blue-600", "rounded-full", "cursor-pointer", "hover:bg-blue-200", "transition-all", "duration-200");
            tag.onclick = () => toggleTag(tag, sanitizedKey, value);

            tagsContainer.appendChild(tag);
          });

          section.appendChild(tagsContainer);
        } else {
          // If no values, display a message saying no options available
          const noOptionsMessage = document.createElement("p");
          noOptionsMessage.textContent = "No options available";
          noOptionsMessage.classList.add("text-gray-500");
          section.appendChild(noOptionsMessage);
        }

        container.appendChild(section);
      }
    }

    // Function to show the message based on selected options
    function showMessage() {
      let message = "Hello";

      // Collect selected values from tags
      const selectedTags = document.querySelectorAll(".selected");
      selectedTags.forEach(tag => {
        message += " " + tag.textContent;
      });

      // Display the message
      document.getElementById("message").textContent = message;
    }

    // Function to toggle selection of a tag (add/remove the 'selected' class)
    function toggleTag(tag, category, value) {
      tag.classList.toggle("selected");

      // Add transition for tag selection
      tag.classList.toggle("bg-blue-600");
      tag.classList.toggle("text-white");

      // Show the selected tags below the metadata options
      updateSelectedTags();
    }

    // Function to update the selected tags display
    function updateSelectedTags() {
      const selectedTagsContainer = document.getElementById("selected-tags-container");

      // Clear the current selected tags container
      selectedTagsContainer.innerHTML = "";

      // Get all selected tags
      const selectedTags = document.querySelectorAll(".selected");
      selectedTags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag.textContent;
        tagElement.classList.add("px-4", "py-2", "bg-blue-100", "text-blue-600", "rounded-full", "cursor-pointer", "hover:bg-blue-200", "transition-all", "duration-200", "selected-tag");

        // Allow users to remove tags by clicking them
        tagElement.onclick = () => removeSelectedTag(tagElement);

        selectedTagsContainer.appendChild(tagElement);
      });
    }

    // Function to remove a selected tag
    function removeSelectedTag(tagElement) {
      // Find the original tag element and remove the 'selected' class
      const originalTag = [...document.querySelectorAll(`span`)].find(tag => tag.textContent === tagElement.textContent);
      if (originalTag) {
        originalTag.classList.remove("selected");

        // Apply transition for removal of selected tag
        originalTag.classList.remove("bg-blue-600");
        originalTag.classList.remove("text-white");
      }

      // Fade out the selected tag element and remove it
      tagElement.classList.add("opacity-0");
      setTimeout(() => {
        tagElement.remove();
      }, 200); // Matches the duration of the fade-out animation
    }


async function upadateChat() {
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
        
        const massages =await sendMessage(userMessage , token)
        const ai_message = massages.response;
        const meta_data = massages.metadata;
        update_meta(meta_data)
        console.log(meta_data);

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

sendButton.addEventListener('click', async () => {
    upadateChat() ;
});


function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

let token = generateString(10)

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
                                <button class="bg-teal-500 text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-teal-400 transition duration-200" onclick="gotoproductinfo('${product.relational_data._id}')">
                                    <i class="fas fa-cart-plus mr-2"></i> More info
                                </button>
                              </div>`;
        productGrid.innerHTML += productCard;
    });
}

function gotoproductinfo(product) {
    console.log(product);

    const data = {
        id: product,
       
      };

    localStorage.setItem('product_id', JSON.stringify(data));  
    // localStorage.setItem('productResponse', JSON.stringify(name));  
    window.location.href = './chatbotinfo.html';
    
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
     upadateChat()
}
    });