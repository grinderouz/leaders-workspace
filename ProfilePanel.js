(function () {
    let html2canvasPromise = null;

    function loadHtml2Canvas() {
        if (window.html2canvas) return Promise.resolve(window.html2canvas);
        if (html2canvasPromise) return html2canvasPromise;
        html2canvasPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
            script.crossOrigin = "anonymous"; // ensure crossorigin for CORS images
            script.onload = () => resolve(window.html2canvas);
            script.onerror = () => reject(new Error("Failed to load html2canvas"));
            document.head.appendChild(script);
        });
        return html2canvasPromise;
    }

    function isLightTheme() {
        return document.documentElement.classList.contains("light-mode");
    }

    function viewProfileColors() {
        if (isLightTheme()) {
            return {
                panelBg: "#ffffff",
                panelFg: "#1e1e1e",
                muted: "#5a5a5a",
                accent: "#9a7b10",
                avatarBg: "#f0f0ee",
                shareHover: "#eee"
            };
        }
        return {
            panelBg: "#191919",
            panelFg: "#fff",
            muted: "#fffbe8cc",
            accent: "#d4af37",
            avatarBg: "#232323",
            shareHover: "#242424"
        };
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
            email: stored.email || ""
        };
    }

    function openProfilePanel() {
        if (document.getElementById("profile-panel-overlay")) return;

        const stored = getStoredProfile();

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
            background: #232323;
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

        const title = document.createElement("h2");
        title.textContent = "Profile Settings";
        title.style.cssText = "color: #d4af37; margin-bottom: 26px; font-size:1.3em; text-align:center;";

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
            background: #191919; color:#fff;
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
            background: #191919; color:#fff;
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
            background: #191919; color:#fff;
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
            background: #191919; color:#fff;
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
            background: #191919; color:#fff;
        `;

        const roleLabel = document.createElement("label");
        roleLabel.textContent = "Select Role";
        roleLabel.style.cssText = "margin-bottom:4px;color:#d4af37;font-weight:500;";
        const roleSelect = document.createElement("select");
        roleSelect.style.cssText = `
            width:100%; padding:10px; font-size:1em;
            margin-bottom:20px; border-radius:5px;
            border:1px solid #bab07c;
            background: #191919; color:#fff;
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
                setTimeout(function () { // Ensure browser shows prompt after focus leaves select
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
            const data = {
                nickname: nicknameInput.value.trim(),
                clanTag: clanTagInput.value.trim(),
                avatarUrl: avatarVal,
                role: selRole,
                discord: discordInput.value.trim(),
                email: emailInput.value.trim()
            };
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
        const colors = viewProfileColors();

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
            background: ${colors.panelBg};
            color: ${colors.panelFg};
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

        // Fix for profile image not appearing in downloads
        // 1. Create an off-DOM <img> to ensure image is loaded before rendering.
        // 2. Also, set crossOrigin if cloud avatars or user avatars.
        function ensureAvatarImgLoaded(img) {
            return new Promise((resolve, reject) => {
                if (img.complete && img.naturalWidth !== 0) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = () => {
                        // fallback to default avatar if user avatar didn't load, then resolve
                        img.src = "https://ui-avatars.com/api/?name=User&background=2d2d2d&color=d4af37&size=128";
                        img.onload = resolve;
                        img.onerror = resolve;
                    };
                }
            });
        }

        const avatarImg = document.createElement("img");
        avatarImg.src = profile.avatarUrl || "https://ui-avatars.com/api/?name=User&background=2d2d2d&color=d4af37&size=128";
        avatarImg.alt = "Avatar";
        avatarImg.style.cssText = `
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: ${colors.avatarBg};
            margin-bottom: 16px;
            object-fit: cover;
        `;

        // Add crossOrigin if external image (to allow CORS for html2canvas)
        try {
            const urlObj = new URL(avatarImg.src);
            if (urlObj.origin !== location.origin) {
                avatarImg.crossOrigin = "anonymous";
            }
        } catch (e) {}

        const detailStyle = `color:${colors.muted};font-size:1em;text-align:center;`;

        const nameEl = document.createElement("div");
        nameEl.textContent = profile.nickname || "No nickname set";
        nameEl.style.cssText = `color:${colors.accent};font-size:1.18em;margin-bottom: 7px;font-weight:bold;text-align:center;`;

        const clanEl = document.createElement("div");
        clanEl.className = "view-profile-detail";
        clanEl.textContent = profile.clanTag ? ("Clan Tag: " + profile.clanTag) : "No clan tag set";
        clanEl.style.cssText = detailStyle + "margin-bottom: 6px;";

        const discordEl = document.createElement("div");
        discordEl.className = "view-profile-detail";
        discordEl.textContent = profile.discord ? ("Discord: " + profile.discord) : "No Discord username set";
        discordEl.style.cssText = detailStyle + "margin-bottom: 6px;";

        const emailEl = document.createElement("div");
        emailEl.className = "view-profile-detail";
        emailEl.textContent = profile.email ? ("Email: " + profile.email) : "No email set";
        emailEl.style.cssText = detailStyle + "margin-bottom: 6px;";

        const roleEl = document.createElement("div");
        roleEl.className = "view-profile-detail";
        if (profile.role === "Elder" || profile.role === "Co-leader" || profile.role === "Clan Leader") {
            roleEl.textContent = `Role: ${profile.role}`;
            roleEl.style.cssText = `color:${colors.accent};font-size:1em;margin-bottom: 22px;text-align:center;`;
        } else {
            roleEl.textContent = "No role set";
            roleEl.style.cssText = detailStyle + "margin-bottom: 22px;";
        }

        const shareBtn = document.createElement("button");
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
        shareBtn.onmouseenter = () => { shareBtn.style.background = colors.shareHover; };
        shareBtn.onmouseleave = () => { shareBtn.style.background = "none"; };
        shareBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;

        shareBtn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            loadHtml2Canvas().then((html2canvas) => {
                // Ensure avatar is loaded before snapshot!
                ensureAvatarImgLoaded(avatarImg).then(() => {
                    // temporarily force image to decode if possible (for browsers that support)
                    if (avatarImg.decode) {
                        avatarImg.decode().catch(() => {});
                    }

                    const origBg = panel.style.background;
                    panel.style.background = "#191919";

                    // html2canvas may miss external (cross-origin) images unless they are loaded+decoded with crossOrigin and CORS is allowed.

                    html2canvas(panel, {
                        backgroundColor: "#191919",
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
                    });
                });
            }).catch(() => {
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

        panel.appendChild(shareBtn);
        panel.appendChild(avatarImg);
        panel.appendChild(nameEl);
        panel.appendChild(clanEl);
        panel.appendChild(discordEl);
        panel.appendChild(emailEl);
        panel.appendChild(roleEl);
        panel.appendChild(closeBtn);

        overlay.onclick = function(e) {
            if (e.target === overlay) closePanel();
        };
        function escListener(evt) {
            if (evt.key === "Escape") closePanel();
        }
        document.addEventListener("keydown", escListener);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        function closePanel() {
            overlay?.parentNode?.removeChild(overlay);
            document.removeEventListener("keydown", escListener);
        }
    }

    function injectPanelAnimationCss() {
        if (document.getElementById("profile-panel-style")) return;
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

    injectPanelAnimationCss();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectProfileButtons);
    } else {
        injectProfileButtons();
    }
})();