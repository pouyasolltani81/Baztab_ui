
let slug_fa

// Get references to DOM elements
const categorySelector = document.getElementById('categorySelector');
const totalTagsText = document.getElementById('total-tags');
const tagNamesText = document.getElementById('tag-names');
const cloudContainer = document.getElementById('cloudTagCloud');
// const donutChartCanvas = document.getElementById('priceDistributionChart');
const lineChartCanvas = document.getElementById('priceLineChart');
const explanationModal = document.getElementById('explanationModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModalButton = document.getElementById('closeModalButton');

// Explanation buttons for charts
const donutExplanationButton = document.getElementById('donut-explanation');
const lineExplanationButton = document.getElementById('line-explanation');
const cloudExplanationButton = document.getElementById('cloud-explanation');

// Function to show modal with appropriate content
function showModal(title, description) {
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  explanationModal.classList.remove('hidden'); // Show modal
}

// Event listener for the explanation buttons
donutExplanationButton.addEventListener('click', () => {
  const description = `
    این نمودار دایره‌ای (Donut Chart) 
    هر بخش از این نمودار نشان‌دهنده یک بازه از قیمت‌ها است که درصدی از کل محصولات را تشکیل می‌دهد.
  `;
  showModal("توضیح نمودار دایره‌ای قیمت", description);
});

lineExplanationButton.addEventListener('click', () => {
  const description = `
    این نمودار خطی توزیع قیمت‌ها را در طول بازه‌های مختلف نمایش می‌دهد.
   
  `;
  showModal("توضیح نمودار خطی توزیع قیمت", description);
});

cloudExplanationButton.addEventListener('click', () => {
  const description = `لیست تگ هایی که توسط هوش مصنوعی که برای این دسته کالا نشانه گذاری شده اند.`;
  showModal("توضیح نمودار ابر کلمات", description);
});

// Close the modal when the close button is clicked
closeModalButton.addEventListener('click', () => {
  explanationModal.classList.add('hidden'); // Hide modal
});

// Fetch all data from the API
async function fetchAllData() {
  try {
    const name_far = JSON.parse(localStorage.getItem('name_far'));

    // adding the bread crumble
    slug_fa = name_far.slug_fa
    document.getElementById("breadcrumb-slug").textContent = slug_fa;

    // adding the name to base
    category_name_fa = name_far.category_name_fa
    document.getElementById("name-fa-base").textContent = category_name_fa;


    let data_c = {
      name_fa: name_far.category_name_fa,
      
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

// Initialize the app by fetching the data and setting everything up
async function initialize() {
  
  let { llm_tags, price_distribution, desertized_price_distribution, basic_info } = await fetchAllData();

  price_distribution = price_distribution.map(num => num / 10);
  

  // Update the basic info section
  document.getElementById('total-product-count').textContent = basic_info.total_product_count;
  document.getElementById('in-stock-count').textContent = basic_info.in_stock_count;
  document.getElementById('out-of-stock-count').textContent = basic_info.out_of_stock_count;

  // Populate category selector and initialize tag cloud
  populateCategorySelector(llm_tags);
  if (Object.keys(llm_tags).length > 0) {
    const initialCategory = Object.keys(llm_tags)[0];
    updateTagCloud(llm_tags, initialCategory);
  }

  // Initialize charts with price distribution data
  initializeCharts(price_distribution, desertized_price_distribution);
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

// Utility function to calculate the moving average of a dataset
function calculateMovingAverage(data, windowSize) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize) {
      result.push(data[i]);
    } else {
      let avg = 0;
      for (let j = i - windowSize; j <= i; j++) {
        avg += data[j];
      }
      result.push(avg / windowSize);
    }
  }
  return result;
}

// Initialize the price charts (Donut Chart and Line Chart)
function initializeCharts(priceData, desertized_price_distribution) {
  // Calculate percentiles and frequencies for the donut chart
  // Ensure chartjs-plugin-datalabels is properly registered
  if (ChartDataLabels) {
    Chart.register(ChartDataLabels);
  }

  // Calculate percentiles and frequencies for the donut chart
  const { percentile_1, percentile_2, percentile_3, percentile_4, percentile_5 } = desertized_price_distribution;
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
      firstPrice: priceData[0].price, // Assuming priceData[0] is the first price
      lastPrice: priceData[priceData.length - 1].price, // Assuming priceData is sorted
      percentage: ((percentile_1.frequency / total_items) * 100).toFixed(2)
    },
    {
      label: `${(percentile_2.lower_bound/10).toLocaleString()} - ${(percentile_2.upper_bound/10).toLocaleString()}`,
      minPrice: (percentile_2.lower_bound/10).toLocaleString(),
      maxPrice: (percentile_2.upper_bound/10).toLocaleString(),
      firstPrice: priceData[0].price,
      lastPrice: priceData[priceData.length - 1].price,
      percentage: ((percentile_2.frequency / total_items) * 100).toFixed(2)
    },
    {
      label: `${(percentile_3.lower_bound/10).toLocaleString()} - ${(percentile_3.upper_bound/10).toLocaleString()}`,
      minPrice: (percentile_3.lower_bound/10).toLocaleString(),
      maxPrice: (percentile_3.upper_bound/10).toLocaleString(),
      firstPrice: priceData[0].price,
      lastPrice: priceData[priceData.length - 1].price,
      percentage: ((percentile_3.frequency / total_items) * 100).toFixed(2)
    },
    {
      label: `${(percentile_4.lower_bound/10).toLocaleString()} - ${(percentile_4.upper_bound/10).toLocaleString()}`,
      minPrice: (percentile_4.lower_bound/10).toLocaleString(),
      maxPrice: (percentile_4.upper_bound/10).toLocaleString(),
      firstPrice: priceData[0].price,
      lastPrice: priceData[priceData.length - 1].price,
      percentage: ((percentile_4.frequency / total_items) * 100).toFixed(2)
    },
    {
      label: `${(percentile_5.lower_bound/10).toLocaleString()} - ${(percentile_5.upper_bound/10).toLocaleString()}`,
      minPrice: (percentile_5.lower_bound/10).toLocaleString(),
      maxPrice: (percentile_5.upper_bound/10).toLocaleString(),
      firstPrice: priceData[0].price,
      lastPrice: priceData[priceData.length - 1].price,
      percentage: ((percentile_5.frequency / total_items) * 100).toFixed(2)
    }
  ];

  // Get the canvas context
  const donutChartCanvas = document.getElementById('priceDistributionChart').getContext('2d');

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


// Helper function to format numbers as K or M
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num;
  }
}

