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

// =============================================
// مودال جزئیات غذا و امتیازدهی ستاره‌ای
// =============================================
const foodModal = document.getElementById("food-modal");
const closeFoodModal = document.getElementById("close-food-modal");
const modalFoodImage = document.getElementById("modal-food-image");
const modalFoodName = document.getElementById("modal-food-name");
const modalFoodDescription = document.getElementById("modal-food-description");
const modalFoodPrice = document.getElementById("modal-food-price");
const modalStars = document.querySelectorAll(".modal-rating-star");
const modalRatingMessage = document.getElementById("modal-rating-message");
let modalSelectedRating = 0;

function updateModalStars(rating) {
  modalStars.forEach(function (star) {
    const value = Number(star.dataset.rating);
    star.classList.toggle("active", value <= rating);
  });
}

if (foodModal && closeFoodModal) {
  // دکمه «مشاهده جزئیات» به‌جای رفتن به صفحه دیگر، مودال را باز می‌کند.
  document.querySelectorAll(".details-button").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const card = button.closest(".food-card");
      if (!card) return;

      const nameElement = card.querySelector("h3");
      const priceElement = card.querySelector(".price");
      const imageElement = card.querySelector("img");
      const descriptionElement = card.querySelector(
        "p:not(.price):not(.available):not(.unavailable)"
      );

      modalFoodName.textContent = nameElement ? nameElement.textContent.trim() : "";
      modalFoodPrice.textContent = priceElement ? priceElement.textContent.trim() : "";
      modalFoodDescription.textContent = descriptionElement
        ? descriptionElement.textContent.trim()
        : "توضیحی برای این غذا ثبت نشده است.";

      if (imageElement) {
        modalFoodImage.src = imageElement.src;
        modalFoodImage.alt = nameElement ? nameElement.textContent.trim() : "تصویر غذا";
      }

      // هر بار که مودال غذای دیگری باز می‌شود، امتیاز نمایشی از ابتدا شروع می‌شود.
      modalSelectedRating = 0;
      updateModalStars(0);
      if (modalRatingMessage) {
        modalRatingMessage.textContent = "هنوز امتیازی ثبت نکرده‌اید.";
      }
      foodModal.classList.add("show");
    });
  });

  closeFoodModal.addEventListener("click", function () {
    foodModal.classList.remove("show");
  });

  foodModal.addEventListener("click", function (event) {
    if (event.target === foodModal) {
      foodModal.classList.remove("show");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      foodModal.classList.remove("show");
    }
  });
}

// ستاره‌ها با حرکت ماوس پیش‌نمایش می‌دهند و با کلیک انتخاب می‌شوند.
modalStars.forEach(function (star) {
  star.addEventListener("mouseenter", function () {
    updateModalStars(Number(star.dataset.rating));
  });

  star.addEventListener("mouseleave", function () {
    updateModalStars(modalSelectedRating);
  });

  star.addEventListener("click", function () {
    modalSelectedRating = Number(star.dataset.rating);
    updateModalStars(modalSelectedRating);
    if (modalRatingMessage) {
      modalRatingMessage.textContent = `امتیاز شما: ${modalSelectedRating} از ۵ ستاره`;
    }
  });
});

console.log("فیلترها، سبد و مودال غذا آماده‌اند.");
