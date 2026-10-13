// =============================================
// فایل script.js
// وظایف اصلی صفحه منو:
// 1) فیلتر غذاها بر اساس دسته‌بندی
// 2) جستجوی غذا بر اساس نام
// 3) افزودن غذا به سبد خرید
// 4) جلوگیری از سفارش غذای ناموجود
// 5) اعمال محدودیت یک غذای اصلی در سبد
// =============================================

// ورودی جستجو را از صفحه پیدا می‌کنیم.
const searchInput = document.querySelector("#search-input");

// همه کارت‌های دسته‌بندی را پیدا می‌کنیم.
const categories = document.querySelectorAll(".category");

// این متغیر نگه می‌دارد که در حال حاضر چه دسته‌ای انتخاب شده است.
// مقدار null یعنی هیچ دسته خاصی انتخاب نشده و همه دسته‌ها قابل نمایش هستند.
let selectedCategory = null;

// =========================
// فیلتر دسته‌بندی‌ها
// =========================

// روی همه دسته‌بندی‌ها حرکت می‌کنیم تا برای هر کدام رویداد کلیک تعریف کنیم.
categories.forEach(function (category) {
  // وقتی روی یک دسته کلیک شود، این تابع اجرا می‌شود.
  category.onclick = function () {
    // ابتدا کلاس active را از همه دسته‌ها حذف می‌کنیم.
    // به این ترتیب فقط دسته انتخاب‌شده حالت فعال خواهد داشت.
    categories.forEach(function (item) {
      item.classList.remove("active");
    });

    // متن داخل تگ p دسته کلیک‌شده را می‌خوانیم.
    const categoryName = category.querySelector("p").textContent.trim();

    // اگر کاربر روی «همه دسته‌بندی‌ها» کلیک کند، فیلتر دسته را پاک می‌کنیم.
    if (categoryName === "همه دسته‌بندی‌ها") {
      // null یعنی دیگر دسته مشخصی انتخاب نشده است.
      selectedCategory = null;

      // این کلاس فقط برای یک افکت کوتاه هنگام پاک شدن فیلتر استفاده می‌شود.
      category.classList.add("clear-filter");

      // بعد از 150 میلی‌ثانیه کلاس افکت را حذف می‌کنیم.
      setTimeout(function () {
        category.classList.remove("clear-filter");
      }, 150);

      // تمام کارت‌های غذا را از صفحه می‌گیریم.
      const foodCards = document.querySelectorAll(".food-card");

      // همه کارت‌ها را دوباره نمایش می‌دهیم.
      foodCards.forEach(function (card) {
        card.style.display = "";
      });

      // چون کار این حالت تمام شده، از تابع خارج می‌شویم.
      return;
    }

    // به دسته انتخاب‌شده کلاس active می‌دهیم تا از نظر ظاهری مشخص شود.
    category.classList.add("active");

    // متن فارسی هر دسته را به مقدار انگلیسی data-category مربوط به کارت‌ها نگاشت می‌کنیم.
    const categoryMap = {
      "غذای ایرانی": "iranian",
      "فست فود": "fastfood",
      نوشیدنی: "drink",
      دسر: "dessert",
    };

    // مقدار دسته انتخاب‌شده را ذخیره می‌کنیم.
    selectedCategory = categoryMap[categoryName];

    // همه کارت‌های غذا را پیدا می‌کنیم.
    const foodCards = document.querySelectorAll(".food-card");

    // تک‌تک کارت‌ها را با دسته انتخاب‌شده مقایسه می‌کنیم.
    foodCards.forEach(function (card) {
      // اگر data-category کارت برابر دسته انتخاب‌شده باشد، کارت نمایش داده می‌شود؛
      // در غیر این صورت مخفی می‌شود.
      card.style.display =
        card.dataset.category === selectedCategory ? "" : "none";
    });
  };
});

// =========================
// جستجوی غذا
// =========================

