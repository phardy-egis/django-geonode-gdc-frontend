// ==================================================================================================================
// ================================================ UTILITIES =======================================================
// ==================================================================================================================

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function elmtIsVisible(ele, container) {
    const { bottom, height, top } = ele.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return top <= containerRect.top ? containerRect.top - top <= height : bottom - containerRect.bottom <= height;
};


export function quoteUrl(url, safe) {
    if (typeof (safe) !== 'string') {
        safe = '/';    // Don't escape slashes by default
    }

    url = encodeURIComponent(url);

    // Unescape characters that were in the safe list
    var toUnencode = [];
    for (var i = safe.length - 1; i >= 0; --i) {
        var encoded = encodeURIComponent(safe[i]);
        if (encoded !== safe.charAt(i)) {    // Ignore safe char if it wasn't escaped
            toUnencode.push(encoded);
        }
    }

    url = url.replace(new RegExp(toUnencode.join('|'), 'ig'), decodeURIComponent);

    return url;
}