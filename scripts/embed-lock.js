const EmbedLock = (() => {
    const LOCK_STYLES = `
        .embed-lock-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #111;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            transition: opacity 0.15s;
        }
        .embed-lock-fullscreen-content {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;
        }
        .embed-lock-title {
            color: #fff;
            font-size: 2.1em;
            font-weight: bold;
            margin-bottom: 38px;
            letter-spacing: 0.04em;
            text-align: center;
        }
        .embed-lock-form-row {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 13px;
            margin-bottom: 26px;
        }
        .embed-lock-input {
            padding: 11px 20px;
            font-size: 1.18em;
            border-radius: 5px;
            border: none;
            background: none;
            color: #f8eec1;
            outline: none;
            margin-bottom: 0;
            width: 260px;
            max-width: 80vw;
            text-align: center;
        }
        .embed-lock-err {
            color: #cb4040;
            font-size: 1.01em;
            min-height: 23px;
            margin-bottom: 6px;
            margin-top: 2px;
            text-align: center;
            font-weight: 500;
        }
        .embed-lock-btn-row {
            margin-top: 16px;
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .embed-lock-btn, .embed-lock-cancel-btn {
            font-size: 1.03em;
            font-weight: bold;
            border-radius: 6px;
            border: none;
            padding: 10px 28px;
            cursor: pointer;
            box-shadow: 0 2.5px 14px #0004, 0 1px 2px #0002;
            transition: background 0.18s, color 0.1s;
        }
        .embed-lock-btn {
            background:rgb(255, 255, 255);
            color: #232323;
        }
        .embed-lock-btn:active {
            background:rgb(0, 0, 0);
            color:white;
        }
        .embed-lock-cancel-btn {
            background: #2f2f2f;
            color: #aaa;
            border: 1px solid #444;
        }
        .embed-lock-cancel-btn:active {
            background: #191919;
            color: #ccc;
        }
        .embed-lock-view-btn {
            display: block;
            margin: 2.5em auto 1.2em auto;
            background:rgb(73, 73, 73);
            color:rgb(255, 255, 255);
            font-size: 1em;
            border: none;
            border-radius: 6px;
            padding: 12px 34px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.18s;
            box-shadow: 0 2.5px 14px #0004, 0 1px 2px #0005;
            text-align: center;
        }
        .embed-lock-view-btn:active {
            background:rgb(255, 255, 255);
            color:black;
        }
        @media (max-width: 520px) {
            .embed-lock-title {
                font-size: 1.22em;
                margin-bottom: 21px;
            }
            .embed-lock-input {
                width: 98vw;
                max-width: 97vw;
            }
        }
    `;
    let stylesAppended = false;
    let pinUnlocked = false;
    let lockedContainers = [];
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
        lockedContainers.forEach(c => showEmbeds(c));
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