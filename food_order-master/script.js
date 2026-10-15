// =============================================
// وظایف اصلی این فایل:
// 1) فیلتر دسته‌بندی
// 2) جستجوی غذا
// 3) افزودن به سبد
// 4) جلوگیری از سفارش غذای ناموجود
// 5) محدودیت یک غذای اصلی
// =============================================

// پیدا کردن ورودی جستجو
const searchInput = document.querySelector("#search-input");

const sortSelect = document.querySelector("#sort-select");

// پیدا کردن همه دسته‌بندی‌ها
const categories = document.querySelectorAll(".category");

// دسته انتخاب‌شده؛ null یعنی همه دسته‌ها
let selectedCategory = null;

const foodContainer = document.querySelector(".food-container");
const originalCardOrder = Array.from(
    foodContainer.querySelectorAll(".food-card")
);

// اعمال هم‌زمان جست‌وجو و فیلتر دسته‌بندی
function applyFilters() {
    const searchText = searchInput.value.trim().toLowerCase();

    const cards = Array.from(
        foodContainer.querySelectorAll(".food-card")
    );

    // مشخص می‌کنیم هر کارت باید نمایش داده شود یا نه
    cards.forEach((card) => {
        const foodName = card.querySelector("h3").textContent
            .trim()
            .toLowerCase();

        const foodCategory = card.dataset.category;

        const matchesSearch = foodName.includes(searchText);

        const matchesCategory =
            selectedCategory === null ||
            foodCategory === selectedCategory;

        card.style.display =
            matchesSearch && matchesCategory ? "" : "none";
    });

    // انتخاب ترتیب نمایش غذاها
    let sortedCards = [...originalCardOrder];
    const sortValue = sortSelect.value;

    if (sortValue === "price-asc") {
        sortedCards.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortValue === "price-desc") {
        sortedCards.sort((a, b) => getPrice(b) - getPrice(a));
    }

    // برگرداندن کارت‌ها به ترتیب انتخاب‌شده
    sortedCards.forEach((card) => {
        foodContainer.appendChild(card);
    });
}

// استخراج قیمت عددی از متن قیمت غذا
function getPrice(card) {
    const priceText = card.querySelector(".price").textContent;
    return Number(priceText.replace(/[^\d]/g, ""));
}

// =========================
// فیلتر دسته‌بندی
// =========================

categories.forEach(function(category) {

    // اجرای کد هنگام کلیک روی دسته
    category.onclick = function() {

        // حذف حالت active از همه دسته‌ها
        categories.forEach(function(item) {
            item.classList.remove("active");
        });

        // گرفتن نام دسته از متن p
        const categoryName =
            category.querySelector("p").textContent.trim();

        // اگر «همه دسته‌بندی‌ها» انتخاب شد
        if (categoryName === "همه دسته‌بندی‌ها") {

            // پاک کردن فیلتر دسته
            selectedCategory = null;

            // افکت کوتاه برای دکمه همه دسته‌ها
            category.classList.add("clear-filter");

            // حذف افکت بعد از 150 میلی‌ثانیه
            setTimeout(function() {
                category.classList.remove("clear-filter");
            }, 150);

            applyFilters();
            return;
        }

        // فعال کردن دسته انتخاب‌شده
        category.classList.add("active");

        // تبدیل نام فارسی دسته به مقدار data-category
        const categoryMap = {
            "غذای ایرانی": "iranian",
            "فست فود": "fastfood",
            "نوشیدنی": "drink",
            "دسر": "dessert"
        };

        // ذخیره دسته انتخاب‌شده
        selectedCategory = categoryMap[categoryName];

        applyFilters();

        // پیدا کردن کارت‌های غذا
        const foodCards =
            document.querySelectorAll(".food-card");

        // بررسی دسته هر کارت
        foodCards.forEach(function(card) {

            // نمایش کارت مطابق دسته انتخاب‌شده
            card.style.display =
                card.dataset.category === selectedCategory
                    ? ""
                    : "none";
        });
    };
});


// =========================
// جستجوی غذا
// =========================

     // اجرای فیلترها هنگام تایپ در کادر جست‌وجو
searchInput.addEventListener("input", applyFilters);

// اجرای فیلترها هنگام تغییر ترتیب قیمت
sortSelect.addEventListener("change", applyFilters); 


// =========================
// افزودن غذا به سبد
// =========================

