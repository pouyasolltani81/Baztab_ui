"use strict";
// Global constants and variables
const user_token = "8ff3960bbd957b7e663b16467400bba2";
const mongoDB_id = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
let imageCoordinates = null; // Will hold cropping coordinates

// Element selectors
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
const cropModal = document.getElementById("cropModal");
const cropImage = document.getElementById("cropImage");
const cropApplyBtn = document.getElementById("cropApplyBtn");
const resizeApplyBtn = document.getElementById("resizeApplyBtn");
const modalCancelBtn = document.getElementById("cropModalCancelBtn");
const modalCancelBtn2 = document.getElementById("cropModalCancelBtn2");
const productModal = document.getElementById("myModal");
const closeModal = document.getElementById("closeModal");

// Cropper instance
let cropper = null;

// Helper functions
function safeAddListener(element, event, callback) {
  if (element) {
    element.addEventListener(event, callback);
  }
}
function showLoading() {
  if (loadingIndicator) loadingIndicator.classList.remove("hidden");
}
function hideLoading() {
  if (loadingIndicator) loadingIndicator.classList.add("hidden");
}
// Convert a file to base64 (without the data URL prefix)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const base64 = typeof reader.result === "string" ? reader.result.split(",")[1] : "";
        resolve(base64);
      } else {
        reject("File read error");
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
// Resize and reduce image quality
function resizeAndReduceQuality(file, maxDim, quality = 0.5) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided."));
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || !e.target.result) return reject(new Error("Failed to load file."));
      img.src = e.target.result;
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
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Failed to create blob from canvas."));
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (error) => reject(new Error("Image load error: " + error));
    };
    reader.onerror = (error) => reject(new Error("File read error: " + error));
    reader.readAsDataURL(file);
  });
}

// Dummy server connector – replace with your actual implementation
async function connect_to_server(url, method, token, contentType, formData, context) {
  return fetch(url, {
    method,
    headers: {
      "Authorization": token,
    },
    body: formData,
  });
}

// ------------------------
// Crop Modal & Image Handling
// ------------------------

// Open crop modal and initialize cropper using server-provided coordinates
async function openCropModal() {
  try {
    if (!imagePreview.src || imagePreview.src === "#") {
      console.error("No image available for cropping.");
      return;
    }
    const formData = new FormData();
    const response = await fetch(imagePreview.src);
    const blob = await response.blob();
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
    if (result && result.return && result.data && result.data.coordinates) {
      const { x1, y1, x2, y2 } = result.data.coordinates;
      cropModal.classList.remove("hidden");
      if (cropper) cropper.destroy();
      cropper = new Cropper(cropImage, {
        aspectRatio: NaN,
        viewMode: 1,
        autoCropArea: 1,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        ready() {
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

// When an image is selected, show its preview and auto-open the crop modal
safeAddListener(imageInput, "change", (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          imagePreview.src = e.target.result;
          imagePreview.classList.remove("hidden");
          if (audioPreview) audioPreview.classList.add("hidden");
          cropImage.src = e.target.result;
          openCropModal();
        }
      };
      reader.onerror = (err) => console.error("Error reading image file:", err);
      reader.readAsDataURL(file);
      if (previewContainer) previewContainer.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error handling image input change:", error);
  }
});

// When an audio file is selected, show its preview and hide image-to-text area
safeAddListener(audioInput, "change", (event) => {
  try {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          audioPreview.src = e.target.result;
          audioPreview.classList.remove("hidden");
          if (imagePreview) imagePreview.classList.add("hidden");
          document.getElementById("img2text")?.classList.add("hidden");
        }
      };
      reader.onerror = (err) => console.error("Error reading audio file:", err);
      reader.readAsDataURL(file);
      if (previewContainer) previewContainer.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error handling audio input change:", error);
  }
});

// Close crop modal and store cropping coordinates
function closeCropModal() {
  cropModal.classList.add("hidden");
  if (cropper) {
    imageCoordinates = cropper.getData();
    cropper.destroy();
    cropper = null;
  }
}
safeAddListener(modalCancelBtn, "click", closeCropModal);
safeAddListener(modalCancelBtn2, "click", closeCropModal);

// Crop & Apply – get the cropped image and update the preview & file input
safeAddListener(cropApplyBtn, "click", async () => {
  try {
    if (!cropper) throw new Error("Cropper not initialized.");
    showLoading();
    const canvas = cropper.getCroppedCanvas();
    if (!canvas) throw new Error("Failed to get cropped canvas.");
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    imagePreview.src = croppedDataUrl;
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
    document.getElementById("resizeApplyBtn")?.click();
  } catch (error) {
    console.error("Error applying crop:", error);
    hideLoading();
  }
});

// Resize & Apply – resize the image per user settings
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
    const resizedBlob = await resizeAndReduceQuality(imageInput.files[0], maxDim, quality);
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
    closeCropModal();
    document.getElementById("submitbutton")?.click();
  } catch (error) {
    console.error("Error applying resize:", error);
    hideLoading();
  }
});

