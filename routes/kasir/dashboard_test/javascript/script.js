document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const mainContent = document.getElementById("main-content");
  
    // Fungsi untuk memuat konten dinamis
    async function loadContent(url) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = text;
  
        // Ambil konten dari ID tertentu
        const newContent = tempDiv.querySelector("#main-content");
        if (newContent) {
          mainContent.innerHTML = newContent.innerHTML;
  
          // Update URL tanpa reload
          window.history.pushState({}, "", url);
        }
      } catch (error) {
        console.error("Error loading content:", error);
      }
    }
  
    // Event listener untuk navigasi
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
  
        // Hapus active class dari semua link
        navLinks.forEach(nav => nav.classList.remove("active"));
  
        // Tambahkan active class ke link yang diklik
        link.classList.add("active");
  
        // Muat konten dari file yang sesuai
        const page = link.getAttribute("href") + ".html";
        loadContent(page);
      });
    });
  });
  