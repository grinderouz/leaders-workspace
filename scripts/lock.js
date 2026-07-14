const LOCKAPP_HASH = "e301479c1594b2e3044ffae89c2d8f8c127cb3e37fe1a84e612a035fb06fa120";

(function () {
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
    position: fixed !important; z-index: 99999 !important; inset: 0 !important;
    background: #0a0a0a !important; color: #e8e6df !important;
    display: flex !important; flex-direction: column !important; justify-content: center !important;
    align-items: center !important; font-family: 'Segoe UI', sans-serif !important;
}
#lockapp-overlay .lockapp-box {
    background: #141311 !important; border: 1px solid #383428 !important;
    border-left: 3px solid #c5a059 !important; padding: 36px 30px !important;
    border-radius: 2px !important; box-shadow: 0 10px 30px #000 !important;
}
#lockapp-overlay h2 {
    margin-bottom: 20px !important; font-size: 1.4em !important;
    color: #f3e5ab !important; letter-spacing: 2px !important; text-transform: uppercase;
}
#lockapp-overlay input[type="password"] {
    padding: 12px !important; font-size: 1em !important; width: 100% !important;
    margin-bottom: 18px !important; border-radius: 2px !important;
    border: 1px solid #383428 !important; background: #0a0a0a !important;
    color: #f3e5ab !important; text-align: center !important;
}
#lockapp-overlay button {
    background-color: #c5a059 !important; border: none !important; border-radius: 2px !important;
    padding: 12px 28px !important; font-size: 0.95em !important;
    color: #0a0a0a !important; font-weight: 700 !important; text-transform: uppercase;
}
#lockapp-overlay .lockapp-err { color: #d96b6b !important; margin-bottom: 10px !important; }
`;
        const style = document.createElement("style");
        style.id = "lockapp-style";
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    async function sha256(str) {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }

    function buildLockScreen(error = false) {
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
        title.textContent = "Enter Passcode";
        box.appendChild(title);

        const input = document.createElement("input");
        input.type = "password";
        input.placeholder = "Enter passcode...";
        input.autofocus = true;
        input.onkeydown = e => {
            if (e.key === "Enter") btn.click();
        };
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