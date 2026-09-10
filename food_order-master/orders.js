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
                <p><strong>غذا:</strong> ${food.name}</p>
                <p><strong>تعداد:</strong> ${food.quantity}</p>
                <p><strong>قیمت:</strong> ${food.price}</p>
            </div>
        `;

        // قیمت در پروژه به شکل متن فارسی مثل «۱۸۰,۰۰۰ تومان» ذخیره شده است.
        // برای انجام محاسبات باید کلمه تومان، ویرگول و ارقام فارسی را تبدیل کنیم.
        const priceNumber = Number(
            food.price
                // کلمه تومان را از متن قیمت حذف می‌کنیم.
                .replace("تومان", "")

                // همه ویرگول‌ها را حذف می‌کنیم.
                .replace(/,/g, "")

                // هر رقم فارسی را به معادل انگلیسی آن تبدیل می‌کنیم.
                .replace(/[۰-۹]/g, function(digit) {
                    return "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
                })
        );

        // قیمت واحد را در تعداد ضرب کرده و به جمع کل سفارش اضافه می‌کنیم.
        orderTotal += priceNumber * food.quantity;
    });

    // تاریخ، مبلغ نهایی و وضعیت سفارش را به انتهای کارت اضافه می‌کنیم.
    orderHTML += `
            <p><strong>تاریخ ثبت:</strong> ${order.date}</p>
            <p><strong>مبلغ کل سفارش:</strong> ${orderTotal.toLocaleString("fa-IR")} تومان</p>
            <p><strong>وضعیت:</strong> ${order.status}</p>
        </div>
    `;

    // کارت ساخته‌شده را داخل صفحه قرار می‌دهیم.
    ordersContainer.innerHTML += orderHTML;
});

// این دو پیام برای تست و مشاهده اطلاعات در Console مرورگر هستند.
console.log(orders);
console.log("orders.js وصل شد");
