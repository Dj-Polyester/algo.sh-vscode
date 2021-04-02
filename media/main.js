//DOM elements
const html = document.getElementsByTagName("html")[0],
    htmlstyle = getComputedStyle(html),
    typeinp = document.getElementById("typeinp"),
    chooseinp = document.getElementById("chooseinp"),
    searchbtn = document.getElementById("searchbtn"),
    codelist = document.getElementById("code-list"),
    errTxts = document.getElementsByClassName("err-txt");

window.onload = () => {
    loadingSpinner = document.getElementsByTagName("lottie-player")[0];
};

//global constants
const THRESHOLD = 20;
//global variables
var OPTIONS,
    txt,
    start,
    end,
    proceedLoad = true,
    wheelinterval,
    MAX_WHEEL_COUNT = 100,
    loadingSpinner;
/**
* 
* @param {string} val a defined property value in :root that can be accessed in the format var(prop) in CSS
* @returns {string} the CSS property value
*/
const prop = val => htmlstyle.getPropertyValue(val);

const codeHTML = (code,
    n, color = prop("--vscode-testing-iconUnset"), width = 16, height = 16) => `
<div>
    <div class="ncounter">${n}</div>
    <div class="copy" title="copy to clipboard">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="${width}.000000pt" height="${height}.000000pt" viewBox="0 0 1024.000000 1024.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,1024.000000) scale(0.1,-0.1)"
            fill="${color}" stroke="none">
            <path d="M4325 8190 c-405 -32 -747 -244 -956 -592 -27 -45 -49 -87 -49 -95 0
            -10 44 -13 228 -13 l227 0 65 66 c107 108 226 176 374 214 77 20 108 20 1231
            20 1122 0 1154 -1 1231 -20 145 -37 262 -103 371 -211 105 -104 169 -213 219
            -374 18 -58 19 -132 19 -1925 0 -1793 -1 -1867 -19 -1925 -31 -99 -66 -176
            -111 -245 -41 -61 -136 -163 -197 -210 l-28 -21 0 -220 c0 -156 3 -219 11
            -219 21 0 152 71 227 123 274 189 457 484 507 816 22 143 22 3659 0 3802 -59
            394 -302 727 -661 908 -95 47 -178 75 -304 103 -93 21 -119 21 -1195 23 -605
            2 -1140 -1 -1190 -5z"/>
            <path d="M3385 7394 c-347 -44 -643 -214 -846 -486 -85 -114 -162 -276 -202
            -423 l-32 -120 0 -1900 0 -1900 32 -120 c131 -484 511 -826 1003 -900 141 -22
            2269 -22 2410 0 135 20 255 57 368 114 358 180 597 510 657 911 22 142 22
            3648 0 3790 -49 329 -215 606 -479 802 -112 84 -275 161 -421 201 l-120 32
            -1170 1 c-643 1 -1183 0 -1200 -2z m2400 -418 c292 -88 500 -297 582 -586 17
            -62 18 -150 18 -1925 0 -1775 -1 -1863 -18 -1925 -83 -291 -296 -504 -587
            -587 -61 -17 -129 -18 -1235 -18 -1106 0 -1174 1 -1235 18 -291 83 -504 296
            -587 587 -17 62 -18 150 -18 1925 0 1775 1 1863 18 1925 91 321 355 558 672
            603 17 2 548 4 1180 3 1077 -2 1154 -3 1210 -20z"/>
            </g>
        </svg>
    </div>
</div>

<pre><code>${code}</code></pre>`;

(async function () {
    try {
        OPTIONS = await ((await fetch("http://localhost:3000/options")).json());
        console.log(OPTIONS);
    } catch (error) {
        DEBUG(error);
    }
    reset();
})();

