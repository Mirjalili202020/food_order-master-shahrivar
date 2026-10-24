// =============================================
// وظایف اصلی این فایل:
// 1) جست‌وجو و فیلتر دسته‌بندی غذاها
// 2) مرتب‌سازی غذاها بر اساس قیمت
// 3) افزودن غذا به سبد با ساختار هماهنگ با cart.js
// 4) جلوگیری از سفارش غذای ناموجود و غذای اصلی متفاوت
// 5) نمایش مودال جزئیات و امتیازدهی ستاره‌ای
// =============================================

// دریافت کنترل‌های جست‌وجو، مرتب‌سازی و دسته‌بندی.
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const categories = document.querySelectorAll(".category");
const foodContainer = document.querySelector(".food-container");

// null یعنی فیلتر دسته‌بندی فعال نیست و همه دسته‌ها مجازند.
let selectedCategory = null;

// ترتیب اولیه کارت‌ها را نگه می‌داریم تا گزینه «ترتیب پیش‌فرض» قابل بازیابی باشد.
const originalCardOrder = Array.from(
  foodContainer.querySelectorAll(".food-card")
);

// تبدیل قیمت کارت به عدد برای مرتب‌سازی و ثبت در سبد.
function getPrice(card) {
  const storedPrice = Number(card.dataset.price);
  if (Number.isFinite(storedPrice) && storedPrice > 0) {
    return storedPrice;
  }

  const priceText = card.querySelector(".price")?.textContent || "";
  return Number(priceText.replace(/[^\d]/g, "")) || 0;
}

// جست‌وجو و دسته‌بندی را هم‌زمان اعمال می‌کنیم و سپس ترتیب قیمت را تنظیم می‌کنیم.
function applyFilters() {
  const searchText = searchInput.value.trim().toLowerCase();
  const cards = Array.from(foodContainer.querySelectorAll(".food-card"));

  cards.forEach(function (card) {
    const foodName = (card.querySelector("h3")?.textContent || "")
      .trim()
      .toLowerCase();
    const matchesSearch = foodName.includes(searchText);
    const matchesCategory =
      selectedCategory === null || card.dataset.category === selectedCategory;

    card.style.display = matchesSearch && matchesCategory ? "" : "none";
  });

  const sortedCards = [...originalCardOrder];
  const sortValue = sortSelect.value;

  if (sortValue === "price-asc") {
    sortedCards.sort(function (a, b) {
      return getPrice(a) - getPrice(b);
    });
  } else if (sortValue === "price-desc") {
    sortedCards.sort(function (a, b) {
      return getPrice(b) - getPrice(a);
    });
  }

  // اضافه‌کردن کارت‌ها به همان ظرف، ترتیب DOM را هم به‌روز می‌کند.
  sortedCards.forEach(function (card) {
    foodContainer.appendChild(card);
  });
}

// وقتی کاربر یک دسته را انتخاب می‌کند، جست‌وجو و مرتب‌سازی نیز حفظ می‌شوند.
categories.forEach(function (category) {
  category.addEventListener("click", function () {
    categories.forEach(function (item) {
      item.classList.remove("active");
    });

    const categoryName = category.querySelector("p").textContent.trim();

    if (categoryName === "همه دسته‌بندی‌ها") {
      selectedCategory = null;
      category.classList.add("clear-filter");
      setTimeout(function () {
        category.classList.remove("clear-filter");
      }, 150);
    } else {
      const categoryMap = {
        "غذای ایرانی": "iranian",
        "فست فود": "fastfood",
        "نوشیدنی": "drink",
        "دسر": "dessert",
      };

      selectedCategory = categoryMap[categoryName] ?? null;
      category.classList.add("active");
    }

    applyFilters();
  });
});

// جست‌وجو هنگام تایپ و مرتب‌سازی هنگام تغییر گزینه اجرا می‌شوند.
searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

