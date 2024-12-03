// Global Variable

let is_payment = false;

// Initiator

function showPesanan() {
    window.scrollTo(0, 0);
    is_payment = true;
    history.pushState({ is_payment: true }, null, "");
    const main_container = document.getElementById('main-container');
    main_container.innerHTML = `<div class="payment-container"></div>`;
    changeButtonTop();
    showMenuDipesan();
    choosePaymentMethod()
    showRingkasanPembayaran()
    changeButtonBottom();
    popUpFailed(false);
}

// Mengganti Tombol Search Atas

function changeButtonTop() {
    const search_button = document.getElementById('search-button');
    search_button.innerHTML = `
        <button type="button" class="back-button" onclick="backToMenu()"><i class="fa-solid fa-arrow-left"></i><span>Menu</span></button>
        <span class="right-nomor-meja">Meja ${meja}</span>`;
}

// Back To Menu

function backToMenu() {
    is_payment = false;
    history.replaceState(null, null, "");
    showStandart();
    backSearchButton();
    backSubmitButton();
    popUpFailed(false);
}

function backSearchButton() {
    const search_button = document.getElementById('search-button');
    search_button.innerHTML = `
        <input type="text" id="searchInput" class="search-menu" placeholder="Mau cari menu apa ?" autocomplete="off" autocapitalize="off" autofocus="off" autofill="off" spellcheck="false">
        <i class="fa-solid fa-magnifying-glass"></i>`;
    document.getElementById('searchInput').addEventListener('input', function() {
        var input = this.value.replace(/\s/g, '') === '' ? null : this.value.toLowerCase();
        if (!input) showStandart();
        else showSearch(input);
    });
}

function backSubmitButton() {
    const submit_button = document.getElementById('submit-button');
    submit_button.setAttribute('onclick', 'showPesanan()');
    updateFooter();
}

window.addEventListener('popstate', (event) => {
    if (is_payment) {
        backToMenu();
    }
});

// Mengganti Tombol Submit Bawah

function changeButtonBottom() {
    const submit_button = document.getElementById('submit-button');
    submit_button.setAttribute('onclick', 'submitPesanan()');
    updateFooterPayment();
}

function updateFooterPayment() {
    const totalItem = Object.values(pesanan).reduce((sum, item) => sum + item.count, 0);
    const totalPrice = Object.values(pesanan).reduce((sum, item) => sum + (item.count * item.price), 0);

    const footerContainer = document.querySelector('.footer-container');
    const totalItemText = footerContainer.querySelector('.total-item');
    const totalPriceText = footerContainer.querySelector('.total-price');

    totalItemText.textContent = `Pesan Sekarang`;
    totalPriceText.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;

    if (totalItem > 0) {
        footerContainer.className = 'footer-container active';
    }
    else {
        footerContainer.className = 'footer-container inactive';
    }
}

// Tampilkan Menu Yang Dipesan

function showMenuDipesan() {
    const main_container = document.getElementById('main-container');
    main_container.innerHTML = `
        <div id="container-menu-dipesan" class="container-menu-reguler">
            <span class="title-menu-category">Menu yang Dipesan</span>
            <div id="box-menu-dipesan" class="scroller-menu-reguler"></div>
        </div>`;
    const box_menu_dipesan = document.getElementById('box-menu-dipesan');
    Object.entries(pesanan).forEach(([id_menu, info_menu]) => {
        const item = menu.find(menuItem => menuItem.id_menu === id_menu);
        const jumlah_menu = info_menu.count;
        const menu_item = document.createElement('div');
        menu_item.className = 'produk-menu-reguler';
        menu_item.innerHTML = `
            <div class="image-container">
                <img src="${item.image}">
            </div>
            <div class="info-container">
                <span class="menu-name">${rapikanNama(item.name)}</span>
                <span class="real-price"><del>${(item.discount != 0) ? 'Rp ' + formatUang(item.price) : ''}</del></span>
                <span class="price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                <span class="jumlah-masing-item">${jumlah_menu}x</span>
                </div>
            </div>`;
        box_menu_dipesan.appendChild(menu_item);
    });
}

// Pilih Menu Pembayaran

let payment_method_choosen = null;

const list_payment_method = [
    {
        'id': 'BYR01',
        'name': 'Cash',
        'icon': '<i class="fa-solid fa-money-bill-1-wave"></i>'
    },
    {
        'id': 'BYR02',
        'name': 'E-Wallet',
        'icon': '<i class="fa-solid fa-wallet"></i>'
    },
    {
        'id': 'BYR03',
        'name': 'M-Banking',
        'icon': '<i class="fa-solid fa-credit-card"></i>'
    },
];

