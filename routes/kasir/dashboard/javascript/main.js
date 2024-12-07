// Global Variable

let menu = [];
const api ='http://127.0.0.1:3003'; // Change This

menu2 = [
    {
        "id_menu": "AYB0000002",
        "name": "Ayam Bakar Madu",
        "price": 18000,
        "discount": 0,
        "category": "ayam",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/AYB0000002.jpg"
    },
    {
        "id_menu": "AYG0000001",
        "name": "Ayam Goreng Kremes",
        "price": 17000,
        "discount": 0,
        "category": "ayam",
        "is_available": 1,
        "is_popular": 1,
        "image": "/static/images/AYG0000001.jpg"
    },
    {
        "id_menu": "AYP0000003",
        "name": "Ayam Panggang Kecap",
        "price": 19000,
        "discount": 0,
        "category": "ayam",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/AYP0000003.jpg"
    },
    {
        "id_menu": "BKB0000002",
        "name": "Bebek Bakar Kecap",
        "price": 27000,
        "discount": 0,
        "category": "bebek",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/BKB0000002.jpg"
    },
    {
        "id_menu": "BKG0000001",
        "name": "Bebek Goreng Kremes",
        "price": 25000,
        "discount": 0,
        "category": "bebek",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/BKG0000001.jpg"
    },
    {
        "id_menu": "BKP0000003",
        "name": "Bebek Panggang Kecap",
        "price": 28000,
        "discount": 0,
        "category": "bebek",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/BKP0000003.jpg"
    },
    {
        "id_menu": "CPY0000004",
        "name": "Capcay Saus Tiram",
        "price": 22000,
        "discount": 0,
        "category": "chinese",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/CPY0000004.jpg"
    },
    {
        "id_menu": "CMT0000003",
        "name": "Cumi Tepung Lada Hitam",
        "price": 38000,
        "discount": 0,
        "category": "seafood",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/CMT0000003.jpg"
    },
    {
        "id_menu": "FYH0000003",
        "name": "Fu Yung Hai Saus Tomat",
        "price": 23000,
        "discount": 0,
        "category": "chinese",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/FYH0000003.jpg"
    },
    {
        "id_menu": "GUL0000004",
        "name": "Gulai Ayam Bumbu Merah",
        "price": 30000,
        "discount": 20,
        "category": "ayam",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/GUL0000004.jpg"
    },
    {
        "id_menu": "GRM0000002",
        "name": "Gurame Bakar Madu",
        "price": 40000,
        "discount": 0,
        "category": "seafood",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/GRM0000002.jpg"
    },
    {
        "id_menu": "ALP0000001",
        "name": "Jus Alpukat",
        "price": 15000,
        "discount": 0,
        "category": "jus",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/ALP0000001.jpg"
    },
    {
        "id_menu": "AGR0000003",
        "name": "Jus Anggur",
        "price": 22000,
        "discount": 0,
        "category": "jus",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/AGR0000003.jpg"
    },
    {
        "id_menu": "STR0000002",
        "name": "Jus Stroberi",
        "price": 20000,
        "discount": 0,
        "category": "jus",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/STR0000002.jpg"
    },
    {
        "id_menu": "KPT0000001",
        "name": "Kepiting Saus Tiram",
        "price": 45000,
        "discount": 0,
        "category": "seafood",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/KPT0000001.jpg"
    },
    {
        "id_menu": "KWT0000002",
        "name": "Kwetiau Goreng Telur Orak-Arik",
        "price": 25000,
        "discount": 20,
        "category": "chinese",
        "is_available": 1,
        "is_popular": 1,
        "image": "/static/images/KWT0000002.jpg"
    },
    {
        "id_menu": "NSG0000001",
        "name": "Nasi Goreng Daging Sapi",
        "price": 24000,
        "discount": 0,
        "category": "chinese",
        "is_available": 1,
        "is_popular": 1,
        "image": "/static/images/NSG0000001.jpg"
    },
    {
        "id_menu": "NSL0000003",
        "name": "Nasi Lontong",
        "price": 5000,
        "discount": 0,
        "category": "nasi",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/NSL0000003.jpg"
    },
    {
        "id_menu": "NSP0000001",
        "name": "Nasi Putih",
        "price": 6000,
        "discount": 0,
        "category": "nasi",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/NSP0000001.jpg"
    },
    {
        "id_menu": "NSU0000002",
        "name": "Nasi Uduk",
        "price": 8000,
        "discount": 0,
        "category": "nasi",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/NSU0000002.jpg"
    },
    {
        "id_menu": "RWN0000002",
        "name": "Rawon Khas Surabaya",
        "price": 40000,
        "discount": 20,
        "category": "sapi",
        "is_available": 1,
        "is_popular": 1,
        "image": "/static/images/RWN0000002.jpg"
    },
    {
        "id_menu": "RDG0000001",
        "name": "Rendang Khas Minang",
        "price": 35000,
        "discount": 20,
        "category": "sapi",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/RDG0000001.jpg"
    },
    {
        "id_menu": "STK0000003",
        "name": "Steak Sirloin Lada Hitam",
        "price": 45000,
        "discount": 20,
        "category": "sapi",
        "is_available": 1,
        "is_popular": 0,
        "image": "/static/images/STK0000003.jpg"
    }
];

// Change Navigation

const data_child_page = {
    'nav_1': { html: 'dashboard.html', script: 'dashboard.js' },
    'nav_2': { html: 'orderlist.html', script: 'orderlist.js' },
    'nav_3': { html: 'menu.html', script: 'menu.js' },
};

async function startNav() {
    const id_awal = 'nav_3';
    const element_nav_awal = document.getElementById(id_awal);
    await changeNav(element_nav_awal);
}

async function changeNav(element) {
    const base_class = 'nav-content'
    const navLinks = document.querySelectorAll(`.${base_class}`);
    navLinks.forEach(nav => nav.classList.remove("active"));
    await changeContent(element.id);
    await reloadScript(element.id);
    element.className = `${base_class} active`;
}

async function changeContent(id) {

    // Routing & Fetch
    const { html:file_name, script:script_name } = data_child_page[id];
    const file_route  = `routes/kasir/dashboard/html/${file_name}`; // Deployment
    // const file_route  = `html/${file_name}`; // Development
    // const script_path = `javascript/${script_name}`;
    const response    = await fetch(file_route);
    const html_text   = await response.text();

    // Append & Insert
    const main_container = document.getElementById('main-container');
    main_container.innerHTML = html_text;
}

async function reloadScript(id) {
    if (id == 'nav_3') {
        await fetchMenu();
        await displayAllMenu();
    }
}

// Initiator

async function main() {
    await startNav();
}

main();