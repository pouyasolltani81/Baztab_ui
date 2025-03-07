"use strict";
// User token and regex
const user_token = "8ff3960bbd957b7e663b16467400bba2";
const mongoDB_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

// Element selectors with null-checks
const imageBtn = document.getElementById("imageBtn");
const audioBtn = document.getElementById("audioBtn");
const imageInput = document.getElementById("imageInput");
const audioInput = document.getElementById("audioInput");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const imagePreview = document.getElementById("imagePreview");
const audioPreview = document.getElementById("audioPreview");
const removePreview = document.getElementById("remove_preview");
const previewContainer = document.getElementById("preview");
const loadingIndicator = document.getElementById("loadingIndicator");
const inputPreviewSection = document.getElementById("inputPreviewSection");

// Modal elements for cropping/resizing
const cropModal = document.getElementById("cropModal");
const cropImage = document.getElementById("cropImage");
const cropApplyBtn = document.getElementById("cropApplyBtn");
const resizeApplyBtn = document.getElementById("resizeApplyBtn");
const modalCancelBtn = document.getElementById("cropModalCancelBtn");
const modalCancelBtn2 = document.getElementById("cropModalCancelBtn2");
let cropper = null;

// Modal for product details
const productModal = document.getElementById("myModal");
const closeModal = document.getElementById("closeModal");

// Media recorder variables (if needed)
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioFile;

// Global variables for search parameters and infinite scroll
let currentPage = 1;
let isLoadingMore = false;
let searchParams = {}; // Will hold {query, page_limit, full_content, image_coordinates, image, audio}
let croppedCoordinates = null; // Set after cropping

// Helper: safely add event listener
function safeAddListener(element, event, callback) {
  if (element) {
    element.addEventListener(event, callback);
  }
}

// Helper: Convert file to Base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Show/hide loading indicator
function showLoading() {
  if (loadingIndicator) loadingIndicator.classList.remove("hidden");
}
function hideLoading() {
  if (loadingIndicator) loadingIndicator.classList.add("hidden");
}

// Button events
safeAddListener(imageBtn, "click", () => {
  if (imageInput) imageInput.click();
});
safeAddListener(audioBtn, "click", () => {
  if (audioInput) audioInput.click();
});
safeAddListener(removePreview, "click", () => {
  if (previewContainer) previewContainer.classList.add("hidden");
  if (imageInput) imageInput.value = "";
  if (audioInput) audioInput.value = "";
  if (inputPreviewSection) inputPreviewSection.innerHTML = "";
});

// Resize and reduce quality function with error handling
function resizeAndReduceQuality(file, maxDim, quality = 0.5) {
  console.log("Resizing image...");
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided."));
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || !e.target.result)
        return reject(new Error("Failed to load file."));
      img.src = e.target.result;
      console.log("Original image data URL:", img.src);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Failed to get canvas context."));
        let width = img.width, height = img.height;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL("image/jpeg", quality);
        console.log("Resized image data URL:", resizedDataUrl);
        canvas.toBlob(
          (blob) => {
            if (!blob)
              return reject(new Error("Failed to create blob from canvas."));
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (error) =>
        reject(new Error("Image load error: " + error));
    };
    reader.onerror = (error) =>
      reject(new Error("File read error: " + error));
    reader.readAsDataURL(file);
  });
}

// Function to connect to the server and initialize cropping with response data
async function openCropModal() {
  try {
    if (!imagePreview.src || imagePreview.src === "#") {
      console.error("No image available for cropping.");
      return;
    }
    // Get image blob from preview src
    const response = await fetch(imagePreview.src);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("image", blob, "image.jpg");

    const serverResponse = await connect_to_server(
      "http://79.175.177.113:21800/AIAnalyze/visually_object_detection/",
      "POST",
      user_token,
      "multipart/form-data",
      formData,
      "sementic_search"
    );
    const result = await serverResponse.json();
    console.log(result);

    if (result && result.return && result.data && result.data.coordinates) {
      const { x1, y1, x2, y2 } = result.data.coordinates;

      cropModal.classList.remove("hidden");
      if (cropper) cropper.destroy();

      cropper = new Cropper(cropImage, {
        aspectRatio: NaN, // free ratio
        viewMode: 1,
        autoCropArea: 1,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        ready() {
          // Set crop box with server response coordinates
          cropper.setCropBoxData({
            left: x1,
            top: y1,
            width: x2 - x1,
            height: y2 - y1
          });
        }
      });
    } else {
      console.error("Invalid server response:", result);
    }
  } catch (error) {
    console.error("Error connecting to server:", error);
  }
}