function choosePaymentMethod() {
    const main_container = document.getElementById('main-container');
    const new_container = document.createElement('div');
    new_container.id = 'container-menu-metode'
    new_container.className = 'container-menu-reguler';
    new_container.innerHTML = `
        <span class="title-menu-category">Metode Pembayaran</span>
        <div id="box-menu-metode" class="scroller-menu-reguler"></div>`;
    main_container.appendChild(new_container);
    const box_menu_metode = document.getElementById('box-menu-metode');
    list_payment_method.forEach((item) => {
        const metode_item = document.createElement('div');
        metode_item.id = item.id;
        metode_item.className = 'item-menu-pembayaran';
        metode_item.innerHTML = `
            <span class="icon-pembayaran">${item.icon}</span>
            <span class="title-pembayaran">${item.name}</span>
            <div class="dot-container">
                <div class="inner-dot ${item.id === 'BYR01' ? 'active' : 'inactive'}"></div>
            </div>`;
        metode_item.addEventListener('click', () => {
            setActivePaymentMethod(item.id);
        });
        box_menu_metode.appendChild(metode_item);
    });
    setActivePaymentMethod('BYR01');
}

function setActivePaymentMethod(id) {
    payment_method_choosen = id;
    const allMethods = document.querySelectorAll('.item-menu-pembayaran');
    allMethods.forEach((method) => {
        const dot = method.querySelector('.inner-dot');
        if (method.id === id) {
            dot.classList.add('active');
            dot.classList.remove('inactive');
        }
        else {
            dot.classList.add('inactive');
            dot.classList.remove('active');
        }
    });
}

// Tampilkan Ringkasan Pembayaran

function showRingkasanPembayaran() {
    const main_container = document.getElementById('main-container');
    const new_container = document.createElement('div');
    new_container.id = 'container-menu-ringkasan'
    new_container.className = 'container-menu-reguler';
    new_container.innerHTML = `
        <span class="title-menu-category">Ringkasan Pembayaran</span>
        <div class="scroller-menu-reguler">
            <div id="box-ringkasan" class="container-ringkasan-pembayaran"></div>
        </div>`;
    main_container.appendChild(new_container);
    const box_menu_ringkasan = document.getElementById('box-ringkasan');
    Object.entries(pesanan).forEach(([id_menu, info_menu]) => {
        const item = menu.find(menuItem => menuItem.id_menu === id_menu);
        const jumlah_menu = info_menu.count;
        const menu_item = document.createElement('div');
        menu_item.className = 'row-ringkasan';
        menu_item.innerHTML = `
            <span class="menu-name">${item.name}</span>
            <span class="jumlah-item">${jumlah_menu}x</span>
            <span class="price-masing-item">${'Rp ' + formatUang((item.price - ((item.discount/100)*item.price)) * jumlah_menu)}</span>`;
        box_menu_ringkasan.appendChild(menu_item);
    });
    const totalPrice = Object.values(pesanan).reduce((sum, item) => sum + (item.count * item.price), 0);
    const box_total = document.createElement('div');
    box_total.className = 'row-ringkasan-total';
    box_total.innerHTML = `
        <span class="text-total">Total</span>
        <span class="price-semua-item">Rp ${formatUang(totalPrice)}</span>`;
    box_menu_ringkasan.appendChild(box_total);
}

// Submit Pesanan

async function submitPesanan() {
    loading('submit-button', true);

    const params = {
        "pesanan" : pesanan,
        "meja" : meja,
        "payment" : payment_method_choosen
    }

    try {
        
        const encryptedString = await yoNdakTau(params);
        const create_order_url = `${api}/create_order`;
        const headers = {'Content-Type':'application/json'};
        const data = {
            'method'  : 'POST',
            'mode'    : 'cors',
            'headers' : headers,
            'body'    : JSON.stringify({'token':encryptedString})
        };

        const req = await fetch(create_order_url, data);
        const response = await req.json();

        if (response.status == 'success') {
            const url_redirect = `${api}/invoice?id=${response.data.id_pesanan}`;
            console.log(url_redirect);
            redirect(url_redirect);
        }

        else {
            popUpFailed(true);
        }

    }

    catch (e) {
        console.log(e);
        popUpFailed(true);
    }
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

// Redirect
function redirect(url) {
    window.location.href = url;
}

// Failed

function popUpFailed(active) {
    const block_container = document.getElementById('block-container');
    block_container.className = active ? 'block-container active' : 'failed-container inactive';
    const failed_container = document.getElementById('failed-container');
    failed_container.className = active ? 'failed-container active' : 'failed-container inactive';
}

// Reload Window

function reloadWindow() {
    window.location.reload();
}