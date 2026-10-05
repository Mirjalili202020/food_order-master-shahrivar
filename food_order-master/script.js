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

// پیدا کردن همه دسته‌بندی‌ها
const categories = document.querySelectorAll(".category");

// دسته انتخاب‌شده؛ null یعنی همه دسته‌ها
let selectedCategory = null;


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

            // پیدا کردن همه کارت‌های غذا
            const foodCards =
                document.querySelectorAll(".food-card");

            // نمایش همه کارت‌ها
            foodCards.forEach(function(card) {
                card.style.display = "";
            });

            // پایان اجرای این بخش
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

// اجرای جستجو هنگام تغییر متن ورودی
searchInput.addEventListener("input", function() {

    // گرفتن متن جستجو و حذف فاصله‌های اضافی
    const searchText =
        searchInput.value.trim();

    // پیدا کردن همه کارت‌های غذا
    const foodCards =
        document.querySelectorAll(".food-card");

    // بررسی تک‌تک کارت‌ها
    foodCards.forEach(function(card) {

        // گرفتن نام غذا
        const foodName =
            card.querySelector("h3").textContent;

        // گرفتن دسته غذا
        const foodCategory =
            card.dataset.category;

        // بررسی وجود متن جستجو در نام غذا
        const matchesSearch =
            foodName.includes(searchText);

        // بررسی هماهنگی کارت با دسته انتخاب‌شده
        const matchesCategory =
            selectedCategory === null ||
            foodCategory === selectedCategory;

        // نمایش فقط در صورت برقرار بودن هر دو شرط
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

        // گرفتن نام غذا
        const foodName =
            card.querySelector("h3").textContent;

        // گرفتن قیمت غذا
        const foodPrice =
            card.querySelector(".price").textContent;

        // گرفتن دسته غذا
        const foodCategory =
            card.dataset.category;

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
        const existingMainFood =
            cart.find(function(item) {
                return mainFoodCategories.includes(
                    item.category
                );
            });

        // جلوگیری از افزودن غذای اصلی دوم
        if (isMainFood && existingMainFood) {
            alert(
                "هر کارمند در هر روز فقط می‌تواند یک غذای اصلی سفارش دهد.\n\n" +
                "سفارش نوشیدنی و دسر همچنان امکان‌پذیر است."
            );
            return;
        }

        // ساخت Object مربوط به غذای انتخاب‌شده
        const food = {
            name: foodName,
            price: foodPrice,
            category: foodCategory,
            quantity: 1
        };

        // پیدا کردن غذای مشابه در سبد
        const existingFood =
            cart.find(function(item) {
                return item.name === food.name;
            });

        // اگر غذا قبلاً وجود داشت، تعدادش را زیاد کن
        if (existingFood) {
            existingFood.quantity += 1;
        } else {
            // اگر وجود نداشت، آن را به سبد اضافه کن
            cart.push(food);
        }

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