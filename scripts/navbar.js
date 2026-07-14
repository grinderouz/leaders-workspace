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
                
                <div class="nav-link dropdown" tabindex="0">
                    ONLINE
                    <svg class="dropdown-caret" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true" focusable="false" style="margin-left:6px; vertical-align: middle;">
                        <path d="M4.646 6.646a.5.5 0 0 1 .708 0L8 9.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z" fill="#8a8578"/>
                    </svg>
                    <div class="dropdown-menu">
                        <a href="subscribers.html" class="dropdown-link">Subscriptions</a>
                        <a href="sub-spinner.html" class="dropdown-link">Magic Wheel</a>
                    </div>
                </div>
                
                <a href="messages.html" class="nav-link">MESSAGES</a>
                <a href="faq.html" class="nav-link">PLAYBOOK FAQ</a>
                <a href="management.html" class="nav-link">MANAGEMENT</a>
            </nav>
        </header>
        <style>
            :root {
                --skyrim-obsidian: #080808;
                --skyrim-iron: #121212;
                --skyrim-plate: #1c1a17;
                --skyrim-border: #383428;
                --skyrim-gold: #c5a059;
                --skyrim-gold-bright: #e6ca65;
                --skyrim-silver: #c0c0c0;
                --skyrim-text-muted: #8a8578;
            }
            #navbar-container {
                position: sticky;
                top: 0;
                z-index: 1000;
                background: transparent;
                width: 100%;
            }
            .navbar-header {
                background: linear-gradient(180deg, #141414 0%, var(--skyrim-obsidian) 100%);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.85), 0 1px 0 rgba(197, 160, 89, 0.2);
                padding: 15px 20px;
                border-bottom: 2px solid var(--skyrim-border);
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
                font-weight: 700;
                letter-spacing: 2.5px;
                text-transform: uppercase;
                vertical-align: middle;
                color: var(--skyrim-silver);
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9), 0 0px 1px #c5a059;
                font-family: Georgia, 'Times New Roman', serif;
                /* Skyrim-like look: use all-caps, more spacing, bold, high contrast serif, and shadow */
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
                background-color: var(--skyrim-gold);
                border-radius: 0;
                transition: all 0.3s ease;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
            }
            .hamburger.active span:nth-child(1) {
                transform: translateY(9px) rotate(45deg);
                background-color: var(--skyrim-gold-bright);
            }
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            .hamburger.active span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg);
                background-color: var(--skyrim-gold-bright);
            }
            .navbar-links {
                display: none;
                flex-direction: column;
                width: 100%;
                margin-top: 15px;
                gap: 6px;
            }
            .navbar-links.show {
                display: flex;
            }
            .nav-link {
                text-decoration: none;
                background: transparent;
                color: var(--skyrim-text-muted);
                font-size: 0.95rem;
                font-weight: 700;
                font-family: Georgia, 'Times New Roman', serif;
                letter-spacing: 2.5px;
                text-transform: uppercase;
                padding: 10px 16px;
                border-radius: 1px;
                text-align: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: block;
                border: 1px solid transparent;
                position: relative;
                cursor: pointer;
                outline: none;
                text-shadow: 0 2px 4px rgba(0,0,0,0.8), 0 0 2px #e6ca65;
            }
            .nav-link:hover, .nav-link:focus, .nav-link.active {
                background: linear-gradient(90deg, var(--skyrim-plate) 0%, var(--skyrim-iron) 100%);
                color: var(--skyrim-gold-bright);
                border: 1px solid var(--skyrim-border);
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
                text-shadow: 0 0 10px #ffe580, 0 2px 7px rgba(230, 202, 101, 0.25);
            }
            .nav-link:hover .dropdown-caret path,
            .nav-link:focus .dropdown-caret path,
            .nav-link.active .dropdown-caret path {
                fill: var(--skyrim-gold-bright);
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
            .dropdown {
                position: relative;
                user-select: none;
            }
            .dropdown-caret {
                transition: transform 0.21s cubic-bezier(.45,.05,.55,.95);
            }
            .dropdown.open > .dropdown-caret {
                transform: rotate(180deg);
            }
            .dropdown-menu {
                display: none;
                position: absolute;
                left: 0;
                top: calc(100% + 6px);
                background: var(--skyrim-obsidian);
                border: 1px solid var(--skyrim-border);
                border-radius: 1px;
                min-width: 220px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.95), inset 0 0 15px rgba(0,0,0,0.8);
                z-index: 40;
                flex-direction: column;
                gap: 2px;
                opacity: 0;
                pointer-events: none;
                transform: translateY(-8px);
                transition: opacity 0.22s cubic-bezier(.45,.05,.55,.95), 
                            transform 0.22s cubic-bezier(.45,.05,.55,.95);
                padding: 4px;
            }
            .dropdown.open .dropdown-menu,
            .dropdown:focus-within .dropdown-menu {
                display: flex;
                opacity: 1;
                pointer-events: auto;
                transform: translateY(0);
            }
            .dropdown-link {
                background: transparent;
                color: var(--skyrim-text-muted);
                padding: 10px 16px;
                text-align: left;
                text-decoration: none;
                font-size: 0.92rem;
                font-weight: 700;
                letter-spacing: 2px;
                text-transform: uppercase;
                border: 1px solid transparent;
                border-radius: 1px;
                transition: all 0.17s ease;
                outline: none;
                font-family: Georgia, 'Times New Roman', serif;
                text-shadow: 0 1px 2px #c0c0c0;
            }
            .dropdown-link:hover, .dropdown-link:focus {
                background: var(--skyrim-plate);
                color: var(--skyrim-gold-bright);
                border: 1px solid var(--skyrim-border);
                text-shadow: 0 0 5px rgba(230, 202, 101, 0.3), 0 0 2px #e6ca65;
            }
            @media (max-width: 699px) {
                .navbar-links {
                    flex-direction: column;
                }
                .dropdown-menu {
                    position: static;
                    min-width: 0;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
                    border-radius: 0;
                    border-left: 2px solid var(--skyrim-gold);
                    border-right: none;
                    border-top: none;
                    border-bottom: none;
                    width: 100%;
                    margin-top: 4px;
                    background: #0d0c0a;
                }
                .dropdown-link {
                    width: 100%;
                    padding-left: 24px;
                }
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
                    font-size: 1.3rem;
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
                    gap: 8px;
                }
                .nav-link {
                    display: inline-block;
                    padding: 8px 14px;
                }
                .dropdown-menu {
                    left: 0;
                    right: auto;
                    top: calc(100% + 6px);
                    min-width: 220px;
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

    const dropdownEl = navbarContainer.querySelector('.dropdown');
    const dropdownMenu = dropdownEl?.querySelector('.dropdown-menu');

    if (dropdownEl && dropdownMenu) {
        let dropdownHovered = false;
        let dropdownHasFocus = false;

        const openDropdown = () => dropdownEl.classList.add("open");
        const closeDropdown = () => dropdownEl.classList.remove("open");

        dropdownEl.addEventListener('mouseenter', () => {
            dropdownHovered = true;
            openDropdown();
        });

        dropdownEl.addEventListener('mouseleave', () => {
            dropdownHovered = false;
            setTimeout(() => {
                if (!dropdownHasFocus) closeDropdown();
            }, 120);
        });

        dropdownEl.addEventListener('focusin', () => {
            dropdownHasFocus = true;
            openDropdown();
        });

        dropdownEl.addEventListener('focusout', () => {
            dropdownHasFocus = false;
            setTimeout(() => {
                if (!dropdownHovered) closeDropdown();
            }, 120);
        });

        dropdownEl.addEventListener('touchstart', (e) => {
            if (!dropdownEl.classList.contains("open")) {
                openDropdown();
                e.preventDefault();
            }
        });

        document.addEventListener('click', (e) => {
            if (!dropdownEl.contains(e.target)) closeDropdown();
        });
    }

    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('active');
            }
        }
    });

    document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a');
        if (!anchor || !anchor.href) return;

        const targetUrl = new URL(anchor.href, window.location.href);
        const isInternal = targetUrl.origin === window.location.origin;
        const isExternalTab = anchor.getAttribute('target') === '_blank';

        if (isInternal && !isExternalTab) {
            navLinks?.classList.remove('show');
            hamburger?.classList.remove('active');
        }
    });

    function updateNavbarBadge() {
        const totalMessages = Number(localStorage.getItem('glw_messages_total')) || 1;
        const readList = JSON.parse(localStorage.getItem('glw_read_messages')) || [];
        const deleteList = JSON.parse(localStorage.getItem('glw_deleted_messages')) || [];
        const unreadCount = Math.max(
            0,
            totalMessages -
                readList.filter(id => !deleteList.includes(id)).length -
                deleteList.length
        );

        const messageLinks = document.querySelectorAll('#navbar-container a[href*="messages.html"], nav a[href*="messages.html"]');
        messageLinks.forEach(link => {
            link.querySelectorAll('.nav-badge').forEach(badge => badge.remove());
            link.querySelectorAll('span').forEach(span => {
                if (
                    (span.classList && span.classList.contains('nav-badge')) ||
                    span.textContent.trim() === '!' ||
                    span.textContent.trim() === ' !'
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