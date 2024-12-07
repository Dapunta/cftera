// Format Uang

function formatUang(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format Text

function convertToTitle(text) {
    return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

// Fetch Menu

async function fetchMenu() {
    try {
        const url = `${api}/get_menu`;
        const response = await fetch(url);
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

// Display All Menu

function displayAllMenu() {
    const container_menu = document.getElementById('container-menu');

    // Menu Popular
    const populer_menu = getPopulerMenu(menu);
    if (populer_menu.length != 0) {
        const new_category = document.createElement('div');
        new_category.className = 'menu-container-category';
        new_category.innerHTML = `
            <span class="category-title-container">Paling Populer</span>
            <div id="category-menu-popular" class="category-menu-container"></div>`;
        container_menu.appendChild(new_category);
        const box_category = document.getElementById('category-menu-popular');
        populer_menu.forEach((item) => {
            const new_menu = document.createElement('div');
            new_menu.id = item.id_menu;
            new_menu.className = item.is_available ? 'menu-container-item available' : 'menu-container-item inavailable';
            new_menu.setAttribute('onclick', 'selectMenu(this.id)')
            new_menu.innerHTML = `
                <div class="image-container">
                    ${item.discount != 0 ? `<span class="discount">${item.discount}%</span>` : ''}
                    ${item.is_popular ? '<span class="popular material-symbols-outlined">crown</span>' : ''}
                    <img src="${item.image}">
                </div>
                <div class="description-container">
                    <span class="name">${item.name}</span>
                    <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
                    <span class="after-price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                </div>`;
            box_category.appendChild(new_menu);
        });
    }

    // Menu Diskon
    const diskon_menu = getDiskonMenu(menu);
    if (diskon_menu.length != 0) {
        const new_category = document.createElement('div');
        new_category.className = 'menu-container-category';
        new_category.innerHTML = `
            <span class="category-title-container">Diskon Spesial</span>
            <div id="category-menu-diskon" class="category-menu-container"></div>`;
        container_menu.appendChild(new_category);
        const box_category = document.getElementById('category-menu-diskon');
        diskon_menu.forEach((item) => {
            const new_menu = document.createElement('div');
            new_menu.id = item.id_menu;
            new_menu.className = item.is_available ? 'menu-container-item available' : 'menu-container-item inavailable';
            new_menu.setAttribute('onclick', 'selectMenu(this.id)')
            new_menu.innerHTML = `
                <div class="image-container">
                    ${item.discount != 0 ? `<span class="discount">${item.discount}%</span>` : ''}
                    ${item.is_popular ? '<span class="popular material-symbols-outlined">crown</span>' : ''}
                    <img src="${item.image}">
                </div>
                <div class="description-container">
                    <span class="name">${item.name}</span>
                    <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
                    <span class="after-price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                </div>`;
            box_category.appendChild(new_menu);
        });
    }

    // All Category
    const all_menu = groupMenuByCategory(menu);
    Object.entries(all_menu).forEach(([category, list_menu]) => {

        // Add Box
        const new_category = document.createElement('div');
        new_category.className = 'menu-container-category';
        new_category.innerHTML = `
            <span class="category-title-container">${convertToTitle(category)}</span>
            <div id="category-menu-${category}" class="category-menu-container"></div>`;
        container_menu.appendChild(new_category);

        // Add Menu
        const box_category = document.getElementById(`category-menu-${category}`);
        list_menu.forEach((item) => {
            const new_menu = document.createElement('div');
            new_menu.id = item.id_menu;
            new_menu.className = item.is_available ? 'menu-container-item available' : 'menu-container-item inavailable';
            new_menu.setAttribute('onclick', 'selectMenu(this.id)')
            new_menu.innerHTML = `
                <div class="image-container">
                    ${item.discount != 0 ? `<span class="discount">${item.discount}%</span>` : ''}
                    ${item.is_popular ? '<span class="popular material-symbols-outlined">crown</span>' : ''}
                    <img src="${item.image}">
                </div>
                <div class="description-container">
                    <span class="name">${item.name}</span>
                    <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
                    <span class="after-price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                </div>`;
            box_category.appendChild(new_menu);
        });

    });
}

// Select Menu

function selectMenu(id) {
    const selected_menu = menu.find(item => item.id_menu === id);
    const container_form = document.getElementById('menu-action-form');
    container_form.innerHTML = `
        <span class="action-title">Edit Menu</span>
        <div class="image-container"><img src="${selected_menu.image}"></div>
        <input id="input-id" type="hidden" value="${selected_menu.id_menu}" autocomplete="off" autocapitalize="off" autofocus="off" autofill="off" spellcheck="false" required>
        <div class="input-row">
            <span>Nama</span>
            <input id="input-name" type="text" value="${selected_menu.name}" autocomplete="off" autocapitalize="off" autofocus="off" autofill="off" spellcheck="false" required>
        </div>
        <div class="input-row">
            <span>Category</span>
            <input id="input-category" type="text" value="${selected_menu.category}" autocomplete="off" autocapitalize="off" autofocus="off" autofill="off" spellcheck="false" required>
        </div>
        <div class="input-row">
            <span>Harga (Rp)</span>
            <input id="input-price" type="number" inputmode="numeric" value="${selected_menu.price}" autocomplete="off" autocapitalize="off" autofocus="off" autofill="off" spellcheck="false" required>
        </div>
        <div class="input-row">
            <span>Diskon (%)</span>
            <input id="input-discount" type="number" inputmode="numeric" value="${selected_menu.discount}" autocomplete="off" autocapitalize="off" autofocus="off" autofill="off" spellcheck="false" required>
        </div>
        <div class="radio-group">
            <span>Available :</span>
            <label>
                <input type="radio" name="available" value="yes" ${selected_menu.is_available ? 'checked' : ''}>
                <span>Yes</span>
            </label>
            <label>
                <input type="radio" name="available" value="no" ${selected_menu.is_available ? '' : 'checked'}>
                <span>No</span>
            </label>
        </div>
        <div class="radio-group">
            <span>Popular :</span>
            <label>
                <input type="radio" name="popular" value="yes" ${selected_menu.is_popular ? 'checked' : ''}>
                <span>Yes</span>
            </label>
            <label>
                <input type="radio" name="popular" value="no" ${selected_menu.is_popular ? '' : 'checked'}>
                <span>No</span>
            </label>
        </div>
        <button id="submit-edit" type="button" class="submit-edit" onclick="editMenu()">Submit</button>`;
}

// Edit Menu

async function editMenu() {
    
    const id = document.getElementById('input-id').value.trim();
    const name = document.getElementById('input-name').value.trim();
    const category = document.getElementById('input-category').value.trim();
    const price = document.getElementById('input-price').value.trim();
    const discount = document.getElementById('input-discount').value.trim();
    
    if (!id || !name || !category || !price || !discount || isNaN(price) || isNaN(discount)) {
        alert("Semua field harus diisi dengan benar, dan harga serta diskon harus berupa angka!");
        return null;
    }

    const available = document.querySelector('input[name="available"]:checked');
    if (!available) {
        alert("Pilih status 'Available'!");
        return null;
    }

    const availableValue = available.value === 'yes' ? 1 : 0;
    const popular = document.querySelector('input[name="popular"]:checked');
    if (!popular) {
        alert("Pilih status 'Popular'!");
        return null;
    }
    const popularValue = popular.value === 'yes' ? 1 : 0;
    const image = document.querySelector('.image-container img').src;

    const formData = {
        id_menu: id,
        name: name,
        price: parseInt(price),
        discount: parseInt(discount),
        category: category.toLowerCase().replace(/ /g, '_'),
        is_available: availableValue,
        is_popular: popularValue,
        image: image
    };

    await submitEdit(formData);

}

// Loading Spinner

function loading(element_id, active) {
    const loadingBox = document.getElementById(element_id);
    if (active)  {
        loadingBox.innerHTML = `<div id="loading-spinner" class="spinner-container"><div class="spinner"></div></div>`;
        loadingBox.style.pointerEvents = 'none';
    }
    else {
        loadingBox.innerHTML = ``;
        loadingBox.style.pointerEvents = 'all';
    }
}

// Submit Edit

async function submitEdit(payload) {

    loading('submit-edit', true);

    const create_order_url = `${api}/edit_menu`;
    const headers = {'Content-Type':'application/json'};
    const data = {
        'method'  : 'POST',
        'mode'    : 'cors',
        'headers' : headers,
        'body'    : JSON.stringify(payload)
    };
    const req = await fetch(create_order_url, data);
    const response = await req.json();

    if (response.status == 'success') {
        updateDisplayMenu(response.data);
        await fetchMenu();
    }

    document.getElementById('menu-action-form').innerHTML = '';
    
}

// Update Display Menu
function updateDisplayMenu(item) {

    const selected_menu = menu.find(item2 => item2.id_menu === item.id_menu);
    const image_menu = selected_menu.image;

    const menu_container = document.getElementById(item.id_menu);
    menu_container.className = item.is_available ? 'menu-container-item available' : 'menu-container-item inavailable';
    menu_container.innerHTML = `
        <div class="image-container">
            ${item.discount != 0 ? `<span class="discount">${item.discount}%</span>` : ''}
            ${item.is_popular ? '<span class="popular material-symbols-outlined">crown</span>' : ''}
            <img src="${image_menu}">
        </div>
        <div class="description-container">
            <span class="name">${item.name}</span>
            <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
            <span class="after-price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
        </div>`
}