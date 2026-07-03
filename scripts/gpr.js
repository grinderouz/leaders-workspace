(function() {
    const REWARDS_SYSTEM_ENABLED = true;

    const MAX_GPOINTS = 50000;
    const INTERVAL_MS = 10000;
    const INACTIVITY_LIMIT = 1 * 60 * 1000;

    let gpoints = parseInt(localStorage.getItem('glw_gpoints')) || 0;
    let intervalId = null;
    let inactivityTimeoutId = null;

    window.REWARDS_SYSTEM_ENABLED = REWARDS_SYSTEM_ENABLED;

    function addGPoint() {
        if (REWARDS_SYSTEM_ENABLED && gpoints < MAX_GPOINTS) {
            gpoints++;
            localStorage.setItem('glw_gpoints', gpoints);
            window.dispatchEvent(new CustomEvent('gpointsUpdated', { detail: gpoints }));
        }
    }

    function startGPoints() {
        if (intervalId === null) {
            intervalId = setInterval(addGPoint, INTERVAL_MS);
        }
    }

    function stopGPoints() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function resetInactivityTimer() {
        if (inactivityTimeoutId !== null) {
            clearTimeout(inactivityTimeoutId);
        }
        if (intervalId === null) {
            startGPoints();
        }
        inactivityTimeoutId = setTimeout(() => {
            stopGPoints();
        }, INACTIVITY_LIMIT);
    }

    window.addEventListener('mousemove', resetInactivityTimer, { passive: true });
    window.addEventListener('touchstart', resetInactivityTimer, { passive: true });
    window.addEventListener('mousedown', resetInactivityTimer, { passive: true });

    startGPoints();
    resetInactivityTimer();
})();