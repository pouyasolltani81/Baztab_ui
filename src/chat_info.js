

let user_token = '8ff3960bbd957b7e663b16467400bba2';

async function GetProduct(id) {
    try {
      
      
        const response = await fetch('http://79.175.177.113:21800/Products/search_product_by_id/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept-Version": 1,
                'Accept': "application/json",
                "Access-Control-Allow-Origin": "*",
                'authorization': user_token,
            },
            body: JSON.stringify({
                "id": id
              })
        });

        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if the response contains valid categories data
        if (data) {
          console.log(data);
          
          update_ui(data);  // Call the update UI function with the response data
        } 

    } catch (error) {
        // Log and display the error to the user
        console.error('Error Getting products:', error);
        // alert('Failed to load products: ' + error.message);
    }
}



  function update_ui(data){
        document.getElementById('product_name_fa').textContent = data.data.product_name_fa;
        document.getElementById('primary_image').src = data.data.relational_data.media_info.primary_image;
        document.getElementById('brand_name_fa').textContent = data.data.relational_data.brand_info.brand_name_fa;
        document.getElementById('mall_name_fa').textContent = data.data.relational_data.mall_info.mall_name_fa;
        document.getElementById('mall_name').textContent = data.data.relational_data.mall_info.mall_name_fa;

        document.getElementById('category_name_fa').textContent = data.data.relational_data.category_info.category_name_fa;
        document.getElementById('category_name_c').textContent = data.data.relational_data.category_info.category_name_fa;
        document.getElementById('is_available').textContent = data.data.is_available ? 'بله' : 'خیر';
        document.getElementById('total_product_count').textContent = data.data.relational_data.category_info.basic_info.total_product_count;
        document.getElementById('in_stock_count').textContent = data.data.relational_data.category_info.basic_info.in_stock_count;
        document.getElementById('out_of_stock_count').textContent = data.data.relational_data.category_info.basic_info.out_of_stock_count;
        document.getElementById('scrape_url').href = data.data.scrape_url;
        
        console.log(data.data.relational_data.category_info.desertized_price_distribution);
        document.getElementById('avg_price').textContent = (data.data.price_stat.avg/10).toLocaleString();
        document.getElementById('min_price').textContent = (data.data.price_stat.min/10).toLocaleString();
        document.getElementById('max_price').textContent = (data.data.price_stat.max/10).toLocaleString();
        document.getElementById('variance').textContent = (data.data.price_stat.variance/10).toLocaleString();
        document.getElementById('description_en').textContent = data.data.llm_enriched_description.description_en;
        document.getElementById('description_fa').textContent = data.data.llm_enriched_description.description_fa;


        if (data.data.llm_enriched_description.llm_tags) {
            let llm_tags = data.data.llm_enriched_description.llm_tags
            llm_tags.forEach(tag => {
                const tag_c =     `<li class="text-gray-800">${tag}</li>`
            
            document.getElementById('llm_tags').innerHTML += tag_c;
        })
        }
        

        if (ChartDataLabels) {
            Chart.register(ChartDataLabels);
        }

        if (data.data.relational_data.category_info.desertized_price_distribution) {

            const { percentile_1, percentile_2, percentile_3, percentile_4, percentile_5 } = data.data.relational_data.category_info.desertized_price_distribution;
            const percentiles = [
                percentile_1.frequency,
                percentile_2.frequency,
                percentile_3.frequency,
                percentile_4.frequency,
                percentile_5.frequency
            ];

            const total_items = percentiles.reduce((sum, freq) => sum + freq, 0); // Sum of all frequencies

            const percentileRanges = [
                {
                label: `${(percentile_1.lower_bound/10).toLocaleString()} - ${(percentile_1.upper_bound/10).toLocaleString()}`,
                minPrice: (percentile_1.lower_bound/10).toLocaleString(),
                maxPrice: (percentile_1.upper_bound/10).toLocaleString(),
                
                percentage: ((percentile_1.frequency / total_items) * 100).toFixed(2)
                },
                {
                label: `${(percentile_2.lower_bound/10).toLocaleString()} - ${(percentile_2.upper_bound/10).toLocaleString()}`,
                minPrice: (percentile_2.lower_bound/10).toLocaleString(),
                maxPrice: (percentile_2.upper_bound/10).toLocaleString(),
                
                percentage: ((percentile_2.frequency / total_items) * 100).toFixed(2)
                },
                {
                label: `${(percentile_3.lower_bound/10).toLocaleString()} - ${(percentile_3.upper_bound/10).toLocaleString()}`,
                minPrice: (percentile_3.lower_bound/10).toLocaleString(),
                maxPrice: (percentile_3.upper_bound/10).toLocaleString(),
                
                percentage: ((percentile_3.frequency / total_items) * 100).toFixed(2)
                },
                {
                label: `${(percentile_4.lower_bound/10).toLocaleString()} - ${(percentile_4.upper_bound/10).toLocaleString()}`,
                minPrice: (percentile_4.lower_bound/10).toLocaleString(),
                maxPrice: (percentile_4.upper_bound/10).toLocaleString(),
                
                percentage: ((percentile_4.frequency / total_items) * 100).toFixed(2)
                },
                {
                label: `${(percentile_5.lower_bound/10).toLocaleString()} - ${(percentile_5.upper_bound/10).toLocaleString()}`,
                minPrice: (percentile_5.lower_bound/10).toLocaleString(),
                maxPrice: (percentile_5.upper_bound/10).toLocaleString(),
                
                percentage: ((percentile_5.frequency / total_items) * 100).toFixed(2)
                }
            ];

            // Get the canvas context
            const donutChartCanvas = document.getElementById('priceChart').getContext('2d');

            // Initialize the Donut Chart
            // Initialize the Donut Chart
            new Chart(donutChartCanvas, {
            type: 'doughnut',
            data: {
                labels: percentileRanges.map(range => `${range.label}: ${range.percentage}%`), // Display percentage with the label
                datasets: [{
                data: percentiles,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true, // Enable tooltips to display information on hover
                    mode: 'index',  // Show tooltip on hovering over any section
                    callbacks: {
                    // Custom tooltip content
                    label: function(tooltipItem) {
                        const dataIndex = tooltipItem.dataIndex;
                        const range = percentileRanges[dataIndex];
                        const frequency = percentiles[dataIndex];
                        
                        // Format the tooltip content
                        return [
                        `Min: ${range.minPrice}`,
                        `Max: ${range.maxPrice}`,
                        `Count: ${frequency}`,
                        `Percentage: ${range.percentage}%`
                        ];
                    }
                    }
                },
                datalabels: {
                    display: true, // Enable datalabels plugin to show custom labels inside slices
                    color: '#fff', // Label text color
                    formatter: function(value, context) {
                    const dataIndex = context.dataIndex;
                    const range = percentileRanges[dataIndex];
                    return `${range.percentage}%`; // Display percentage as label inside the chart
                    },
                    font: {
                    weight: 'bold',
                    size: 14
                    },
                    anchor: 'center', // Position the label inside the slice
                    align: 'center',  // Center the text inside each slice
                    offset: 0, // Set offset to zero to prevent misalignment
                    padding: 0, // Remove any padding that could cause misalignment
                }
                }
            }
            });

        }
        
    }


    let productData = JSON.parse(sessionStorage.getItem('product_id'));
    GetProduct(productData.id);  

    // window.addEventListener('load', function() {
    //     showLoader(async function() {
    //         let productData = JSON.parse(sessionStorage.getItem('product_id'));
    //         await GetProduct(productData.id);  
    //         document.getElementById('mainContent').classList.remove('hidden'); 
    //     });
    //   });
        