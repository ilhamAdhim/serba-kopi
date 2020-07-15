AOS.init();
// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../service-worker.js')
            .then(function () {
                console.log('Pendaftaran ServiceWorker berhasil');
            })
            .catch(function () {
                console.log('Pendaftaran ServiceWorker gagal');
            });
    })
} else {
    console.log("ServiceWorker belum didukung browser ini.")
}

document.addEventListener("DOMContentLoaded", () => {
    // Activate sidebar nav
    let elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                // Muat daftar tautan menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                // Daftarkan event listener untuk setiap tautan menu
                document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
                    elm.addEventListener("click", function (event) {
                        // Tutup sidenav
                        let sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        // Muat konten halaman yang dipanggil
                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });
                });
            }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }


    // Load page content
    let page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);

    function loadPage(page) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                let content = document.querySelector("#body-content");
                if (this.status === 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status == 404) {
                    // Jika user online, tapi file html tidak ada di server
                    content.innerHTML = `
                    <div class="container" style="height:80vh"> 
                        <div class="center"> 
                            <h1> 404 Not Found </h1>
                            Halaman tidak ditemukan
                        </div>
                    </div>
                    `;
                } else {
                    // Jika user offline
                    content.innerHTML = `
                    <div class="container" style="height:80vh"> 
                        <div class="center">
                        <img src="../images/offline.png"> <br>
                            Anda sedang offline
                        </div>
                    </div>`;
                }
            }
        };
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();
    }
});
