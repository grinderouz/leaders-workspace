document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar-container");

    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <header class="navbar-header">
                <div class="navbar-top-row">
                    <a href="index.html">
                        <img src="assets/navicon.png" alt="navicon" class="navbar-favicon" onerror="this.style.display='none';">
                    </a>
                    <a href="index.html" class="navbar-logo-title">
                        <img src="logo.png" alt="Logo" class="navbar-logo" onerror="this.style.display='none';">
                        <span class="navbar-title">GLW - Grinderouz Leaders Workspace</span>
                    </a>
                    <button class="hamburger" id="hamburger-menu" aria-label="Toggle navigation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <nav class="navbar-links" id="navbar-links">
                    <a href="index.html" class="nav-link">Rules & Ranks</a>
                    <a href="faq.html" class="nav-link">PlayBook FAQ</a>
                    <a href="database.html" class="nav-link">Google Forms</a>
                    <a href="https://grinderouz.github.io/clan/" class="nav-link">Home Site</a>
                </nav>
            </header>
            <style>
                #navbar-container {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    background: #1a1a1a;
                    width: 100%;
                }
                .navbar-header {
                    box-shadow: 0 4px 10px rgba(0,0,0,0.18);
                    padding: 15px 20px;
                    border-radius: 0 0 10px 10px;
                    margin-bottom: 24px;
                    border-bottom: 2px solid #d4af37;
                    display: flex;
                    flex-direction: column;
                    background: #1a1a1a;
                    position: sticky;
                    top: 0;
                    z-index: 1100;
                }
                .navbar-top-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    gap: 16px;
                }
                .navbar-favicon {
                    display: inline-block;
                    height: 32px;
                    width: 32px;
                    margin-right: 8px;
                    border-radius: 6px;
                }
                .navbar-logo-title {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                }
                .navbar-logo {
                    background: #191919;
                    border-radius: 8px;
                    border: 1px solid #2a2a2a;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.24);
                    height: 32px;
                    width: 32px;
                    margin-right: 12px;
                    vertical-align: middle;
                }
                .navbar-title {
                    font-size: 1.2rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    vertical-align: middle;
                    color: #d4af37;
                }
                @media (max-width: 699px) {
                    .navbar-title,
                    .navbar-logo {
                        display: none !important;
                    }
                    .navbar-logo-title {
                        padding: 0;
                        margin: 0;
                    }
                    .navbar-favicon {
                        margin-right: 0;
                    }
                }
                .hamburger {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 25px;
                    height: 18px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                }
                .hamburger span {
                    width: 100%;
                    height: 2px;
                    background-color: #d4af37;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }
                .hamburger.active span:nth-child(1) {
                    transform: translateY(8px) rotate(45deg);
                }
                .hamburger.active span:nth-child(2) {
                    opacity: 0;
                }
                .hamburger.active span:nth-child(3) {
                    transform: translateY(-8px) rotate(-45deg);
                }
                .navbar-links {
                    display: none;
                    flex-direction: column;
                    width: 100%;
                    margin-top: 15px;
                    gap: 12px;
                }
                .navbar-links.show {
                    display: flex;
                }
                .nav-link {
                    text-decoration: none;
                    color: #d4af37;
                    font-size: 1.1rem;
                    font-weight: 500;
                    border-bottom: 2px solid transparent;
                    padding-bottom: 4px;
                    transition: border 0.2s, color 0.2s;
                    display: block;
                }
                .nav-link:hover, .nav-link:focus, .nav-link.active {
                    color: #fff;
                    border-bottom: 2px solid #d4af37;
                }
                @media (min-width: 700px) {
                    .navbar-header {
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        padding: 20px 28px 14px 28px;
                        /* keep sticky and top/z-index on desktop */
                        position: sticky;
                        top: 0;
                        z-index: 1100;
                    }
                    .navbar-top-row {
                        width: auto;
                    }
                    .navbar-favicon {
                        height: 40px;
                        width: 40px;
                    }
                    .navbar-logo {
                        height: 40px;
                        width: 40px;
                        margin-right: 12px;
                        display: inline-block;
                    }
                    .navbar-title {
                        font-size: 2rem;
                        letter-spacing: 1.5px;
                        display: inline-block;
                    }
                    .hamburger {
                        display: none;
                    }
                    .navbar-links {
                        display: flex;
                        flex-direction: row;
                        margin-top: 0;
                        width: auto;
                        gap: 20px;
                    }
                }
            </style>
        `;

        const hamburger = document.getElementById("hamburger-menu");
        const navLinks = document.getElementById("navbar-links");

        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("show");
                hamburger.classList.toggle("active");
            });
        }

        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }
});