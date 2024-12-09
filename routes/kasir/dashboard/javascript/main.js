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
    const id_awal = 'nav_1';
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

// Load Profile

let session_var = 'session';

async function loadSession() {
    const session_data = localStorage.getItem(session_var);
    return session_data ? JSON.parse(session_data) : {'id_kasir':0, 'name':null, 'status':null, 'token':null};
}

async function loadProfile() {
    const data = await loadSession();
    const profile_container = document.getElementById('profile-card');
    profile_container.innerHTML = `
        <div id="${data.id_kasir}" class="profile-data">
            <span id="profile-admin-name" class="name">${data.name}</span>
            <span id="profile-admin-status" class="task">${data.status}</span>
        </div>`;
}

// Logout

function logout() {
    localStorage.removeItem(session_var);
    const cok = document.cookie.split(";");
    for (let cookie of cok) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; path=/; SameSite=Strict`;
    }
    window.location.href = `${api}/login`;
}

// Initiator

async function main() {
    await startNav();
    await loadProfile();
}

main();