const EmojiSystem = (() => {
    const EMOJI_DATA = {
        "link": "assets/emojis/link.png",
        "youtube": "assets/emojis/youtube.png",
        "discord": "assets/emojis/discord.png",
        "online-basic": "assets/emojis/online-basic.png",
        "online-ultimate": "assets/emojis/online-ultimate.png",
        "online-creators": "assets/emojis/online-creators.png",
    };

    const DEFAULT_SIZE = "22px";

    function getEmojiStyle(size = DEFAULT_SIZE) {
        return [
            "display: inline-block",
            `width: ${size}`,
            `height: ${size}`,
            "vertical-align: bottom",
            "margin: 0 2px",
            "object-fit: contain"
        ].join("; ") + ";";
    }

    function replaceText(text, size) {
        const style = getEmojiStyle(size);
        return text.replace(/:([a-z0-9_-]+):/gi, function(match, p1) {
            const emojiPath = EMOJI_DATA[p1.toLowerCase()];
            if (emojiPath) {
                return `<img src="${emojiPath}" alt="${p1}" title=":${p1}:" style="${style}" class="custom-emoji">`;
            }
            return match;
        });
    }

    function parse(selector) {
        let elements;
        if (typeof selector === 'string') {
            elements = document.querySelectorAll(selector);
        } else if (selector instanceof NodeList || Array.isArray(selector)) {
            elements = selector;
        } else {
            elements = [selector];
        }
        elements.forEach(function(el) {
            if (el && el.innerHTML) {
                const customSize = el.getAttribute('data-emoji-size') || DEFAULT_SIZE;
                el.innerHTML = replaceText(el.innerHTML, customSize);
            }
        });
    }

    window.addEventListener('DOMContentLoaded', function() {
        parse('[data-emojis]');
    });

    return {
        data: EMOJI_DATA,
        parse,
        replaceText
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmojiSystem;
}