// ------------------------
// Product Details Modal
// ------------------------
function showProductModal() {
  if (productModal) productModal.classList.remove("hidden");
}
safeAddListener(closeModal, "click", () => {
  if (productModal) productModal.classList.add("hidden");
});

// ------------------------
// Search Form Submission & Infinite Scroll
// ------------------------
safeAddListener(searchForm, "submit", async (e) => {
  e.preventDefault();
  try {
    showLoading();
    const query = searchInput ? searchInput.value.trim() : "";
    let imageFile = imageInput && imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;
    let audioFile = audioInput && audioInput.files && audioInput.files[0] ? audioInput.files[0] : null;
    
    // Clear search input field
    if (searchInput) searchInput.value = "";
    
    // Update input preview section
    if (inputPreviewSection) {
      if (imageFile) {
        const imgBase64 = await fileToBase64(imageFile);
        inputPreviewSection.innerHTML = `<img src="data:image/jpeg;base64,${imgBase64}" class="w-[40rem] rounded-xl border-4 border-teal-800" />`;
      } else if (audioFile) {
        const audBase64 = await fileToBase64(audioFile);
        inputPreviewSection.innerHTML = `<audio controls class="w-full rounded-xl border-4 border-teal-800" src="data:audio/mp3;base64,${audBase64}"></audio>`;
      } else if (query) {
        inputPreviewSection.innerHTML = `<p class="text-gray-800 text-lg font-semibold">Query: ${query}</p>`;
      }
    }
    
    // Convert files to base64 strings (if provided)
    let imageBase64 = "";
    let audioBase64 = "";
    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
    }
    if (audioFile) {
      audioBase64 = await fileToBase64(audioFile);
    }
    
    // If the query is a MongoDB id, use a direct semantic search (without pagination)
    if (mongoDB_id.test(query)) {
      const resultsContainer = document.getElementById("sementic_results");
      if (resultsContainer) resultsContainer.innerHTML = "";
      document.getElementById("img2text")?.classList.add("hidden");
      
      const formData = new FormData();
      formData.append("query", query);
      formData.append("page", "1");
      formData.append("page_limit", "15");
      if (imageCoordinates) formData.append("image_coordinates", JSON.stringify(imageCoordinates));
      formData.append("full_content", "1");
      if (imageBase64) formData.append("image", imageBase64);
      if (audioBase64) formData.append("audio", audioBase64);
      
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
      if (resultData.data[0]?.similar_products?.length > 0) {
        resultData.data[0].similar_products.forEach((product) => {
          const card = createProductCard(resultData, product);
          resultsContainerEl.appendChild(card);
        });
      } else {
        const noProductsMessage = document.createElement("p");
        noProductsMessage.textContent = "No similar products found.";
        noProductsMessage.className = "text-gray-600 text-center";
        resultsContainerEl.appendChild(noProductsMessage);
      }
    } else {
      // Combined search with infinite scroll (pagination)
      const resultsContainerEl = document.getElementById("sementic_results");
      if (resultsContainerEl) resultsContainerEl.innerHTML = "";
      let page = 1;
      const page_limit = 15;
      let hasMoreResults = true;
      
      async function loadResults() {
        if (!hasMoreResults) return;
        const formData = new FormData();
        formData.append("query", query);
        formData.append("page", page.toString());
        formData.append("page_limit", page_limit.toString());
        if (imageCoordinates) formData.append("image_coordinates", JSON.stringify(imageCoordinates));
        formData.append("full_content", "1");
        if (imageBase64) formData.append("image", imageBase64);
        if (audioBase64) formData.append("audio", audioBase64);
        
        const response = await connect_to_server(
          "http://79.175.177.113:21800/AIAnalyze/agent_based_find_similar_content/",
          "POST",
          user_token,
          "multipart/form-data",
          formData,
          "sementic_search"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const resultData = await response.json();
        if (resultData.return !== true || resultData.data.length === 0) {
          hasMoreResults = false;
          if (page === 1) alert("No results found.");
          return;
        }
        resultData.data.forEach((item) => {
          const card = createProductCard(item);
          resultsContainerEl.appendChild(card);
        });
        page++;
      }
      
      await loadResults();
      
      window.addEventListener("scroll", async () => {
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
          hasMoreResults
        ) {
          showLoading();
          await loadResults();
          hideLoading();
        }
      });
      
      // Additionally, if an image was provided, trigger the image2text call
      if (imageBase64) {
        try {
          const formData_totext = new FormData();
          formData_totext.append("query", query);
          formData_totext.append("image", imageBase64);
          const response_totext = await connect_to_server(
            "http://79.175.177.113:21800/AIAnalyze/Image2text_fa/",
            "POST",
            user_token,
            "multipart/form-data",
            formData_totext,
            "sementic_search"
          );
          const result_totext = await response_totext.json();
          console.log(result_totext);
          document.getElementById("img2text").innerHTML = `
            <div class="text-xl font-semibold text-gray-800 mb-4">
                نام : ${result_totext.data.produc_name}
            </div>
            <div class="text-gray-600 mb-4">
                <span class="font-medium text-gray-700">توضیحات :</span>
                ${result_totext.data.description}
            </div>
            <div class="text-gray-600 mb-4">
                <span class="font-medium text-gray-700">برند :</span>
                ${result_totext.data.produc_brand}
            </div>
            <div class="text-gray-600">
                <span class="font-medium text-gray-700">متا دیتا :</span>
                ${result_totext.data.produc_metadata}
            </div>`;
        } catch (e) {
          console.error(e);
        }
      }
    }
    hideLoading();
  } catch (error) {
    console.error("Error during search form submission:", error);
    hideLoading();
  }
});