// Image input change: show preview, update crop modal, and auto-open crop modal
safeAddListener(imageInput, "change", (event) => {
  try {
    if (!event || !event.target || !event.target.files)
      throw new Error("Invalid event data.");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          imagePreview.src = e.target.result;
          imagePreview.classList.remove("hidden");
          if (audioPreview) audioPreview.classList.add("hidden");
          cropImage.src = e.target.result;
          // Auto open crop modal after image upload
          openCropModal();
        }
      };
      reader.onerror = (err) =>
        console.error("Error reading image file:", err);
      reader.readAsDataURL(file);
      if (previewContainer) previewContainer.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error handling image input change:", error);
  }
});

// Audio input change: show preview and hide image-to-text (since input is not image)
safeAddListener(audioInput, "change", (event) => {
  try {
    if (!event || !event.target || !event.target.files)
      throw new Error("Invalid event data.");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          audioPreview.src = e.target.result;
          audioPreview.classList.remove("hidden");
          if (imagePreview) imagePreview.classList.add("hidden");
          // Hide image-to-text container since input is not an image
          document.getElementById("img2text").classList.add("hidden");
        }
      };
      reader.onerror = (err) =>
        console.error("Error reading audio file:", err);
      reader.readAsDataURL(file);
      if (previewContainer) previewContainer.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error handling audio input change:", error);
  }
});

// Close crop modal (both cancel buttons)
function closeCropModal() {
  cropModal.classList.add("hidden");
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}
safeAddListener(modalCancelBtn, "click", closeCropModal);
safeAddListener(modalCancelBtn2, "click", closeCropModal);

// Crop & Apply button – now capture crop coordinates and auto-trigger resize
safeAddListener(cropApplyBtn, "click", async () => {
  try {
    if (!cropper) throw new Error("Cropper not initialized.");
    showLoading();
    const canvas = cropper.getCroppedCanvas();
    if (!canvas) throw new Error("Failed to get cropped canvas.");
    // Get cropped image data URL
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    imagePreview.src = croppedDataUrl;
    // Capture current crop coordinates (as an object) for the request
    croppedCoordinates = cropper.getData(true);
    // Update file input with cropped file
    canvas.toBlob((blob) => {
      if (blob && imageInput && imageInput.files[0]) {
        const croppedFile = new File(
          [blob],
          "cropped_" + imageInput.files[0].name,
          { type: "image/jpeg" }
        );
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(croppedFile);
        imageInput.files = dataTransfer.files;
      }
      hideLoading();
    }, "image/jpeg", 0.8);
    closeCropModal();
    // Instead of directly triggering search, trigger resize so that the image is resized before search.
    if (resizeApplyBtn) resizeApplyBtn.click();
  } catch (error) {
    console.error("Error applying crop:", error);
    hideLoading();
  }
});

