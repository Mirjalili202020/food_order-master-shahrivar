// =============================================
// فایل orders.js
// وظیفه: خواندن سفارش‌های ثبت‌شده و نمایش تاریخچه سفارش‌ها
// =============================================

// سفارش‌ها را از localStorage می‌خوانیم.
// اگر سفارشی وجود نداشته باشد، آرایه خالی استفاده می‌شود.
const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

// محلی از صفحه که کارت‌های سفارش باید داخل آن نمایش داده شوند.
const ordersContainer =
    document.querySelector("#orders-container");

// روی همه سفارش‌های ذخیره‌شده حرکت می‌کنیم.
// orderIndex شماره سفارش را برای نمایش به کاربر مشخص می‌کند.
orders.forEach(function(order, orderIndex) {

    // فقط سفارش‌هایی را نمایش می‌دهیم که ساختار درست داشته باشند.
    // Array.isArray بررسی می‌کند foods واقعاً یک آرایه است.
    // این شرط مانع می‌شود داده قدیمی یا ناقص، کل صفحه تاریخچه را خراب کند.
    if (!order || !Array.isArray(order.foods)) {
        console.warn("یک سفارش با ساختار ناقص پیدا شد:", order);
        return;
    }

    // مبلغ کل این سفارش از صفر شروع می‌شود و در ادامه محاسبه می‌شود.
    let orderTotal = 0;

    // بخش ابتدایی HTML کارت سفارش را می‌سازیم.
    // Template Literal با علامت ` اجازه می‌دهد HTML چندخطی و متغیرها را کنار هم بنویسیم.
    let orderHTML = `
        <div class="order-card">
            <h3>سفارش شماره ${orderIndex + 1}</h3>
    `;

    // هر غذای موجود در این سفارش را جداگانه بررسی می‌کنیم.
    order.foods.forEach(function(food) {

        // نام، تعداد و قیمت هر غذا را به HTML سفارش اضافه می‌کنیم.
        orderHTML += `
            <div class="order-food">
                <p><strong>غذا:</strong> ${food.title}</p>
                <p><strong>تعداد:</strong> ${food.count}</p>
                <p><strong>قیمت:</strong> ${Number(food.price).toLocaleString("fa-IR")} تومان
                </p>
            </div>
        `;

        // قیمت غذا از قبل به شکل عدد ذخیره شده است.
        const priceNumber = Number(food.price) || 0;

        // قیمت واحد را در آن ضرب می کنیم و به مبلغ کل سفارش اضافه می کنیم
        orderTotal += priceNumber * food.count;
    });

    // تاریخ، مبلغ نهایی و وضعیت سفارش را به انتهای کارت اضافه می‌کنیم.
    orderHTML += `
        <p><strong>تاریخ ثبت:</strong> ${order.date}</p>
        <p><strong>جمع قیمت غذاها:</strong> ${(order.subtotal ?? orderTotal).toLocaleString("fa-IR")} تومان</p>
        <p><strong>مالیات ۹٪:</strong> ${(order.tax ?? 0).toLocaleString("fa-IR")} تومان</p>
        <p><strong>مبلغ نهایی:</strong> ${(order.total ?? orderTotal).toLocaleString("fa-IR")} تومان</p>
        <p><strong>وضعیت:</strong> ${order.status}</p>
        </div>
    `;

    // کارت ساخته‌شده را داخل صفحه قرار می‌دهیم.
    ordersContainer.innerHTML += orderHTML;
    });

// این دو پیام برای تست و مشاهده اطلاعات در Console مرورگر هستند.
console.log(orders);
console.log("orders.js وصل شد");
