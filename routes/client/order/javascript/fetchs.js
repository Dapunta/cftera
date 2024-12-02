// Global Variable

let menu = []
let meja = null;
const api ='http://127.0.0.1:3003'; // Change This

// Format Uang

function formatUang(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format Nama Menu

function rapikanNama(text) {
    let listKata = text.split(' ');
    let namaMenu;
    if (listKata.length > 1 && listKata.length < 4) {
        if (listKata.length === 2) namaMenu = text.replace(' ', '<br>');
        else if (listKata.length === 3) namaMenu = `${listKata[0]} ${listKata[1]}<br>${listKata[2]}`;
    }
    else {
        namaMenu = text;
    }
    return namaMenu;
}

// Set Nomor Meja

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('meja')) {
    meja = urlParams.get('meja');
}

function setNomorMeja() {
    document.getElementsByTagName('title')[0].innerText = `Meja ${meja} - Resto Nusantara`;

    document.getElementById('nomor-meja').innerText = meja;
}

setNomorMeja();

// Fetch Menu

async function fetchMenu() {
    try {
        const url = `${api}/get_menu`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        menu = await response.json();
    }
    catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Mendapat Menu Diskon

function getDiskonMenu(menuData) {
    return menuData.filter(menu => menu.discount !== 0);
}

// Mendapat Menu Populer

function getPopulerMenu(menuData) {
    return menuData.filter(menu => menu.is_popular === 1);
}

// Mengelompokkan Menu Berdasar Kategori

function groupMenuByCategory(menuData) {
    return menuData.reduce((grouped, menu) => {
        if (!grouped[menu.category]) {
            grouped[menu.category] = [];
        }
        grouped[menu.category].push(menu);
        return grouped;
    }, {});
}

// Show Menu Diskon

async function showMenuDiskon() {
    const diskon_menu = await getDiskonMenu(menu);
    const main_container = document.getElementById('main-container');

    if (diskon_menu.length != 0) {
        let but;

        // Add Box
        const container_menu_diskon = document.createElement('div');
        container_menu_diskon.id = 'container-menu-diskon';
        container_menu_diskon.className = 'container-menu-diskon';
        container_menu_diskon.innerHTML = `
            <span class="title-menu-category">Diskon Spesial</span>
            <div id="box-menu-diskon" class="scroller-menu-diskon"></div>`;
        main_container.appendChild(container_menu_diskon);

        // Add Menu
        const parent_container = document.getElementById('box-menu-diskon');
        diskon_menu.forEach((item) => {
            if (item.is_available) {
                if (Object.keys(pesanan).includes(item.id_menu)) {
                    if (pesanan[item.id_menu].count != 0) {
                        but = `
                            <button type="button" class="decrement-button" onclick="decrementItem(this)">-</button>
                            <span class="count">${pesanan[item.id_menu].count}</span>
                            <button type="button" class="increment-button" onclick="incrementItem(this)">+</button>
                        `;
                    }
                    else {
                        but = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
                    }
                }
                else {
                    but = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
                }
                const menu_item = document.createElement('div');
                menu_item.id = item.id_menu;
                menu_item.className = 'produk-menu-diskon';
                menu_item.innerHTML = `
                    <div class="image-container">
                        <img src="${item.image}">
                    </div>
                    <div class="info-container">
                        <span class="menu-name">${rapikanNama(item.name)}</span>
                        <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
                        <span class="price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                        <div class="add-button-container">
                            ${but}
                        </div>
                    </div>`;
                parent_container.appendChild(menu_item);
            }
        });
    }
}

// Show Menu Populer

async function showMenuPopuler() {
    const populer_menu = await getPopulerMenu(menu);
    const main_container = document.getElementById('main-container');

    if (populer_menu.length != 0) {
        let but;

        // Add Box
        const container_menu_populer = document.createElement('div');
        container_menu_populer.id = 'container-menu-populer';
        container_menu_populer.className = 'container-menu-reguler';
        container_menu_populer.innerHTML = `
            <span class="title-menu-category">Paling Laris</span>
            <div id="box-menu-populer" class="scroller-menu-reguler"></div>`;
        main_container.appendChild(container_menu_populer);

        // Add Menu
        const parent_container = document.getElementById('box-menu-populer');
        populer_menu.forEach((item) => {
            if (item.is_available) {
                if (Object.keys(pesanan).includes(item.id_menu)) {
                    if (pesanan[item.id_menu].count != 0) {
                        but = `
                            <button type="button" class="decrement-button" onclick="decrementItem(this)">-</button>
                            <span class="count">${pesanan[item.id_menu].count}</span>
                            <button type="button" class="increment-button" onclick="incrementItem(this)">+</button>
                        `;
                    }
                    else {
                        but = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
                    }
                }
                else {
                    but = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
                }
                const menu_item = document.createElement('div');
                menu_item.id = item.id_menu;
                menu_item.className = 'produk-menu-reguler';
                menu_item.innerHTML = `
                    <div class="image-container">
                        <img src="${item.image}">
                    </div>
                    <div class="info-container">
                        <span class="menu-name">${rapikanNama(item.name)}</span>
                        <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
                        <span class="price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                        <div class="add-button-container">
                            ${but}
                        </div>
                    </div>`;
                parent_container.appendChild(menu_item);
            }
        });
    }
}

// Show All Menu

function convertToTitle(text) {
    return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function convertToID(text) {
    return text.replace(/_/g, '');
}

async function showAllMenu() {
    const all_menu = await groupMenuByCategory(menu);
    const main_container = document.getElementById('main-container');

    Object.entries(all_menu).forEach(([category, list_menu]) => {
        let but;

        // Add Box
        const container_menu = document.createElement('div');
        container_menu.id = `container-menu-${convertToID(category)}`;
        container_menu.className = 'container-menu-reguler';
        container_menu.innerHTML = `
            <span class="title-menu-category">${convertToTitle(category)}</span>
            <div id="box-menu-${convertToID(category)}" class="scroller-menu-reguler"></div>`;
        main_container.appendChild(container_menu);

        // Add Menu
        const parent_container = document.getElementById(`box-menu-${convertToID(category)}`);
        list_menu.forEach((item) => {
            if (item.is_available) {
                if (Object.keys(pesanan).includes(item.id_menu)) {
                    if (pesanan[item.id_menu].count != 0) {
                        but = `
                            <button type="button" class="decrement-button" onclick="decrementItem(this)">-</button>
                            <span class="count">${pesanan[item.id_menu].count}</span>
                            <button type="button" class="increment-button" onclick="incrementItem(this)">+</button>
                        `;
                    }
                    else {
                        but = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
                    }
                }
                else {
                    but = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
                }
                const menu_item = document.createElement('div');
                menu_item.id = item.id_menu;
                menu_item.className = 'produk-menu-reguler';
                menu_item.innerHTML = `
                    <div class="image-container">
                        <img src="${item.image}">
                    </div>
                    <div class="info-container">
                        <span class="menu-name">${rapikanNama(item.name)}</span>
                        <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
                        <span class="price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                        <div class="add-button-container">
                            ${but}
                        </div>
                    </div>`;
                parent_container.appendChild(menu_item);
            }
        });
    });
}

// Show If SearchInput == null

async function showStandart() {
    const main_container = document.getElementById('main-container');
    main_container.innerHTML = '';
    await showMenuDiskon();
    await showMenuPopuler();
    await showAllMenu();
}

// Show If SearchInput != null

function showSearch(text) {
    const main_container = document.getElementById('main-container');
    main_container.innerHTML = '<div id="box-menu-search" class="scroller-menu-reguler"></div>';

    text = text.toLowerCase().trim();
    const listKeyword = text.split(' ');

    const result = menu.filter(item =>
        listKeyword.every(word => item.name.toLowerCase().includes(word)) ||
        listKeyword.every(word => item.category.toLowerCase().replace(/_/g, ' ').includes(word)) ||
        listKeyword.every(word => text.includes(item.category.toLowerCase().replace(/_/g, ' ').split(' ').join(' '))) ||
        listKeyword.every(word => text.includes(item.name.toLowerCase().replace(/_/g, ' ').split(' ').join(' ')))
    );

    printResult(result);
}

function printResult(result) {
    let but;
    const parent_container = document.getElementById('box-menu-search');
    result.forEach((item) => {
        if (item.is_available) {
            if (Object.keys(pesanan).includes(item.id_menu)) {
                if (pesanan[item.id_menu].count != 0) {
                    but = `
                        <button type="button" class="decrement-button" onclick="decrementItem(this)">-</button>
                        <span class="count">${pesanan[item.id_menu].count}</span>
                        <button type="button" class="increment-button" onclick="incrementItem(this)">+</button>
                    `;
                }
                else {
                    but = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
                }
            }
            else {
                but = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
            }
            const menu_item = document.createElement('div');
            menu_item.id = item.id_menu;
            menu_item.className = 'produk-menu-reguler';
            menu_item.innerHTML = `
                <div class="image-container">
                    <img src="${item.image}">
                </div>
                <div class="info-container">
                    <span class="menu-name">${rapikanNama(item.name)}</span>
                    <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
                    <span class="price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                    <div class="add-button-container">
                        ${but}
                    </div>
                </div>`;
            parent_container.appendChild(menu_item);
        }
    });
}

document.getElementById('searchInput').addEventListener('input', function() {
    var input = this.value.replace(/\s/g, '') === '' ? null : this.value.toLowerCase();
    if (!input) showStandart();
    else showSearch(input);
});

// Initiator

async function main() {
    await fetchMenu();
    await showStandart();
}

main();