// Resize & Apply button – uses user inputs for max dimension and quality,
// then automatically triggers the search using the new FormData parameters.
safeAddListener(resizeApplyBtn, "click", async () => {
  try {
    if (!imageInput || !imageInput.files || !imageInput.files[0])
      throw new Error("No image file available for resizing.");
    const maxDimInput = document.getElementById("maxDimension");
    const qualityInput = document.getElementById("qualityInput");
    const maxDim = maxDimInput ? parseInt(maxDimInput.value, 10) : 1024;
    const qualityPercent = qualityInput ? parseInt(qualityInput.value, 10) : 70;
    const quality = qualityPercent / 100;
    showLoading();
    const resizedBlob = await resizeAndReduceQuality(
      imageInput.files[0],
      maxDim,
      quality
    );
    const resizedFile = new File(
      [resizedBlob],
      imageInput.files[0].name,
      { type: "image/jpeg" }
    );
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        imagePreview.src = e.target.result;
      }
      hideLoading();
    };
    reader.readAsDataURL(resizedFile);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(resizedFile);
    imageInput.files = dataTransfer.files;
    
    // Automatically build search parameters and perform search:
    const query = searchInput ? searchInput.value : "";
    const imageFile = imageInput.files[0];
    const audioFile = (audioInput && audioInput.files && audioInput.files[0]) ? audioInput.files[0] : null;
    const imageBase64 = await fileToBase64(imageFile);
    let audioBase64 = "";
    if (audioFile) {
      audioBase64 = await fileToBase64(audioFile);
    }
    // Set global search parameters
    searchParams = {
      query: query,
      page: 1,
      page_limit: 15,
      image_coordinates: croppedCoordinates, // may be null if not cropped
      full_content: 1,
      image: imageBase64,
      audio: audioBase64
    };
    currentPage = 1; // reset page number for new search
    await performSearch(currentPage, false);
  } catch (error) {
    console.error("Error applying resize:", error);
    hideLoading();
  }
});

// Function to perform the search (or fetch additional pages) using the new FormData parameters
async function performSearch(page, appendResults = false) {
  try {
    showLoading();
    const formData = new FormData();
    formData.append("query", searchParams.query || "");
    formData.append("page", page);
    formData.append("page_limit", searchParams.page_limit);
    formData.append("full_content", searchParams.full_content);
    if (searchParams.image_coordinates) {
      formData.append("image_coordinates", JSON.stringify(searchParams.image_coordinates));
    }
    formData.append("image", searchParams.image || "");
    formData.append("audio", searchParams.audio || "");
    
    // Main agent-based search call
    const response = await connect_to_server(
      "http://79.175.177.113:21800/AIAnalyze/agent_based_find_similar_content/",
      "POST",
      user_token,
      "multipart/form-data",
      formData,
      "sementic_search"
    );
    const resultData = await response.json();
    console.log(resultData);
    
    const resultsContainerEl = document.getElementById("sementic_results");
    if (!appendResults && resultsContainerEl) {
      resultsContainerEl.innerHTML = "";
    }
    if (resultData.data && resultData.data.length > 0) {
      resultData.data.forEach((item, index) => {
        const card = createProductCard(resultData, item);
        resultsContainerEl.appendChild(card);
      });
    } else {
      if (!appendResults && resultsContainerEl) {
        const noProductsMessage = document.createElement("p");
        noProductsMessage.textContent = "No results found.";
        noProductsMessage.className = "text-gray-600 text-center";
        resultsContainerEl.appendChild(noProductsMessage);
      }
    }
    
    // If an image exists, call the image2text endpoint with the same parameters
    if (searchParams.image) {
      const formDataToText = new FormData();
      formDataToText.append("query", searchParams.query || "");
      formDataToText.append("page", page);
      formDataToText.append("page_limit", searchParams.page_limit);
      formDataToText.append("full_content", searchParams.full_content);
      if (searchParams.image_coordinates) {
        formDataToText.append("image_coordinates", JSON.stringify(searchParams.image_coordinates));
      }
      formDataToText.append("image", searchParams.image);
      formDataToText.append("audio", searchParams.audio || "");
      const responseToText = await connect_to_server(
        "http://79.175.177.113:21800/AIAnalyze/Image2text_fa/",
        "POST",
        user_token,
        "multipart/form-data",
        formDataToText,
        "sementic_search"
      );
      const resultToText = await responseToText.json();
      console.log(resultToText);
      const img2textDiv = document.getElementById("img2text");
      if (img2textDiv) {
        img2textDiv.innerHTML = `
          <div class="text-xl font-semibold text-gray-800 mb-4">
              نام : ${resultToText.data.produc_name}
          </div>
          <div class="text-gray-600 mb-4">
              <span class="font-medium text-gray-700">توضیحات :</span>
              ${resultToText.data.description}
          </div>
          <div class="text-gray-600 mb-4">
              <span class="font-medium text-gray-700">برند :</span>
              ${resultToText.data.produc_brand}
          </div>
          <div class="text-gray-600">
              <span class="font-medium text-gray-700">متا دیتا :</span>
              ${resultToText.data.produc_metadata}
          </div>`;
      }
    }
    hideLoading();
  } catch (error) {
    console.error("Error during performSearch:", error);
    hideLoading();
  }
}