// Get the min and max values from price data
function getPriceLimits(priceData) {
  const minPrice = Math.min(...priceData);
  const maxPrice = Math.max(...priceData);

  // Update the DOM elements with the min and max prices
  document.getElementById('min-price').textContent = formatNumber(minPrice);
  document.getElementById('max-price').textContent = formatNumber(maxPrice);
   // Update the DOM elements with the min and max prices
  document.getElementById('min-price-base').textContent =  `${minPrice.toLocaleString()} تومان`;
  document.getElementById('max-price-base').textContent =  `${maxPrice.toLocaleString()} تومان`;
}

// Create Histogram Bins for Line Chart
function createHistogramBins(data, binSize = 200000) {
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const bins = [];
  for (let i = minValue; i <= maxValue; i += binSize) {
    bins.push(i);
  }

  const histogram = bins.map((binStart, index) => {
    const binEnd = binStart + binSize;
    const count = data.filter(value => value >= binStart && value < binEnd).length;
    return { bin: `${binStart} - ${binEnd}`, count };
  });

  return histogram;
}

// Get and display min and max prices
getPriceLimits(priceData);

// Create histogram data for the line chart
const histogramData = createHistogramBins(priceData);
const formattedLabels = histogramData.map(item => `${formatNumber(parseInt(item.bin.split('-')[0]))} - ${formatNumber(parseInt(item.bin.split('-')[1]))}`);
const histogramDataValues = histogramData.map(item => item.count);

// Line Chart Configuration
const lineCtx = document.getElementById('priceLineChart').getContext('2d');
new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: formattedLabels,
    datasets: [{
      label: 'Price Distribution',
      data: histogramDataValues,
      borderColor: '#4BC0C0',  // Retaining your original color
      backgroundColor: 'rgba(59, 130, 246, 0.2)',  // Adjusting background color
      fill: true,
      tension: 0.3,
      // Don't show labels at data points
      datalabels: {
        display: false  // This ensures no labels will be shown on the data points
      }
    }]
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} items`;
          }
        },
        bodyColor: '#fff',
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10,
            weight: '600'
          },
          color: '#333'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
            weight: '600'
          },
          color: '#333',
          callback: function(value) {
            return formatNumber(value); // Custom format for y-axis numbers
          }
        }
      }
    }
  }
});

}





// Function to show loading overlay
    function showLoader(asyncOperation) {
      // Create and append the overlay with the spinner
      const overlay = document.createElement('div');
      overlay.classList.add('loading-overlay');
      overlay.innerHTML = `
        <div class="spinner">
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Perform the async operation and hide the loader when done
      asyncOperation().finally(() => {
        // Remove the overlay after the operation is done
        overlay.remove();
      });
    }

    // Example of an asynchronous operation (fetching or simulating an API call)
    function pageInitialization() {
      return new Promise(resolve => {
        setTimeout(() => {
          // Simulate loading process (e.g., fetching data)
          resolve('Page Loaded');
        }, 5000); // Simulating a 2-second load time
      });
    }

    // Start loading and use `showLoader` to show the spinner
    window.addEventListener('load', function() {
      showLoader(async function() {
        await pageInitialization();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
      });
    });

////////////////////////////////////////////////////////////////////////////////////////////////

function pageInitialization() {
  return new Promise(async (resolve, reject) => {
    try {
      // Wait for fetchAllData to complete (assuming fetchAllData() is asynchronous)
        console.log('0')

      await initialize(); // Replace with your actual fetch function
        console.log('1')

      // Once the data is fetched, resolve the promise
      resolve('Page Loaded and Data Fetched');
    } catch (error) {
      // In case fetchAllData() fails, reject the promise
      reject('Error during data fetching: ' + error);
    }
  });
}


    // Start loading and use `showLoader` to show the spinner
    window.addEventListener('load', function() {
      showLoader(async function() {
        await pageInitialization();  // Simulate page load logic
        document.getElementById('mainContent').classList.remove('hidden'); // Show main content
      });
    });

    