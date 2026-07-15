'use strict';

window.PERFORMANCE_SETTINGS = {
    targetFPS: 30,
    showFPS: false,
    autoBatteryFPS: true,
    batteryFPS: 15
};

window.PERFORMANCE_SETTINGS_META = {
  targetFPS: { min: 1, max: 120, step: 1, decimals: 0 },
  showFPS: { type: 'bool' },
  autoBatteryFPS: { type: 'bool' },
  batteryFPS: { min: 1, max: 120, step: 1, decimals: 0 }
};
