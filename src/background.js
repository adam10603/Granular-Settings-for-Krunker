chrome.runtime.onInstalled.addListener(function() {
    const defaultConfig = {"gsConfig": {"sliderMin": 0.1, "sliderMax": 15.0, "sliderStep": 0.1, "granularFOV": false}};
    chrome.storage.sync.set(defaultConfig, function() {
        //console.log("[Granular Settings] Default settings initialized: " + JSON.stringify(defaultConfig, null, 0));
    });
});