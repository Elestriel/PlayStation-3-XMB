(function() {
    let currentFPS = 0;
    let then = performance.now();
    let lastTime = performance.now();
    let appFrames = 0;
    let isCharging = true;

    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            isCharging = battery.charging;

            battery.addEventListener('chargingchange', function() {
                isCharging = battery.charging;
            });
        });
    }

    const fpsCounter = document.createElement('div');
    fpsCounter.style.cssText = 'position:fixed; top:10px; left:10px; color:#0f0; background:rgba(0,0,0,0.8); padding:6px 12px; border-radius:4px; font-family:monospace; font-size:14px; z-index:10000; pointer-events:none; display:none; border:1px solid #0f0;';
    document.body.appendChild(fpsCounter);

    window.addEventListener('dblclick', (e) => {
        if (!['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName)) {
            const uiLayer = document.getElementById('ui-layer-root');
            if (uiLayer) {
                uiLayer.style.display = uiLayer.style.display === 'none' ? '' : 'none';
            }
        }
    });

    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        function intercept(time) {
            // Read directly from the factory's mutated state
            const target = window.PERFORMANCE_SETTINGS.targetFPS;
            if (window.PERFORMANCE_SETTINGS.autoBatteryFPS && !isCharging) {
                activeTargetFPS = window.PERFORMANCE_SETTINGS.batteryFPS;
            }
            const interval = 1000 / target;
            const elapsed = time - then;

            // React to the toggle checkbox dynamically
            fpsCounter.style.display = window.PERFORMANCE_SETTINGS.showFPS ? 'block' : 'none';

            if (elapsed >= interval) {
                then = time - (elapsed % interval);
                
                appFrames++;
                if (time >= lastTime + 1000) {
                    currentFPS = Math.round((appFrames * 1000) / (time - lastTime));
                    appFrames = 0;
                    lastTime = time;
                    
                    // Update text string once per second
                    fpsCounter.innerText = `FPS: ${currentFPS} | Limit: ${target}`;
                }
                
                callback(time);
            } else {
                originalRaf(intercept);
            }
        }
        return originalRaf(intercept);
    };
})();