// افزودن غذا به سبد خرید.
const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const card = button.closest(".food-card");
    if (!card) return;

    // فقط کارت دارای کلاس available قابل سفارش است.
    const availability = card.querySelector(".available");
    if (!availability) {
      alert("این غذا در حال حاضر ناموجود است.");
      return;
    }

    const foodId = card.dataset.id;
    const foodName = card.querySelector("h3").textContent.trim();
    const foodPrice = getPrice(card);
    const foodCategory = card.dataset.category;

    if (!foodId || !foodPrice) {
      alert("اطلاعات این غذا کامل نیست. لطفاً با پشتیبانی تماس بگیرید.");
      return;
    }

    // cart.js از ساختار id/title/price/count استفاده می‌کند؛ همین ساختار را نگه می‌داریم.
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const foodCategories =
      JSON.parse(localStorage.getItem("foodCategories")) || {};
    const mainFoodCategories = ["iranian", "fastfood"];
    const isMainFood = mainFoodCategories.includes(foodCategory);

    // مشخص می‌کنیم آیا سبد از قبل غذای اصلی متفاوتی دارد.
    const existingMainFood = cart.find(function (item) {
      const existingCard = item.id
        ? document.querySelector(`.food-card[data-id="${item.id}"]`)
        : null;
      const existingCategory =
        foodCategories[item.id] ||
        (existingCard && existingCard.dataset.category) ||
        item.category;
      return mainFoodCategories.includes(existingCategory);
    });

    // افزودن همان غذای اصلی تعدادش را زیاد می‌کند؛ غذای اصلی متفاوت پذیرفته نمی‌شود.
    if (
      isMainFood &&
      existingMainFood &&
      existingMainFood.id !== foodId
    ) {
      alert(
        "هر کارمند در هر روز فقط می‌تواند یک نوع غذای اصلی سفارش دهد.\n\n" +
          "سفارش نوشیدنی و دسر همچنان امکان‌پذیر است."
      );
      return;
    }

    const food = {
      id: foodId,
      title: foodName,
      price: foodPrice,
      count: 1,
    };

    const existingFood = cart.find(function (item) {
      return item.id === foodId;
    });

    if (existingFood) {
      existingFood.count = (Number(existingFood.count) || 1) + 1;
    } else {
      cart.push(food);
    }

    // دسته را جدا از اطلاعات سبد ذخیره می‌کنیم؛ cart.js و orders.js از آن استفاده می‌کنند.
    foodCategories[foodId] = foodCategory;
    localStorage.setItem("foodCategories", JSON.stringify(foodCategories));
    localStorage.setItem("cart", JSON.stringify(cart));

    // شمارنده سبد از این رویداد سفارشی باخبر می‌شود و بدون رفرش به‌روز می‌شود.
    document.dispatchEvent(new Event("cartUpdated"));

    button.textContent = "✓ اضافه شد";
    button.disabled = true;
    setTimeout(function () {
      button.textContent = "افزودن به سبد";
      button.disabled = false;
    }, 1000);
  });
});


/* =============================================
   مودال جزئیات غذا و امتیازدهی ستاره‌ای
============================================= */

const foodModal = document.getElementById("food-modal");
const closeFoodModal = document.getElementById("close-food-modal");
const modalFoodImage = document.getElementById("modal-food-image");
const modalFoodName = document.getElementById("modal-food-name");
const modalFoodDescription = document.getElementById("modal-food-description");
const modalFoodPrice = document.getElementById("modal-food-price");
const modalStars = document.querySelectorAll(".modal-rating-star");
const modalRatingMessage = document.getElementById("modal-rating-message");

// امتیازها بر اساس شناسه هر غذا جداگانه ذخیره می‌شوند.
const modalRatingsStorageKey = "foodRatings";

let modalSelectedRating = 0;
let currentModalFoodId = null;

// خواندن امتیازهای ذخیره‌شده از مرورگر
function getSavedFoodRatings() {
  try {
    const savedRatings = JSON.parse(
      localStorage.getItem(modalRatingsStorageKey)
    );

    if (
      savedRatings &&
      typeof savedRatings === "object" &&
      !Array.isArray(savedRatings)
    ) {
      return savedRatings;
    }
  } catch (error) {
    console.error("خواندن امتیازهای ذخیره‌شده ناموفق بود:", error);
  }

  return {};
}

