import $ from 'jquery'

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

// Taken from https://stackoverflow.com/questions/47549648/uikit-how-to-get-order-with-the-sortable-component
/**
 * This function return a boolean if a layer of a given ID already exists in the store
 * @param  {object} state           The REDUX state object for current store
 * @return {number}                 Position index of sortable item
 */
export function getSortableCurrentIndex(e){

    const currentLi = e.originalEvent.explicitOriginalTarget.parentNode;
    indexes = [];
    $(this).find('li').each(function () {
        indexes.push($(this).data("index"));
    });
    return $(currentLi).index()

}

/* Parse QueryString using String Splitting */
//  Taken from https://pietschsoft.com/post/2015/09/25/javascript-tips-parse-querystring-to-dictionary
export function parseQueryStringToDictionary(queryString) {
    var dictionary = {};

    // remove the '?' from the beginning of the
    // if it exists
    if (queryString.indexOf('?') === 0) {
        queryString = queryString.substr(1);
    }

    // Step 1: separate out each key/value pair
    var parts = queryString.split('&amp;');

    for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        // Step 2: Split Key/Value pair
        var keyValuePair = p.split('=');

        // Step 3: Add Key/Value pair to Dictionary object
        var key = keyValuePair[0];
        var value = keyValuePair[1];

        // decode URI encoded string
        value = decodeURIComponent(value);
        value = value.replace(/\+/g, ' ');

        dictionary[key] = value;
    }

    // Step 4: Return Dictionary Object
    return dictionary;
}