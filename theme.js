(function () {
    const THEMES = [
        { id: "default", name: "Classic Gold", description: "Original dark workspace with gold accents.", file: null },
        { id: "light", name: "Light", description: "Bright, clean layout for daytime use.", file: "themes/light.css" },
        { id: "purple-nitro", name: "Purple Nitro", description: "Purple and cyan Nitro style.", file: "themes/purple-nitro.css" },
        { id: "coc", name: "CoC", description: "CoC Green Theme.", file: "themes/coc.css" },
        { id: "moogle", name: "Moogle Dark", description: "Moogle Dark UI Theme.", file: "themes/moogle.css" },
        { id: "dios", name: "DIOS", description: "Dark Phone Theme.", file: "themes/dark-ios.css" }
    ];

    const STORAGE_KEY = "glw_theme";
    const LEGACY_LIGHT_KEY = "glw_light_mode";
    const LINK_ID = "glw-theme-css";

    let currentId = "default";

    function findTheme(id) {
        return THEMES.find(function (t) { return t.id === id; }) || THEMES[0];
    }

    function loadStoredId() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && findTheme(stored).id === stored) return stored;
        if (localStorage.getItem(LEGACY_LIGHT_KEY) === "1") {
            localStorage.setItem(STORAGE_KEY, "light");
            return "light";
        }
        return "default";
    }

    function applyTheme(id) {
        const theme = findTheme(id);
        currentId = theme.id;
        const root = document.documentElement;

        root.classList.remove("light-mode");
        THEMES.forEach(function (t) {
            root.classList.remove("theme-" + t.id);
        });

        root.classList.remove("theme-default");
        if (theme.id === "default") {
            root.removeAttribute("data-theme");
            root.classList.add("theme-default");
        } else {
            root.setAttribute("data-theme", theme.id);
            root.classList.add("theme-" + theme.id);
            if (theme.id === "light") root.classList.add("light-mode");
        }

        let link = document.getElementById(LINK_ID);
        if (theme.file) {
            if (!link) {
                link = document.createElement("link");
                link.id = LINK_ID;
                link.rel = "stylesheet";
                document.head.appendChild(link);
            }
            link.href = theme.file;
        } else if (link) {
            link.remove();
        }

        window.dispatchEvent(new CustomEvent("glw-theme-change", { detail: { id: theme.id } }));
    }

    function setTheme(id) {
        const theme = findTheme(id);
        localStorage.setItem(STORAGE_KEY, theme.id);
        localStorage.setItem(LEGACY_LIGHT_KEY, theme.id === "light" ? "1" : "0");
        applyTheme(theme.id);
    }

    window.GLWTheme = {
        themes: THEMES,
        getId: function () { return currentId; },
        setTheme: setTheme,
        isLight: function () { return currentId === "light"; },
        setLight: function (on) { setTheme(on ? "light" : "default"); }
    };

    currentId = loadStoredId();
    applyTheme(currentId);
})();
