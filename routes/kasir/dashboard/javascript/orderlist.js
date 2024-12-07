let list_order = [];
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

// Format Waktu

function formatWaktu(epochTime) {
    const date = new Date(epochTime * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = date.getDate();
    const month = date.toLocaleString('id-ID', { month: 'long' });
    const year = date.getFullYear();
    return `${hours}:${minutes}, ${day} ${month} ${year}`;
}

// Fetch Order

async function fetchOrder() {
    try {
        const url = `${api}/get_order`;
        // const url = `json/list_order.json`;
        const response = await fetch(url);
        list_order = await response.json();
    }
    catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Display All Order

async function displayAllOrder() {
    const container_order = document.getElementById('orderlist-container');
    // list_order.sort((a, b) => b.time - a.time);
    list_order.forEach((item) => {
        const new_order = document.createElement('div');
        new_order.id = item.id_pesanan;
        new_order.className = 'orderlist-item';
        new_order.setAttribute('onclick','showOrderDetail(this.id)');
        
        const payment = list_payment_method.find(item2 => item2.id === item.payment).name;
        let status_color;
        if (item.status.toLowerCase() == 'belum diproses') {status_color = '#fc8f8f';}
        else if (item.status.toLowerCase() == 'diproses') {status_color = '#d3cf05';}
        else if (item.status.toLowerCase() == 'selesai') {status_color = '#58ce58';}

        new_order.innerHTML = `
            <div class="orderlist-info" ip="${item.ip}">
                <span class="id-pesanan">${item.id_pesanan}</span>
                <span class="time">${formatWaktu(item.time)}</span>
                <span class="meja">Meja ${item.meja}</span>
                <span class="price">Rp ${formatUang(item.total_price)}</span>
            </div>
            <span id="orderlist-status-${item.id_pesanan}" class="orderlist-status" style="background-color: ${status_color};">${item.status}</span>`;
        container_order.appendChild(new_order);
    });
}

// Show order detail

function showOrderDetail(id) {

    // Main
    const selected_order = list_order.find(item2 => item2.id_pesanan === id);
    const main_container = document.getElementById('right-panel');
    main_container.innerHTML = `
        <div id="pesanan-${id}" class="orderlist-container-show-detail">
            <span class="right-panel-title">Detail Pesanan</span>
            <div id="show-menu" class="right-panel-menu"></div>
            <div id="show-detail" class="right-panel-detail"></div>
            <div class="right-panel-button">
                <button class="button-edit-status-order stat1" onclick="editStatusOrder(this, 'Belum Diproses')">Belum Diproses</button>
                <button class="button-edit-status-order stat2" onclick="editStatusOrder(this, 'Diproses')">Diproses</button>
                <button class="button-edit-status-order stat3" onclick="editStatusOrder(this, 'Selesai')">Selesai</button>
            </div>
            <button type="button" class="delete-selected-order-button" onclick="deleteOrder(this)"><i class="fa-solid fa-trash"></i></button>
        </div>`;

    // Show Menu
    const menu_container = document.getElementById('show-menu');
    selected_order.pesanan.forEach((item) => {
        const new_menu = document.createElement('div');
        new_menu.id = item.id_menu;
        new_menu.className = 'right-item-menu-box';
        new_menu.innerHTML = `
            <div class="image-container"><img src="${item.image}"></div>
            <div class="info-container">
                <span class="menu-name">${item.name}</span>
                <span class="after-price">Rp ${formatUang(item.price - ((item.discount/100)*item.price))}</span>
                <span class="count">x${item.count}</span>
            </div>`;
        menu_container.appendChild(new_menu);
    });

    // Show Detail
    const detail_container = document.getElementById('show-detail');
    detail_container.innerHTML = `
        <span class="detail-row">
            <span class="detail-col-key">Pesanan</span>
            <span class="detail-col-separator">:</span>
            <span class="detail-col-value bold">${selected_order.id_pesanan}</span>
        </span>
        <span class="detail-row">
            <span class="detail-col-key">Meja</span>
            <span class="detail-col-separator">:</span>
            <span class="detail-col-value">${selected_order.meja}</span>
        </span>
        <span class="detail-row">
            <span class="detail-col-key">Waktu</span>
            <span class="detail-col-separator">:</span>
            <span class="detail-col-value">${formatWaktu(selected_order.time)}</span>
        </span>
        <span class="detail-row">
            <span class="detail-col-key">IP</span>
            <span class="detail-col-separator">:</span>
            <span class="detail-col-value">${selected_order.ip}</span>
        </span>
        <span class="detail-row">
            <span class="detail-col-key">Status</span>
            <span class="detail-col-separator">:</span>
            <span id="detail-col-value-${selected_order.id_pesanan}" class="detail-col-value">${selected_order.status}</span>
        </span>
        <span class="detail-row-price">Rp ${formatUang(selected_order.total_price)}</span>`;
}

// Edit status order

async function editStatusOrder(near, status) {
    const id_pesanan = near.closest('.orderlist-container-show-detail').id.split('-')[1];
    
    const edit_status_order_url = `${api}/edit_status_order`;
    const headers = {'Content-Type':'application/json'};
    const data = {
        'method'  : 'POST',
        'mode'    : 'cors',
        'headers' : headers,
        'body'    : JSON.stringify({'id_pesanan':id_pesanan, 'status':status})
    };
    const req = await fetch(edit_status_order_url, data);
    const response = await req.json();

    if (response.status == 'success') {
        updateDisplayStatusOrder(response.data);
        await fetchOrder();
    }
}

// Update Status Order

function updateDisplayStatusOrder(item) {

    // Section 1
    let status_color;
    if (item.status.toLowerCase() == 'belum diproses') {status_color = '#fc8f8f';}
    else if (item.status.toLowerCase() == 'diproses') {status_color = '#d3cf05';}
    else if (item.status.toLowerCase() == 'selesai') {status_color = '#58ce58';}
    const status_container_1 = document.getElementById(`orderlist-status-${item.id_pesanan}`);
    status_container_1.setAttribute('style', `background-color: ${status_color};`);
    status_container_1.innerHTML = item.status;
    
    // Section 2
    const status_container_2 = document.getElementById(`detail-col-value-${item.id_pesanan}`);
    status_container_2.innerHTML = item.status;
}

// Hapus order

async function deleteOrder(near) {
    const id_pesanan = near.closest('.orderlist-container-show-detail').id.split('-')[1];
    
    const delete_order_url = `${api}/delete_order`;
    const headers = {'Content-Type':'application/json'};
    const data = {
        'method'  : 'POST',
        'mode'    : 'cors',
        'headers' : headers,
        'body'    : JSON.stringify({'id_pesanan':id_pesanan})
    };
    const req = await fetch(delete_order_url, data);
    const response = await req.json();
    console.log(response);

    if (response.status == 'success') {
        await fetchOrder();
        document.getElementById(id_pesanan).remove();
        document.getElementById('right-panel').innerHTML = '';
    }
}