function setupCopy() {
    //FIXME: I couldnt figure out why first page wraps second element in code tags (unexpected)
    /**
     * also it is told Array.prototype.slice.call is faster than Array.from
     * https://stackoverflow.com/a/48474206/10713877
     */
    const codetxts = Array.prototype.slice.call(document.getElementsByTagName("code"));
    const codebtns = Array.prototype.slice.call(document.getElementsByClassName("copy"));
    codetxts.splice(1, 1);
    codebtns.forEach((elem, index) => {
        elem.addEventListener("click", async () => {
            if (!navigator.clipboard) {
                DEBUG("The object 'navigator.clipboard' does not exist.");
                return;
            }
            try {
                const copyVal = codetxts[index].innerText;
                await navigator.clipboard.writeText(copyVal);
            } catch (error) {
                DEBUG(error);
            }
        });
    });
}

async function getPage(txt, lang, start, end) {
    try {
        console.log(start, end);
        const res = await ((await fetch(`http://localhost:3000/code/${txt}/${lang}/${start}/${end}`)).json());
        const codes = res.map((x, i) => codeHTML(x.join(""), start + i + 1));
        return codes;
    } catch (error) {
        DEBUG(error);
    }
}
/////////////////////////////////////////////////
//https://stackoverflow.com/q/22268079/10713877//
function getScrollY() {
    var scrOfX = 0, scrOfY = 0;
    if (typeof (window.pageYOffset) === 'number') //Netscape compliant
        scrOfY = window.pageYOffset;
    else if (document.body && document.body.scrollTop) //DOM compliant
        scrOfY = document.body.scrollTop;
    else if (document.documentElement && document.documentElement.scrollTop) //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop;
    return scrOfY;
}

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}

function reset() {
    codelist.innerHTML = "";
    start = 0, end = OPTIONS.load;
}

async function update(txt, lang, start, end) {
    const t0 = performance.now();
    const codes = (await getPage(txt, lang, start, end)).join("");
    const reqinterval = performance.now() - t0;

    if (wheelinterval) {
        MAX_WHEEL_COUNT = 100 * Math.ceil(reqinterval / wheelinterval);
        console.log(MAX_WHEEL_COUNT);
    }

    codelist.innerHTML += codes;
    hljs.highlightAll();

    //add events to copy buttons
    setupCopy();
}

document.addEventListener("wheel", async function () {
    const docheight = getDocHeight();

    if (proceedLoad && docheight <= getScrollY() + window.innerHeight + THRESHOLD) { //bottom
        proceedLoad = false;
        window.scrollTo(0, docheight - (MAX_WHEEL_COUNT >> 6) * THRESHOLD);
        await update(txt, lang, start, end);
        proceedLoad = true;
        start = end;
        end += OPTIONS.load;
    }

    var time = this._time;
    var timestamp = new Date().getTime();
    if (time)
        wheelinterval = timestamp - time;
    this._time = timestamp;
});
function errState(obj) {
    obj.style.outlineColor = prop("--vscode-inputValidation-errorBorder");
    obj.style.backgroundColor = prop("--vscode-inputValidation-errorBackground");
}
function normState(obj) {
    obj.style.outlineColor = prop("--vscode-input-border");
    obj.style.backgroundColor = prop("--vscode-input-background");
}
function load() {
    searchbtn.disabled = true;
    reset();
    loadingSpinner.style.display = "block";//show spinner
    disableScroll();
}
function finishload() {
    loadingSpinner.style.display = "none";//hide spinner
    start = end;
    end += OPTIONS.load;
    searchbtn.disabled = false;
    enableScroll();
}

searchbtn.addEventListener("click", async function () {
    normState(typeinp);
    errTxts[0].style.visibility = "hidden";
    normState(chooseinp);
    errTxts[1].style.visibility = "hidden";

    txt = typeinp.value;
    lang = chooseinp.value;

    let valid = true;

    if (txt === "") {
        errState(typeinp);
        errTxts[0].style.visibility = "visible";
        valid = false;

    } if (lang === "item") {
        errState(chooseinp);
        errTxts[1].style.visibility = "visible";
        valid = false;
    } if (valid) {
        load();
        await update(txt, lang, start, end);
        finishload();
    }
});
////////////////////////////////////////////////
//https://stackoverflow.com/a/4770179/10713877//
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}