// روشن یا خاموش کردن ستاره‌ها
function updateModalStars(rating) {
  modalStars.forEach(function (star) {
    const value = Number(star.dataset.rating);
    star.classList.toggle("active", value <= rating);
  });
}

// نمایش پیام متناسب با امتیاز
function updateModalRatingMessage(rating) {
  if (!modalRatingMessage) return;

  if (rating > 0) {
    modalRatingMessage.textContent =
      `امتیاز شما: ${rating} از ۵ ستاره`;
  } else {
    modalRatingMessage.textContent = "هنوز امتیازی ثبت نکرده‌اید.";
  }
}

if (foodModal && closeFoodModal) {
  // باز کردن مودال جزئیات غذا
  document.querySelectorAll(".details-button").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      const card = button.closest(".food-card");
      if (!card) return;

      // شناسه غذا برای ذخیره مستقل امتیاز آن
      currentModalFoodId = card.dataset.id || null;

      const nameElement = card.querySelector("h3");
      const priceElement = card.querySelector(".price");
      const imageElement = card.querySelector("img");

      const descriptionElement = card.querySelector(
        "p:not(.price):not(.available):not(.unavailable)"
      );

      modalFoodName.textContent = nameElement
        ? nameElement.textContent.trim()
        : "";

      modalFoodPrice.textContent = priceElement
        ? priceElement.textContent.trim()
        : "";

      modalFoodDescription.textContent = descriptionElement
        ? descriptionElement.textContent.trim()
        : "توضیحی برای این غذا ثبت نشده است.";

      if (imageElement) {
        modalFoodImage.src = imageElement.src;
        modalFoodImage.alt = nameElement
          ? nameElement.textContent.trim()
          : "تصویر غذا";
      }

      // بازیابی امتیاز قبلی همین غذا
      const savedRatings = getSavedFoodRatings();
      const savedRating = Number(savedRatings[currentModalFoodId]);

      modalSelectedRating =
        currentModalFoodId &&
        Number.isInteger(savedRating) &&
        savedRating >= 1 &&
        savedRating <= 5
          ? savedRating
          : 0;

      updateModalStars(modalSelectedRating);
      updateModalRatingMessage(modalSelectedRating);

      foodModal.classList.add("show");
    });
  });

  // بستن مودال با دکمه بستن
  closeFoodModal.addEventListener("click", function () {
    foodModal.classList.remove("show");
  });

  // بستن مودال با کلیک روی فضای بیرون آن
  foodModal.addEventListener("click", function (event) {
    if (event.target === foodModal) {
      foodModal.classList.remove("show");
    }
  });

  // بستن مودال با کلید Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      foodModal.classList.remove("show");
    }
  });
}

// مدیریت تعامل کاربر با ستاره‌ها
modalStars.forEach(function (star) {
  // پیش‌نمایش امتیاز هنگام رفتن ماوس روی ستاره
  star.addEventListener("mouseenter", function () {
    updateModalStars(Number(star.dataset.rating));
  });

  // برگشت به امتیاز ثبت‌شده پس از خارج شدن ماوس
  star.addEventListener("mouseleave", function () {
    updateModalStars(modalSelectedRating);
  });

  // ثبت و ذخیره امتیاز با کلیک
  star.addEventListener("click", function () {
    if (!currentModalFoodId) {
      if (modalRatingMessage) {
        modalRatingMessage.textContent =
          "شناسه غذا مشخص نیست؛ امتیاز ذخیره نشد.";
      }
      return;
    }

    const rating = Number(star.dataset.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return;
    }

    const savedRatings = getSavedFoodRatings();

    // فقط امتیاز غذای انتخاب‌شده تغییر می‌کند.
    savedRatings[currentModalFoodId] = rating;

    try {
      localStorage.setItem(
        modalRatingsStorageKey,
        JSON.stringify(savedRatings)
      );

      modalSelectedRating = rating;
      updateModalStars(modalSelectedRating);
      updateModalRatingMessage(modalSelectedRating);
    } catch (error) {
      console.error("ذخیره امتیاز ناموفق بود:", error);

      if (modalRatingMessage) {
        modalRatingMessage.textContent =
          "ذخیره امتیاز انجام نشد. لطفاً دوباره تلاش کنید.";
      }
    }
  });
});
