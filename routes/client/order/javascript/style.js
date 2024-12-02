// Sticky Header (Background Image)

const list_background = [
    "../assets/background/layout_1_edit.jpg",
    "../assets/background/layout_2_edit.jpg",
    "../assets/background/layout_3_edit.jpg",
    "../assets/background/layout_4_edit.jpg",
]

function setHeader() {
    const image_container = document.getElementById('image-container');
    const dot_container = document.getElementById('dot-container');
    list_background.forEach((item) => {
        const new_image = document.createElement('div');
        new_image.className = 'image-header-container';
        new_image.innerHTML = `<img src="${item}">`;
        image_container.appendChild(new_image);
        const new_dot = document.createElement('div');
        new_dot.className = 'dot-item';
        dot_container.appendChild(new_dot);
    });
}

setHeader();

window.addEventListener('scroll', function () {
    const header = document.querySelector('.header-container');
    const maxHeight = 160;
    const minHeight = 60;
    const scrollThreshold = 170;
    const scrollY = Math.min(window.scrollY, scrollThreshold);
    const newHeight = maxHeight - (scrollY / scrollThreshold) * (maxHeight - minHeight);
    header.style.height = `${Math.max(newHeight, minHeight)}px`;
});

// Sticky Nomor Meja

window.addEventListener("scroll", function () {
    const mejaContainer = document.querySelector(".nomor-meja-container");

    const maxHeight = 26;        // Tinggi awal
    const minHeight = 20;        // Tinggi akhir
    const maxTop = 14;           // Top awal
    const minTop = 0;            // Top akhir
    const maxRight = 14;         // Right awal
    const minRight = 0;          // Right akhir
    const maxFontSize = 100;     // Font size awal (%)
    const minFontSize = 80;      // Font size akhir (%)
    const scrollThreshold = 170; // Batas scroll untuk transisi penuh

    const scrollY = Math.min(window.scrollY, scrollThreshold);
    const progress = scrollY / scrollThreshold; // Progress 0 (awal) ke 1 (akhir)

    // Hitung nilai baru untuk setiap properti
    const newHeight = maxHeight - progress * (maxHeight - minHeight);
    const newTop = maxTop - progress * (maxTop - minTop);
    const newRight = maxRight - progress * (maxRight - minRight);
    const newFontSize = maxFontSize - progress * (maxFontSize - minFontSize);

    const newBorderRadiusTopLeft = 6 - progress * 6;     // Dari 6px ke 0px
    const newBorderRadiusTopRight = 6 - progress * 6;    // Dari 6px ke 0px
    const newBorderRadiusBottomLeft = 6;                 // Tetap 6px
    const newBorderRadiusBottomRight = 6 - progress * 6; // Dari 6px ke 0px

    // Terapkan nilai ke elemen
    mejaContainer.style.height = `${newHeight}px`;
    mejaContainer.style.top = `${newTop}px`;
    mejaContainer.style.right = `${newRight}px`;
    mejaContainer.style.fontSize = `${newFontSize}%`;

    mejaContainer.style.borderRadius = `${newBorderRadiusTopLeft}px ${newBorderRadiusTopRight}px ${newBorderRadiusBottomRight}px ${newBorderRadiusBottomLeft}px`;
});

// Slider Background

const scroller = document.querySelector('.scroller-image-container');
const dots = document.querySelectorAll('.dot-item');

function updateDots() {
    const scrollPosition = scroller.scrollLeft;
    const containerWidth = scroller.clientWidth;
    const activeIndex = Math.round(scrollPosition / containerWidth);

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

scroller.addEventListener('scroll', updateDots);

updateDots();

// Refresh

window.onload = function() {
    window.scrollTo(0, 0);
};