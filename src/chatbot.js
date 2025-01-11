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
let meta_tag_available = false ; 
const startChatBtn = document.getElementById('start-chat-btn');


let all_products = [


];

let chatID = ''

async function sendMessage(userm , token_c , raiting = 0 , meta_tags = [] ) {


    try {

        
        console.log(meta_tags);
        
        const userMessage = userm;
        const apiKey = '115eaa30563d058ea78e4428d7af881031863d4cd48709f90a44bb9a97cbdfdf';
        console.log(token_c);
        const sessionId = token_c;

        if (chatID) {
            await sendRating(raiting,chatID,sessionId)
            
        }

        console.log('body :' , { 
                        
            "query":userMessage ,
            "session_id": sessionId,
            "selected_tag": meta_tags

        });
        
        const response = await fetch('http://79.175.177.113:21800/AIAnalyze/semantic_search/', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    "Accept-Version": 1,
                    'Accept': "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'authorization': user_token,
                },
            body: JSON.stringify({  
                        
                    "query":userMessage ,
                    "session_id": sessionId,
                    "selected_tag": meta_tags

                }),
            // mode: 'no-cors'
        });


        // const data = sendMessage_c(userMessage)

        const data = await response.json();
        chatID = data.data.chat_id
        console.log('dot',data);
        console.log(data.data);

        // if (data.data.response[data.data.length - 1] == '{'){
            
        //     try {
        //     data.data = JSON.parse(data.data.response)
        //     console.log(data);
        //     } catch (error) {
        //         console.log(error.message);
        //     }

            
        // }
        if (data.data.product_id && data.data.product_id.length > 0){
            document.querySelector('#chat_container').classList.add('w-9/12')
            document.querySelector('#chat_container').classList.remove('w-full')
            document.querySelector('#product_container').classList.remove('w-[0px]')
            document.querySelector('#product_container').classList.add('p-6')


            await fetchAllProducts(data.data.product_id)
        } else {

            document.querySelector('#chat_container').classList.remove('w-9/12')
            document.querySelector('#chat_container').classList.add('w-full')
            document.querySelector('#product_container').classList.add('w-[0px]')
            document.querySelector('#product_container').classList.remove('p-6')
        }

        console.log('booo',data.data.product_id);
        

        return  data.data
    } catch {
        let data = {
            'data': {
                'response': 'مشکلی پیش آمد'
            }
        }

        return  data.data

    }
    
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
                  
    });


    

    

        if (!response.ok) {

            throw new Error(`Error fetching product with ID ${id}: ${response.status}`);

        }

        const productData = await response.json();

       

        return productData.data; 

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


// startChatBtn.addEventListener('click', async () => {
//     const userMessage = document.getElementById('chat-input').value;
//     if (userMessage) {
//         chatBar.classList.add('scale-0');

//         // Show typing animation
//         const typingAnimation = `<div id="typing" class="flex items-start space-x-2">
//                                       <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
//                                           <p dir='rtl'><i class="fas fa-spinner fa-spin mr-2"></i> در حال تایپ...</p>
//                                       </div>
//                                   </div>`;
//         chatHistory.innerHTML += typingAnimation;
//         document.getElementById('loading_2').classList.remove('hidden')
//   // Wait for AI message

//         let message = userMessage;

//         if (meta_tag_available) {
//             const selectedTags = document.querySelectorAll(".selected");
//             selectedTags.forEach(tag => {
//                 message += " " + tag.textContent;
//             });
//         }

//         // Display the message
      
        
//         const massages =await sendMessage(message , token)
//         const ai_message = massages.response;
//         console.log(ai_message);
        
//         const meta_data = massages.metadata;
//         if (meta_data){
//             document.getElementById('meta_tags').classList.remove('scale-x-0')
//             update_meta(meta_data)
//         } else {
//             document.getElementById('meta_tags').classList.add('scale-x-0')

//             meta_tag_available = false
//         }
//         console.log(meta_data);
        
//         document.getElementById('loading_2').classList.add('hidden')

        
//         // Hide input area and show chat layout
//         chatBar.classList.add('hidden');
//         chatLayout.classList.remove('hidden');
//         chatLayout.classList.add('flex');

