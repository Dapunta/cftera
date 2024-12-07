// Global Variable

let menu = [];
const api ='http://127.0.0.1:3003'; // Change This

// Change Navigation

const data_child_page = {
    'nav_1': { html: 'dashboard.html', script: 'dashboard.js' },
    'nav_2': { html: 'orderlist.html', script: 'orderlist.js' },
    'nav_3': { html: 'menu.html', script: 'menu.js' },
};

async function startNav() {
    const id_awal = 'nav_2';
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
    else if (id == 'nav_2') {
        await fetchOrder();
        await displayAllOrder();
    }
}

// Initiator

async function main() {
    await startNav();
}

main();