// پیدا کردن همه دکمه‌های افزودن به سبد
const buttons =
    document.querySelectorAll(".add-to-cart");

// افزودن رویداد کلیک به هر دکمه
buttons.forEach(function(button) {

    button.onclick = function() {

        // پیدا کردن کارت مربوط به همین دکمه
        const card =
            button.parentElement;

        // بررسی موجود بودن غذا
        const availability =
            card.querySelector(".available");

        // اگر غذا موجود نبود، ادامه نده
        if (!availability) {
            alert("این غذا در حال حاضر ناموجود است.");
            return;
        }

        // شناسه غذا را از data-id کارت می‌گیریم.
        const foodId = card.dataset.id;

        // نام غذا را از عنوان کارت می‌گیریم.
        const foodName = card.querySelector("h3").textContent;

        // قیمت را به صورت متن از کارت غذا می‌گیریم.
        const foodPriceText = card.querySelector(".price").textContent;

        // ویرگول و کلمه «تومان» را حذف می‌کنیم و قیمت را به عدد تبدیل می‌کنیم.
        const foodPrice = Number(
          foodPriceText.replace(/,/g, "").replace("تومان", "").trim()
        );

        // دسته‌بندی غذا را از data-category کارت می‌گیریم.
        const foodCategory = card.dataset.category;

        // خواندن سبد از localStorage
        // اگر سبد وجود نداشت، آرایه خالی بساز
        let cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        // دسته‌هایی که غذای اصلی محسوب می‌شوند
        const mainFoodCategories = [
            "iranian",
            "fastfood"
        ];

        // بررسی اینکه غذای جدید اصلی است یا نه
        const isMainFood =
            mainFoodCategories.includes(foodCategory);

        // پیدا کردن غذای اصلی موجود در سبد
               
        const existingMainFood = cart.find(function(item) {
            // کارت غذای موردنظر را با شناسه آن پیدا می‌کنیم.
            const foodCard = document.querySelector(
                `.food-card[data-id="${item.id}"]`
            );

            // بررسی می‌کنیم که غذا ایرانی یا فست‌فود باشد.
            return foodCard &&
                mainFoodCategories.includes(foodCard.dataset.category);
        });

        // جلوگیری از افزودن غذای اصلی دوم
        if (isMainFood && existingMainFood) {
            alert(
                "هر کارمند در هر روز فقط می‌تواند یک غذای اصلی سفارش دهد.\n\n" +
                "سفارش نوشیدنی و دسر همچنان امکان‌پذیر است."
            );
            return;
        }

        // اطلاعات غذا را با ساختار جدید داخل سبد قرار می‌دهیم.
        const food = {
          id: foodId,
          title: foodName,
          price: foodPrice,
          count: 1
        };

        // پیدا کردن غذای مشابه در سبد
        const existingFood =
            cart.find(function(item) {
                return item.id === food.id;
            });

        // اگر غذا قبلاً وجود داشت، تعدادش را زیاد کن
        if (existingFood) {
            existingFood.count += 1;
        } else {
            // اگر وجود نداشت، آن را به سبد اضافه کن
            cart.push(food);
        }

        // دسته‌بندی غذاها را جدا از اطلاعات اصلی سبد ذخیره می‌کنیم.
        const foodCategories =
            JSON.parse(localStorage.getItem("foodCategories")) || {};

        // دسته‌بندی این غذا را با شناسه آن نگه می‌داریم.
        foodCategories[foodId] = foodCategory;

        // اطلاعات دسته‌بندی را در localStorage ذخیره می‌کنیم.
        localStorage.setItem(
            "foodCategories",
            JSON.stringify(foodCategories)
        );

        // تبدیل cart به JSON و ذخیره در localStorage
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        // خبر دادن به بخش شمارنده سبد
        document.dispatchEvent(
            new Event("cartUpdated")
        );

        // تغییر موقت متن دکمه
        button.textContent = "✓ اضافه شد";

        // غیرفعال کردن موقت دکمه
        button.disabled = true;

        // برگرداندن دکمه به حالت عادی بعد از یک ثانیه
        setTimeout(function() {
            button.textContent = "افزودن به سبد";
            button.disabled = false;
        }, 1000);
    };
});

// پیام تست برای اطمینان از اجرای کامل فایل
console.log("آخر فایل اجرا شد");