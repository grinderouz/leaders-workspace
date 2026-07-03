document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar-container");

    if (!navbarContainer) return;

    navbarContainer.innerHTML = `
        <header class="navbar-header">
            <div class="navbar-top-row">
                <div style="display: flex; align-items: center; gap: 13px;">
                    <a href="index.html">
                        <img src="assets/navicon.png" alt="navicon" class="navbar-favicon" onerror="this.style.display='none';">
                    </a>
                    <a href="index.html" class="navbar-logo-title">
                        <img src="logo.png" alt="Logo" class="navbar-logo" onerror="this.style.display='none';">
                        <span class="navbar-title">GLW - Grinderouz Leaders Workspace</span>
                    </a>
                </div>
                <button class="hamburger" id="hamburger-menu" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <nav class="navbar-links" id="navbar-links">
                <a href="index.html" class="nav-link">RULES & RANKS</a>
                <a href="messages.html" class="nav-link">MESSAGES</a>
                <a href="faq.html" class="nav-link">PLAYBOOK FAQ</a>
                <a href="management.html" class="nav-link">MANAGEMENT</a>
            </nav>
        </header>
        <style>
            #navbar-container {
                position: sticky;
                top: 0;
                z-index: 1000;
                background: transparent;
                width: 100%;
            }
            .navbar-header {
                background: #111111;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                padding: 15px 20px;
                border-bottom: 1px solid #222;
                display: flex;
                flex-direction: column;
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
                height: 36px;
                width: 36px;
                margin-right: 8px;
                border-radius: 6px;
                border: 1px solid none;
            }
            .navbar-logo-title {
                display: flex;
                align-items: center;
                text-decoration: none;
            }
            .navbar-logo {
                background: #191919;
                border-radius: 6px;
                border: 1px solid #333;
                height: 36px;
                width: 36px;
                margin-right: 12px;
                vertical-align: middle;
            }
            .navbar-title {
                font-size: 1.2rem;
                font-weight: 600;
                letter-spacing: 0.5px;
                vertical-align: middle;
                color: #eeeeee;
                font-family: 'Segoe UI', Roboto, Helvetica, sans-serif;
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
                width: 28px;
                height: 20px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
            }
            .hamburger span {
                width: 100%;
                height: 2px;
                background-color: #dddddd;
                border-radius: 2px;
                transition: all 0.3s ease;
            }
            .hamburger.active span:nth-child(1) {
                transform: translateY(9px) rotate(45deg);
            }
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            .hamburger.active span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg);
            }
            .navbar-links {
                display: none;
                flex-direction: column;
                width: 100%;
                margin-top: 15px;
                gap: 8px;
            }
            .navbar-links.show {
                display: flex;
            }
            .nav-link {
                text-decoration: none;
                background: transparent;
                color: #aaaaaa;
                font-size: 0.95rem;
                font-weight: 600;
                font-family: 'Segoe UI', Roboto, sans-serif;
                padding: 10px 16px;
                border-radius: 6px;
                text-align: center;
                transition: all 0.2s ease;
                display: block;
                letter-spacing: 0.5px;
                border: 1px solid transparent;
                position: relative;
            }
            .nav-link:hover, .nav-link:focus, .nav-link.active {
                background: #1a1a1a;
                color: #d4af37;
                border: 1px solid #333;
            }
            .nav-badge {
                display: inline-block;
                vertical-align: middle;
                margin-left: 6px;
                margin-bottom: 2px;
                width: 18px;
                height: 18px;
                object-fit: contain;
            }
            @media (min-width: 700px) {
                .navbar-header {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 30px;
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
                    font-size: 1.4rem;
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
                    gap: 10px;
                }
                .nav-link {
                    display: inline-block;
                    padding: 8px 14px;
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

    // Universal PWA Navigation Handler (Fixes Windows, Android, and iOS Safari)
    // Prevents installed PWAs from popping out into external browser tabs
    document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a');
        if (!anchor || !anchor.href) return;

        // Check if the link points to an internal HTML page on the same domain
        const targetUrl = new URL(anchor.href, window.location.href);
        const isInternal = targetUrl.origin === window.location.origin;
        const isExternalTab = anchor.getAttribute('target') === '_blank';

        if (isInternal && !isExternalTab && !anchor.hasAttribute('download')) {
            // Close mobile hamburger menu if open
            navLinks?.classList.remove('show');
            hamburger?.classList.remove('active');

            // Force navigation inside the current PWA window frame
            event.preventDefault();
            window.location.href = anchor.href;
        }
    });

    function updateNavbarBadge() {
        const totalMessages = Number(localStorage.getItem('glw_messages_total')) || 1;
        const readList = JSON.parse(localStorage.getItem('glw_read_messages')) || [];
        const deleteList = JSON.parse(localStorage.getItem('glw_deleted_messages')) || [];
        const unreadCount = Math.max(0, totalMessages - readList.filter(id => !deleteList.includes(id)).length - deleteList.length);

        const messageLinks = document.querySelectorAll('#navbar-container a[href*="messages.html"], nav a[href*="messages.html"]');
        messageLinks.forEach(link => {
            link.querySelectorAll('.nav-badge').forEach(badge => badge.remove());
            link.querySelectorAll('span').forEach(span => {
                if (
                    (span.classList && span.classList.contains('nav-badge')) ||
                    span.textContent.trim() === '!' || span.textContent.trim() === ' !'
                ) {
                    span.remove();
                }
            });
            if (unreadCount > 0) {
                const badgeImg = document.createElement('img');
                badgeImg.className = 'nav-badge';
                badgeImg.src = 'assets/notified.png';
                badgeImg.alt = '!';
                badgeImg.title = 'Unread messages';
                link.appendChild(badgeImg);
            }
        });
    }

    window.updateNavbarBadge = updateNavbarBadge;
    updateNavbarBadge();
});