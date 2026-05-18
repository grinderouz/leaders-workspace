const LOCKAPP_HASH = "e301479c1594b2e3044ffae89c2d8f8c127cb3e37fe1a84e612a035fb06fa120";

(function() {
    if (!window.crypto || !window.crypto.subtle) {
        alert("Unsupported browser for lockapp.js");
        return;
    }

    const LOCKAPP_WINNAME = `LOCKAPP_UNLOCKED_${LOCKAPP_HASH}`;
    if (window.name === LOCKAPP_WINNAME) return;

    function injectOverlayStyles() {
        if (document.getElementById('lockapp-style')) return;
        const css = `
            #lockapp-overlay {
                position:fixed !important;
                z-index:99999 !important;
                inset:0 !important;
                background:black !important;
                color:#fff !important;
                text-align:center !important;
                display:flex !important;
                flex-direction:column !important;
                justify-content:center !important;
                align-items:center !important;
                font-family:sans-serif !important;
            }
            #lockapp-overlay .lockapp-box {
                background:#111 !important;
                box-shadow:0 6px 32px #000c !important;
                padding:36px 26px !important;
                border-radius:10px !important;
                min-width:270px !important;
                max-width:95vw !important;
                margin:auto !important;
                box-sizing:border-box !important;
            }
            #lockapp-overlay h2 {
                margin-bottom:20px !important;
                font-size:1.3em !important;
                color:#d4af37 !important;
                font-family:inherit !important;
            }
            #lockapp-overlay input[type="password"] {
                padding:12px !important;
                font-size:1em !important;
                width:100% !important;
                margin-bottom:18px !important;
                border-radius:4px !important;
                border:1px solid #bab07c !important;
                text-align:center !important;
                background:#1a1a1a !important;
                color:#fff !important;
                outline:none !important;
                box-sizing:border-box !important;
            }
            #lockapp-overlay button {
                background-color:#d4af37 !important;
                border:none !important;
                border-radius:5px !important;
                padding:12px 28px !important;
                font-size:1em !important;
                color:#1a1a1a !important;
                cursor:pointer !important;
                font-weight:600 !important;
                margin-bottom:8px !important;
                transition:filter 0.17s;
            }
            #lockapp-overlay button:active {
                filter:brightness(0.94)
            }
            #lockapp-overlay .lockapp-err {
                color:#c84838 !important;
                padding-bottom:8px !important;
                font-weight:600 !important;
            }
            #lockapp-overlay small {
                color:#fff8 !important;
                margin-top:22px !important;
                display:block !important;
                font-size:0.97em !important;
            }
            @media (max-width:490px) {
                #lockapp-overlay .lockapp-box {
                    padding:22px 7vw !important;
                    min-width:0 !important;
                    width:100% !important;
                }
            }
        `;
        const style = document.createElement("style");
        style.id = "lockapp-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    async function sha256(str) {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
    }

    function buildLockScreen(error=false) {
        document.getElementById("lockapp-overlay")?.remove();
        injectOverlayStyles();

        const overlay = document.createElement("div");
        overlay.id = "lockapp-overlay";

        const box = document.createElement("div");
        box.className = "lockapp-box";
        
        if (error) {
            const err = document.createElement("div");
            err.className = "lockapp-err";
            err.textContent = "Incorrect passcode. Try again!";
            box.appendChild(err);
        }

        const title = document.createElement("h2");
        title.textContent = "🔒 Enter Passcode";
        box.appendChild(title);

        const input = document.createElement("input");
        input.type = "password";
        input.placeholder = "Enter passcode...";
        input.autofocus = true;
        input.onkeydown = e => { if(e.key==="Enter") btn.click(); };

        box.appendChild(input);

        const btn = document.createElement("button");
        btn.textContent = "Unlock";
        btn.onclick = async () => {
            btn.disabled = true;
            btn.textContent = "Unlocking...";
            const hash = await sha256(input.value);
            if (hash === LOCKAPP_HASH) {
                window.name = LOCKAPP_WINNAME;
                overlay.remove();
            } else {
                setTimeout(() => buildLockScreen(true), 400);
            }
        };
        box.appendChild(btn);

        const note = document.createElement("div");
        note.innerHTML = `<small>Protected by GrinderouzDB</small>`;
        box.appendChild(note);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
        input.focus();
    }

    function ensureDOM(cb) {
        if (document.body) cb();
        else document.addEventListener("DOMContentLoaded", cb);
    }
    ensureDOM(() => buildLockScreen(false));
})();