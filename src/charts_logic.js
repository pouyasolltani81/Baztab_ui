const user_token = '9fc0fe536ea09fed645f9f791fc15e65';




// Get references to DOM elements
const categorySelector = document.getElementById('categorySelector');
const totalTagsText = document.getElementById('total-tags');
const tagNamesText = document.getElementById('tag-names');
const cloudContainer = document.getElementById('cloudTagCloud');
const donutChartCanvas = document.getElementById('priceDistributionChart');
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
    این نمودار دایره‌ای (Donut Chart) توزیع قیمت محصولات را در 5 درصد اول تا 5 درصد آخر از لحاظ قیمت نمایش می‌دهد.
    هر بخش از این نمودار نشان‌دهنده یک بازه از قیمت‌ها است که درصدی از کل محصولات را تشکیل می‌دهد.
  `;
  showModal("توضیح نمودار دایره‌ای قیمت", description);
});

lineExplanationButton.addEventListener('click', () => {
  const description = `
    این نمودار خطی توزیع قیمت‌ها را در طول بازه‌های مختلف نمایش می‌دهد.
    داده‌ها به صورت میانگین متحرک صاف شده‌اند تا روند کلی قیمت‌ها را نشان دهند.
  `;
  showModal("توضیح نمودار خطی توزیع قیمت", description);
});

cloudExplanationButton.addEventListener('click', () => {
  const description = `
    این نمودار ابر کلمات، برچسب‌های مختلف محصولات را در دسته‌های مختلف نشان می‌دهد.
    اندازه هر کلمه نشان‌دهنده تعداد محصولات مرتبط با آن برچسب است.
  `;
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
  const { llm_tags, price_distribution, desertized_price_distribution, basic_info } = await fetchAllData();

  console.log(llm_tags, Object.values(price_distribution), desertized_price_distribution, basic_info);

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
  const { percentile_1, percentile_2, percentile_3, percentile_4, percentile_5 } = desertized_price_distribution;
  const percentiles = [
    percentile_1.frequency,
    percentile_2.frequency,
    percentile_3.frequency,
    percentile_4.frequency,
    percentile_5.frequency
  ];
  const percentileRanges = [
    `${percentile_1.lower_bound} - ${percentile_1.upper_bound}`,
    `${percentile_2.lower_bound} - ${percentile_2.upper_bound}`,
    `${percentile_3.lower_bound} - ${percentile_3.upper_bound}`,
    `${percentile_4.lower_bound} - ${percentile_4.upper_bound}`,
    `${percentile_5.lower_bound} - ${percentile_5.upper_bound}`
  ];

  // Initialize Donut Chart
  const donutChartCtx = donutChartCanvas.getContext('2d');
  new Chart(donutChartCtx, {
    type: 'doughnut',
    data: {
      labels: percentileRanges,
      datasets: [{
        data: percentiles,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} items`
          }
        }
      },
    }
  });

  // Handle "chunky" data and bin it into ranges before smoothing
  const binnedData = binPriceData(priceData, 200000);  // Adjusted bin size to $200,000
  const smoothedPriceData = calculateMovingAverage(binnedData, 3); // Apply moving average with smaller window size (3)

  console.log('Binned Data:', binnedData);
  console.log('Smoothed Data:', smoothedPriceData);

  // Ensure that we have enough data points
  if (binnedData.length === 0) {
    console.error('No binned data available.');
    return;
  }

  // Initialize Line Chart
  const lineChartCtx = lineChartCanvas.getContext('2d');
  new Chart(lineChartCtx, {
    type: 'line',
    data: {
      labels: Array.from({ length: smoothedPriceData.length }, (_, index) => `Price ${index + 1}`),
      datasets: [{
        label: 'Price Distribution',
        data: smoothedPriceData,  // Use smoothed data
        borderColor: '#4BC0C0',
        fill: false,
        tension: 0.1,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
    }
  });
}

// Bin the price data into ranges (e.g., bin prices into $200,000 intervals)
function binPriceData(priceData, binSize) {
  const binnedData = [];
  
  // Sort prices in ascending order to ensure proper binning
  priceData.sort((a, b) => a - b);

  let currentBinSum = 0;
  let currentBinCount = 0;
  
  // Iterate through price data, binning into ranges of `binSize`
  for (let i = 0; i < priceData.length; i++) {
    currentBinSum += priceData[i];
    currentBinCount++;
    
    // When the bin reaches the bin size, finalize this bin and reset
    if (currentBinSum >= (currentBinCount * binSize)) {
      binnedData.push(currentBinSum / currentBinCount); // Average price in the bin
      currentBinSum = 0;
      currentBinCount = 0;
    }
  }
  
  // Push the last bin if there’s leftover data
  if (currentBinCount > 0) {
    binnedData.push(currentBinSum / currentBinCount);
  }

  return binnedData;
}

// Initialize the app
initialize();