// با هر تغییر در ورودی جستجو، فیلتر جستجو اجرا می‌شود.
searchInput.addEventListener("input", function () {
  // متن واردشده را می‌خوانیم و فاصله‌های اضافی ابتدا و انتها را حذف می‌کنیم.
  const searchText = searchInput.value.trim();

  // همه کارت‌های غذا را دریافت می‌کنیم.
  const foodCards = document.querySelectorAll(".food-card");

  // تک‌تک کارت‌ها را بررسی می‌کنیم.
  foodCards.forEach(function (card) {
    // نام غذا از عنوان h3 کارت خوانده می‌شود.
    const foodName = card.querySelector("h3").textContent;

    // دسته غذا از ویژگی data-category کارت خوانده می‌شود.
    const foodCategory = card.dataset.category;

    // includes بررسی می‌کند متن جستجو داخل نام غذا وجود دارد یا نه.
    const matchesSearch = foodName.includes(searchText);

    // این شرط بررسی می‌کند کارت با دسته انتخاب‌شده نیز هماهنگ باشد.
    // اگر selectedCategory برابر null باشد یعنی همه دسته‌ها مجاز هستند.
    const matchesCategory =
      selectedCategory === null || foodCategory === selectedCategory;

    // فقط کارتی نمایش داده می‌شود که هم با جستجو و هم با دسته انتخابی مطابقت داشته باشد.
    if (matchesSearch && matchesCategory) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});

// =========================
// افزودن غذا به سبد
// =========================

// تمام دکمه‌های «افزودن به سبد» را پیدا می‌کنیم.
const buttons = document.querySelectorAll(".add-to-cart");

// برای هر دکمه یک رویداد کلیک تعریف می‌کنیم.
buttons.forEach(function (button) {
  button.onclick = function () {
    // parentElement دکمه، همان کارت غذای مربوط به آن است.
    const card = button.parentElement;

    // بررسی می‌کنیم کارت دارای عنصر .available هست یا نه.
    // وجود این کلاس یعنی غذا موجود است.
    const availability = card.querySelector(".available");

    // اگر عنصر available پیدا نشد، غذا ناموجود است و سفارش متوقف می‌شود.
    if (!availability) {
      alert("این غذا در حال حاضر ناموجود است.");
      return;
    }

    // نام غذای انتخاب‌شده را از h3 کارت می‌خوانیم.
    const foodName = card.querySelector("h3").textContent;

    // قیمت غذا را از عنصر دارای کلاس price می‌خوانیم.
    const foodPrice = card.querySelector(".price").textContent;

    // دسته غذا را از data-category کارت می‌خوانیم.
    const foodCategory = card.dataset.category;

    // سبد فعلی را از localStorage می‌خوانیم.
    // اگر سبدی وجود نداشته باشد، یک آرایه خالی می‌سازیم.
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // دسته‌های غذای ایرانی و فست‌فود را به عنوان «غذای اصلی» در نظر گرفته‌ایم.
    const mainFoodCategories = ["iranian", "fastfood"];

    // includes بررسی می‌کند آیا دسته غذای انتخاب‌شده جزو غذاهای اصلی است یا نه.
    const isMainFood = mainFoodCategories.includes(foodCategory);

    // با find بررسی می‌کنیم آیا از قبل یک غذای اصلی داخل سبد وجود دارد یا نه.
    const existingMainFood = cart.find(function (item) {
      return mainFoodCategories.includes(item.category);
    });

    // اگر غذای جدید اصلی باشد و قبلاً هم غذای اصلی در سبد وجود داشته باشد،
    // اجازه افزودن غذای اصلی دوم را نمی‌دهیم.
    if (isMainFood && existingMainFood) {
      alert(
        "هر کارمند در هر روز فقط می‌تواند یک غذای اصلی سفارش دهد.\n\n" +
          "سفارش نوشیدنی و دسر همچنان امکان‌پذیر است.",
      );
      return;
    }

    // یک Object برای غذای انتخاب‌شده می‌سازیم.
    // این اطلاعات بعداً در سبد و سفارش استفاده می‌شوند.
    const food = {
      name: foodName,
      price: foodPrice,
      category: foodCategory,
      quantity: 1,
    };

    // بررسی می‌کنیم آیا دقیقاً همین غذا قبلاً در سبد وجود دارد یا نه.
    const existingFood = cart.find(function (item) {
      return item.name === food.name;
    });

    // اگر غذا قبلاً در سبد باشد، به جای ساخت مورد جدید تعدادش را افزایش می‌دهیم.
    if (existingFood) {
      existingFood.quantity += 1;
    } else {
      // اگر غذا در سبد نباشد، آن را به انتهای آرایه cart اضافه می‌کنیم.
      cart.push(food);
    }

    // آرایه سبد را با JSON.stringify به متن تبدیل و در localStorage ذخیره می‌کنیم.
    localStorage.setItem("cart", JSON.stringify(cart));

    // یک رویداد سفارشی ایجاد می‌کنیم تا cart-count.js متوجه تغییر سبد شود.
    // به این ترتیب شمارنده سبد بدون رفرش صفحه به‌روز می‌شود.
    document.dispatchEvent(new Event("cartUpdated"));

    // برای بازخورد بصری، متن دکمه را موقتاً تغییر می‌دهیم.
    button.textContent = "✓ اضافه شد";

    // دکمه را موقتاً غیرفعال می‌کنیم تا کاربر چند بار سریع روی آن کلیک نکند.
    button.disabled = true;

    // بعد از یک ثانیه، دکمه را به حالت عادی برمی‌گردانیم.
    setTimeout(function () {
      button.textContent = "افزودن به سبد";
      button.disabled = false;
    }, 1000);
  };
});

// این پیام برای اطمینان از اجرای کامل فایل در Console نمایش داده می‌شود.
console.log("آخر فایل اجرا شد");

// =========================
// مودال جزئیات غذا
// =========================

const foodModal = document.getElementById("food-modal");
const closeFoodModal = document.getElementById("close-food-modal");

const modalFoodImage = document.getElementById("modal-food-image");
const modalFoodName = document.getElementById("modal-food-name");
const modalFoodDescription = document.getElementById("modal-food-description");
const modalFoodPrice = document.getElementById("modal-food-price");

// باز کردن مودال با کلیک روی دکمه جزئیات
document.querySelectorAll(".details-button").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const card = button.closest(".food-card");
    if (!card) return;

    const foodName = card.querySelector("h3");
    const foodPrice = card.querySelector(".price");
    const foodImage = card.querySelector("img");

    modalFoodName.textContent = foodName ? foodName.textContent.trim() : "";
    modalFoodPrice.textContent = foodPrice ? foodPrice.textContent.trim() : "";

    if (foodImage) {
      modalFoodImage.src = foodImage.src;
      modalFoodImage.alt = foodName ? foodName.textContent.trim() : "تصویر غذا";
    }

    // اطلاعات تکمیلی در این مرحله مقدار پیش‌فرض دارند.
    const foodDescription = card.querySelector("p:not(.price):not(.available)");
    modalFoodDescription.textContent = foodDescription
      ? foodDescription.textContent.trim()
      : "توضیحی برای این غذا ثبت نشده است.";

    foodModal.classList.add("show");
  });
});

// بستن با دکمه ×
closeFoodModal.addEventListener("click", function () {
  foodModal.classList.remove("show");
});

// بستن با کلیک روی فضای تیره
foodModal.addEventListener("click", function (event) {
  if (event.target === foodModal) {
    foodModal.classList.remove("show");
  }
});

// بستن با کلید Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    foodModal.classList.remove("show");
  }
});

// =========================
// امتیازدهی ستاره‌ای داخل مودال
// =========================

const modalStars = document.querySelectorAll(".modal-rating-star");
const modalRatingMessage = document.getElementById("modal-rating-message");

let modalSelectedRating = 0;

function updateModalStars(rating) {
  modalStars.forEach(function (star) {
    const value = Number(star.dataset.rating);
    star.classList.toggle("active", value <= rating);
  });
}

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

    modalRatingMessage.textContent = `امتیاز شما: ${modalSelectedRating} از ۵ ستاره`;
  });
});
