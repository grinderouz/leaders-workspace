(function () {
    let html2canvasPromise = null;

    const VIEW_PROFILE_BG = "#232323";
    const PROFILE_PANEL_BG = "#232323";

    function getThemeProfileColors() {
        const fallback = {
            accent: "#d4af37",
            text: "#ffffff",
            muted: "#b48808"
        };
        if (!document.body) return fallback;

        const text = getComputedStyle(document.body).color || fallback.text;

        let accent = fallback.accent;
        const accentEl = document.querySelector("h1, h2, .navbar-title");
        if (accentEl) {
            const c = getComputedStyle(accentEl).color;
            if (c && c !== "rgba(0, 0, 0, 0)") accent = c;
        }

        let muted = fallback.muted;
        const mutedEl = document.querySelector(".desc, .theme-card-desc, h3");
        if (mutedEl) {
            const c = getComputedStyle(mutedEl).color;
            if (c) muted = c;
        }

        return { accent, text, muted };
    }

    function applyViewProfileColors(panel, colors) {
        if (!panel || !colors) return;
        panel.style.background = VIEW_PROFILE_BG;
        panel.style.color = colors.text;
        panel.style.setProperty("--profile-view-accent", colors.accent);
        panel.style.setProperty("--profile-view-text", colors.text);
        panel.style.setProperty("--profile-view-muted", colors.muted);
        panel.querySelectorAll(".profile-view-accent").forEach(function (el) {
            el.style.color = colors.accent;
        });
        panel.querySelectorAll(".profile-view-text").forEach(function (el) {
            el.style.color = colors.text;
        });
        panel.querySelectorAll(".profile-view-muted").forEach(function (el) {
            el.style.color = colors.muted;
        });
        const shareIcon = panel.querySelector(".profile-view-share-btn svg");
        if (shareIcon) shareIcon.setAttribute("stroke", colors.accent);
    }

    function loadHtml2Canvas() {
        if (window.html2canvas) return Promise.resolve(window.html2canvas);
        if (html2canvasPromise) return html2canvasPromise;
        html2canvasPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
            script.onload = () => resolve(window.html2canvas);
            script.onerror = () => reject(new Error("Failed to load html2canvas"));
            document.head.appendChild(script);
        });
        return html2canvasPromise;
    }

    function injectProfileButtons() {
        if (document.getElementById("profile-btn-panel-wrapper")) return;

        const btnWrapper = document.createElement("div");
        btnWrapper.id = "profile-btn-panel-wrapper";
        btnWrapper.style.cssText = `
            position: fixed;
            right: 26px;
            bottom: 30px;
            z-index: 12003;
            display: flex;
            gap: 13px;
            background: rgba(26, 26, 26, 0.86);
            border-radius: 14px;
            box-shadow: 0 3px 22px #000a, 0 1.5px 2px #0005;
            padding: 14px 19px;
            align-items: center;
            transition: background 0.22s;
        `;

        const btn = document.createElement("button");
        btn.id = "profile-btn-panel";
        btn.textContent = "Profile";
        btn.type = "button";
        btn.style.cssText = `
            background: #272727;
            color: #d4af37;
            border: 1.5px solid #d4af37;
            border-radius: 7px;
            padding: 8px 17px 8px 14px;
            font-size: 1em;
            font-family: inherit;
            box-shadow: 0 2px 12px #0006;
            cursor: pointer;
            outline: none;
            transition: background 0.18s, color 0.16s;
        `;
        btn.onmouseenter = () => btn.style.background = "#333";
        btn.onmouseleave = () => btn.style.background = "#272727";
        btn.onclick = openProfilePanel;
        btnWrapper.appendChild(btn);

        const viewBtn = document.createElement("button");
        viewBtn.id = "view-profile-btn-panel";
        viewBtn.textContent = "View Profile";
        viewBtn.type = "button";
        viewBtn.style.cssText = `
            background: #191919;
            color: #fff;
            border: 1.5px solid #d4af37;
            border-radius: 7px;
            padding: 8px 17px 8px 14px;
            font-size: 1em;
            font-family: inherit;
            box-shadow: 0 2px 12px #0006;
            cursor: pointer;
            outline: none;
            margin-left: 4px;
            transition: background 0.18s, color 0.16s;
        `;
        viewBtn.onmouseenter = () => viewBtn.style.background = "#232323";
        viewBtn.onmouseleave = () => viewBtn.style.background = "#191919";
        viewBtn.onclick = openViewProfilePanel;
        btnWrapper.appendChild(viewBtn);

        document.body.appendChild(btnWrapper);
    }

    function getCreationDate() {
        let stored = {};
        try {
            stored = JSON.parse(localStorage.getItem("profilePanel") || "{}");
        } catch (e) {}
        return stored.creationDate || null;
    }

    function formatCreationDate(dateString) {
        if (!dateString) return null;
        let date;
        if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
            // old format: YYYY-MM-DD HH:mm:ss
            date = new Date(dateString.replace(" ", "T"));
        } else if (!isNaN(Date.parse(dateString))) {
            date = new Date(dateString);
        } else {
            return dateString;
        }
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    }

    function getStoredProfile() {
        let stored = {};
        try {
            stored = JSON.parse(localStorage.getItem("profilePanel") || "{}");
        } catch (e) {}
        return {
            nickname: stored.nickname || "",
            clanTag: stored.clanTag || "",
            avatarUrl: stored.avatarUrl || "https://ui-avatars.com/api/?name=User&background=2d2d2d&color=d4af37&size=128",
            role: stored.role || "",
            discord: stored.discord || "",
            email: stored.email || "",
            creationDate: stored.creationDate || null
        };
    }

    function openProfilePanel() {
        if (document.getElementById("profile-panel-overlay")) return;

        const stored = getStoredProfile();
        const hasCreationDate = !!stored.creationDate;

        const overlay = document.createElement("div");
        overlay.id = "profile-panel-overlay";
        overlay.style.cssText = `
            position:fixed;inset:0;z-index:12010;
            background:rgba(0,0,0,0.66);
            display:flex;align-items:center;justify-content:center;
            animation:profilePanelFadeIn 0.14s;
        `;

        const panel = document.createElement("div");
        panel.className = "profile-panel-modal";
        panel.style.cssText = `
            background: ${PROFILE_PANEL_BG};
            color: #fff;
            border-radius: 12px;
            padding: 36px 28px 28px 28px;
            min-width: 320px;
            max-width: 94vw;
            min-height: 270px;
            box-shadow: 0 4px 40px #000A;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            position: relative;
        `;
        panel.style.setProperty("--profile-panel-input-bg", "#2a2a2a");
        panel.style.setProperty("--profile-panel-input-color", "#fff");

        const title = document.createElement("h2");
        title.textContent = "Profile Settings";
        title.style.cssText = "color: #d4af37; margin-bottom: 23px; font-size:1.3em; text-align:center;";

        const avatarPreview = document.createElement("img");
        avatarPreview.src = stored.avatarUrl || "https://ui-avatars.com/api/?name=User&background=2d2d2d&color=d4af37&size=128";
        avatarPreview.alt = "Avatar";
        avatarPreview.style.cssText = `
            display: block;
            margin: 0 auto 16px auto;
            width: 78px; height: 78px; border-radius: 50%;
            background: #111; object-fit: cover;
        `;

        const avatarLabel = document.createElement("label");
        avatarLabel.textContent = "Avatar Image URL";
        avatarLabel.style.cssText = "margin-bottom:4px;color:#d4af37;font-weight:500;";
        const avatarInput = document.createElement("input");
        avatarInput.type = "text";
        avatarInput.placeholder = "Paste image URL or leave blank for default";
        avatarInput.value = stored.avatarUrl === "https://ui-avatars.com/api/?name=User&background=2d2d2d&color=d4af37&size=128" ? "" : stored.avatarUrl;
        avatarInput.style.cssText = `
            width:100%; padding:10px; font-size:1em;
            margin-bottom:15px; border-radius:5px;
            border:1px solid #bab07c;
            background: var(--profile-panel-input-bg, #fff);
            color: var(--profile-panel-input-color, #111);
        `;
        avatarInput.addEventListener("input", function() {
            let url = avatarInput.value.trim();
            if (!url) url = "https://ui-avatars.com/api/?name=User&background=2d2d2d&color=d4af37&size=128";
            avatarPreview.src = url;
        });

        const nicknameLabel = document.createElement("label");
        nicknameLabel.textContent = "Your Nickname";
        nicknameLabel.style.cssText = "margin-bottom:4px;color:#d4af37;font-weight:500;";
        const nicknameInput = document.createElement("input");
        nicknameInput.type = "text";
        nicknameInput.placeholder = "e.g., ChiefSam";
        nicknameInput.value = stored.nickname;
        nicknameInput.style.cssText = `
            width:100%; padding:10px; font-size:1em;
            margin-bottom:15px; border-radius:5px;
            border:1px solid #bab07c;
            background: var(--profile-panel-input-bg, #fff);
            color: var(--profile-panel-input-color, #111);
        `;

        const clanTagLabel = document.createElement("label");
        clanTagLabel.textContent = "Your Clan Tag";
        clanTagLabel.style.cssText = "margin-bottom:4px;color:#d4af37;font-weight:500;";
        const clanTagInput = document.createElement("input");
        clanTagInput.type = "text";
        clanTagInput.placeholder = "#CLANTAG";
        clanTagInput.value = stored.clanTag;
        clanTagInput.style.cssText = `
            width:100%; padding:10px; font-size:1em;
            margin-bottom:15px; border-radius:5px;
            border:1px solid #bab07c;
            background: var(--profile-panel-input-bg, #fff);
            color: var(--profile-panel-input-color, #111);
        `;

        const discordLabel = document.createElement("label");
        discordLabel.textContent = "Discord Username";
        discordLabel.style.cssText = "margin-bottom:4px;color:#d4af37;font-weight:500;";
        const discordInput = document.createElement("input");
        discordInput.type = "text";
        discordInput.placeholder = "e.g., myusername#0000";
        discordInput.value = stored.discord;
        discordInput.style.cssText = `
            width:100%; padding:10px; font-size:1em;
            margin-bottom:15px; border-radius:5px;
            border:1px solid #bab07c;
            background: var(--profile-panel-input-bg, #fff);
            color: var(--profile-panel-input-color, #111);
        `;

        const emailLabel = document.createElement("label");
        emailLabel.textContent = "Email";
        emailLabel.style.cssText = "margin-bottom:4px;color:#d4af37;font-weight:500;";
        const emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.placeholder = "e.g., your@email.com";
        emailInput.value = stored.email;
        emailInput.style.cssText = `
            width:100%; padding:10px; font-size:1em;
            margin-bottom:15px; border-radius:5px;
            border:1px solid #bab07c;
            background: var(--profile-panel-input-bg, #fff);
            color: var(--profile-panel-input-color, #111);
        `;

        const roleLabel = document.createElement("label");
        roleLabel.textContent = "Select Role";
        roleLabel.style.cssText = "margin-bottom:4px;color:#d4af37;font-weight:500;";
        const roleSelect = document.createElement("select");
        roleSelect.style.cssText = `
            width:100%; padding:10px; font-size:1em;
            margin-bottom:20px; border-radius:5px;
            border:1px solid #bab07c;
            background: var(--profile-panel-input-bg, #fff);
            color: var(--profile-panel-input-color, #111);
        `;

        const emptyOpt = document.createElement("option");
        emptyOpt.value = "";
        emptyOpt.textContent = "Select a role...";
        roleSelect.appendChild(emptyOpt);

        const elderOpt = document.createElement("option");
        elderOpt.value = "Elder";
        elderOpt.textContent = "Elder";
        roleSelect.appendChild(elderOpt);

        const coleaderOpt = document.createElement("option");
        coleaderOpt.value = "Co-leader";
        coleaderOpt.textContent = "Co-leader";
        roleSelect.appendChild(coleaderOpt);

        const leaderOpt = document.createElement("option");
        leaderOpt.value = "Clan Leader";
        leaderOpt.textContent = "Clan Leader";
        roleSelect.appendChild(leaderOpt);

        roleSelect.value = (stored.role === "Elder" || stored.role === "Co-leader" || stored.role === "Clan Leader") ? stored.role : "";

        let leaderPincodeChecked = false;

        roleSelect.addEventListener('change', function () {
            if (roleSelect.value === 'Clan Leader' && !leaderPincodeChecked) {
                setTimeout(function () {
                    let pin = prompt('Enter Clan Leader Passcode:');
                    if (pin !== '1738') {
                        roleSelect.value = "";
                        alert("Incorrect pin code. Cannot select Clan Leader role.");
                    } else {
                        leaderPincodeChecked = true;
                    }
                }, 0);
            }
        });

        let creationDate = stored.creationDate || null;
        let creationDatePanelDiv = null;

        if (creationDate) {
            creationDatePanelDiv = document.createElement("div");
            creationDatePanelDiv.className = "profile-panel-creationdate";
            creationDatePanelDiv.style.cssText = "color:#aaa;font-size:0.97em;margin-bottom:12px;margin-top:-7px;text-align:right;font-style:italic;";
            creationDatePanelDiv.textContent = "Account Creation Date: " + formatCreationDate(creationDate);
        } else {
            const setCreationBtn = document.createElement("button");
            setCreationBtn.textContent = "Set Issue Date";
            setCreationBtn.type = "button";
            setCreationBtn.style.cssText = `
                background: #5fbc32;
                color: #fff;
                border: none;
                border-radius: 6px;
                font-size: 1em;
                padding: 7px 18px;
                font-weight: bold;
                margin-bottom: 13px;
                cursor: pointer;
                margin-top: -2px;
                align-self: flex-end;
            `;
            setCreationBtn.onclick = function () {
                if (creationDatePanelDiv || getCreationDate()) {
                    setCreationBtn.disabled = true;
                    setCreationBtn.style.display = "none";
                    return;
                }
                const now = new Date();
                const isoString = now.getFullYear() + '-' +
                    String(now.getMonth() + 1).padStart(2, '0') + '-' +
                    String(now.getDate()).padStart(2, '0') + ' ' +
                    String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0') + ':' +
                    String(now.getSeconds()).padStart(2, '0');
                let current = {};
                try { current = JSON.parse(localStorage.getItem("profilePanel") || "{}"); } catch(e){}
                if (!current.creationDate) {
                    current.creationDate = isoString;
                    localStorage.setItem("profilePanel", JSON.stringify(current));
                }
                setCreationBtn.style.display = "none";
                creationDatePanelDiv = document.createElement("div");
                creationDatePanelDiv.className = "profile-panel-creationdate";
                creationDatePanelDiv.style.cssText = "color:#aaa;font-size:0.97em;margin-bottom:12px;margin-top:-7px;text-align:right;font-style:italic;";
                creationDatePanelDiv.textContent = "Account Creation Date: " + formatCreationDate(isoString);
                setCreationBtn.parentNode.insertBefore(creationDatePanelDiv, setCreationBtn.nextSibling);
            };

            panel.appendChild(setCreationBtn);
        }
        if (creationDatePanelDiv) {
            panel.appendChild(creationDatePanelDiv);
        }

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex;justify-content:flex-end;gap:10px;";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.style.cssText = `
            background: #d4af37; color: #232323;
            border: none; border-radius: 6px; font-weight:bold;
            padding: 10px 22px; font-size:1em;
            cursor:pointer; transition:background 0.18s;
        `;
        saveBtn.onclick = function () {
            let avatarVal = avatarInput.value.trim();
            if (!avatarVal) {
                avatarVal = "https://ui-avatars.com/api/?name=User&background=2d2d2d&color=d4af37&size=128";
            }
            const selRole = roleSelect.value;
            if (selRole === "Clan Leader" && !leaderPincodeChecked) {
                let pin = prompt('Enter Clan Leader Passcode:');
                if (pin !== '1738') {
                    alert("Incorrect pin code. Cannot save as Clan Leader role.");
                    return;
                }
            }
            let old = {};
            try { old = JSON.parse(localStorage.getItem("profilePanel") || "{}"); } catch(e){}
            const data = {
                nickname: nicknameInput.value.trim(),
                clanTag: clanTagInput.value.trim(),
                avatarUrl: avatarVal,
                role: selRole,
                discord: discordInput.value.trim(),
                email: emailInput.value.trim()
            };
            if (old.creationDate) data.creationDate = old.creationDate;
            localStorage.setItem("profilePanel", JSON.stringify(data));
            closeProfilePanel();
        };

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.cssText = `
            background: #333; color: #fff;
            border: none; border-radius: 6px;
            padding: 10px 18px; font-size:1em;
            cursor:pointer; transition:background 0.16s;
        `;
        closeBtn.onclick = closeProfilePanel;

        panel.appendChild(title);
        panel.appendChild(avatarPreview);
        panel.appendChild(avatarLabel);
        panel.appendChild(avatarInput);
        panel.appendChild(nicknameLabel);
        panel.appendChild(nicknameInput);
        panel.appendChild(clanTagLabel);
        panel.appendChild(clanTagInput);
        panel.appendChild(discordLabel);
        panel.appendChild(discordInput);
        panel.appendChild(emailLabel);
        panel.appendChild(emailInput);
        panel.appendChild(roleLabel);
        panel.appendChild(roleSelect);
        btnRow.appendChild(saveBtn);
        btnRow.appendChild(closeBtn);
        panel.appendChild(btnRow);

        overlay.onclick = function(e) {
            if (e.target === overlay) closeProfilePanel();
        };

        function escListener(evt) {
            if (evt.key === "Escape") closeProfilePanel();
        }
        document.addEventListener("keydown", escListener);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        function closeProfilePanel() {
            overlay?.parentNode?.removeChild(overlay);
            document.removeEventListener("keydown", escListener);
        }
    }

    function openViewProfilePanel() {
        if (document.getElementById("view-profile-overlay")) return;
        const profile = getStoredProfile();

        let profileColors = getThemeProfileColors();

        const overlay = document.createElement("div");
        overlay.id = "view-profile-overlay";
        overlay.style.cssText = `
            position:fixed;inset:0;z-index:12011;
            background:rgba(0,0,0,0.77);
            display:flex;align-items:center;justify-content:center;
            animation:profilePanelFadeIn 0.18s;
        `;

        const panel = document.createElement("div");
        panel.className = "view-profile-modal";
        panel.style.cssText = `
            background: ${VIEW_PROFILE_BG};
            border-radius: 17px;
            padding: 38px 36px 28px 36px;
            min-width: 330px;
            max-width: 96vw;
            box-shadow: 0 6px 44px #000C;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        `;
        applyViewProfileColors(panel, profileColors);

        const avatarImg = document.createElement("img");
        avatarImg.src = profile.avatarUrl || "https://ui-avatars.com/api/?name=User&background=2d2d2d&color=d4af37&size=128";
        avatarImg.alt = "Avatar";
        avatarImg.style.cssText = `
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: #232323;
            margin-bottom: 16px;
            object-fit: cover;
        `;

        const nameEl = document.createElement("div");
        nameEl.className = "profile-view-accent";
        nameEl.textContent = profile.nickname || "No nickname set";
        nameEl.style.cssText = "font-size:1.18em;margin-bottom:7px;font-weight:bold;text-align:center;";

        const fieldStyle = "font-size:1em;margin-bottom:6px;text-align:center;";
        const mutedStyle = fieldStyle + "font-weight:bold;";

        const clanEl = document.createElement("div");
        if (profile.clanTag) {
            clanEl.className = "profile-view-text";
            clanEl.textContent = "Clan Tag: " + profile.clanTag;
            clanEl.style.cssText = fieldStyle;
        } else {
            clanEl.className = "profile-view-muted";
            clanEl.textContent = "No clan tag set";
            clanEl.style.cssText = mutedStyle;
        }

        const discordEl = document.createElement("div");
        if (profile.discord) {
            discordEl.className = "profile-view-text";
            discordEl.textContent = "Discord: " + profile.discord;
            discordEl.style.cssText = fieldStyle;
        } else {
            discordEl.className = "profile-view-muted";
            discordEl.textContent = "No Discord username set";
            discordEl.style.cssText = mutedStyle;
        }

        const emailEl = document.createElement("div");
        if (profile.email) {
            emailEl.className = "profile-view-text";
            emailEl.textContent = "Email: " + profile.email;
            emailEl.style.cssText = fieldStyle;
        } else {
            emailEl.className = "profile-view-muted";
            emailEl.textContent = "No email set";
            emailEl.style.cssText = mutedStyle;
        }

        const roleEl = document.createElement("div");
        if (profile.role === "Elder" || profile.role === "Co-leader" || profile.role === "Clan Leader") {
            roleEl.className = "profile-view-accent";
            roleEl.textContent = `Role: ${profile.role}`;
            roleEl.style.cssText = fieldStyle + "margin-bottom:22px;font-weight:bold;";
        } else {
            roleEl.className = "profile-view-muted";
            roleEl.textContent = "No role set";
            roleEl.style.cssText = mutedStyle + "margin-bottom:22px;";
        }

        const creationDateViewDiv = document.createElement("div");
        if (profile.creationDate) {
            creationDateViewDiv.className = "profile-view-text";
            creationDateViewDiv.textContent = "Issue Date: " + formatCreationDate(profile.creationDate);
            creationDateViewDiv.style.cssText = fieldStyle + "margin-bottom:8px;";
            panel.appendChild(creationDateViewDiv);
        }

        const shareBtn = document.createElement("button");
        shareBtn.className = "profile-view-share-btn";
        shareBtn.title = "Download image to share!";
        shareBtn.style.cssText = `
            position: absolute;
            top: 13px;
            right: 16px;
            background: none;
            border: none;
            padding: 3px 3px 1px 3px;
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.12s;
            z-index: 2;
        `;
        shareBtn.onmouseenter = () => { shareBtn.style.background = "#fafafd"; };
        shareBtn.onmouseleave = () => { shareBtn.style.background = "none"; };
        shareBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${profileColors.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

        shareBtn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Find the close button in this panel and change its text content before image download
            const closeBtn = panel.querySelector("button:not(.profile-view-share-btn)");
            let originalCloseText = null;
            if (closeBtn) {
                originalCloseText = closeBtn.textContent;
                closeBtn.textContent = "GRINDEROUZ CARD";
            }

            loadHtml2Canvas().then((html2canvas) => {
                const origBg = panel.style.background;
                panel.style.background = VIEW_PROFILE_BG;
                html2canvas(panel, {
                    backgroundColor: VIEW_PROFILE_BG,
                    useCORS: true,
                    logging: false,
                    scale: 2
                }).then(canvas => {
                    panel.style.background = origBg;
                    canvas.toBlob(function(blob) {
                        if (!blob) return;
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `${(profile.nickname || "profile")}_card.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => { URL.revokeObjectURL(link.href); }, 200);
                    }, 'image/png');
                }).catch(()=>{
                    panel.style.background = origBg;
                    alert("Sorry! Could not generate image.");
                }).finally(() => {
                    // Restore original close button text after download action
                    if (closeBtn && originalCloseText !== null) {
                        closeBtn.textContent = originalCloseText;
                    }
                });
            }).catch(() => {
                if (closeBtn && originalCloseText !== null) {
                    closeBtn.textContent = originalCloseText;
                }
                alert("Image sharing functionality failed to load. Please try again.");
            });
        };

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.cssText = `
            background:#d4af37;
            color:#191919;
            border:none;
            border-radius:7px;
            padding:10px 22px;
            font-size:1em;
            font-weight:bold;
            margin-top:8px;
            cursor:pointer;
            transition:background 0.17s;
        `;
        closeBtn.onclick = closePanel;

        injectProfilePanelStyle();

        panel.appendChild(shareBtn);
        panel.appendChild(avatarImg);
        panel.appendChild(nameEl);
        panel.appendChild(clanEl);
        panel.appendChild(discordEl);
        panel.appendChild(emailEl);
        panel.appendChild(roleEl);
        panel.appendChild(closeBtn);
        applyViewProfileColors(panel, profileColors);

        overlay.onclick = function(e) {
            if (e.target === overlay) closePanel();
        };
        function escListener(evt) {
            if (evt.key === "Escape") closePanel();
        }
        document.addEventListener("keydown", escListener);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        function onWorkspaceThemeChange() {
            profileColors = getThemeProfileColors();
            applyViewProfileColors(panel, profileColors);
        }
        window.addEventListener("glw-theme-change", onWorkspaceThemeChange);

        function closePanel() {
            window.removeEventListener("glw-theme-change", onWorkspaceThemeChange);
            overlay?.parentNode?.removeChild(overlay);
            document.removeEventListener("keydown", escListener);
        }
    }

    function injectPanelAnimationCss() {
        if (document.getElementById("profile-panel-style")) return;
        injectProfilePanelStyle();
        const style = document.createElement("style");
        style.id = "profile-panel-style";
        style.textContent = `
            @keyframes profilePanelFadeIn {
                from { opacity:0; }
                to   { opacity:1; }
            }
        `;
        document.head.appendChild(style);
    }

    function injectProfilePanelStyle() {
        if (document.getElementById("profile-panel-theme-style")) return;
        const style = document.createElement("style");
        style.id = "profile-panel-theme-style";
        style.textContent = `
            .view-profile-modal,
            .profile-panel-modal,
            html:not([data-theme]) #profile-panel-overlay > div,
            html.theme-default #profile-panel-overlay > div,
            html.theme-default .profile-panel-modal {
                background: #232323 !important;
                color: #fff !important;
            }
            html:not([data-theme]) #profile-panel-overlay input,
            html:not([data-theme]) #profile-panel-overlay select,
            html.theme-default #profile-panel-overlay input,
            html.theme-default #profile-panel-overlay select {
                background: #2a2a2a !important;
                color: #fff !important;
                border-color: #bab07c !important;
            }
            .view-profile-modal .profile-view-accent {
                color: var(--profile-view-accent, #d4af37);
            }
            .view-profile-modal .profile-view-text {
                color: var(--profile-view-text, #fff);
            }
            .view-profile-modal .profile-view-muted {
                color: var(--profile-view-muted, #b48808);
            }
            .profile-panel-modal label,
            .profile-panel-modal h2 {
                color: #b48808 !important;
            }
            .profile-panel-modal input, .profile-panel-modal select {
                border: 1px solid #bab07c;
            }
            .profile-panel-modal input:focus, .profile-panel-modal select:focus {
                border-color: #d4af37 !important;
                outline: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    injectPanelAnimationCss();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectProfileButtons);
    } else {
        injectProfileButtons();
    }
})();