// =============================================
// فایل profile.js
// وظیفه: بررسی اطلاعات فرم پروفایل قبل از ثبت
// =============================================

// خود فرم پروفایل را از HTML پیدا می‌کنیم.
const profileForm = document.querySelector("#profile-form");

// وقتی فرم ارسال شود، این تابع اجرا می‌شود.
profileForm.addEventListener("submit", function(event) {

    // جلوی ارسال معمولی فرم و رفرش شدن صفحه را می‌گیریم.
    event.preventDefault();

    // مقدار نام را می‌گیریم و فاصله‌های ابتدا و انتها را حذف می‌کنیم.
    const fullName =
        document.querySelector("#full-name").value.trim();

    // مقدار شماره تلفن را می‌گیریم.
    const phone =
        document.querySelector("#phone").value.trim();

    // مقدار ایمیل را می‌گیریم.
    const email =
        document.querySelector("#email").value.trim();

    // مقدار واحد سازمانی را می‌گیریم.
    const department =
        document.querySelector("#department").value.trim();

    // اگر نام کمتر از ۳ کاراکتر باشد، نام نامعتبر است.
    if (fullName.length < 3) {

        alert("لطفاً نام و نام خانوادگی را به‌درستی وارد کنید.");

        // اجرای تابع را متوقف می‌کنیم.
        return;
    }

    // الگوی شماره موبایل ایران: 09 + 9 رقم
    const phonePattern = /^09\d{9}$/;

    // بررسی می‌کنیم شماره با الگوی بالا مطابقت دارد یا نه.
    if (!phonePattern.test(phone)) {

        alert("لطفاً یک شماره تلفن معتبر وارد کنید.");

        return;
    }

    // الگوی ساده برای بررسی شکل کلی ایمیل.
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // اگر ایمیل با الگو مطابقت نداشته باشد، ادامه نمی‌دهیم.
    if (!emailPattern.test(email)) {

        alert("لطفاً یک ایمیل معتبر وارد کنید.");

        return;
    }

    // اگر واحد سازمانی خالی باشد، فرم ثبت نمی‌شود.
    if (department.length === 0) {

        alert("لطفاً واحد خود را وارد کنید.");

        return;
    }

    // اگر به اینجا برسیم، تمام بررسی‌ها موفق بوده‌اند.
    alert("اطلاعات پروفایل با موفقیت ثبت شد.");
});

// برای اطمینان از اتصال فایل به HTML در Console پیام می‌دهیم.
console.log("profile.js وصل شد");