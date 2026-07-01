const EmbedLock = (function () {
    const LOCK_STYLES = `
        .embed-lock-overlay {
            position: absolute;
            inset: 0;
            background: #111;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: opacity 0.15s;
        }
        .embed-lock-box {
            background: #232323;
            border: 2.5px solid #d4af37;
            border-radius: 12px;
            padding: 32px 22px 22px 22px;
            box-shadow: 0 4.5px 26px #000b, 0 1px 2px #0004;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .embed-lock-title {
            color: #d4af37;
            font-size: 1.18em;
            font-weight: bold;
            margin-bottom: 18px;
            letter-spacing: 0.03em;
        }
        .embed-lock-input {
            padding: 8px 14px;
            font-size: 1em;
            border-radius: 5px;
            border: none;
            margin-bottom: 12px;
            outline: none;
            background: #181818;
            color: #f8eec1;
        }
        .embed-lock-btn {
            background: #d4af37;
            color: #232323;
            font-size: 1em;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            padding: 7px 18px;
            cursor: pointer;
            transition: background 0.16s;
        }
        .embed-lock-btn:active {
            background: #b89829;
        }
        .embed-lock-err {
            color: #cb4040;
            font-size: 0.97em;
            min-height: 19px;
            margin-bottom: 3px;
            margin-top: 2px;
            text-align: center;
        }
        .embed-lock-view-btn {
            display: block;
            margin: 2.5em auto 1.2em auto;
            background: #d4af37;
            color: #232323;
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
            background: #b89829;
        }
    `;
    let stylesAppended = false;
    let pinUnlocked = false;
    let lockedContainers = [];
    let viewLockedBtn = null;
    let unlockPin = null;

    // Hide "Open in new tab" button(s) in given container (those with .iframe-newtab-btn)
    function hideOpenInNewTabBtns(container) {
        if (!container) return;
        let btns = container.querySelectorAll('.iframe-newtab-btn');
        btns.forEach(btn => {
            btn.style.visibility = "hidden";
        });
    }

    // Show "Open in new tab" button(s) in given container
    function showOpenInNewTabBtns(container) {
        if (!container) return;
        let btns = container.querySelectorAll('.iframe-newtab-btn');
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
        viewLockedBtn.textContent = "Unlock With Pin";
        viewLockedBtn.onclick = function () {
            showUnlockPrompt(secretPin);
        };

        // Create a wrapper for centering, or rely on block+auto margin (block+auto centers in most flows)
        let parent = document.querySelector('main') || document.body;
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
        // Prevent multiple prompt overlays
        if (document.querySelector('.embed-lock-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'embed-lock-overlay';
        overlay.innerHTML = `
            <div class="embed-lock-box">
                <div class="embed-lock-title">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align:middle; margin-right:6px;" xmlns="http://www.w3.org/2000/svg">
                        <rect x="5" y="11" width="14" height="8" rx="3" stroke="#d4af37" stroke-width="2" fill="none"/>
                        <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="#d4af37" stroke-width="2" fill="none"/>
                    </svg>
                    Leader PIN Required
                </div>
                <div class="embed-lock-err"></div>
                <input class="embed-lock-input" type="password" placeholder="Enter PIN..." maxlength="16" spellcheck="false" />
                <button class="embed-lock-btn">Unlock</button>
            </div>
        `;
        document.body.appendChild(overlay);

        const errDiv = overlay.querySelector('.embed-lock-err');
        const input = overlay.querySelector('.embed-lock-input');
        const btn = overlay.querySelector('.embed-lock-btn');

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

        btn.onclick = tryUnlock;
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') tryUnlock();
        });
    }

    function hideEmbeds(container) {
        if (!container) return;
        let iframes = container.querySelectorAll('iframe');
        iframes.forEach(frame => frame.style.display = 'none');
        // ALSO hide any open-in-new-tab buttons in this container
        hideOpenInNewTabBtns(container);
    }

    function showEmbeds(container) {
        if (!container) return;
        let iframes = container.querySelectorAll('iframe');
        iframes.forEach(frame => frame.style.display = '');
        // ALSO show any open-in-new-tab buttons in this container
        showOpenInNewTabBtns(container);
    }

    function revealLockedEmbeds() {
        // Make all locked containers visible again, including embedded links
        lockedContainers.forEach(c => showEmbeds(c));
        lockedContainers.length = 0; // clear
    }

    function lockIframeContainer(container, secretPin) {
        appendStyles();
        if (!container) return;

        // On first protected section encountered, show the "View Locked" button
        if (!viewLockedBtn && !pinUnlocked) {
            showViewLockedButton(secretPin);
        }

        if (pinUnlocked || (unlockPin && secretPin === unlockPin)) {
            // If pin is already unlocked, immediately reveal
            showEmbeds(container);
        } else {
            // Hide embed(s) and open-in-new-tab btn(s) inside container and register for later reveal
            hideEmbeds(container);
            if (!lockedContainers.includes(container)) {
                lockedContainers.push(container);
            }
        }
    }

    return { lockIframeContainer };
})();