// ------------------------
// Create Product Card
// ------------------------
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
      id.textContent = `شناسه: ${product.metadata.id}`;
      id.className = "text-gray-700 mb-2";
      card.appendChild(id);
    }
    if (product.scores) {
      const score = document.createElement("p");
      score.textContent = `امتیاز: ${product.textualy_similarity_score + product.visualy_similarity_score}`;
      score.className = "text-green-600 mb-2";
      card.appendChild(score);
    }
    if (product.metadata?.category) {
      const category = document.createElement("p");
      category.textContent = `کتگوری: ${product.metadata.category}`;
      category.className = "text-gray-500 mb-2";
      card.appendChild(category);
    }
    if (
      data_t?.data &&
      data_t.data[0]?.product_data &&
      data_t.data[0].product_data[0]?.proccessd_data?.llm_enriched_description?.description_fa
    ) {
      const description = document.createElement("p");
      description.textContent = data_t.data[0].product_data[0].proccessd_data.llm_enriched_description.description_fa;
      description.className = "text-gray-600 mb-4";
      card.appendChild(description);
    }
    if (
      data_t?.data &&
      data_t.data[0]?.product_data &&
      data_t.data[0].product_data[0]?.proccessd_data?.llm_enriched_description?.llm_tags?.length > 0
    ) {
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
    if (
      data_t?.data &&
      data_t.data[0]?.product_data &&
      data_t.data[0].product_data[0]?.price_info?.is_available !== undefined
    ) {
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
    if (
      data_t?.data &&
      data_t.data[0]?.product_data &&
      data_t.data[0].product_data[0]?.price_info?.price_list?.[0]?.shipping_fee !== undefined
    ) {
      const shippingFee = document.createElement("p");
      const fee = data_t.data[0].product_data[0].price_info.price_list[0].shipping_fee;
      shippingFee.textContent = `قیمت ارسال: ${fee === 0 ? "---" : fee + " IRR"}`;
      shippingFee.className = "text-gray-600 mb-2";
      card.appendChild(shippingFee);
    }
    if (
      data_t?.data &&
      data_t.data[0]?.product_data &&
      data_t.data[0].product_data[0]?.price_info?.price_list?.discount_percent !== undefined
    ) {
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

// ------------------------
// Modal Population for Product Details
// ------------------------
async function populateModal(itemid) {
  try {
    const resultsContainer = document.getElementById("sementic_results_2");
    if (resultsContainer) resultsContainer.innerHTML = "";
    const formData = new FormData();
    formData.append("query", itemid);
    formData.append("page", "1");
    formData.append("page_limit", "15");
    if (imageCoordinates) formData.append("image_coordinates", JSON.stringify(imageCoordinates));
    formData.append("full_content", "1");
    const response = await connect_to_server(
      "http://79.175.177.113:21800/AIAnalyze/agent_based_find_similar_content/",
      "POST",
      user_token,
      "multipart/form-data",
      formData,
      "sementic_search"
    );
    const result = await response.json();
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
    document.getElementById("sementic_resultsSection_2")?.classList.remove("hidden");
  } catch (error) {
    console.error("Error populating modal:", error);
  }
  hideLoading();
}

// ------------------------
// End of Code
// ------------------------
