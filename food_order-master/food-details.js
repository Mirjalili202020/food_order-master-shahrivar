// =============================================
// فایل food-details.js
// وظیفه: نگهداری اطلاعات کامل غذاها و نمایش اطلاعات غذای انتخاب‌شده
// در صفحه food-details.html
// =============================================

// شیء foods مثل یک دیتابیس ساده در سمت کاربر عمل می‌کند.
// هر کلید مثل kebab یا chicken شناسه یک غذاست.
// داخل هر غذا نام، توضیحات، مواد اولیه، قیمت و مسیر تصویر ذخیره شده است.
const foods = {

    // =========================
    // غذاهای ایرانی
    // =========================

    kebab: {
        name: "چلوکباب",
        description:
            "چلوکباب یکی از غذاهای محبوب ایرانی است که همراه با برنج و کباب سرو می‌شود.",
        ingredients: [
            "برنج",
            "گوشت کبابی",
            "گوجه فرنگی",
            "کره",
            "زعفران"
        ],
        price: "۱۸۰,۰۰۰ تومان",
        image: "images/kebab.jpg"
    },

    chicken: {
        name: "جوجه کباب",
        description:
            "جوجه کباب یکی از غذاهای محبوب ایرانی است که با گوشت مرغ مزه‌دار شده و به صورت کبابی سرو می‌شود.",
        ingredients: [
            "گوشت مرغ",
            "پیاز",
            "زعفران",
            "آبلیمو",
            "کره"
        ],
        price: "۱۵۰,۰۰۰ تومان",
        image: "images/chicken.jpg"
    },

    ghormeh: {
        name: "قورمه سبزی",
        description:
            "قورمه سبزی یکی از غذاهای سنتی و محبوب ایرانی است که با سبزی معطر، گوشت و لوبیا تهیه می‌شود.",
        ingredients: [
            "سبزی قورمه",
            "گوشت",
            "لوبیا قرمز",
            "لیمو عمانی",
            "پیاز"
        ],
        price: "۱۸۰,۰۰۰ تومان",
        image: "images/ghormeh.jpg"
    },

    tahchin: {
        name: "ته چین",
        description:
            "ته چین غذایی خوش‌عطر و خوشمزه ایرانی است که با برنج، مرغ، ماست و زعفران تهیه می‌شود.",
        ingredients: [
            "برنج",
            "مرغ",
            "ماست",
            "تخم مرغ",
            "زعفران"
        ],
        price: "۳۵۰,۰۰۰ تومان",
        image: "images/tahchin.jpg"
    },

    zereshkpolo: {
        name: "زرشک پلو",
        description:
            "زرشک پلو غذایی محبوب ایرانی است که با برنج زعفرانی، زرشک و مرغ سرو می‌شود.",
        ingredients: [
            "برنج",
            "مرغ",
            "زرشک",
            "زعفران",
            "کره"
        ],
        price: "۴۵۰,۰۰۰ تومان",
        image: "images/zereshkpolo.jpg"
    },

    baghali: {
        name: "باقالی پلو",
        description:
            "باقالی پلو یکی از غذاهای سنتی ایرانی است که با برنج، باقالی و شوید تهیه می‌شود.",
        ingredients: [
            "برنج",
            "باقالی",
            "شوید",
            "زعفران",
            "کره"
        ],
        price: "۱,۱۵۰,۰۰۰ تومان",
        image: "images/baghali.jpg"
    },

    kalepache: {
        name: "کله پاچه",
        description:
            "کله پاچه یکی از غذاهای سنتی ایرانی است که معمولاً به عنوان یک وعده غذایی کامل سرو می‌شود.",
        ingredients: [
            "کله گوسفند",
            "پاچه گوسفند",
            "نخود",
            "پیاز",
            "ادویه"
        ],
        price: "۲,۰۰۰,۰۰۰ تومان",
        image: "images/kalepache.jpg"
    },

    gheyme: {
        name: "قیمه با برنج",
        description:
            "قیمه با برنج غذایی سنتی و محبوب ایرانی است که با لپه، گوشت، سیب‌زمینی و برنج سرو می‌شود.",
        ingredients: [
            "برنج",
            "گوشت",
            "لپه",
            "لیمو عمانی",
            "سیب‌زمینی"
        ],
        price: "۳۵۰,۰۰۰ تومان",
        image: "images/gheyme.jpg"
    },

    fesenjan: {
        name: "فسنجان",
        description:
            "فسنجان یکی از غذاهای اصیل ایرانی است که با گردو، رب انار و گوشت مرغ تهیه می‌شود.",
        ingredients: [
            "گردو",
            "رب انار",
            "مرغ",
            "پیاز",
            "زعفران"
        ],
        price: "۱۹۰,۰۰۰ تومان",
        image: "images/fesenjan.jpg"
    },

    abgoosht: {
        name: "آبگوشت",
        description:
            "آبگوشت یا دیزی یکی از غذاهای سنتی ایرانی است که با گوشت، نخود، لوبیا و سیب‌زمینی تهیه می‌شود.",
        ingredients: [
            "گوشت",
            "نخود",
            "لوبیا",
            "سیب‌زمینی",
            "گوجه فرنگی"
        ],
        price: "۱۷۰,۰۰۰ تومان",
        image: "images/abgoosht.jpg"
    },

    lobiapolo: {
        name: "لوبیا پلو",
        description:
            "لوبیا پلو یکی از غذاهای محبوب ایرانی است که با برنج، لوبیا سبز و گوشت تهیه می‌شود.",
        ingredients: [
            "برنج",
            "لوبیا سبز",
            "گوشت",
            "گوجه فرنگی",
            "زعفران"
        ],
        price: "۱۵۰,۰۰۰ تومان",
        image: "images/lobiapolo.jpg"
    },

    sabzipolomahi: {
        name: "سبزی پلو با ماهی",
        description:
            "سبزی پلو با ماهی یکی از غذاهای محبوب ایرانی است که با برنج معطر، سبزی و ماهی سرو می‌شود.",
        ingredients: [
            "برنج",
            "سبزی معطر",
            "ماهی",
            "سیر",
            "زعفران"
        ],
        price: "۲۲۰,۰۰۰ تومان",
        image: "images/sabzipolomahi.jpg"
    },


    // =========================
    // فست فود
    // =========================

    pizza: {
        name: "پیتزا",
        description:
            "پیتزای خوشمزه با پنیر و مواد تازه، مناسب برای یک وعده لذیذ.",
        ingredients: [
            "خمیر پیتزا",
            "پنیر",
            "سس گوجه",
            "گوشت",
            "فلفل دلمه‌ای"
        ],
        price: "۵۴۰,۰۰۰ تومان",
        image: "images/pizza.jpg"
    },

    chikstrag: {
        name: "چیکن استراگنف",
        description:
            "چیکن استراگنف غذایی خوشمزه با تکه‌های مرغ، سس خامه‌ای و سیب‌زمینی است.",
        ingredients: [
            "فیله مرغ",
            "قارچ",
            "خامه",
            "پیاز",
            "سیب‌زمینی"
        ],
        price: "۸۵۰,۰۰۰ تومان",
        image: "images/chikstrag.jpg"
    },

    mashroomb: {
        name: "ماشروم برگر",
        description:
            "ماشروم برگر با گوشت گوساله، قارچ و پنیر تهیه می‌شود و طعمی لذیذ دارد.",
        ingredients: [
            "گوشت گوساله",
            "قارچ",
            "پنیر",
            "نان برگر",
            "سس مخصوص"
        ],
        price: "۶۷۷,۰۰۰ تومان",
        image: "images/mashroomb.jpg"
    },

    kababtorki: {
        name: "کباب ترکی",
        description:
            "کباب ترکی یا دونر با گوشت مزه‌دار شده و همراه با نان و مخلفات سرو می‌شود.",
        ingredients: [
            "گوشت",
            "نان",
            "گوجه فرنگی",
            "کاهو",
            "سس مخصوص"
        ],
        price: "۹۴۰,۰۰۰ تومان",
        image: "images/kababtorki.jpg"
    },

    shaver: {
        name: "شاورما لبنانی",
        description:
            "شاورما لبنانی غذایی خوشمزه با گوشت مزه‌دار شده، سبزیجات و سس مخصوص است.",
        ingredients: [
            "گوشت مرغ و گوشت",
            "نان",
            "کاهو",
            "خیارشور",
            "سس مخصوص"
        ],
        price: "۴۸۵,۰۰۰ تومان",
        image: "images/shaver.jpg"
    },

    sandwichfile: {
        name: "ساندویچ فیله مرغ",
        description:
            "ساندویچ فیله مرغ با فیله مرغ ترد و سبزیجات تازه در نان مخصوص سرو می‌شود.",
        ingredients: [
            "فیله مرغ",
            "نان",
            "کاهو",
            "گوجه فرنگی",
            "سس مخصوص"
        ],
        price: "۳۵۵,۰۰۰ تومان",
        image: "images/sandwichfile.jpg"
    },

    bandari: {
        name: "ساندویچ بندری",
        description:
            "ساندویچ بندری یک غذای تند و خوشمزه با سوسیس، پیاز و ادویه‌های مخصوص است.",
        ingredients: [
            "سوسیس",
            "پیاز",
            "رب گوجه فرنگی",
            "فلفل",
            "ادویه"
        ],
        price: "۱۲۰,۰۰۰ تومان",
        image: "images/bandari.jpg"
    },

    hotdog: {
        name: "هات‌داگ",
        description:
            "هات‌داگ با نان تازه و سس مخصوص تهیه می‌شود و یکی از غذاهای محبوب فست‌فودی است.",
        ingredients: [
            "هات‌داگ",
            "نان",
            "سس کچاپ",
            "سس خردل",
            "خیارشور"
        ],
        price: "۱۴۰,۰۰۰ تومان",
        image: "images/hotdog.jpg"
    },

    cheeseburger: {
        name: "چیزبرگر",
        description:
            "چیزبرگر با گوشت گوساله، پنیر و نان برگر همراه با سس مخصوص سرو می‌شود.",
        ingredients: [
            "گوشت گوساله",
            "پنیر",
            "نان برگر",
            "کاهو",
            "گوجه فرنگی"
        ],
        price: "۱۸۰,۰۰۰ تومان",
        image: "images/cheeseburger.jpg"
    },

    lasagna: {
        name: "لازانیا",
        description:
            "لازانیا غذایی لذیذ با لایه‌های پاستا، گوشت، سس مخصوص و پنیر است.",
        ingredients: [
            "ورق لازانیا",
            "گوشت",
            "سس گوجه فرنگی",
            "پنیر",
            "سس بشامل"
        ],
        price: "۱۹۰,۰۰۰ تومان",
        image: "images/lasagna.jpg"
    },

    friedchicken: {
        name: "فیله سوخاری",
        description:
            "فیله مرغ سوخاری ترد و خوشمزه همراه با سس مخصوص سرو می‌شود.",
        ingredients: [
            "فیله مرغ",
            "آرد سوخاری",
            "تخم مرغ",
            "ادویه",
            "سس مخصوص"
        ],
        price: "۲۰۰,۰۰۰ تومان",
        image: "images/fried-chicken.jpg"
    },


    // =========================
    // نوشیدنی‌ها
    // =========================

    abali: {
        name: "دوغ آب علی کوچیک",
        description:
            "دوغ گازدار خنک و خوش‌طعم، مناسب برای همراهی با غذا.",
        ingredients: [
            "آب",
            "ماست",
            "نمک",
            "گاز خوراکی"
        ],
        price: "۵۵,۰۰۰ تومان",
        image: "images/abali.jpg"
    },

    fanta: {
        name: "نوشابه فانتا کوچک",
        description:
            "نوشابه فانتا کوچک و خنک با طعم پرتقالی.",
        ingredients: [
            "آب گازدار",
            "شکر",
            "طعم‌دهنده پرتقالی"
        ],
        price: "۴۰,۰۰۰ تومان",
        image: "images/fanta.jpg"
    },

    cocacola: {
        name: "کوکاکولا کوچک",
        description:
            "نوشابه کوکاکولا کوچک و خنک، مناسب برای همراهی با غذا.",
        ingredients: [
            "آب گازدار",
            "شکر",
            "عصاره‌های طعم‌دهنده"
        ],
        price: "۴۰,۰۰۰ تومان",
        image: "images/coca-cola.jpg"
    },

    pepsi: {
        name: "پپسی کوچک",
        description:
            "نوشابه پپسی کوچک و خنک با طعم کولا.",
        ingredients: [
            "آب گازدار",
            "شکر",
            "طعم‌دهنده‌های کولا"
        ],
        price: "۴۰,۰۰۰ تومان",
        image: "images/pepsi.jpg"
    },

    malt: {
        name: "ماءالشعیر",
        description:
            "ماءالشعیر خنک و گوارا که برای همراهی با غذا مناسب است.",
        ingredients: [
            "عصاره مالت",
            "آب",
            "گاز خوراکی",
            "طعم‌دهنده"
        ],
        price: "۵۰,۰۰۰ تومان",
        image: "images/malt-beverage.jpg"
    },

    water: {
        name: "آب معدنی",
        description:
            "آب معدنی خنک و گوارا، مناسب برای همراهی با هر نوع غذا.",
        ingredients: [
            "آب معدنی"
        ],
        price: "۲۰,۰۰۰ تومان",
        image: "images/water.jpg"
    },


    // =========================
    // دسرها
    // =========================

    sansebastian: {
        name: "چیزکیک سن‌سباستین",
        description:
            "چیزکیک خامه‌ای با رویه کاراملی و بافتی نرم و لطیف.",
        ingredients: [
            "پنیر خامه‌ای",
            "خامه",
            "تخم مرغ",
            "شکر",
            "وانیل"
        ],
        price: "۱۲۰,۰۰۰ تومان",
        image: "images/san-sebastian-cheesecake.jpg"
    },

    tiramisu: {
        name: "تیرامیسو",
        description:
            "دسر ایتالیایی خوشمزه با قهوه، پنیر ماسکارپونه و پودر کاکائو.",
        ingredients: [
            "پنیر ماسکارپونه",
            "قهوه",
            "بیسکویت",
            "خامه",
            "پودر کاکائو"
        ],
        price: "۱۱۰,۰۰۰ تومان",
        image: "images/tiramisu.jpg"
    },

    brownie: {
        name: "براونی شکلاتی",
        description:
            "براونی نرم و شکلاتی با طعمی غنی و دلچسب.",
        ingredients: [
            "شکلات",
            "آرد",
            "کره",
            "تخم مرغ",
            "شکر"
        ],
        price: "۹۵,۰۰۰ تومان",
        image: "images/chocolate-brownie.jpg"
    },

    profiteroles: {
        name: "پروفیترول شکلاتی",
        description:
            "شیرینی پف‌دار پرشده با خامه و پوشیده‌شده با سس شکلاتی.",
        ingredients: [
            "خمیر شو",
            "خامه",
            "شکلات",
            "شیر",
            "تخم مرغ"
        ],
        price: "۱۱۵,۰۰۰ تومان",
        image: "images/chocolate-profiteroles.jpg"
    },

    pannacotta: {
        name: "پانا کوتا",
        description:
            "دسر ایتالیایی لطیف و خامه‌ای که همراه با سس میوه‌ای سرو می‌شود.",
        ingredients: [
            "خامه",
            "شیر",
            "شکر",
            "ژلاتین",
            "وانیل"
        ],
        price: "۱۰۰,۰۰۰ تومان",
        image: "images/panna-cotta.jpg"
    }
};


