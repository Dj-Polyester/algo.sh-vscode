const THRESHOLD = 20;
hljs.highlightAll();
//https://stackoverflow.com/q/22268079/10713877
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

document.addEventListener("scroll", function () {
    // console.log(`getDocHeight(): ${getDocHeight()}`);
    // console.log(`getScrollY(): ${getScrollY()}`);
    // console.log(`window.innerHeight: ${window.innerHeight}`);

    if (getDocHeight() <= getScrollY() + window.innerHeight + THRESHOLD) {
        console.log("bottom");
        var oldcontent = document.getElementById('code-list');
        oldcontent.innerHTML = oldcontent.innerHTML + `<pre>
        <code>
#hello world
print(31)
        </code>
      </pre>`;
        document.getElementById("code-list").innerHTML = oldcontent.innerHTML;
        hljs.highlightAll();
    }
});