//         // Display the user's message
//         chatHistory.innerHTML = `<div class="flex justify-end space-x-2">
//                                       <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
//                                           <p dir='rtl'><i class="fas fa-user mr-2"></i> ${userMessage}</p>
//                                       </div>
//                                   </div>`;

//         // Remove typing animation
//         const typingElement = document.getElementById('typing');
//         if (typingElement) {
//             typingElement.remove();
//         }

//         // Typing effect for AI message
//         const aiMessageElement = document.createElement('div');
//         aiMessageElement.classList.add('flex', 'items-start', 'space-x-2');
//         aiMessageElement.innerHTML = `<div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
//                                           <p dir='rtl'><i class="fas fa-check-circle mr-2"></i> <span id="aiMessageContent"></span></p>
//                                       </div>`;
//         chatHistory.appendChild(aiMessageElement);

//         const aiMessageContent = document.getElementById('aiMessageContent');
//         let index = 0;
//         const typingSpeed = 10; // Adjust typing speed (in milliseconds)

//         function typeMessage() {
//             if (index < ai_message.length) {
//                 aiMessageContent.textContent += ai_message[index];
//                 index++;
//                 setTimeout(typeMessage, typingSpeed);
//             } else {
//                 setTimeout(() => {
//                     addProductCards(all_products);
//                 }, 10); 
//             }
//         }

//         typeMessage();
//     }
// });



// Function to update the metadata dynamically
    function update_meta(metadata) {
        meta_tag_available = true

        const selectedTagsContainer = document.getElementById("selected-tags-container");

      selectedTagsContainer.innerHTML = "";
      

      console.log(metadata);

      const container = document.createElement("div");
      
      for (const [key, values] of Object.entries(metadata)) {
        const section = document.createElement("div");
        section.classList.add("pt-4");

        const title = document.createElement("h3");
        title.textContent = key;
        title.classList.add("text-l", "font-semibold");
        section.appendChild(title);

        const sanitizedKey = key.replace(/\s+/g, "_");

       
        if (values.length > 0) {
          const tagsContainer = document.createElement("div");
          tagsContainer.classList.add("flex", "flex-col", "gap-2" , 'pt-2');

          values.forEach(value => {
            const tag = document.createElement("span");
            tag.textContent = value;
            tag.classList.add(  "text-blue-100", "rounded-full", "cursor-pointer", "hover:text-teal-200", "transition-all", "duration-200");
            // tag.onclick = () => toggleTag(tag, sanitizedKey, value);
            tag.onclick = () => { console.log(`Tag clicked: ${value}`); toggleTag(tag, sanitizedKey, value); };

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

        // document.getElementById('metadata-container').appendChild(section)
      }

      return container
    }

    // Function to show the message based on selected options
    // Function to toggle selection of a tag (add/remove the 'selected' class)
    function toggleTag(tag, category, value) {
      tag.classList.toggle(`selected${category}`);

      // Add transition for tag selection
      tag.classList.toggle("text-teal-200");
   

      // Show the selected tags below the metadata options
      updateSelectedTags();
    }

    // Function to update the selected tags display
    function updateSelectedTags(category) {
      const selectedTagsContainer = document.getElementById("selected-tags-container");

      // Clear the current selected tags container
      selectedTagsContainer.innerHTML = "";

      // Get all selected tags
      const selectedTags = document.querySelectorAll(`.selected${category}`);
      selectedTags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag.textContent;
        tagElement.classList.add("px-4", "py-2", "bg-blue-100", "text-blue-600", "rounded-full", "cursor-pointer", "hover:bg-blue-200", "transition-all", "duration-200", "selected-tag");

        // Allow users to remove tags by clicking them
        tagElement.onclick = () => removeSelectedTag(tagElement , category);

        selectedTagsContainer.appendChild(tagElement);
      });
    }

    // Function to remove a selected tag
    function removeSelectedTag(tagElement ,category) {
      // Find the original tag element and remove the 'selected' class
      const originalTag = [...document.querySelectorAll(`span`)].find(tag => tag.textContent === tagElement.textContent);
      if (originalTag) {
        originalTag.classList.remove(`selected${category}`);

        // Apply transition for removal of selected tag
        originalTag.classList.remove("text-teal-200");
     
      }

      // Fade out the selected tag element and remove it
      tagElement.classList.add("opacity-0");
      setTimeout(() => {
        tagElement.remove();
      }, 200); // Matches the duration of the fade-out animation
    }


    
let rating = 0


async function sendRating(rating, chatid , sessionId) {

    try { 
        const response = await fetch('http://79.175.177.113:21800/AIAnalyze/update_chat_by_like/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
            body : {
                "session_id": sessionId,
                "chat_id": chatid,
                "like": rating
                
            }
        });


    }
    catch(e) {
        console.log(e);
        
    }
    
}

