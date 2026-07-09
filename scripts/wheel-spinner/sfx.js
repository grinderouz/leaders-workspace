const spinLoopSound = new Audio('sfx/spinner/spin.mp3');
const winnerSound = new Audio('sfx/spinner/winner.mp3');

spinLoopSound.loop = true;
spinLoopSound.preload = 'auto';
winnerSound.preload = 'auto';

const spinBtn = document.getElementById('spinBtn');

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
            if (spinBtn.disabled) {
                spinLoopSound.currentTime = 0;
                spinLoopSound.play().catch(err => console.warn("Audio play prevented:", err));
            } else {
                spinLoopSound.pause();
                winnerSound.currentTime = 0;
                winnerSound.play().catch(err => console.warn("Audio play prevented:", err));
            }
        }
    });
});

if (spinBtn) {
    observer.observe(spinBtn, { attributes: true });
} else {
    console.error("Script Error: Could not find the spin button (#spinBtn).");
}