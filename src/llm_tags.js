let productData = JSON.parse(localStorage.getItem('categorydata'));
let name_fa = categorydata.name_fa

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
            

          }
        } 

    } catch (error) {
      
        console.error('Error searching products:', error);
        // alert('Failed to search products: ' + error.message);
    }

}





async function approveTags(){

    console.log('mario APPROVED IT !!!!');


}