async function upadateChat() {





        

        const userMessage = userInput.value;
        
        let message = userMessage;
        let meta_tags = [];
        let sendMassage = message;

        if (meta_tag_available) {
            const selectedTags = document.querySelectorAll(".selected");
            selectedTags.forEach(tag => {

                message += ' ' + tag.textContent
                meta_tags.push(tag.textContent)
                
                
            });
        }

        console.log(meta_tags);


    if (userMessage  || document.getElementById('selected-tags-container').innerHTML != '' ) {
        m_n += 1 ;
        // Display the user's message
        chatHistory.innerHTML += `<div class="flex justify-end space-x-2">
                                      <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-user mr-2"></i> ${message}</p>
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

        // Display the message
      
        
        const massages =await sendMessage(sendMassage , token , rating , meta_tags)
            
            
        let ai_message = ''
        console.log(typeof massages.response);
        
        if (typeof massages.response == 'string' ) {
             ai_message = massages.response;

        } else {
             ai_message = 'مشکلی پیش آمد'
        }
        
        console.log(ai_message);

        const meta_data = massages.metadata;
        let met_div
        if (meta_data){
            document.getElementById('meta_tags').classList.remove('scale-x-0')
            met_div = update_meta(meta_data)
        } else {
            document.getElementById('meta_tags').classList.add('scale-x-0')
            meta_tag_available = false
        }
        
        console.log(meta_data);

        // Remove typing animation
        const typingElement = document.getElementById('typing');
        if (typingElement) {
            typingElement.remove();
        }

        // Typing effect for AI message
        const aiMessageElement = document.createElement('div');
        const met_mes = document.createElement('div');
        const like_dis = document.createElement('div');
        like_dis.classList.add("flex", "justify-end" ,"gap-4" ,"mt-2");
        like_dis.innerHTML = `<i class="fas fa-thumbs-up like-icon cursor-pointer text-gray-400 text-2xl transition-transform duration-300"></i>
            <i class="fas fa-thumbs-down dislike-icon cursor-pointer text-gray-400 text-2xl transition-transform duration-300"></i>`

        met_mes.classList.add("bg-blue-600" ,"text-white", "p-3", "rounded-lg" ,"max-w-xs");
        met_mes.innerHTML = `<p dir='rtl'><i class="fas fa-check-circle mr-2"></i> <span id="aiMessageContent${m_n}"></span></p>`
        met_mes.appendChild(met_div)

        met_mes.appendChild(like_dis)
        aiMessageElement.classList.add('flex', 'items-start', 'space-x-2');
    //     aiMessageElement.innerHTML = `
    // <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
    //     <p dir='rtl'><i class="fas fa-check-circle mr-2"></i> <span id="aiMessageContent${m_n}"></span></p>
    //     <div class="flex justify-end gap-4 mt-2">
    //         <i class="fas fa-thumbs-up like-icon cursor-pointer text-gray-400 text-2xl transition-transform duration-300"></i>
    //         <i class="fas fa-thumbs-down dislike-icon cursor-pointer text-gray-400 text-2xl transition-transform duration-300"></i>
    //     </div>
    // </div>`;
    aiMessageElement.appendChild(met_mes)
        chatHistory.appendChild(aiMessageElement);




        const aiMessageContent = document.getElementById(`aiMessageContent${m_n}`);
        let index = 0;
        const typingSpeed = 10; 

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
        rating = -1
        document.querySelectorAll('.like-icon, .dislike-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const parent = this.closest('.flex');
                const likeIcon = parent.querySelector('.like-icon');
                const dislikeIcon = parent.querySelector('.dislike-icon');
                rating = -1
                
                if (this.classList.contains('fa-thumbs-up')) {
                    likeIcon.classList.toggle('text-green-500');
                    dislikeIcon.classList.remove('text-red-500');
                    rating = 1
                } else {
                    dislikeIcon.classList.toggle('text-red-500');
                    likeIcon.classList.remove('text-green-500');
                    rating = 0
                }
                
                likeIcon.classList.add('scale-110');
                dislikeIcon.classList.add('scale-110');
                setTimeout(() => {
                    likeIcon.classList.remove('scale-110');
                    dislikeIcon.classList.remove('scale-110');
                }, 300);
            });


            
        });


        

    }

}