// Search form submission handling (for manual searches)
safeAddListener(searchForm, "submit", async (e) => {
  e.preventDefault();
  try {
    showLoading();
    const query = searchInput ? searchInput.value : "";
    const imageFile = (imageInput && imageInput.files && imageInput.files[0]) ? imageInput.files[0] : null;
    const audioFile = (audioInput && audioInput.files && audioInput.files[0]) ? audioInput.files[0] : null;
    
    // Update input preview section
    if (inputPreviewSection) {
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            inputPreviewSection.innerHTML = `<img src="${e.target.result}" class="w-[40rem] rounded-xl border-4 border-teal-800" />`;
          }
        };
        reader.readAsDataURL(imageFile);
      } else if (audioFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            inputPreviewSection.innerHTML = `<audio controls class="w-full rounded-xl border-4 border-teal-800" src="${e.target.result}"></audio>`;
          }
        };
        reader.readAsDataURL(audioFile);
      } else if (query) {
        inputPreviewSection.innerHTML = `<p class="text-gray-800 text-lg font-semibold">Query: ${query}</p>`;
      }
    }
    
    const imageBase64 = imageFile ? await fileToBase64(imageFile) : "";
    const audioBase64 = audioFile ? await fileToBase64(audioFile) : "";
    
    // Set global search parameters for manual search
    searchParams = {
      query: query,
      page: 1,
      page_limit: 15,
      image_coordinates: croppedCoordinates,
      full_content: 1,
      image: imageBase64,
      audio: audioBase64
    };
    currentPage = 1;
    await performSearch(currentPage, false);
    hideLoading();
  } catch (error) {
    console.error("Error during search form submission:", error);
    hideLoading();
  }
});

// Infinite scroll: when the user nears the bottom, fetch additional pages.
window.addEventListener("scroll", async () => {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100) && !isLoadingMore) {
    isLoadingMore = true;
    currentPage++;
    await performSearch(currentPage, true);
    isLoadingMore = false;
  }
});

