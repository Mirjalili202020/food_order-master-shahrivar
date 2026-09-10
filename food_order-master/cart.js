// =============================================
// فایل cart.js
// وظایف اصلی صفحه سبد:
// 1) خواندن و نمایش اقلام سبد
// 2) محاسبه مبلغ کل
// 3) افزایش، کاهش و حذف غذاها
// 4) ثبت سفارش
// 5) کنترل محدودیت یک غذای اصلی در هر روز
// =============================================

// پیام تست برای اطمینان از اتصال فایل JavaScript به صفحه سبد.
console.log("cart.js وصل شد");

// سبد ذخیره‌شده را از localStorage می‌خوانیم.
// اگر سبدی وجود نداشته باشد، آرایه خالی استفاده می‌شود.
const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

// محلی که کارت‌های اقلام سبد در آن ساخته می‌شوند.
const cartContainer =
    document.querySelector("#cart-container");

// عنصر مربوط به نمایش مبلغ نهایی سبد.
const totalPrice =
    document.querySelector("#total-price");

// دکمه ثبت سفارش را پیدا می‌کنیم.
const orderButton =
    document.querySelector(".order-button");


// =========================
// ثبت سفارش
// =========================

// هنگام کلیک روی دکمه ثبت سفارش، این تابع اجرا می‌شود.
orderButton.onclick = function() {

    // اگر طول آرایه cart صفر باشد، یعنی سبد خالی است و سفارش ثبت نمی‌شود.
    if (cart.length === 0) {
        alert("سبد سفارش شما خالی است.");
        return;
    }

    // تاریخچه سفارش‌های قبلی را از localStorage می‌خوانیم.
    // اگر هنوز سفارشی ثبت نشده باشد، آرایه خالی در نظر می‌گیریم.
    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    // دسته‌های ایرانی و فست‌فود را به عنوان غذای اصلی تعریف می‌کنیم.
    const mainFoodCategories = [
        "iranian",
        "fastfood"
    ];

    // تاریخ و زمان فعلی سیستم را دریافت می‌کنیم.
    const today = new Date();

    // از سال، ماه و روز یک کلید ساده می‌سازیم.
    // این کلید فقط برای تشخیص این است که دو سفارش در یک روز ثبت شده‌اند یا نه.
    const todayKey =
        `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // با some بررسی می‌کنیم آیا در سفارش‌های قبلی، سفارشی مربوط به امروز وجود دارد
    // که داخل آن حداقل یک غذای اصلی ثبت شده باشد.
    const alreadyOrderedMainFoodToday =
        orders.some(function(order) {

            // ابتدا تاریخ سفارش باید برابر امروز باشد.
            return order.dateKey === todayKey &&
                order.foods.some(function(food) {

                    // سپس بررسی می‌کنیم دسته غذا جزو غذاهای اصلی است یا نه.
                    return mainFoodCategories.includes(
                        food.category
                    );
                });
        });

    // بررسی می‌کنیم آیا سبد فعلی هم حداقل یک غذای اصلی دارد یا نه.
    const cartHasMainFood =
        cart.some(function(food) {
            return mainFoodCategories.includes(
                food.category
            );
        });

    // اگر کاربر امروز قبلاً غذای اصلی ثبت کرده باشد
    // و سبد فعلی هم غذای اصلی داشته باشد، ثبت سفارش متوقف می‌شود.
    if (
        alreadyOrderedMainFoodToday &&
        cartHasMainFood
    ) {
        alert(
            "شما امروز یک غذای اصلی سفارش داده‌اید و امکان ثبت غذای اصلی دیگری ندارید.\n\n" +
            "سفارش نوشیدنی و دسر همچنان امکان‌پذیر است."
        );
        return;
    }

    // یک Object جدید برای سفارش می‌سازیم.
    const order = {

        // تمام اقلام فعلی سبد داخل سفارش ذخیره می‌شوند.
        foods: cart,

        // وضعیت اولیه سفارش.
        status: "ثبت شده",

        // تاریخ قابل‌خواندن برای نمایش به کاربر.
        date: new Date().toLocaleString("fa-IR"),

        // کلید تاریخ برای بررسی محدودیت روزانه در سفارش‌های بعدی.
        dateKey: todayKey
    };

    // سفارش جدید را به آرایه سفارش‌های قبلی اضافه می‌کنیم.
    orders.push(order);

    // تمام سفارش‌ها را دوباره در localStorage ذخیره می‌کنیم.
    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    // بعد از ثبت موفق سفارش، سبد خرید را پاک می‌کنیم.
    localStorage.removeItem("cart");

    // پیام تست در Console.
    console.log("سفارش با موفقیت ذخیره شد!");

    // صفحه را رفرش می‌کنیم تا سبد خالی و اطلاعات جدید نمایش داده شود.
    location.reload();
};


// =========================
// نمایش سبد سفارش
// =========================

// اگر حداقل یک آیتم داخل سبد وجود داشته باشد، اقلام را نمایش می‌دهیم.
if (cart.length > 0) {

    // محتوای قبلی ظرف سبد را خالی می‌کنیم تا اقلام را با JavaScript بسازیم.
    cartContainer.innerHTML = "";

    // متغیر total برای جمع مبلغ همه اقلام سبد.
    let total = 0;

    // روی همه اقلام سبد حرکت می‌کنیم.
    // index شماره هر آیتم داخل آرایه را مشخص می‌کند و برای دکمه‌ها استفاده می‌شود.
    cart.forEach(function(food, index) {

        // قیمت در پروژه به صورت رشته فارسی مثل «۱۸۰,۰۰۰ تومان» است.
        // برای محاسبه، آن را به عدد واقعی JavaScript تبدیل می‌کنیم.
        const priceNumber = Number(
            food.price
                // کلمه تومان را حذف می‌کنیم.
                .replace("تومان", "")

                // تمام ویرگول‌ها را حذف می‌کنیم.
                .replace(/,/g, "")

                // ارقام فارسی را به ارقام انگلیسی تبدیل می‌کنیم.
                .replace(/[۰-۹]/g, function(digit) {
                    return "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
                })
        );

        // قیمت کل همین غذا = قیمت واحد × تعداد.
        const foodTotal =
            priceNumber * food.quantity;

        // با Template Literal، HTML مربوط به هر آیتم سبد را می‌سازیم.
        // data-index باعث می‌شود بعداً بفهمیم هر دکمه مربوط به کدام عضو آرایه cart است.
        cartContainer.innerHTML += `

            <div class="cart-item">

                <!-- نام غذا -->
                <h3>${food.name}</h3>

                <!-- قیمت واحد -->
                <p>
                    قیمت واحد:
                    <span class="cart-food-price">
                        ${food.price}
                    </span>
                </p>

                <!-- کنترل تعداد -->
                <div class="quantity-control">

                    <button
                        class="decrease-button"
                        data-index="${index}">
                        −
                    </button>

                    <span>${food.quantity}</span>

                    <button
                        class="increase-button"
                        data-index="${index}">
                        +
                    </button>

                </div>

                <!-- قیمت کل همین غذا -->
                <p>
                    جمع:
                    <span class="cart-food-price">
                        ${foodTotal.toLocaleString("fa-IR")} تومان
                    </span>
                </p>

                <!-- حذف کامل غذا -->
                <button
                    class="remove-button"
                    data-index="${index}">
                    حذف کامل
                </button>

            </div>
        `;

        // مبلغ این آیتم را به مبلغ کل سبد اضافه می‌کنیم.
        total += foodTotal;

        // مقدار جمع فعلی را برای تست در Console نمایش می‌دهیم.
        console.log("total : ", total);
    });

    // مبلغ نهایی را با فرمت عدد فارسی در صفحه نمایش می‌دهیم.
    totalPrice.textContent =
        `مبلغ نهایی: ${total.toLocaleString("fa-IR")} تومان`;


    // =========================
    // دکمه افزایش تعداد
    // =========================

    // تمام دکمه‌های + را از بین HTML ساخته‌شده پیدا می‌کنیم.
    const increaseButtons =
        cartContainer.querySelectorAll(
            ".increase-button"
        );

    // برای هر دکمه افزایش، رویداد کلیک تعریف می‌کنیم.
    increaseButtons.forEach(function(button) {

        button.onclick = function() {

            // data-index یک رشته است؛ با Number آن را به عدد تبدیل می‌کنیم.
            const index =
                Number(button.dataset.index);

            // تعداد آیتم موردنظر را یک واحد افزایش می‌دهیم.
            cart[index].quantity += 1;

            // سبد جدید را ذخیره می‌کنیم.
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            // صفحه را رفرش می‌کنیم تا تعداد و مبلغ‌ها دوباره محاسبه شوند.
            location.reload();
        };
    });


    // =========================
    // دکمه کاهش تعداد
    // =========================

    // تمام دکمه‌های − را پیدا می‌کنیم.
    const decreaseButtons =
        cartContainer.querySelectorAll(
            ".decrease-button"
        );

    // برای هر دکمه کاهش، رویداد کلیک تعریف می‌کنیم.
    decreaseButtons.forEach(function(button) {

        button.onclick = function() {

            // شماره آیتم مربوط به این دکمه را از data-index می‌خوانیم.
            const index =
                Number(button.dataset.index);

            // اگر تعداد بیشتر از یک باشد، فقط یک واحد کم می‌کنیم.
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                // اگر تعداد برابر یک باشد، کاهش دوباره یعنی حذف آیتم از سبد.
                // splice از محل index یک عضو را از آرایه حذف می‌کند.
                cart.splice(index, 1);
            }

            // سبد تغییرکرده را ذخیره می‌کنیم.
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            // برای نمایش نتیجه جدید صفحه را رفرش می‌کنیم.
            location.reload();
        };
    });


    // =========================
    // دکمه حذف کامل
    // =========================

    // تمام دکمه‌های «حذف کامل» را پیدا می‌کنیم.
    const removeButtons =
        cartContainer.querySelectorAll(
            ".remove-button"
        );

    // برای هر دکمه حذف، رویداد کلیک تعریف می‌کنیم.
    removeButtons.forEach(function(button) {

        button.onclick = function() {

            // شماره آیتم مربوط به دکمه را می‌خوانیم.
            const index =
                Number(button.dataset.index);

            // آیتم موردنظر را به طور کامل از آرایه حذف می‌کنیم.
            cart.splice(index, 1);

            // نسخه جدید سبد را ذخیره می‌کنیم.
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            // صفحه را برای نمایش نتیجه جدید رفرش می‌کنیم.
            location.reload();
        };
    });

} else {

    // اگر سبد خالی باشد، پیام مناسب نمایش می‌دهیم.
    cartContainer.innerHTML =
        "<p>.سبد سفارش شما خالی است</p>";

    // وقتی سبد خالی است، مبلغ نهایی هم نمایش داده نمی‌شود.
    totalPrice.textContent = "";
}