// =========================
// دریافت غذای انتخاب‌شده از آدرس صفحه
// =========================

// window.location.search بخش Query String آدرس را می‌دهد؛
// مثلاً در food-details.html?food=kebab مقدار آن برابر ?food=kebab است.
// URLSearchParams کار خواندن پارامترهای آدرس را ساده می‌کند.
const params = new URLSearchParams(
    window.location.search
);

// مقدار پارامتر food را از آدرس می‌گیریم.
// برای مثال در ?food=kebab مقدار foodId برابر kebab می‌شود.
const foodId = params.get("food");

// با استفاده از شناسه، اطلاعات همان غذا را از شیء foods پیدا می‌کنیم.
const food = foods[foodId];


// =========================
// نمایش اطلاعات غذا
// =========================

if (food) {

    // نمایش نام غذا
    document.querySelector("#food-name").textContent =
        food.name;

    // نمایش توضیحات
    document.querySelector("#food-description").textContent =
        food.description;

    // نمایش قیمت
    document.querySelector("#food-price").textContent =
        food.price;

    // نمایش تصویر
    const foodImage =
        document.querySelector("#food-image");

    foodImage.src = food.image;
    foodImage.alt = food.name;

    // نمایش مواد تشکیل‌دهنده
    const ingredients =
        document.querySelector("#food-ingredients");

    food.ingredients.forEach(function(item) {

        const li =
            document.createElement("li");

        li.textContent = item;

        ingredients.appendChild(li);
    });
}