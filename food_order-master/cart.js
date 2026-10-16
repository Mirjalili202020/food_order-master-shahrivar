// =============================================
// فایل cart.js
// وظایف اصلی صفحه سبد:
// 1) خواندن و نمایش اقلام سبد
// 2) محاسبه مبلغ کل
// 3) افزایش، کاهش و حذف غذاها
// 4) ثبت سفارش
// 5) کنترل محدودیت یک غذای اصلی در هر روز
// =============================================
document.addEventListener("DOMContentLoaded", function () {

// پیام تست برای اطمینان از اتصال فایل JavaScript به صفحه سبد.
console.log("cart.js وصل شد");

// سبد ذخیره‌شده را از localStorage می‌خوانیم.
// اگر سبدی وجود نداشته باشد، آرایه خالی استفاده می‌شود.
let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

 // دسته‌بندی غذاها را جداگانه از localStorage می‌خوانیم.
const foodCategories =
    JSON.parse(localStorage.getItem("foodCategories")) || {};

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

                   
                    return mainFoodCategories.includes(
                    foodCategories[food.id] || food.category
                    );
                });
        });

    
    // بررسی می‌کنیم آیا سبد فعلی غذای اصلی دارد یا نه.
    const cartHasMainFood =
        cart.some(function(food) {
            return mainFoodCategories.includes(
                foodCategories[food.id] || food.category
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

    // محاسبه جمع قیمت غذاها
    const subtotal = cart.reduce(function (sum, food) {
        return sum + food.price * food.count;
    }, 0);

    // محاسبه مالیات ۹ درصد
    const tax = subtotal * 0.09;

    // محاسبه مبلغ نهایی
    const finalTotal = subtotal + tax;

    // ساخت اطلاعات سفارش
    const order = {
        foods: cart,
        subtotal: subtotal,
        tax: tax,
        total: finalTotal,
        status: "ثبت شده",
        date: new Date().toLocaleString("fa-IR"),
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

function renderCart() {

// اگر حداقل یک آیتم داخل سبد وجود داشته باشد، اقلام را نمایش می‌دهیم.
if (cart.length > 0) {

    // محتوای قبلی ظرف سبد را خالی می‌کنیم تا اقلام را با JavaScript بسازیم.
    cartContainer.innerHTML = "";

    // جمع مبلغ تمام غذاها با درنظرگرفتن تعداد هر غذا
    const total = cart.reduce(function (sum, food) {
          return sum + food.price * food.count;
        }, 0);

    // روی همه اقلام سبد حرکت می‌کنیم.
    // index شماره هر آیتم داخل آرایه را مشخص می‌کند و برای دکمه‌ها استفاده می‌شود.
    cart.forEach(function(food, index) {

    
        // قیمت غذا از قبل در script.js به عدد تبدیل شده است.
        const priceNumber = food.price;

        // قیمت کل این غذا = قیمت واحد × تعداد.
        const foodTotal = priceNumber * food.count;

        // با Template Literal، HTML مربوط به هر آیتم سبد را می‌سازیم.
        // data-index باعث می‌شود بعداً بفهمیم هر دکمه مربوط به کدام عضو آرایه cart است.
        cartContainer.innerHTML += `

            <div class="cart-item">

                <!-- نام غذا -->
                <h3>${food.title}</h3>

                <!-- قیمت واحد -->
                <p>
                    قیمت واحد:
                    
                    <span class="cart-food-price">
                        ${priceNumber.toLocaleString("fa-IR")} تومان
                    </span>
                </p>

                <!-- کنترل تعداد -->
                <div class="quantity-control">

                    <button
                        class="decrease-button"
                        data-index="${index}">
                        −
                    </button>

                    <span>${food.count}</span>

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



        // مقدار جمع فعلی را برای تست در Console نمایش می‌دهیم.
        console.log("total : ", total);
    });

    // محاسبه مالیات ۹ درصد
    const tax = total * 0.09;

    // محاسبه مبلغ نهایی با احتساب مالیات
    const finalTotal = total + tax;

    // نمایش مبلغ نهایی با مالیات
    totalPrice.textContent =
        `مبلغ نهایی با مالیات ۹٪: ${finalTotal.toLocaleString("fa-IR")} تومان`;


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
            cart[index].count += 1;

            // سبد جدید را ذخیره می‌کنیم.
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            // سبد را دوباره نمایش می‌دهیم، بدون رفرش صفحه.
            renderCart();
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
            if (cart[index].count > 1) {
                cart[index].count -= 1;
            } else {
                // اگر تعداد یک باشد، غذا را با filter از سبد حذف می‌کنیم.
                cart = cart.filter(function(food, foodIndex) {
                    return foodIndex !== index;
                });
            }

            // سبد تغییرکرده را ذخیره می‌کنیم.
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

           // سبد را دوباره نمایش می‌دهیم، بدون رفرش صفحه.
           renderCart();
            
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

            // همه غذاها را نگه می‌داریم، به‌جز غذایی که کاربر حذف کرده است.
            cart = cart.filter(function(food, foodIndex) {
                return foodIndex !== index;
            });

            // نسخه جدید سبد را ذخیره می‌کنیم.
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

           // سبد را دوباره نمایش می‌دهیم، بدون رفرش صفحه.
           renderCart();
        };
    });

} else {

    // اگر سبد خالی باشد، پیام مناسب نمایش می‌دهیم.
    cartContainer.innerHTML =
        "<p>.سبد سفارش شما خالی است</p>";

    // وقتی سبد خالی است، مبلغ نهایی هم نمایش داده نمی‌شود.
    totalPrice.textContent = "";
}

}

renderCart();
});