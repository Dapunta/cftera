let pesanan = {};

function addButton(child) {
    const parentElement = child.closest('.produk-menu-diskon') || child.closest('.produk-menu-reguler');
    const idMenu = parentElement.id;
    const list_same_menu = getSameID(idMenu);

    const priceElement = parentElement.querySelector('.price');
    const price = parseInt(priceElement.textContent.replace(/[^\d]/g, ''), 10);

    if (!pesanan[idMenu] || pesanan[idMenu].count === 0) {
        pesanan[idMenu] = { count: 1, price: price };
    }

    list_same_menu.forEach((item) => {
        changeToCounter(item, idMenu);
    });

    updateFooter();
}

function getSameID(id) {
    const same_id = document.querySelectorAll(`#${id} .add-button-container`);
    return(same_id);
}

function changeToCounter(container, idMenu) {
    container.innerHTML = `
        <button type="button" class="decrement-button" onclick="decrementItem(this)">-</button>
        <span class="count">${pesanan[idMenu].count}</span>
        <button type="button" class="increment-button" onclick="incrementItem(this)">+</button>
    `;
}

function decrementItem(child) {
    const parentElement = child.closest('.produk-menu-diskon') || child.closest('.produk-menu-reguler');
    const idMenu = parentElement.id;
    const list_same_menu = getSameID(idMenu);

    if (pesanan[idMenu].count > 1) {
        pesanan[idMenu].count--;
        list_same_menu.forEach((item) => {
            const parentButton = item.closest('.add-button-container');
            parentButton.querySelector('.count').textContent = pesanan[idMenu].count;
        });
    }
    else {
        delete pesanan[idMenu];
        list_same_menu.forEach((item) => {
            item.innerHTML = `<button type="button" class="add-button" onclick="addButton(this)">Add</button>`;
        });
    }

    updateFooter();
}

function incrementItem(child) {
    const parentElement = child.closest('.produk-menu-diskon') || child.closest('.produk-menu-reguler');
    const idMenu = parentElement.id;
    const list_same_menu = getSameID(idMenu);

    pesanan[idMenu].count++;

    list_same_menu.forEach((item) => {
        const parentButton = item.closest('.add-button-container');
        parentButton.querySelector('.count').textContent = pesanan[idMenu].count;
    });

    updateFooter();
}

function updateFooter() {
    const totalItem = Object.values(pesanan).reduce((sum, item) => sum + item.count, 0);
    const totalPrice = Object.values(pesanan).reduce((sum, item) => sum + (item.count * item.price), 0);

    const footerContainer = document.querySelector('.footer-container');
    const totalItemText = footerContainer.querySelector('.total-item');
    const totalPriceText = footerContainer.querySelector('.total-price');

    totalItemText.textContent = `Lihat ${totalItem} Item`;
    totalPriceText.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;

    if (totalItem > 0) {
        footerContainer.className = 'footer-container active';
    }
    else {
        footerContainer.className = 'footer-container inactive';
    }
}