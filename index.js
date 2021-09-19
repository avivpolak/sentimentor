async function sentimator(text) {
    let data = { text: text };
    let res = await fetch("https://sentim-api.herokuapp.com/api/v1/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

async function getHttp() {
    const text = document.getElementById("inputBar").value;
    let result = await sentimator(text);
    displayResultInDom(result);
}

async function displayResultInDom(result) {
    let body = document.getElementById("body");
    let polarity = (await (result["result"].polarity + 1)) / 2;
    let gauge = new Gauge(document.getElementById("gauge"));
    // body.style.backgroundColor = getColorFromPolarity(polarity);
    gauge.value(polarity);
}
function getColorFromPolarity(polarity) {
    const r = (1 - polarity) * 255;
    const g = polarity * 255;
    return `rgb(${r},${g},0)`;
}

document.getElementById("btn").addEventListener("click", getHttp);

// The Gauge object encapsulates the behavior
// of simple gauge. Most of the implementation
// is in the CSS rules, but we do have a bit
// of JavaScript to set or read the gauge value

function Gauge(el) {
    // ##### Private Properties and Attributes

    let element, // Containing element for the info component
        data, // `.gauge__data` element
        needle, // `.gauge__needle` element
        value = 0.0, // Current gauge value from 0 to 1
        prop; // Style for transform

    // ##### Private Methods and Functions

    let setElement = function (el) {
        // Keep a reference to the various elements and sub-elements
        element = el;
        data = element.querySelector(".gauge__data");
        needle = element.querySelector(".gauge__needle");
    };

    let setValue = function (x) {
        value = x;
        let turns = -0.5 + x * 0.5;
        data.style[prop] = "rotate(" + turns + "turn)";
        needle.style[prop] = "rotate(" + turns + "turn)";
    };

    // ##### Object to be Returned

    function exports() {}

    // ##### Public API Methods

    exports.element = function (el) {
        if (!arguments.length) {
            return element;
        }
        setElement(el);
        return this;
    };

    exports.value = function (x) {
        if (!arguments.length) {
            return value;
        }
        setValue(x);
        return this;
    };

    // ##### Initialization

    let body = document.getElementsByTagName("body")[0];
    [
        "webkitTransform",
        "mozTransform",
        "msTransform",
        "oTransform",
        "transform",
    ].forEach(function (p) {
        if (typeof body.style[p] !== "undefined") {
            prop = p;
        }
    });

    if (arguments.length) {
        setElement(el);
    }

    return exports;
}

let gauge = new Gauge(document.getElementById("gauge"));
gauge.value(0.75);
