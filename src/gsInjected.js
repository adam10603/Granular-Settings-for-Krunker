var gs_settings = {"sliderMin": 0.1, "sliderMax": 15.0, "sliderStep": 0.1, "granularFOV": false}; // Defaulted to Krunker's defaults

function gs_processSettings(settingsEvent) {
    var data = settingsEvent.detail;

    var allKeysFound = true;
    Object.keys(gs_settings).forEach((k) => {
        allKeysFound &= (k in data);
    });

    if (!allKeysFound) {
        console.log("[Granular Settings] Error: Invalid config data");
        return;
    }

    gs_settings = data;
    gs_applyModifications(true);
    //console.log("[Granular Settings] Settings received: " + JSON.stringify(gs_settings, null, 0));
}

function gs_applyModifications(liveUpdateAttempt = false) {
    var newMin  = gs_settings["sliderMin"];
    var newMax  = gs_settings["sliderMax"];
    var newStep = gs_settings["sliderStep"];

    var modifySlider = function(sliderElementID, name) {
        var sliderElement = document.getElementById(sliderElementID);
        if (sliderElement) {
            var sliderInputElement = sliderElement.parentNode.lastChild.lastChild;
            if (sliderInputElement) {
                if (sliderInputElement.nodeName === "INPUT") {
                    if (sliderElementID == "slid9" || sliderElementID == "slid10") {
                        // FOV sliders, only change step size, not limits
                        sliderInputElement.step = (gs_settings["granularFOV"] ? 0.5 : 5);
                    } else {
                        if (sliderInputElement.value < newMin) {
                            sliderInputElement.value    = newMin;
                            sliderElement.innerHTML     = newMin.toString();
                        }
                        if (sliderInputElement.value > newMax) {
                            sliderInputElement.value    = newMax;
                            sliderElement.innerHTML     = newMax.toString();
                        }
                        sliderInputElement.min  = newMin;
                        sliderInputElement.max  = newMax;
                        sliderInputElement.step = newStep;
                    }
                }
            } else {
                if (!liveUpdateAttempt) console.log("[Granular Settings] Error: Cannot obtain reference to " + name + " input");
            }
        } else {
            if (!liveUpdateAttempt) console.log("[Granular Settings] Error: Cannot obtain reference to " + name);
        }
    }

    modifySlider("slid7", "sensitivity slider");
    modifySlider("slid8", "aim sensitivity slider");
    modifySlider("slid9", "FOV slider");
    modifySlider("slid10", "Weapon FOV slider");
}

function gs_init() {
    const maxTries = 10;

    var tries = 0;

    var hijackShowWindow = function() {
        var showWindowOriginal = undefined;

        try {
            showWindowOriginal = showWindow;
        } catch (err) {
            console.log("[Granular Settings] Failed to hijack the function 'showWindow()'. Retrying (" + (++tries) + ")");
            if (tries < maxTries) setTimeout(hijackShowWindow, 1000);
            return -1;
        }

        showWindow = function(arg) {
            showWindowOriginal(arg);
            if (arg === 1 /* Settings window */) {
                gs_applyModifications();
            }
        }

        document.addEventListener('gs_transmit_settings', gs_processSettings);

        console.log("[Granular Settings] Successful injection!");
        return 0;
    }

    hijackShowWindow();
}

gs_init();