const api ='http://127.0.0.1:3003'; // Change This
let id_invoice = '';
let response_data = {"status":"failed"};

const response = {
    "status"  : "success",
    "message" : "",
    "data"    : {
        "id_pesanan" : "A042710001",
        "meja"       : "A4",
        "timestamp"  : 1733239704,
        "payment"    : "Cash",
        "pesanan"    : [
            {
                "id_menu":"GRB0000001",
                "name":"Gurame Bakar Madu",
                "count":1,
                "price":40000
            },
            {
                "id_menu":"KWT0000001",
                "name":"Kwetiau Goreng Telur Orak-Arik",
                "count":2,
                "price":20000
            },
        ],
        "total_price" : 80000
    }
};

// Set id_pesanan

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('id')) {
    id_invoice = urlParams.get('id');
}

// Format Uang

function formatUang(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format Time

function formatEpochTime(epochTime) {
    const date = new Date(epochTime * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() dimulai dari 0
    const year = date.getFullYear();
    return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

// Fetch Data

async function fetchInvoice() {
    try {
        const url = `${api}/get_invoice?id=${id_invoice}`;
        const response = await fetch(url);
        response_data = await response.json();
    }
    catch (error) {
        console.error('Error fetching invoice :', error);
    }
}

// Display Data

function displayInvoice() {
    if (response_data.status == 'success') {
        displaySuccess()
    }
    
}

function displaySuccess() {
    const main_container = document.getElementById('main-container');

    // ID Pesanan
    const code_container = document.createElement('div');
    code_container.className = 'code-container';
    code_container.innerHTML = `
        <span class="id-pesanan">${response_data.data.id_pesanan}</span>
        <span class="status-pesanan">Pesanan Berhasil<i class="fa-solid fa-check"></i></span>`;
    main_container.appendChild(code_container);

    // Invoice
    const invoice_container = document.createElement('div');
    invoice_container.className = 'invoice-container';
    invoice_container.innerHTML = `
        <div class="box-invoice-container">
            <span class="item-invoice-title">Detail Pesanan</span>
            <div id="detail-pesanan" class="item-invoice-container detail">
                <div class="item-invoice-row-detail">
                    <span class="name">Meja</span>
                    <span class="value">${response_data.data.meja}</span>
                </div>
                <div class="item-invoice-row-detail">
                    <span class="name">Waktu</span>
                    <span class="value">${formatEpochTime(response_data.data.timestamp)}</span>
                </div>
                <div class="item-invoice-row-detail">
                    <span class="name">Pembayaran</span>
                    <span class="value">${response_data.data.payment}</span>
                </div>
            </div>
        </div>
        <div class="box-invoice-container">
            <span class="item-invoice-title">Ringkasan Pembayaran</span>
            <div id="ringkasan-pembayaran" class="item-invoice-container ringkasan"></div>
        </div>`;
    main_container.appendChild(invoice_container);

    // Pesanan
    const pesanan_container = document.getElementById('ringkasan-pembayaran');
    response_data.data.pesanan.forEach((item) => {
        const new_pesanan = document.createElement('div');
        new_pesanan.id = item.id_menu;
        new_pesanan.className = 'item-invoice-row-ringkasan';
        new_pesanan.innerHTML = `
            <span class="name">${item.name}</span>
            <span class="count">x${item.count}</span>
            <span class="value">Rp ${formatUang(item.price * item.count)}</span>`;
        pesanan_container.appendChild(new_pesanan);
    });
    const total_pesanan = document.createElement('div');
    total_pesanan.className = 'item-invoice-row-total';
    total_pesanan.innerHTML = `<span>Total Rp ${formatUang(response_data.data.total_price)}</span>`;
    pesanan_container.appendChild(total_pesanan);

    // Footer
    const footer_container = document.createElement('div');
    footer_container.className = 'footer-container';
    footer_container.innerHTML = `<span class="warning-text">Tunjukkan Kode ke Kasir<br>Kemudian Lakukan Pembayaran</span>`;
    main_container.appendChild(footer_container);
}

// Initiator

async function main() {
    await fetchInvoice();
    displayInvoice();
}

main();