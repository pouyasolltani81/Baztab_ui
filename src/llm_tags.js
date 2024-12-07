let categorydata = JSON.parse(localStorage.getItem('categorydata'));
let name_fa = categorydata.name_fa

const categorySelector = document.getElementById('categorySelector');
const totalTagsText = document.getElementById('total-tags');
const tagNamesText = document.getElementById('tag-names');
const cloudContainer = document.getElementById('cloudTagCloud');

async function generateTags() {


    try {
      
        const response = await fetch('http://79.175.177.113:21800/Categories/llm_analyze_tags/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
            body: JSON.stringify({
                "name_fa": name_fa,
              
              })
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data) {
          if(data.return){
            

            console.log('generatee marioooo!!!!');

            document.getElementById('Tags_container').innerHTML = `
                <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
                    <div class="p-4 border-2 border-teal-600 bg-teal-100 rounded-md text-center">Tag Example</div>
            `
            document.getElementById('approveButton').classList.remove('scale-0')
            
          } else {

            console.log("approved before");
            document.getElementById('tag_Cloud_container').classList.remove('hidden')
            showllmtags()
            

          }
        } 

    } catch (error) {
      
        console.error('Error searching products:', error);
        // alert('Failed to search products: ' + error.message);
    }

}


async function fetchAllData() {
    try {
      
  
  
      let data_c = {
        'name_fa': name_fa,
        
      };
      const response = await fetch('http://79.175.177.113:21800/Categories/get_category_details/', {
      method: 'POST',
       headers: {
                  'Content-Type': 'application/json',
                  "Accept-Version": 1,
                  'Accept': "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json; charset=utf-8",
                  'authorization': user_token,
              },
        body: JSON.stringify(data_c)
      }); 
      const data = await response.json();
      return data.data;  // Assuming 'data' contains your required objects
    } catch (error) {
      console.error('Error fetching data:', error);
      return {}; // Return empty object in case of error
    }
}

async function showllmtags(){

    let { llm_tags, price_distribution, desertized_price_distribution, basic_info } = await fetchAllData();

  // Populate category selector and initialize tag cloud
  populateCategorySelector(llm_tags);
  if (Object.keys(llm_tags).length > 0) {
    const initialCategory = Object.keys(llm_tags)[0];
    updateTagCloud(llm_tags, initialCategory);
  }


// Populate the category dropdown based on the available cloudTags
function populateCategorySelector(cloudTags) {
    categorySelector.innerHTML = ''; // Clear existing options
  
    // Add options dynamically based on fetched cloudTags
    for (const category in cloudTags) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelector.appendChild(option);
    }
  
    // Add event listener to update the tag cloud when the category is changed
    categorySelector.addEventListener('change', (event) => {
      const selectedCategory = event.target.value;
      updateTagCloud(cloudTags, selectedCategory);
    });
  }
  
  // Update the tag cloud based on the selected category
  function updateTagCloud(cloudTags, selectedCategory) {
    const tags = cloudTags[selectedCategory] || [];
    totalTagsText.textContent = `تعداد برچسب‌ها: ${tags.length}`;
  
    // Clear the existing cloud
    cloudContainer.innerHTML = '';
  
    // Add the new tags to the cloud
    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = 'tag-card bg-gray-200 px-4 py-2 rounded-lg shadow-md mb-2';
      tagElement.textContent = tag;
      cloudContainer.appendChild(tagElement);
    });
  }
}



async function approveTags(){

    console.log('mario APPROVED IT !!!!');


}