async function UpdateUiHistory(data) {
    for (i=0 ; i < data.length; i++)  {
        console.log('saved : ',data[i]);
        
        let chat = data[i] ;
        chatHistory.innerHTML += `<div class="flex justify-end space-x-2">
                                      <div class="bg-teal-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-user mr-2"></i> ${chat.question}</p>
                                      </div>
                                  </div>`;

        chatHistory.innerHTML += `<div id="typing" class="flex items-start space-x-2" id='metadata-container'>
                                      <div class="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                                          <p dir='rtl'><i class="fas fa-spinner fa-spin mr-2"></i>${chat.answer.response}</p>
                                      </div>
                                  </div>`


        await fetchAllProducts(chat.answer.product_id)

        // const meta_data = chat.answer.metadata;
       
        // if (meta_data){
        //     document.getElementById('meta_tags').classList.remove('scale-x-0')
        //     update_meta(meta_data)
        // } else {
        //     document.getElementById('meta_tags').classList.add('scale-x-0')
        //     meta_tag_available = false
        // }
        
        // console.log(meta_data);

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
                                // ${product.relational_data.price_stat.avg ? `<p class="text-gray-600 text-center">${(product.price_stat.avg/10).toLocaleString()} تومان</p>` : ''}

function addProductCards(products) {
    console.log(products);
    
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = `<div class="bg-white p-4 shadow-lg rounded-lg border border-gray-300 h-fit">
                                <h3 class="text-teal-600 font-semibold text-center">${product.product_name_fa}</h3>
                                ${product.relational_data.price_stat ? `<p class="text-gray-600 text-center">${(product.price_stat.avg/10).toLocaleString()} تومان</p>` : ''}

                                <img src="${product.relational_data.media_info.primary_image}" class='rounded-lg h-[100px] w-full' alt="Product image">
                                <button class="bg-teal-500 text-white px-4 py-2 rounded-lg mt-2 w-full hover:bg-teal-400 transition duration-200" onclick="gotoproductinfo('${product.relational_data._id}')">
                                    <i class="fas fa-cart-plus mr-2"></i> اطلاعات بیشتر
                                </button>
                              </div>`;
        productGrid.innerHTML += productCard;
    });
}

function gotoproductinfo(product) {
    console.log(product);

    const data = {
        id: product,
        season_id : token
       
      };

    sessionStorage.setItem('product_id', JSON.stringify(data));   

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

const container = document.getElementById('icon-container');
const waveHand = document.getElementById('wave-hand');
let iswaving = true ;
document.addEventListener('keydown',async function(event) {
    if (event.key === 'Enter') {
        if (iswaving) {
             container.classList.add('opacity-0');

                setTimeout(() => {
                    container.remove();
                    
                }, 500); 
            
            iswaving = false ;
        }
       
        event.preventDefault()
        upadateChat()
        
}
    });





    const textarea = document.getElementById('user-input');
    const maxLines = 5;
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
      const lines = Math.min(textarea.scrollHeight / lineHeight, maxLines);
      textarea.style.height = lines * lineHeight + 'px';
    });




    if (sessionStorage.getItem('product_id')){
        token = JSON.parse(sessionStorage.getItem('product_id')).season_id
        getHistory(token)
    }




    async function getHistory(sessionId) {

        try { 
            const response = await fetch('http://79.175.177.113:21800/AIAnalyze/chat_history/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    "Accept-Version": 1,
                    'Accept': "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'authorization': user_token,
                },
                body : {

                    "session_id": sessionId,
                    
                }
            });

            const data = await response.json();

            UpdateUiHistory(data)


        }
        catch(e) {
            console.log(e);
            
        }
        
    }