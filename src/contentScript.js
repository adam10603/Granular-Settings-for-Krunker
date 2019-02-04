window.onload = function() {
    function injectScript(file, node) {
        var th = document.getElementsByTagName(node)[0];
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', file);
        th.appendChild(s);
    }
    injectScript( chrome.extension.getURL('/gsInjected.js'), 'body');

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg === "gs_transmit_settings_internal") {
            transmitSettings();
        }
    });

    setTimeout(transmitSettings, 500);
}

function transmitSettings() {
    chrome.storage.sync.get("gsConfig", function(data) {
        var settings = data["gsConfig"];
        document.dispatchEvent(new CustomEvent('gs_transmit_settings', {detail: settings}));
    });
}