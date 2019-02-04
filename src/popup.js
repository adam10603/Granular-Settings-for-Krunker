var saveButton = undefined;

function saveSettings() {
    var lightUpElement = function(em, className, long = false) {
        em.classList.add(className);
        setTimeout(() => { em.classList.remove(className) }, long ? 2000 : 300);
    };

    var regex = /^([0-9]*[.])?[0-9]+$/;

    var testInput = (element) => {
        var emId = element.id;
        if (emId === "granularFOV") {
            return { elementID: emId, value: element.checked };
        }
        var rawValue = element.value;
        var value = parseFloat(rawValue);
        if (!regex.test("" + rawValue)) {
            lightUpElement(element, "redBackground", true);
            return undefined;
        }
        if (value < element.min || value > element.max) {
            lightUpElement(element, "redBackground", true);
            return undefined;
        }
        return { elementID: emId, value: value };
    };

    var newSettings = {};
    var badInput = false;

    var inputIDs = ["sliderMin", "sliderMax", "sliderStep", "granularFOV"];
    for (var i in inputIDs) {
        var ret = testInput(document.getElementById(inputIDs[i]));
        if (ret !== undefined) newSettings[ret.elementID] = ret.value;
        else badInput = true;
    }

    if (badInput) return;

    var newConfig = {"gsConfig": newSettings};
    chrome.storage.sync.set(newConfig, function() {
        chrome.tabs.query({url: "https://krunker.io/*", currentWindow: true}, function(tabs) {
            tabs.forEach((tab) => {
                chrome.tabs.sendMessage(tab.id, "gs_transmit_settings_internal");
            });
        });
        //console.log("[Granular Settings] Settings saved: " + JSON.stringify(newConfig, null, 0));
        lightUpElement(saveButton, "greenBackground");
    });
}

window.onload = function() {
    chrome.storage.sync.get("gsConfig", function(data) {
        //console.log("[Granular Settings] Settings loaded: " + JSON.stringify(data, null, 0));
        document.getElementById("sliderMin").value      = data["gsConfig"]["sliderMin"];
        document.getElementById("sliderMax").value      = data["gsConfig"]["sliderMax"];
        document.getElementById("sliderStep").value     = data["gsConfig"]["sliderStep"];
        document.getElementById("granularFOV").checked  = data["gsConfig"]["granularFOV"];
    });
    saveButton = document.getElementById("saveButton");
    saveButton.onclick = saveSettings;
}