"use strict";
nitialization();
document.getElementById("btn").addEventListener("click", getHttp);
document.getElementById("btn").addEventListener("mouseenter", highLight);

async function getHttp() {
    //the main controling function.
    //actived by send button click event.

    toogleLoadingPage();
    const text = document.getElementById("inputBar").value;
    const result = await sentimator(text);
    if (result !== null) {
        displayResultInDom(text, result);
    }
    if (document.getElementById("toRandom").checked) {
        const random = await randomSentence();
        if (random !== null) {
            document.getElementById("inputBar").value = random.ad;
        }
    }
    toogleLoadingPage();
}

async function sentimator(text) {
    //PARAMETER: text input
    //-->sends post to "https://sentim-api.herokuapp.com/api/v1/".
    //-->gets response.
    //RETURNS : result {result:{type:"type",polarity:"polarity"}}.
    //the type can be: positive, nuetral,negative.
    //polarity is  a decimal number between -1 and 1 .

    let data = { text: text };
    const response = await fetch("https://sentim-api.herokuapp.com/api/v1/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (response.status > 400) {
        //response is having a kind of problem.
        document.getElementById("resultBar").innerText =
            response.status + ":" + response.statusText;
    }
    try {
        const result = await response.json();
        document.getElementById("resultBar").innerText = result.result.type;
        return result;
    } catch {
        return null;
    }
}

async function randomSentence() {
    //-->sends "get" to "https://api.isevenapi.xyz/api/iseven/5".
    //-->gets json format Obj.
    //RETURNS {ad:"random sentence"}:

    let response = await fetch("https://api.isevenapi.xyz/api/iseven/5");
    try {
        return response.json();
    } catch {
        return null;
    }
}

function toogleLoadingPage() {
    //toogle the packmen loader be'ing hide,
    //toogle the inputContent be'ing shown,

    document.getElementById("loading").classList.toggle("hide");
    document.getElementById("inputContent").classList.toggle("hide");
}

async function displayResultInDom(text, result) {
    //gets the results ,and displaying it on dom.

    let body = document.getElementById("body");
    let sentence = document.getElementById("sentence");
    let polarity = (await (result["result"].polarity + 1)) / 2; //gets polatiry(-1-->1) turns it into (0-->1)
    let gauge = new Gauge(document.getElementById("gauge"));
    body.style.backgroundColor = getColorFromPolarity(polarity);
    gauge.value(polarity);
    sentence.innerText = text;
}
function getColorFromPolarity(polarity) {
    //polatiry is a number between 0-1.
    const r = (1 - polarity) * 255; //0 on polarity =1 ,255 on polarity=0
    const g = polarity * 255; //255 on polarity =1 ,0 on polarity=0
    const b = -0.0093 * g ** 2 + 2.36 * g; // this is a parabula , b(g), that have 3 known points.{0(0),150(127.5),0(255)}
    return `rgb(${r},${g},${b})`;
}

//Visibile mouse enter to send button

function highLight() {
    document.getElementById("btn").classList.add("highLighted");
    document.getElementById("btn").addEventListener("mouseleave", backToNormal);
}
function backToNormal() {
    document.getElementById("btn").classList.remove("highLighted");
}

//nitialization

function nitialization() {
    let gauge = new Gauge(document.getElementById("gauge"));
    gauge.value(0.5);
    body.style.backgroundColor = getColorFromPolarity(0.5);
}

// The Gauge-----> i did not wrote this code

function Gauge(el) {
    //Private Properties and Attributes

    let element, // Containing element for the info component
        data, // `.gauge__data` element
        needle, // `.gauge__needle` element
        value = 0.0, // Current gauge value from 0 to 1
        prop; // Style for transform

    //Private Methods and Functions

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

    //Object to be Returned

    function exports() {}

    //Public API Methods

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

    //nitialization

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