// Function to create a product card with error handling
function createProductCard(data_t, product) {
  try {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow-md p-6 mb-6";
    if (product.metadata?.primary_image) {
      const image = document.createElement("img");
      image.src = product.metadata.primary_image;
      image.alt = product.metadata.name || "Product Image";
      image.className = "w-full h-64 object-cover rounded-lg mb-4";
      card.appendChild(image);
    }
    if (product.metadata?.name) {
      const name = document.createElement("h3");
      name.textContent = product.metadata.name;
      name.className = "text-xl font-semibold mb-2";
      card.appendChild(name);
    }
    if (product.metadata?.price) {
      const price = document.createElement("p");
      price.textContent = `قیمت: ${product.metadata.price.toLocaleString()} IRR`;
      price.className = "text-gray-700 mb-2";
      card.appendChild(price);
    }
    if (product.metadata?.id) {
      const id = document.createElement("p");
      id.textContent = `شناسه: ${product.metadata.id.toLocaleString()}`;
      id.className = "text-gray-700 mb-2";
      card.appendChild(id);
    }
    if (product.scores) {
      const score = document.createElement("p");
      score.textContent = `score : ${product.visualy_similarity_score + product.textualy_similarity_score}`;
      score.className = "text-green-600 hover:text-green-800 underline";
      card.appendChild(score);
    }
    if (product.metadata?.category) {
      const category = document.createElement("p");
      category.textContent = `کتگوری: ${product.metadata.category}`;
      category.className = "text-gray-500 mb-2";
      card.appendChild(category);
    }
    if (data_t.data[0]?.product_data[0]?.proccessd_data?.llm_enriched_description?.description_fa) {
      const description = document.createElement("p");
      description.textContent = data_t.data[0].product_data[0].proccessd_data.llm_enriched_description.description_fa;
      description.className = "text-gray-600 mb-4";
      card.appendChild(description);
    }
    if (data_t.data[0]?.product_data[0]?.proccessd_data?.llm_enriched_description?.llm_tags?.length > 0) {
      const tags = document.createElement("div");
      tags.className = "flex flex-wrap gap-2 mb-4";
      data_t.data[0].product_data[0].proccessd_data.llm_enriched_description.llm_tags.forEach((tag) => {
        if (tag) {
          const tagElement = document.createElement("span");
          tagElement.textContent = tag;
          tagElement.className = "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm";
          tags.appendChild(tagElement);
        }
      });
      card.appendChild(tags);
    }
    if (data_t.data[0]?.product_data[0]?.price_info?.is_available !== undefined) {
      const availability = document.createElement("p");
      availability.textContent = `موجودی: ${data_t.data[0].product_data[0].price_info.is_available ? "موجود" : "ناموجود"}`;
      availability.className = "text-green-600 mb-2";
      card.appendChild(availability);
    }
    if (product.textualy_similarity_score !== undefined) {
      const score = document.createElement("p");
      score.textContent = `امتیاز: ${product.textualy_similarity_score + product.visualy_similarity_score}`;
      score.className = "text-green-600 mb-2";
      card.appendChild(score);
    }
    if (data_t.data[0]?.product_data[0]?.price_info?.price_list?.[0]?.shipping_fee !== undefined) {
      const shippingFee = document.createElement("p");
      shippingFee.textContent = `قیمت ارسال: ${
        data_t.data[0].product_data[0].price_info.price_list[0].shipping_fee === 0
          ? "--- "
          : `${data_t.data[0].product_data[0].price_info.price_list[0].shipping_fee} IRR`
      }`;
      shippingFee.className = "text-gray-600 mb-2";
      card.appendChild(shippingFee);
    }
    if (data_t.data[0]?.product_data[0]?.price_info?.price_list?.discount_percent !== undefined) {
      const discount = document.createElement("p");
      discount.textContent = `تخفیف: ${data_t.data[0].product_data[0].price_info.price_list.discount_percent}%`;
      discount.className = "text-red-600 mb-4";
      card.appendChild(discount);
    }
    if (product.metadata?.scrape_url) {
      const link = document.createElement("a");
      link.href = product.metadata.scrape_url;
      link.textContent = "این محصول را در سایت ببینید";
      link.className = "text-blue-600 hover:text-blue-800 underline";
      link.target = "_blank";
      card.appendChild(link);
    }
    return card;
  } catch (error) {
    console.error("Error creating product card:", error);
    return document.createElement("div");
  }
}

// Function to populate the product details modal
async function populateModal(itemid) {
  try {
    const resultsContainer = document.getElementById("sementic_results_2");
    if (resultsContainer) resultsContainer.innerHTML = "";
    const formData = new FormData();
    formData.append("query", itemid);
    showLoading();
    const response = await connect_to_server(
      "http://79.175.177.113:21800/AIAnalyze/agent_based_find_similar_content/",
      "POST",
      user_token,
      "multipart/form-data",
      formData,
      "sementic_search"
    );
    const result = await response.json();
    console.log(result);
    if (result.data[0]?.similar_products?.length > 0) {
      result.data[0].similar_products.forEach((product) => {
        const card = createProductCard(result, product);
        resultsContainer.appendChild(card);
      });
    } else {
      const noProductsMessage = document.createElement("p");
      noProductsMessage.textContent = "No similar products found.";
      noProductsMessage.className = "text-gray-600 text-center";
      resultsContainer.appendChild(noProductsMessage);
    }
    document.getElementById("sementic_resultsSection_2").classList.remove("hidden");
  } catch (error) {
    console.error("Error populating modal:", error);
  }
  hideLoading();
}

// Product details modal handling
function showProductModal() {
  if (productModal) productModal.classList.remove("hidden");
}
safeAddListener(closeModal, "click", () => {
  if (productModal) productModal.classList.add("hidden");
});
