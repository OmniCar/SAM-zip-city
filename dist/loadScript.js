export function loadScript(src, id) {
    return new Promise(function (resolve, reject) {
        var existingScript = document.getElementById(id);
        if (!existingScript) {
            var s = void 0;
            s = document.createElement('script');
            s.src = src;
            s.id = id;
            s.onload = resolve;
            s.onerror = reject;
            s.async = true;
            document.head.appendChild(s);
        }
        else {
            resolve();
        }
    });
}
