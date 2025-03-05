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

// Helper: safely add event listener
function safeAddListener(element, event, callback) {
  if (element) {
    element.addEventListener(event, callback);
  }
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

// Function to open the crop modal and initialize Cropper.js
function openCropModal() {
  if (!imagePreview.src || imagePreview.src === "#") {
    console.error("No image available for cropping.");
    return;
  }
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
  });
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

// Crop & Apply button
safeAddListener(cropApplyBtn, "click", async () => {
  try {
    if (!cropper) throw new Error("Cropper not initialized.");
    showLoading();
    const canvas = cropper.getCroppedCanvas();
    if (!canvas) throw new Error("Failed to get cropped canvas.");
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    imagePreview.src = croppedDataUrl;
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
  } catch (error) {
    console.error("Error applying crop:", error);
    hideLoading();
  }
});

// Resize & Apply button – uses user inputs for max dimension and quality
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
    closeCropModal();
  } catch (error) {
    console.error("Error applying resize:", error);
    hideLoading();
  }
});

// Show product details modal
function showProductModal() {
  if (productModal) productModal.classList.remove("hidden");
}
safeAddListener(closeModal, "click", () => {
  if (productModal) productModal.classList.add("hidden");
});

// Search form submission handling
safeAddListener(searchForm, "submit", async (e) => {
  e.preventDefault();
  try {
    showLoading();
    const query = searchInput ? searchInput.value : "";
    const imageFile =
      imageInput && imageInput.files ? imageInput.files[0] : null;
    const audioFile =
      audioInput && audioInput.files ? audioInput.files[0] : null;

    if (searchInput) searchInput.value = "loading please wait ....";

    // Update input preview section (below img2text)
    if (inputPreviewSection) {
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            inputPreviewSection.innerHTML = `<img src="${e.target.result}" class="w-50 h-50 rounded-xl border-4 border-teal-800" />`;
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

    let response, resultData;
    if (mongoDB_id.test(query)) {
      const sementicResultsSection = document.getElementById("sementic_resultsSection");
      const resultsContainer = document.getElementById("sementic_results");
      if (sementicResultsSection)
        sementicResultsSection.classList.remove("hidden");
      if (resultsContainer) resultsContainer.innerHTML = "";
      document.getElementById("img2text")?.classList.add("hidden");
      const formData = new FormData();
      formData.append("query", query);
      response = await connect_to_server(
        "http://79.175.177.113:21800/AIAnalyze/agent_based_find_similar_content/",
        "POST",
        user_token,
        "multipart/form-data",
        formData,
        "sementic_search"
      );
      resultData = await response.json();
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
      const formData = new FormData();
      if (query) formData.append("query", query);
      if (imageFile) formData.append("image", imageFile);
      if (audioFile) formData.append("audio", audioFile);
      formData.append("topk", 15);
      const formData_totext = new FormData();
      if (imageFile) {
        formData_totext.append("image", imageFile);
        // Show loading inside the img2text container if image is present
        const img2textDiv = document.getElementById("img2text");
        if (img2textDiv) {
          img2textDiv.classList.remove("hidden");
          img2textDiv.innerHTML = `<div class="text-center text-gray-600">Loading image-to-text...</div>`;
        }
      } else {
        document.getElementById("img2text").classList.add("hidden");
      }
      hideLoading();

      response = await connect_to_server(
        "http://79.175.177.113:21800/AIAnalyze/agent_based_find_similar_content/",
        "POST",
        user_token,
        "multipart/form-data",
        formData,
        "sementic_search"
      );
      console.log(response);
      if (searchInput) searchInput.value = "";
      if (imageInput) imageInput.value = "";
      if (audioInput) audioInput.value = "";
      if (previewContainer) previewContainer.classList.add("hidden");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      resultData = await response.json();
      if (resultData.return !== true) {
        alert("Error: " + resultData.message);
        return;
      }
      const resultsContainerEl = document.getElementById("sementic_results");
      if (resultsContainerEl) resultsContainerEl.innerHTML = "";
      resultData.data.forEach((item, index) => {
        console.log(item);
        const card = document.createElement("div");
        card.className = "bg-white rounded-lg overflow-hidden";
        if (item.metadata && item.metadata.primary_image) {
          const img = document.createElement("img");
          img.src = item.metadata.primary_image;
          img.alt = item.metadata.name || "Product Image";
          img.className = "w-full h-48 object-cover";
          card.appendChild(img);
        }
        const cardBody = document.createElement("div");
        cardBody.className = "p-4";
        const nameEl = document.createElement("h3");
        nameEl.className = "text-lg font-bold mb-2";
        nameEl.textContent = item.metadata?.name || "Unnamed Product";
        cardBody.appendChild(nameEl);
        if (item.metadata?.category) {
          const categoryEl = document.createElement("p");
          categoryEl.className = "text-sm text-gray-600";
          categoryEl.textContent = "کتگوری: " + item.metadata.category;
          cardBody.appendChild(categoryEl);
        }
        if (item.metadata?.price && !isNaN(item.metadata.price)) {
          const priceEl = document.createElement("p");
          priceEl.className = "text-sm text-green-600 font-semibold mt-2";
          priceEl.textContent = "قیمت: " + item.metadata.price;
          cardBody.appendChild(priceEl);
        }
        if (item.metadata?.id) {
          const id = document.createElement("p");
          id.className = "text-sm text-gray-600 font-semibold mt-2";
          id.textContent = "شناسه: " + item.metadata.id;
          cardBody.appendChild(id);
        }
        if (item.scores) {
          const score = document.createElement("p");
          score.className = "text-sm text-green-600 font-semibold mt-2";
          score.textContent = "score: " + item.scores;
          cardBody.appendChild(score);
        }
        const info_button = document.createElement("button");
        info_button.id = "similar_search_" + index;
        info_button.className = "w-full bg-teal-500 p-4 mt-4 text-center rounded-xl";
        info_button.textContent = "اطلاعات بیشتر";
        info_button.onclick = () => {
          console.log(item.metadata.id);
          showProductModal();
          populateModal(item.metadata.id);
        };
        cardBody.appendChild(info_button);
        card.appendChild(cardBody);
        resultsContainerEl.appendChild(card);
      });
      if (resultData.data.length > 0) {
        document.getElementById("sementic_resultsSection").classList.remove("hidden");
      } else {
        alert("No results found.");
      }
      // If image file exists, then after populating the agent call, make an additional call to image2text
      if (imageFile) {
        try {
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
    if (data_t.data[0]?.product_data[0]?.price_info?.price_list[0]?.shipping_fee !== undefined) {
      const shippingFee = document.createElement("p");
      shippingFee.textContent = `قیمت ارسال: ${data_t.data[0].product_data[0].price_info.price_list.shipping_fee === 0 ? "--- " : `${data_t.data[0].product_data[0].price_info.price_list[0].shipping_fee} IRR`}`;
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
}

// Product details modal handling
function showProductModal() {
  if (productModal) productModal.classList.remove("hidden");
}
safeAddListener(closeModal, "click", () => {
  if (productModal) productModal.classList.add("hidden");
});
