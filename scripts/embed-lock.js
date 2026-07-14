const EmbedLock = (() => {
    const LOCK_STYLES = `
        .embed-lock-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #0a0a0a; z-index: 9999;
            display: flex; flex-direction: column; align-items: stretch; justify-content: center;
        }
        .embed-lock-fullscreen-content {
            flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .embed-lock-title {
            color: #f3e5ab; font-size: 1.8em; font-weight: bold; margin-bottom: 30px;
            letter-spacing: 3px; text-transform: uppercase; text-align: center;
            font-family: 'Segoe UI', 'Trebuchet MS', Trajan, Georgia, serif;
        }
        .embed-lock-input {
            padding: 12px; font-size: 1.2em; border-radius: 2px;
            border: 1px solid #383428; background: #0a0a0a;
            color: #f3e5ab; outline: none; width: 260px; text-align: center;
        }
        .embed-lock-input:focus { border-color: #c5a059; }
        .embed-lock-err { color: #d96b6b; font-size: 0.9em; min-height: 20px; margin-top: 10px; }
        .embed-lock-btn, .embed-lock-cancel-btn {
            font-size: 0.95em; font-weight: 600; border-radius: 2px; border: 1px solid #383428;
            padding: 10px 24px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;
            transition: all 0.2s;
        }
        .embed-lock-btn { background: #c5a059; color: #0a0a0a; }
        .embed-lock-btn:hover { background: #f3e5ab; border-color: #f3e5ab; }
        .embed-lock-cancel-btn { background: #141311; color: #9e9a8f; }
        .embed-lock-view-btn {
            display: block; margin: 2em auto; background: #141311; color: #f3e5ab;
            border: 1px solid #383428; border-radius: 2px; padding: 12px 30px;
            font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 2px;
        }
        .embed-lock-view-btn:hover { border-color: #c5a059; box-shadow: 0 0 10px rgba(197,160,89,0.3); }
    `;
    let stylesAppended = false;
    let pinUnlocked = false;
    const lockedContainers = [];
    let viewLockedBtn = null;
    let unlockPin = null;

    function hideOpenInNewTabBtns(container) {
        if (!container) return;
        const btns = container.querySelectorAll('.iframe-newtab-btn');
        btns.forEach(btn => {
            btn.style.visibility = "hidden";
        });
    }

    function showOpenInNewTabBtns(container) {
        if (!container) return;
        const btns = container.querySelectorAll('.iframe-newtab-btn');
        btns.forEach(btn => {
            btn.style.visibility = "";
        });
    }

    function appendStyles() {
        if (stylesAppended) return;
        const styleTag = document.createElement('style');
        styleTag.textContent = LOCK_STYLES;
        document.head.appendChild(styleTag);
        stylesAppended = true;
    }

    function showViewLockedButton(secretPin) {
        if (viewLockedBtn) return;
        viewLockedBtn = document.createElement('button');
        viewLockedBtn.className = 'embed-lock-view-btn';
        viewLockedBtn.textContent = "UNLOCK WITH ADMIN PIN";
        viewLockedBtn.onclick = () => {
            showUnlockPrompt(secretPin);
        };
        const parent = document.querySelector('main') || document.body;
        parent.insertBefore(viewLockedBtn, parent.firstChild);
    }

    function hideViewLockedButton() {
        if (viewLockedBtn) {
            viewLockedBtn.remove();
            viewLockedBtn = null;
        }
    }

    function showUnlockPrompt(secretPin) {
        appendStyles();
        if (document.querySelector('.embed-lock-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'embed-lock-overlay';
        overlay.innerHTML = `
            <div class="embed-lock-fullscreen-content">
                <div class="embed-lock-title">
                    Access Code Required
                </div>
                <div class="embed-lock-form-row">
                    <input class="embed-lock-input" type="password" placeholder="Enter PIN..." maxlength="16" spellcheck="false" />
                    <div class="embed-lock-err"></div>
                </div>
                <div class="embed-lock-btn-row">
                    <button class="embed-lock-btn">Unlock</button>
                    <button class="embed-lock-cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const input = overlay.querySelector('.embed-lock-input');
        const errDiv = overlay.querySelector('.embed-lock-err');
        const unlockBtn = overlay.querySelector('.embed-lock-btn');
        const cancelBtn = overlay.querySelector('.embed-lock-cancel-btn');

        setTimeout(() => { input.focus(); }, 50);

        function tryUnlock() {
            if (input.value.trim() === secretPin) {
                pinUnlocked = true;
                unlockPin = secretPin;
                overlay.style.opacity = '0.35';
                setTimeout(() => {
                    overlay.remove();
                    hideViewLockedButton();
                    revealLockedEmbeds();
                }, 150);
            } else {
                errDiv.textContent = "Incorrect PIN.";
                input.value = "";
                input.focus();
            }
        }

        unlockBtn.onclick = tryUnlock;
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') tryUnlock();
            if (e.key === 'Escape') hideOverlay();
        });

        cancelBtn.onclick = hideOverlay;
        overlay.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') hideOverlay();
        });

        function hideOverlay() {
            overlay.remove();
        }
    }

    function hideEmbeds(container) {
        if (!container) return;
        const iframes = container.querySelectorAll('iframe');
        iframes.forEach(frame => frame.style.display = 'none');
        hideOpenInNewTabBtns(container);
    }

    function showEmbeds(container) {
        if (!container) return;
        const iframes = container.querySelectorAll('iframe');
        iframes.forEach(frame => frame.style.display = '');
        showOpenInNewTabBtns(container);
    }

    function revealLockedEmbeds() {
        lockedContainers.forEach(showEmbeds);
        lockedContainers.length = 0;
    }

    function lockIframeContainer(container, secretPin) {
        appendStyles();
        if (!container) return;
        if (!viewLockedBtn && !pinUnlocked) {
            showViewLockedButton(secretPin);
        }
        if (pinUnlocked || (unlockPin && secretPin === unlockPin)) {
            showEmbeds(container);
        } else {
            hideEmbeds(container);
            if (!lockedContainers.includes(container)) {
                lockedContainers.push(container);
            }
        }
    }

    return { lockIframeContainer };
})();